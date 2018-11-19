import React, { Component } from 'react';
import GameBoard from "./view/board/GameBoard";
import "./Scene.css";

export default class Scene extends Component {

  render () {

    return (
      <div id="sensuba-scene">
        <GameBoard/>
      </div>
    )
  }
}