import React, { Component } from 'react';
import Card from './Card';

export default class SecretBox extends Component {

  render () {

    //var master = this.props.master;
    var model = this.props.model;

    return (
      <div
      id={"sensuba-secretbox-" + model.id.no}
      className={"sensuba-secretbox"}>
      {
        this.props.model.cards.map((model, i) => {
          return <Card style={{left: (2*i) + "vw", top:(0.3*i) + "vw"}} key={model.id.no} model={model} master={this.props.master} select={m => this.props.master.manager.select(m)}/>
        })
      }
      </div>
    )
  }
}