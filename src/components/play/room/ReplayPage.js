import React, { Component } from 'react';
import './RoomPage.css';
import Nav from '../../Nav';
import Game from '../../../game/Replay';

export default class ReplayPage extends Component {
  
  render() {
    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
        <main id="replay-page">
          <Game api={this.props.api} room={this.props.room} socket={this.props.socket} quitReplay = {() => this.props.history.push("/play")}/>
        </main>
      </div>
    );
  }
}