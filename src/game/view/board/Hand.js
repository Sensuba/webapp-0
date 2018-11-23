import React, { Component } from 'react';
import Card from './Card';

export default class Hand extends Component {

  render () {

    return (
      <div className="sensuba-hand">
      {
      	this.props.model.cards.map(model => <Card key={model.id.no} model={model} master={this.props.master} select={m => this.props.master.manager.select(m)}/>)
      }
      </div>
    )
  }
}