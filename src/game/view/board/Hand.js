import React, { Component } from 'react';
import Card from './Card';

export default class Hand extends Component {

  render () {

  	var count = this.props.model.count;

    return (
      <div className={"sensuba-hand " + (this.props.top ? "sensuba-hand-top" : "sensuba-hand-bottom")}>
      {
      	this.props.model.cards.map((model, i) => {
      		var shift = (-4.1 - (count-1) * (5 - count/7) + i * (10 - count/3.5)) * (this.props.top ? 1 : 1.4);
      		return <Card style={{left: "calc(50% " + (shift > 0 ? "+" : "-") + " " + Math.abs(shift) + "vw)"}} key={model.id.no} model={model} master={this.props.master} select={m => this.props.master.manager.select(m)}/>
      	})
      }
      </div>
    )
  }
}