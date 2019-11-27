import React, { Component } from 'react';
import './RoomPage.css';
import Nav from '../../Nav';
import Game from '../../../game/Game';
import Library from '../../../services/Library';

export default class RoomPage extends Component {

  constructor (props) {

    super(props);
    this.state = { heroes: {} };
  }

  changeBackground(you, opponent) {

    Library.getCard(you, hero => this.setState({heroes: Object.assign(this.state.heroes, {you: hero.highRes || hero.imgLink})}));
    Library.getCard(opponent, hero => this.setState({heroes: Object.assign(this.state.heroes, {opponent: hero.highRes || hero.imgLink})}));
    //this.setState({heroes: {you, opponent}});
  }
  
  render() {console.log(this.state);
    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
        <main id="room-page">
          <div className="room-background">
            { this.state.heroes && this.state.heroes.you ? <img crossOrigin="Anonymous" className="room-background-hero" src={this.state.heroes.you} alt={"Your hero"}/> : <span/> }
            { this.state.heroes && this.state.heroes.opponent ? <img crossOrigin="Anonymous" className="room-background-hero" src={this.state.heroes.opponent} alt={"Opponent's hero"}/> : <span/> }
          </div>
          <Game api={this.props.api} room={this.props.room} socket={this.props.socket} updateHeroes={this.changeBackground.bind(this)} quitRoom = {() => this.props.history.push("/play")}/>
        </main>
      </div>
    );
  }
}