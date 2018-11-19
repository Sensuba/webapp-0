import React, { Component } from 'react';

export default class Row extends Component {

  render () {

    return (
      <div className="sensuba-row">
      	{this.props.children}
      </div>
    )
  }
}