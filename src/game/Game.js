import React, { Component } from 'react';
import './Game.css';
import Manager from './Manager';
//import Model from './model/board/GameBoard';
import View from './view/board/GameBoard';
import User from '../services/User';
import openSocket from 'socket.io-client';
//import Card from './view/board/Card';
//import CardModel from './model/board/Card';
import CardPreview from '../components/cards/Card';
//import WaitingState from './controller/state/WaitingState';
//import PlayingState from './controller/state/PlayingState';
import Loader from '../components/utility/Loader';

import { createStore } from 'redux';
import reducers from './reducers';

const defaultDeck = {
  hero: 1,
  body: [
    101, 101, 101, 101, 101,
    101, 101, 101, 101, 101,
    101, 101, 101, 101, 101,
    101, 101, 101, 101, 101,
    101, 101, 101, 101, 101,
    101, 101, 101, 101, 101
  ]
};

export default class Game extends Component {

  constructor (props) {

    super(props);

    this.socket = openSocket(this.props.server);
    this.store = createStore(reducers);
    this.store.subscribe(() => {
      this.setState({model: this.store.getState()}, () => this.manager.control(this.isPlaying));
    });

    var myDeck = sessionStorage.getItem("playdeck");
    if (myDeck)
      myDeck = JSON.parse(myDeck);

    this.state = {

      cards: JSON.parse(sessionStorage.getItem("cardlist")),
      model: this.store.getState(),
      deck: myDeck || defaultDeck
    }

    this.manager = new Manager(this.state.model, this.command.bind(this));

    this.socket.on('connected', () => {
      this.socket.emit("join", props.room);
    });

    this.socket.on('joined', role => {
      if (role.as === 'player') {
        this.no = role.no;
        this.socket.emit('prepare', User.isConnected() ? User.getData().token : "Anonymous", this.state.deck);
      }

      this.socket.on('notification',  this.analyse.bind(this));
    })
  }

  componentWillUnmount () {

    this.socket.emit('quit');
  }

  analyse (n) {

    this.store.dispatch(n);
  }

  command (command) {

    this.socket.emit('command', command);
  }

  get waiting () {

    return !this.state.model.started;
  }

  get isPlaying () {

    var ca = this.state.model.currentArea;
    return ca ? ca.id.no === this.no : false;
  }

  render() {
    return (
      <div>
      <div id="img-preview-tooltip" data-toggle="tooltip" data-placement="right" src="" alt="preview" data-animation="false" data-trigger="manual">
        { this.state.preview ? <CardPreview src={this.state.preview}/> : <span/> }
      </div>
      {
        this.waiting
        ? 
          <div className="waiting-room">
            <Loader type="connect"/>
            <div className="waiting-text">
              Waiting for an opponent...
              <br/><span className="small-text">To fight a friend, share the url with them.</span>
            </div>
          </div>
        : <span/>
      }
      <div style={{ display: this.waiting ? "none" : "block" }}>
        <View model={this.state.model} master={this}/>
      </div>
      </div>
    );
  }
}