import React, { Component } from 'react';
import Card from './Card';

export default class Deck extends Component {

	constructor (props) {

		super(props);
    this.model = props.model;
		this.id = props.model.id;
		props.master.register(this);
	}

  render () {

    return (
      <div className="sensuba-deck">
      {
      	this.model.cards.map((model, i) => <Card hidden key={i} model={model} master={this.props.master}/>)
      }
      </div>
    )
  }
}