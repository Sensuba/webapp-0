import React, { Component } from 'react';
import Scene from './Scene';
import Manager from './Manager';
import * as BABYLON from 'babylonjs';
import Model from './model/board/GameBoard';
import Vue from './vue/board/GameBoard';
import User from '../services/User';
import openSocket from 'socket.io-client';
import Card from './vue/board/Card'

export default class Game extends Component {

  constructor (props) {

    super(props);

    const socket = openSocket(this.props.server);

    this.state = {
      socket: socket,
      model: new Model()
    };

    this.manager = new Manager(this.state.model);

    socket.on('connected', () => {
      socket.emit("join", "room1");
    });

    socket.on('joined', role => {
      if (role.as === 'player') {
        socket.emit('prepare', User.isConnected() ? User.getData().token : "Anonymous", {
          hero: 1,
          body: [
            101, 101, 101, 101, 101,
            101, 101, 101, 101, 101,
            101, 101, 101, 101, 101,
            101, 101, 101, 101, 101,
            101, 101, 101, 101, 101, 
            101, 101, 101, 101, 101
          ]
        });
      }

      socket.on('notification',  this.analyse.bind(this));
    })
  }

  analyse (n) {

    switch(n.type) {
    case "newcard":
      new Card(this.manager.find(n.data[0]), n.src.no, new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 0));
      break;
    case "identify":
      this.manager.find(n.data[0].id).identify(n.data[0]);
      break;
    case "draw":
      this.manager.find(n.src).hand.addCard(this.manager.find(n.data[0]));
      break;
    default: break;
    }
  }

  onSceneMount = (e: SceneEventArgs) => {

      const { canvas, scene, engine } = e;

      scene.manager = this.manager;

      var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 6, -24), scene);
      camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(canvas, true);

      var light = new BABYLON.HemisphericLight("mainlight", new BABYLON.Vector3(0, 1, 0), scene);

      this.vue = new Vue(scene);

      scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

      engine.runRenderLoop(() => {
          if (scene) {
              scene.render();
          }
      });
  }

  render() {
    return (
      <Scene onSceneMount={this.onSceneMount} />
    );
  }
}