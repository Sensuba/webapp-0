import React, { Component } from 'react';
import Card from './Card';

export default class Deck extends Component {

  showTooltip(e) {

    var tooltip = document.getElementById("deck-count-tooltip");
    tooltip.setAttribute("style", `display: block; top: ${e.pageY}px; left: ${e.pageX}px; margin-left: -18em`);
    this.props.master.setState({deckcount: {you: this.props.model.id.no === this.props.master.no, count:this.props.model.count}});
  }

  hideTooltip() {

    var tooltip = document.getElementById("deck-count-tooltip");
    tooltip.setAttribute("style", `display: none`);
  }

  render () {

    return (
      <div className={"sensuba-deck sensuba-deck-size" + this.deckSizeToCssNo()}
        onMouseMove={this.props.model ? e => this.showTooltip(e) : e => {}}
        onMouseLeave={this.props.model ? e => this.hideTooltip() : e => {}}
      >
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