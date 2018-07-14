import React, { Component } from 'react';
import './RoomPage.css';
import Nav from '../../Nav';
import openSocket from 'socket.io-client';
import Game from '../../../game/Game';
import User from '../../../services/User';

export default class RoomPage extends Component {

	constructor (props) {

		super(props);

    const socket = openSocket(this.props.server);

    this.state = {
      socket: socket
    };

    socket.on('connected', () => {
      socket.emit("join", "room1");
    });

    socket.on('joined', role => {
      if (role === 'player')
        socket.emit('prepare', User.isConnected() ? User.getData().token : "Anonymous", {
          hero: 1,
          body: [
            101, 101, 101, 101, 101,
            101, 101, 101, 101, 101,
            101, 101, 101, 101, 101,
            101, 101, 101, 101, 101,
            101, 101, 101, 101, 101, 
            101, 101, 101, 101, 101
          ]
        });

      socket.on('notification', data => console.log(data));
    })
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