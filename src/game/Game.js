import React, { Component } from 'react';
import './Game.css';
import Manager from './Manager';
import Model from './model/board/GameBoard';
import View from './view/board/GameBoard';
import User from '../services/User';
import openSocket from 'socket.io-client';
import Card from './view/board/Card';
import CardModel from './model/board/Card';
import CardPreview from '../components/cards/Card';
import WaitingState from './controller/state/WaitingState';
import PlayingState from './controller/state/PlayingState';
import Loader from '../components/utility/Loader';

import { createStore } from 'redux';
import reducers from './reducers';

export default class Game extends Component {

  constructor (props) {

    super(props);

    this.socket = openSocket(this.props.server);
    this.store = createStore(reducers);

    /*this.state = {
      socket: socket,
      waiting: true,
      model: new Model(),
      cards: JSON.parse(sessionStorage.getItem("cardlist"))
    };*/

    this.state = {

      cards: JSON.parse(sessionStorage.getItem("cardlist")),
      waiting: true
    }

    this.manager = new Manager(this.state.model, this.command.bind(this));

    this.socket.on('connected', () => {
      this.socket.emit("join", props.room);
    });

    this.socket.on('joined', role => {
      if (role.as === 'player') {
        this.no = role.no;
        this.socket.emit('prepare', User.isConnected() ? User.getData().token : "Anonymous", {
          hero: 1,
          body: [
            101, 101, 101, 101, 101,
            101, 101, 101, 101, 101,
            105, 105, 105, 105, 105,
            105, 105, 105, 105, 105, 
            108, 108, 108, 108, 108,
            108, 108, 108, 108, 108
          ]
        });
      }

      this.socket.on('notification',  this.analyse.bind(this));
    })
  }

  componentWillUnmount () {

    this.socket.emit('quit');
  }

  analyse (n) {

    this.setState({waiting: false});
    this.store.dispatch(n);
  }

  command (command) {

    this.socket.emit('command', command);
  }

  register (element) {

    this.manager.addItem(element);
  }

  get isPlaying () {

    var ca = this.store.getState().currentArea;
    return ca ? ca.id.no === this.no : false;
  }

  render() {
    return (
      <div>
      <div id="img-preview-tooltip" data-toggle="tooltip" data-placement="right" src="" alt="preview" data-animation="false" data-trigger="manual">
        { this.state.preview ? <CardPreview src={this.state.preview}/> : <span/> }
      </div>
      {
        this.state.waiting
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
      <div style={{ display: this.state.waiting ? "none" : "block" }}>
        <View model={this.store.getState()} master={this}/>
      </div>
      </div>
    );
  }
}