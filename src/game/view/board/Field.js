import React, { Component } from 'react';

export default class Field extends Component {

  render () {

    return (
      <div className="sensuba-field">
      	{this.props.children}
      </div>
    )
  }
}