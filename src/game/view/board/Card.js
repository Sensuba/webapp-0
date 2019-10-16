import React, { Component } from 'react';
import View from '../../../components/cards/Card';

export default class Card extends Component {

  showTooltip(e, card, left) {

  	var tooltip = document.getElementById("img-preview-tooltip");
    if (e.pageX < 300)
      left = false;
  	tooltip.setAttribute("style", `display: block; top: ${e.pageY > window.innerHeight - 200 + window.scrollY ? window.innerHeight - 200 + window.scrollY : e.pageY}px; left: ${e.pageX}px; margin-left: ${left ? -18 : 4}em`);
  	this.props.master.setState({preview: card.eff});
  }

  hideTooltip() {

  	var tooltip = document.getElementById("img-preview-tooltip");
  	tooltip.setAttribute("style", `display: none`);
  }

  componentWillUnmount() {

    if (this.props.master.state.preview === this.props.model)
      this.hideTooltip();
  }

  render () {

    return (
      <div
        id={"sensuba-card-" + this.props.model.id.no}
        style={this.props.style}
        onMouseMove={this.props.model.nameCard ? e => this.showTooltip(e, this.props.model, true) : e => {}}
        onMouseLeave={this.props.model.nameCard ? e => this.hideTooltip() : e => {}}
        className={"sensuba-card-view" + (this.props.model.hasState("flying") ? " flying" : "") + (this.props.hidden ? " invisible" : "")}
        onClick={e => {
          if (this.props.select) {
            this.props.select(this.props.model);
            document.getElementById("faculty-tooltip").setAttribute("style", `top: ${e.pageY}px; left: ${e.pageX}px; margin-left: 4em`);
          }
          e.stopPropagation();
        }}>
      	<View model={this.props.model.model} level={this.props.model.level} src={this.props.model.nameCard ? this.props.model.eff : null} className={this.props.master.manager.controller.haloFor(this.props.model)}/>
        { this.props.model.hasShield ? <div className="sensuba-card-shield"/> : <span/> }
        { this.props.model.frozen ? <div className="sensuba-card-freeze"/> : <span/> }
        { this.props.model.exalted && this.props.model.onBoard ? <div className="sensuba-card-exalt"/> : <span/> }
        { this.props.model.silenced ? <div className="sensuba-card-silence"/> : <span/> }
      </div>
    )
  }
}