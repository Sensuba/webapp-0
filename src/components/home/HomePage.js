import React, { Component } from 'react';
import './HomePage.css';
import Nav from '../Nav';

export default class HomePage extends Component {
  
  render() {
    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <div className="home-choicer">
            <div className="home-panel panel-left">
              <img className="home-panel-background" src="/img1.jpg" alt="bg"/>
              <div className="home-panel-filter"/>
              <div className="home-panel-text">
                <h3>Get into the game</h3>
                <p>Once again, worlds will collide ! With the power of your cards, engage fierce battles between heroes of any time or any world, and gather people to help you during your fight. Play Sensuba online for free to experience the world of card battles between your favorites anime characters.</p>
                <button className="select-button" onClick={() => this.props.history.push("/play")}>Start a game</button>
              </div>
            </div>
            <div className="home-panel panel-right">
              <img className="home-panel-background" src="/img2.jpg" alt="bg"/>
              <div className="home-panel-filter"/>
              <div className="home-panel-text">
                <h3>How to play ?</h3>
                <p>Come here to get all the knowledge you need to play Sensuba with your friends and kick asses online.</p>
                <button className="select-button" onClick={() => this.props.history.push("/rules")}>Learn the basics</button>
              </div>
            </div>
            <div className="home-panel panel-left">
              <img className="home-panel-background" src="/img3.jpg" alt="bg"/>
              <div className="home-panel-filter"/>
              <div className="home-panel-text">
                <h3>A full set of cards</h3>
                <p>Explore the collection and discover more than 200 cards. Assemble effects to conceive powerful synergies.</p>
                <button className="select-button" onClick={() => this.props.history.push("/cards")}>Explore the collection</button>
              </div>
            </div>
            <div className="home-panel panel-right">
              <img className="home-panel-background" src="/img4.jpg" alt="bg"/>
              <div className="home-panel-filter"/>
              <div className="home-panel-text">
                <h3>Join us on Discord</h3>
                <p>Meet the community and share you playstyle with everyone. By sharing your experience and your time with others, you support the game and get better at it.</p>
                <a className="select-button" target="_blank" rel="noopener noreferrer" href="https://discordapp.com/invite/gqRdwg2">Go on Discord</a>
              </div>
            </div>
          </div>
      	</main>
      </div>
    );
  }
}