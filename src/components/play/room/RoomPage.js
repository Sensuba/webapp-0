import React, { Component } from 'react';
import './RoomPage.css';
import Nav from '../../Nav';
import Game from '../../../game/Game';

export default class RoomPage extends Component {
  
  render() {
    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
        <main id="room-page">
          <Game room={this.props.room} socket={this.props.socket} quitRoom = {() => this.props.history.push("/play")}/>
        </main>
      </div>
    );
  }
}