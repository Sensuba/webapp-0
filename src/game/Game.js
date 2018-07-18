import React, { Component } from 'react';
import Scene from './Scene';
import * as BABYLON from 'babylonjs';
import Model from './model/board/GameBoard';
import Vue from './vue/board/GameBoard';

export default class Game extends Component {

  constructor (props) {

    super(props);

    this.state = new Model();
  }

  onSceneMount = (e: SceneEventArgs) => {

      const { canvas, scene, engine } = e;

      var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 6, -24), scene);
      camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(canvas, true);

      var light = new BABYLON.HemisphericLight("mainlight", new BABYLON.Vector3(0, 1, 0), scene);

      new Vue(scene);

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