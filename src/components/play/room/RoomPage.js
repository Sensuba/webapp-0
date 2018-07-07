import React, { Component } from 'react';
import './RoomPage.css';
import Nav from '../../Nav';
import openSocket from 'socket.io-client';
import Game from './game/Game';

export default class RoomPage extends Component {

	constructor (props) {

		super(props);

    const socket = openSocket(this.props.server);

    this.state = {
      socket: socket
    };

    socket.on('connected', function () {
      socket.emit("join", "room1");
    });
	}

  render() {
    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <Game/>
      	</main>
      </div>
    );
  }
}