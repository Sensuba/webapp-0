import React, { Component } from 'react';
import "./EndTurn.css";

export default class EndTurn extends Component {

  render () {

    return (
      <div 	className={this.props.locked ? " sensuba-end-turn-locked" : "sensuba-end-turn"}
      		onClick={this.props.locked ? () => {} : () => this.props.endTurn()}>
      		{this.props.locked ? "Opponent's turn" : "End turn"}
      	</div>
    )
  }
}