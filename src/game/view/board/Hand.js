import React, { Component } from 'react';
import Card from './Card';

export default class Hand extends Component {

	constructor (props) {

		super(props);
    this.model = props.model;
		this.id = props.model.id;
		props.master.register(this);
	}

  render () {

    return (
      <div className="sensuba-hand">
      {
      	this.model.cards.map((model, i) => <Card key={i} model={model} master={this.props.master} select={m => this.props.master.manager.select(m)}/>)
      }
      </div>
    )
  }
}