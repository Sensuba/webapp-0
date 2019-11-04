import React, { Component } from 'react';
import './Game.css';
//import Manager from './Manager';
import Sequencer from './Sequencer';
//import Model from './model/board/GameBoard';
import View from './view/board/GameBoard';
//import User from '../services/User';
//import Card from './view/board/Card';
//import CardModel from './model/board/Card';
import CardPreview from '../components/cards/Card';
//import WaitingState from './controller/state/WaitingState';
//import PlayingState from './controller/state/PlayingState';
import Loader from '../components/utility/Loader';
//import FacultyBox from './view/UI/FacultyBox';
import History from './view/UI/History';
//import Lightbox from '../components/utility/Lightbox';import
//import { Button } from 'reactstrap';
//import files from '../utility/FileManager';

import { createStore } from 'redux';
import reducers from './reducers';

export default class Replay extends Component {

  constructor (props) {

    super(props);

    this.store = createStore(reducers);
    this.store.subscribe(() => {
      this.setState({model: this.store.getState()}, () => {});
    });

    this.props.api.getReplay(this.props.room, response => {
      if (!response.data)
        this.props.quitReplay();
      else {
        this.index = 0;
        this.replayData = JSON.parse(response.data);
        this.next();
      }
    });

    this.state = {

      model: this.store.getState()
    }
    this.sequencer = new Sequencer(this, this.state.model, this.store.dispatch);
  }

  analyse (n) {

    this.sequencer.add(n);
  }

  end () {

    setTimeout(() => this.props.quitReplay(), 5000);
  }

  next () {

    let n = this.replayData[this.index];
    if (!n) {
      this.end();
      return;
    }
    let a = () => {
      this.analyse(n);
      this.index++;
      this.next();
    }
    var tf = this.timeFor(n.type);
    if (!tf)
      a();
    else {
      if (this.towait){
        setTimeout(a.bind(this), this.towait);
        this.towait = tf;
      }
      else {
        this.towait = tf;
        a();
      }
    }
  }

  timeFor (type) {

    switch (type) {
    case "newturn":
    return 2500;
    case "cardfaculty":
    case "playcard":
    return 2500;
    case "charattack":
    return 1500;
    case "charmove":
    return 1000;
    default: return 0;
    }
  }

  get waiting () {

    return !this.state.model.started;
  }

  get isPlaying () {

    return false;
  }

  get isReplay () {

    return true;
  }

  select (e) {

  }

  render() {
    return (
      <div>
      <div id="img-preview-tooltip" data-toggle="tooltip" data-placement="right" src="" alt="preview" data-animation="false" data-trigger="manual">
        { this.state.preview ? <CardPreview src={this.state.preview} level={this.state.preview.level} model={this.state.preview.model}/> : <span/> }
      </div>
      <div id="deck-count-tooltip" data-toggle="tooltip" data-placement="left" data-animation="false" data-trigger="manual">
        { this.state.deckcount ? ("You" + (this.state.deckcount.you ? " have " : "r opponent has ") + this.state.deckcount.count + " card" + (this.state.deckcount.count > 1 ? "s" : "") + " left.") : "" }
      </div>
      {
        this.waiting
        ? 
          <div className="waiting-room">
            <Loader type="connect"/>
            <div className="waiting-text">
              Searching replay...
            </div>
          </div>
        : <span/>
      }
      <div style={{ display: this.waiting ? "none" : "block" }}>
        <View model={this.state.model} master={this}/>
      </div>
      <History entries={this.state.model.log.history}/>
      <div id="newturn-frame">
        <h1 className="big-text">Your Turn</h1>
      </div>
      </div>
    );
  }
}