import React, { Component } from 'react';
import './PlayPage.css';
import { Button } from 'reactstrap'
import Nav from '../Nav';
import openSocket from 'socket.io-client';

export default class PlayPage extends Component {

	constructor (props) {

		super(props);

    const socket = openSocket('http://localhost:8080');
    socket.on('okay', function () {
      console.log("YEAH")
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
            <Button>Créer une partie</Button>
          </div>
          <div className="main-section">
            <h2>Parties en cours</h2>
          </div>
      	</main>
      </div>
    );
  }
}