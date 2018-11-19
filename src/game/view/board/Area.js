import React, { Component } from 'react';

export default class Area extends Component {

	constructor (props) {

		super(props);
    this.model = props.model;
		this.id = props.model.id;
		props.master.register(this);
	}

  render () {

    return (
      <div className="sensuba-area">
      	{this.props.children}
      </div>
    )
  }
}