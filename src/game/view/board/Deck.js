import React, { Component } from 'react';
import Card from './Card';

export default class Deck extends Component {

  render () {

    return (
      <div className="sensuba-deck">
      {
      	this.props.model.cards.map(model => <Card hidden key={model.id.no} model={model} master={this.props.master}/>)
      }
      </div>
    )
  }
}