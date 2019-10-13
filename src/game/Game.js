import React, { Component } from 'react';
import './Game.css';
import Manager from './Manager';
import Sequencer from './Sequencer';
//import Model from './model/board/GameBoard';
import View from './view/board/GameBoard';
import User from '../services/User';
//import Card from './view/board/Card';
//import CardModel from './model/board/Card';
import CardPreview from '../components/cards/Card';
//import WaitingState from './controller/state/WaitingState';
//import PlayingState from './controller/state/PlayingState';
import Loader from '../components/utility/Loader';
import FacultyBox from './view/UI/FacultyBox';

import { createStore } from 'redux';
import reducers from './reducers';

const defaultDeck = {
  hero: 1,
  body: [
    168, 168, 168, 168, 168,
    109, 109, 109, 109, 109,
    159, 159, 159, 159, 159,
    132, 132, 132, 132, 132,
    173, 173, 173, 173, 173,
    124, 124, 124, 124, 124
  ]
};

export default class Game extends Component {

  constructor (props) {

    super(props);

    this.store = createStore(reducers);
    this.store.subscribe(() => {
      this.setState({model: this.store.getState()}, () => this.manager.control(this.isPlaying));
    });

    var myDeck = localStorage.getItem("playdeck");
    if (myDeck)
      myDeck = JSON.parse(myDeck);

    this.state = {

      cards: JSON.parse(localStorage.getItem("cardlist")),
      model: this.store.getState(),
      deck: myDeck || defaultDeck
    }

    this.manager = new Manager(this.state.model, this.command.bind(this), state => state ? this.setState(state) : this.forceUpdate());
    this.sequencer = new Sequencer(this.state.model, this.store.dispatch);

    this.props.socket.emit("join", props.room);

    this.props.socket.on('joined', role => {
      if (role.as === 'player') {
        this.no = role.no;
        this.props.socket.emit('prepare', User.isConnected() ? User.getData().token : "Anonymous", this.state.deck);
      }

      this.props.socket.on('notification',  this.analyse.bind(this));
    });

    this.props.socket.on('endgame', win => {
      this.props.quitRoom();
    });

    this.createParticle = () => {};
  }

  componentWillUnmount () {

    this.props.socket.emit('quit');
  }

  analyse (n) {

    this.sequencer.add(n);
  }

  command (command) {

    this.props.socket.emit('command', command);
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
        { this.state.preview ? <CardPreview src={this.state.preview} level={this.state.preview.level} model={this.state.preview.model}/> : <span/> }
      </div>
      <div id="faculty-tooltip" data-toggle="tooltip" data-placement="right" data-animation="false" data-trigger="manual">
        { this.state.faculties && this.state.faculties.length > 0 ? <FacultyBox faculties={ this.state.faculties } select={m => this.manager.select(m)}/> : <span/> }
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