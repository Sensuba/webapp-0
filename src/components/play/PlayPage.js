import React, { Component } from 'react';
import './PlayPage.css';
import { Button } from 'reactstrap'
import Nav from '../Nav';
import openSocket from 'socket.io-client';

export default class PlayPage extends Component {

	constructor (props) {

		super(props);console.log(this.props)

    const socket = openSocket(this.props.server);

    this.state = {
      socket: socket
    };

    socket.on('connected', function () {
      //console.log("YEAH")
    });
	}

  handleData (data) {

  }

  render() {
    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <div className="main-section">
            <Button onClick={() => this.props.history.push(`/play/room1`)}>Créer une partie</Button>
          </div>
          <div className="main-section">
            <h2>Parties en cours</h2>
          </div>
      	</main>
      </div>
    );
  }
}