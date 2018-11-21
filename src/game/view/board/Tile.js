import React, { Component } from 'react';
import Card from './Card';

export default class Tile extends Component {

	constructor (props) {

		super(props);
    this.model = props.model;
		this.id = props.model.id;
		props.master.register(this);
	}

  render () {

    return (
      <div className="sensuba-tile" onClick={() => this.props.master.manager.select(this.model)}>
      {
        this.model.card !== null ? <Card model={this.model.card} master={this.props.master} select={m => this.props.master.manager.select(m)}/> : <span/>
      }
      </div>
    )
  }
}