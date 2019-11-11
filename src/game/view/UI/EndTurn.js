import React, { Component } from 'react';
import "./EndTurn.css";

export default class EndTurn extends Component {

  render () {

    return (
      <div 	className={"sensuba-end-turn " + (this.props.locked ? "sensuba-end-turn-locked" : "sensuba-end-turn-active") + (this.props.extra ? " sensuba-end-turn-extra" : "")}
      		onClick={this.props.locked ? () => {} : () => this.props.endTurn()}>
      		<div className="sensuba-end-turn-circle">
      			{
      				[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(no => <div id={"sensuba-end-turn-dot-" + no} className="sensuba-end-turn-dot" key={no}/>)
      			}
      		</div>
      		<div className="sensuba-end-turn-text">{this.props.locked ? "Opponent's turn" : (this.props.extra ? "Extra turn" : "End turn")}</div>
      	</div>
    )
  }
}