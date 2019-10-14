import React, { Component } from 'react';

export default class Area extends Component {

  render () {

    return (
      <div id={"sensuba-area-" + this.props.model.id.no} className="sensuba-area">
      	{this.props.children}
      </div>
    )
  }
}