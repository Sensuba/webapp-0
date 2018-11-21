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

export default class Game extends Component {

  constructor (props) {

    super(props);

    const socket = openSocket(this.props.server);

    this.state = {
      socket: socket,
      waiting: true,
      model: new Model(),
      cards: JSON.parse(sessionStorage.getItem("cardlist"))
    };

    this.manager = new Manager(this.state.model, this.command.bind(this));

    socket.on('connected', () => {
      socket.emit("join", props.room);
    });

    socket.on('joined', role => {
      if (role.as === 'player') {
        this.no = role.no;
        socket.emit('prepare', User.isConnected() ? User.getData().token : "Anonymous", {
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

      socket.on('notification',  this.analyse.bind(this));
    })
  }

  componentWillUnmount () {

    this.state.socket.emit('quit');
  }

  analyse (n) {

    switch(n.type) {
    case "start":
      this.setState({waiting: false});
      break;
    case "newturn":
      this.state.model.newTurn(n.src.no);
      this.manager.controller = (this.no === n.src.no ? new PlayingState(this.manager) : new WaitingState(this.manager));
      this.isPlaying = this.no === n.src.no;
      break;
    case "newcard":
      var loc = this.manager.find(n.data[0]);
      var c = new CardModel(n.src.no, loc.model);
      break;
    case "identify":
      this.manager.find(n.data[0].id).model.identify(n.data[0]);
      break;
    case "cardmove":
      if (this.manager.find(n.src) && this.manager.find(n.data[0]))
        this.manager.find(n.src).model.goto(this.manager.find(n.data[0]).model);
      break;
    case "destroycard":
      if (this.manager.find(n.src))
        this.manager.find(n.src).model.destroy();
      break;
    case "createmana":
      this.state.model.areas[n.src.no].manapool.createReceptacle(n.data[0].value);
      break;
    case "usemana":
      this.state.model.areas[n.src.no].manapool.use(n.data[0].value);
      break;
    default: break;
    }

    this.forceUpdate();
  }

  command (command) {

    this.state.socket.emit('command', command);
  }

  register (element) {

    this.manager.addItem(element);
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
        <View model={this.state.model} master={this}/>
      </div>
      </div>
    );
  }
}