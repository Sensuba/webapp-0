import React, { Component } from 'react';
import Scene from './Scene';
import Manager from './Manager';
import * as BABYLON from 'babylonjs';
import Model from './model/board/GameBoard';
import Vue from './vue/board/GameBoard';
import User from '../services/User';
import openSocket from 'socket.io-client';
import Card from './vue/board/Card';
import CardModel from './model/board/Card';
import WaitingState from './controller/state/WaitingState';
import PlayingState from './controller/state/PlayingState';

export default class Game extends Component {

  constructor (props) {

    super(props);

    const socket = openSocket(this.props.server);

    this.state = {
      socket: socket,
      model: new Model()
    };

    this.manager = new Manager(this.state.model, this.command.bind(this));

    socket.on('connected', () => {
      socket.emit("join", "room1");
    });

    socket.on('joined', role => {
      if (role.as === 'player') {
        this.no = role.no;
        socket.emit('prepare', User.isConnected() ? User.getData().token : "Anonymous", {
          hero: 1,
          body: [
            101, 101, 101, 101, 101,
            101, 101, 101, 101, 101,
            101, 101, 101, 101, 101,
            105, 105, 105, 105, 105,
            105, 105, 105, 105, 105, 
            105, 105, 105, 105, 105
          ]
        });
      }

      socket.on('notification',  this.analyse.bind(this));
    })
  }

  analyse (n) {

    switch(n.type) {
    case "newturn":
      this.manager.controller = (this.no === n.src.no ? new PlayingState(this.manager) : new WaitingState(this.manager));
      break;
    case "newcard":
      var loc = this.manager.find(n.data[0]);
      var c = new CardModel(n.src.no, loc.model);
      new Card(loc, c, new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 0));
      break;
    case "identify":
      this.manager.find(n.data[0].id).identify(n.data[0]);
      break;
    case "cardmove":
      if (this.manager.find(n.src) && this.manager.find(n.data[0]))
        this.manager.find(n.src).goto(this.manager.find(n.data[0]));
      break;
    case "destroycard":
      if (this.manager.find(n.src))
        this.manager.find(n.src).destroy();
      break;
    default: break;
    }
  }

  onSceneMount = (e: SceneEventArgs) => {

      const { canvas, scene, engine } = e;

      scene.manager = this.manager;

      var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI/2, 0, 26, new BABYLON.Vector3(0, 3, -26), scene);
      camera.setTarget(BABYLON.Vector3.Zero());
      //camera.attachControl(canvas, true);

      var light = new BABYLON.HemisphericLight("mainlight", new BABYLON.Vector3(-18, 10, -10), scene);
      light.intensity = 2;

      this.vue = new Vue(scene, this.state.model);

      scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

      engine.runRenderLoop(() => {
          if (scene) {
              scene.render();
          }
      });
  }

  command (command) {

    this.state.socket.emit('command', command);
  }

  render() {
    return (
      <Scene onSceneMount={this.onSceneMount} />
    );
  }
}