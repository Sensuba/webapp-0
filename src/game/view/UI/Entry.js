import React, { Component } from 'react';

export default class Entry extends Component {

  showTooltip(e, card, left) {

  	var tooltip = document.getElementById("img-preview-tooltip");
    if (e.pageX < 300)
      left = false;
  	tooltip.setAttribute("style", `display: block; top: ${e.pageY > window.innerHeight * 0.74 - 60 + window.scrollY ? window.innerHeight * 0.74 - 60 + window.scrollY : e.pageY}px; left: ${e.pageX}px; margin-left: ${left ? -18 : 4}em; margin-top: -4em`);
  	this.props.master.setState({preview: card});
  }

  hideTooltip() {

  	var tooltip = document.getElementById("img-preview-tooltip");
  	tooltip.setAttribute("style", `display: none`);
  }

  componentWillUnmount() {

    if (!this.props.master || !this.props.master.state)
      return;
    if (this.props.master.state.preview === this.props.value.src)
      this.hideTooltip();
  }

  render () {

    return (
    	<div
    	className={"history-entry history-" + this.props.value.type + ( this.props.value.option ? (" option-" + this.props.value.option) : "" )}
        onMouseMove={e => this.showTooltip(e, this.props.value.src, true)}
        onMouseLeave={e => this.hideTooltip()}
        >
    		{ this.props.value.src ? <img crossOrigin="Anonymous" className="history-entry-bg" src={this.props.value.src.imgLink || "/game/back.png"} alt="History card preview"/> : <span/> }
		</div>
    )
  }
}