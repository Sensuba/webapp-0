import React, { Component } from 'react';
import Card from './Card';

export default class Tile extends Component {

  render () {

    return (
      <div className={"sensuba-tile " + this.props.master.manager.controller.targetable(this.props.model)} onClick={() => this.props.master.manager.select(this.props.model)}>
      {
        this.props.model.card !== null ? <Card model={this.props.model.card} master={this.props.master} select={m => this.props.master.manager.select(m)}/> : <span/>
      }
      </div>
    )
  }
}