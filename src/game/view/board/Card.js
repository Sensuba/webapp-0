import React, { Component } from 'react';
import View from '../../../components/cards/Card';

export default class Card extends Component {

  showTooltip(e, card, left) {

  	var tooltip = document.getElementById("img-preview-tooltip");
  	tooltip.setAttribute("style", `display: block; top: ${e.pageY}px; left: ${e.pageX}px; margin-left: ${left ? -18 : 4}em`);
  	this.props.master.setState({preview: card});
  }

  hideTooltip() {

  	var tooltip = document.getElementById("img-preview-tooltip");
  	tooltip.setAttribute("style", `display: none`);
  }

  /*showFaculties(e, card, left) {

    var tooltip = document.getElementById("faculty-tooltip");
    //tooltip.setAttribute("style", `display: block; top: ${e.pageY}px; left: ${e.pageX}px; margin-left: ${left ? -18 : 4}em`);
  }*/

  render () {

  	//if (this.data === undefined && this.props.model.idCardmodel)
  	//	this.data = this.props.master.state.cards.find(card => card.idCardmodel === this.props.model.idCardmodel);

    return (
      <div
        style={this.props.style}
        onMouseMove={this.props.model.idCardmodel ? e => this.showTooltip(e, this.props.model, true) : e => {}}
        onMouseLeave={this.props.model.idCardmodel ? e => this.hideTooltip() : e => {}}
        className={"sensuba-card-view" + (this.props.hidden ? " invisible" : "")}
        onClick={e => {
          this.props.select(this.props.model);
          document.getElementById("faculty-tooltip").setAttribute("style", `top: ${e.pageY}px; left: ${e.pageX}px; margin-left: 4em`);
          e.stopPropagation();
        }}>
      	<View model={this.props.model.model} src={this.props.model.idCardmodel ? this.props.model : null} className={this.props.master.manager.controller.haloFor(this.props.model)}/>
      </div>
    )
  }
}