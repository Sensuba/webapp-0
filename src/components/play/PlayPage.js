import React, { Component } from 'react';
import './PlayPage.css';
import { Button } from 'reactstrap'
import Nav from '../Nav';
import openSocket from 'socket.io-client';

export default class PlayPage extends Component {

	constructor (props) {

		super(props);

    console.log(this.props);
    console.log(process.env)

    const socket = openSocket(this.props.server);

    this.state = {
      socket: socket,
      seeking: false
    };

    socket.on('connected', function () {
      //console.log("YEAH")
    });
	}
  componentWillUnmount () {

    this.state.socket.disconnect();
  }

  handleData (data) {

  }

  seekGame (prv) {

    if (this.state.seeking)
      return;
    this.state.socket.emit('seek', prv);
    var history = this.props.history;
    this.state.socket.on('assign', function (res) {
      history.push(`/play/${res.to}`);
    });
    this.setState({seeking: true});
  }

  render() {
    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <div className="main-section">
            <Button onClick={() => this.seekGame(false)}>Quick game</Button>
            <Button onClick={() => this.seekGame(true)}>Private room</Button>
          </div>
      	</main>
      </div>
    );
  }
}