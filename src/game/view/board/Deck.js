import React, { Component } from 'react';
import Card from './Card';

export default class Deck extends Component {

  render () {

    return (
      <div className={"sensuba-deck sensuba-deck-size" + this.deckSizeToCssNo()}>
      {
      	this.props.model.cards.map(model => <Card hidden key={model.id.no} model={model} master={this.props.master}/>)
      }
      <div className="fatigue-mark"/>
      </div>
    )
  }

  deckSizeToCssNo () {

  	if (this.props.model.count > 20)
  		return "1";
  	if (this.props.model.count > 15)
  		return "2";
  	if (this.props.model.count > 10)
  		return "3";
  	if (this.props.model.count > 5)
  		return "4";
  	if (this.props.model.count > 1)
  		return "5";
  	if (this.props.model.count > 0)
  		return "6";
  	if (this.props.model.count === 0)
  		return "7";
  }
}