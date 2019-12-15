import React, { Component } from 'react';
import Card from './Card';

export default class Choosebox extends Component {

  render () {

    return (
      <div className={"sensuba-choosebox" + (this.props.model.opened ? " sensuba-choosebox-opened" : "")}>
	      <div className="sensuba-choosebox-inner">
	      {
	      	this.props.model.cards.map((model, i) => {
	      		return <Card key={model.id.no} model={model} master={this.props.master} select={m => this.props.master.manager.select(m)}/>
	      	})
	      }
	      </div>
      </div>
    )
  }
}