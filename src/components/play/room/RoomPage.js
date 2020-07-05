import React, { Component } from 'react';
import './RoomPage.css';
import Nav from '../../Nav';
import Game from '../../../game/Game';
import Library from '../../../services/Library';

export default class RoomPage extends Component {

  constructor (props) {

    super(props);
    this.state = { heroes: {}, vsstate: 0 };
    this.subscribers = [[], []];
  }

  changeBackground(you, opponent) {

    Library.getCard(you, hero => this.setState({heroes: Object.assign(this.state.heroes, {you: hero.highRes || hero.imgLink})}));
    Library.getCard(opponent, hero => this.setState({heroes: Object.assign(this.state.heroes, {opponent: hero.highRes || hero.imgLink})}));
    //this.setState({heroes: {you, opponent}});

    this.setState({ vsstate: 1 });
    this.subscribers[0].forEach(f => f());
    setTimeout(() => this.subscribers[1].forEach(f => f()), 3700);
    setTimeout(() => {
      this.setState({ vsstate: 2 });
      setTimeout(() => this.setState({ vsstate: 3 }), 2000);
    }, 4500);
    var audio = new Audio("/audio/cinematic.ogg");
    audio.volume = localStorage.getItem('sound.sfx') !== undefined ? localStorage.getItem('sound.sfx') : 1;
    if (!localStorage.getItem('sound.muted'))
      audio.play();
  }
  
  render() {
    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
        <main id="room-page">
          { 
            this.state.vsstate > 0 && this.state.vsstate < 3 ? 
            <div className={"room-vs-wrapper" + (this.state.vsstate === 2 ? " vs-screen-open" : "")}>
              <div className="room-vs-screen">
                { this.state.heroes && this.state.heroes.you ? <img crossOrigin="Anonymous" className="room-background-hero" src={this.state.heroes.you} alt={""}/> : <span/> }
                { this.state.heroes && this.state.heroes.opponent ? <img crossOrigin="Anonymous" className="room-background-hero" src={this.state.heroes.opponent} alt={""}/> : <span/> }
                <img className="room-vs-icon" src="/vs.png" alt="vs"/>
              </div>
            </div> : <span/>
          }
          <div className="room-background">
            { this.state.heroes && this.state.heroes.you ? <img crossOrigin="Anonymous" className="room-background-hero" src={this.state.heroes.you} alt={""}/> : <span/> }
            { this.state.heroes && this.state.heroes.opponent ? <img crossOrigin="Anonymous" className="room-background-hero" src={this.state.heroes.opponent} alt={""}/> : <span/> }
          </div>
          <Game subscribe={(f, i) => this.subscribers[i].push(f)} api={this.props.api} room={this.props.room} getSocket={() => this.props.getSocket()} updateHeroes={this.changeBackground.bind(this)} quitRoom = {() => this.props.history.push("/play")}/>
        </main>
      </div>
    );
  }
}