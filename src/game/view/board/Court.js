import React, { Component } from 'react';
import Card from './Card';

export default class Court extends Component {

	constructor (props) {

		super(props);
    this.model = props.model;
		this.id = props.model.id;
		props.master.register(this);
	}

  render () {

    return (
      <div className="sensuba-court">
      {
        this.model.card !== null ? <Card model={this.model.card} master={this.props.master}/> : <span/>
      }
      </div>
    )
  }
}