import React, { Component } from 'react';

export default class Field extends Component {

	constructor (props) {

		super(props);
    this.model = props.model;
		this.id = props.model.id;
		props.master.register(this);
	}

  render () {

    return (
      <div className="sensuba-field">
      	{this.props.children}
      </div>
    )
  }
}