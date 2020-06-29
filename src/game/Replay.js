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
import MuteButton from './view/UI/MuteButton';
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


    this.volume = localStorage.getItem('sound.sfx') !== undefined ? localStorage.getItem('sound.sfx') : 1;
    //var music = Math.random() < 0.33 ? "virgocluster" : (Math.random() < 0.5 ? "planemo" : "auroraborealis");
    var music = "void";
    this.audio = new Audio("/audio/" + music + ".mp3");
    this.audio.volume = localStorage.getItem('sound.music') !== undefined ? localStorage.getItem('sound.music') * 0.2 : 0.2;
    this.mute = true;
    this.audio.muted = true;

    this.state = {

      model: this.store.getState()
    }
    this.sequencer = new Sequencer(this, this.state.model, this.store.dispatch);
    this.props.subscribe(() => {
      setTimeout(() => this.sequencer.setState(1), 1000);
    }, 0);
    this.props.subscribe(() => {
      this.sequencer.setState(3);
      this.loopMusic();
    }, 1);
  }

  loopMusic () {

      if (this.unmounted)
        return;
      this.audio.currentTime = 0;
      this.audio.play();
      setTimeout(() => this.loopMusic(), this.audio.duration*1000);
  }

  analyse (n) {

    if (n.type === "init"){
      this.props.updateHeroes(n.data[(this.no || 0)*3+2].no, n.data[(1-(this.no || 0))*3+2].no);
      var model = this.state.model;
      model.areas[0].name = n.data[0].value;
      model.areas[0].avatar = n.data[1].value;
      model.areas[1].name = n.data[3].value;
      model.areas[1].avatar = n.data[4].value;
    }
    if (n.type === "identify" && this.no !== undefined && n.data[0].cardType === "hero" && this.state.model.areas[this.no].field.tiles[6].occupied && this.state.model.areas[this.no].field.tiles[6].card.id.no === n.data[0].id.no)
      this.setState({ hero: n.data[0] });
    this.sequencer.add(n);
  }

  quit () {

    this.stopped = true;
    this.props.quitReplay();
  }

  end () {

    setTimeout(() => this.quit(), 5000);
  }

  shiftMessage () {

  }

  next () {

    if (this.stopped)
      return;
    let n = this.replayData[this.index];
    if (!n) {
      this.end();
      return;
    }
    let a = () => {
      if (this.stopped)
        return;
      this.analyse(n);
      this.index++;
      this.next();
    }
    var tf = this.timeFor(n);
    if (!tf)
      a();
    else {
      if (this.towait){
        setTimeout(a.bind(this), this.towait);
        this.towait = tf;
      }
      else {
        this.towait = tf;
        setTimeout(a.bind(this), 2000);
      }
    }
  }

  timeFor (n) {

    switch (n.type) {
    case "newturn":
    return 2500;
    case "cardfaculty":
    return 2500;
    case "cardmove":
    if (n.data[1] && n.data[1].type === "hand" && (n.data[0].type === "tile" || n.data[0].type === "court"))
      return 2500;
    return 0;
    case "charattack":
    return 1500;
    case "charmove":
    return 1000;
    default: return 0;
    }
  }

  componentWillUnmount() {

    this.unmounted = true;
    this.audio.pause();
    this.audio.currentTime = 0;
    if (!this.stopped)
      this.quit();
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

  switchMute () {

    this.mute = !this.mute;
    this.audio.muted = this.mute;
  }

  changeVolume (vol, sfx) {

    if (sfx)
      this.volume = vol;
    else
      this.audio.volume = vol * 0.2;
  }

  select (e) {

  }
  
  updatePreview (preview) {

    this.setState({preview});
  }

  render() {
    return (
      <div>
      <div id="img-preview-tooltip" data-toggle="tooltip" data-placement="right" src="" alt="preview" data-animation="false" data-trigger="manual">
        { this.state.preview && this.state.preview.card ? <CardPreview src={this.state.preview.card} level={this.state.preview.card.level} model={this.state.preview.card.model}/> : <span/> }
        { this.state.preview && this.state.preview.target ? <CardPreview className="img-preview-tooltip-target" src={this.state.preview.target} level={this.state.preview.target.level} model={this.state.preview.target.model}/> : <span/> }
        { this.state.preview && this.state.preview.icon ? <div className={"img-preview-tooltip-icon img-preview-icon-" + this.state.preview.icon}/> : <span/> }
        { this.state.preview && this.state.preview.text ? <div className="img-preview-tooltip-text">{ this.state.preview.text }</div> : <span/> }
      </div>
      <div id="deck-count-tooltip" data-toggle="tooltip" data-placement="left" data-animation="false" data-trigger="manual">
        { this.state.deckcount ? ("" + this.state.deckcount.count + " carte" + (this.state.deckcount.count > 1 ? "s" : "") + " restante"  + (this.state.deckcount.count > 1 ? "s" : "") + ".") : "" }
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
        <View model={this.state.model} messages={[]} master={this}/>
        <div id="screen-anim" className="screen-anim"><div className="screen-anim-inner"/></div>
      </div>
      <MuteButton switch={() => this.switchMute()} changeVolume={(volume, sfx) => this.changeVolume(volume, sfx)} defaultMute={true} master={this}/>
      <History entries={this.state.model.log.history} master={this}/>
      <div id="newturn-frame">
        <h1 className="big-text">A vous de jouer</h1>
      </div>
      </div>
    );
  }
}