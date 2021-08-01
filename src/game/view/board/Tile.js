import React, { Component } from 'react';
import Card from './Card';

export default class Tile extends Component {

  render () {

    var master = this.props.master;
    var model = this.props.model;

    var classes = (master.manager ? master.manager.controller.targetable(model) : "");
    model.hazards.forEach(hazards => classes += " sensuba-hazards-" + hazards);

    return (
      <div
      id={"sensuba-tile-" + model.id.no}
      className={"sensuba-tile " + classes}
      onClick={e => { master.select(model); e.stopPropagation(); } }>
      {
        model.card !== null ? <Card model={model.card} master={master} select={m => master.select(m)}/> : <span/>
      }
      <div className="sensuba-tile-weather">
        <div className="particle"/><div className="particle"/><div className="particle"/><div className="particle"/>
        <div className="particle"/><div className="particle"/><div className="particle"/><div className="particle"/>
      </div>
      <div className="sensuba-tile-magic"/>
      </div>
    )
  }
}