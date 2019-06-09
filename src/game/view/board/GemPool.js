import React, { Component } from 'react';

export default class GemPool extends Component {

  render () {

  	var gems = [];
  	for (var i = 0; i < this.props.model.gems; i++)
  		gems.push(i);

    return (
      <div className="sensuba-gems">
      {
      	gems.map(model => <div key={model} className="sensuba-gem"/>)
      }
      </div>
    )
  }
}