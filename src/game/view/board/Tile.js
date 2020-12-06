import React, { Component } from 'react';
import Card from './Card';

export default class Tile extends Component {

  render () {

    var master = this.props.master;
    var model = this.props.model;

    return (
      <div
      id={"sensuba-tile-" + model.id.no}
      className={"sensuba-tile " + (master.manager ? master.manager.controller.targetable(model) : "") + " " + (model.hazards ? "sensuba-hazards-" + model.hazards : "")}
      onClick={e => { master.select(model); e.stopPropagation(); } }>
      {
        model.card !== null ? <Card model={model.card} master={master} select={m => master.select(m)}/> : <span/>
      }
      </div>
    )
  }
}