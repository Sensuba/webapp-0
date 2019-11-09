import React, { Component } from 'react';

export default class Entry extends Component {

  showTooltip(e, card, left) {console.log(card);

  	var tooltip = document.getElementById("img-preview-tooltip");
    if (e.pageX < 300)
      left = false;
  	tooltip.setAttribute("style", `display: block; top: ${e.pageY}px; left: ${e.pageX}px; margin-left: ${left ? -18 : 4}em; margin-top: -4em`);
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
    	className={"history-entry history-" + this.props.value.type}
        onMouseMove={e => this.showTooltip(e, this.props.value.src, true)}
        onMouseLeave={e => this.hideTooltip()}
        >
    		<img crossOrigin="Anonymous" className="history-entry-bg" src={this.props.value.src.imgLink} alt="History card preview"/>
		</div>
    )
  }
}