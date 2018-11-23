import React, { Component } from 'react';

export default class Area extends Component {

  render () {

    return (
      <div className="sensuba-area">
      	{this.props.children}
      </div>
    )
  }
}