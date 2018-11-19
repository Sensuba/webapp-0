import React, { Component } from 'react';
import View from '../../../components/cards/Card';

export default class Card extends Component {

	constructor (props) {

		super(props);
		this.model = props.model;
		this.id = props.model.id;
		props.master.register(this);
	}

  showTooltip(e, card, left) {

  	var tooltip = document.getElementById("img-preview-tooltip");
  	tooltip.setAttribute("style", `display: block; top: ${e.pageY}px; left: ${e.pageX}px; margin-left: ${left ? -18 : 0}em`);
  	this.props.master.setState({preview: card});
  }

  hideTooltip() {

  	var tooltip = document.getElementById("img-preview-tooltip");
  	tooltip.setAttribute("style", `display: none`);
  }

  render () {

  	if (this.data === undefined && this.model.idCardmodel)
  		this.data = this.props.master.state.cards.find(card => card.idCardmodel === this.model.idCardmodel);

    return (
      <div onMouseMove={this.data ? e => this.showTooltip(e, this.data, true) : e => {}} onMouseLeave={this.data ? e => this.hideTooltip() : e => {}} className={"sensuba-card-view" + (this.props.hidden ? " invisible" : "")} onClick={() => this.props.select(this.model)}>
      	<View src={this.data}/>
      </div>
    )
  }
}