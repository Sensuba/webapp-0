import React, { Component } from 'react';
import Card from './Card';

export default class Court extends Component {

  render () {

    return (
      <div className={"sensuba-court " + (this.props.model.id.no === 1 ? "sensuba-court-top" : "sensuba-court-bottom")}>
      {
        this.props.model.card !== null ? <Card model={this.props.model.card} master={this.props.master}/> : <span/>
      }
      </div>
    )
  }
}