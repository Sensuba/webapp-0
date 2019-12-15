import React, { Component } from 'react';

export default class Faculty extends Component {

  showTooltip(e, card, left, bottom) {

    var tooltip = document.getElementById("img-preview-tooltip");
    if (e) {
      if (e.pageX < 300)
        left = false;
    	tooltip.setAttribute("style", `display: block; top: ${e.pageY > window.innerHeight * 0.74 - 60 + window.scrollY ? window.innerHeight * 0.74 - 60 + window.scrollY : e.pageY}px; left: ${e.pageX}px; margin-left: ${left ? -18 : 4}em; opacity: 0.9; filter: grayscale(0.5) sepia(0.5) hue-rotate(120deg);`);
    }
    else tooltip.setAttribute("style", `display: block`);
    this.show = true;
    this.props.master.setState({preview: card});
  }

  hideTooltip() {

  	var tooltip = document.getElementById("img-preview-tooltip");
  	tooltip.setAttribute("style", `display: none`);
    this.show = false;
  }

  componentWillUnmount() {

    //if (this.props.master.state.preview && this.props.src. && this.props.master.state.preview.id === this.props.model.id) 
      this.hideTooltip();
  }

  render () {

    return (
    	<div
    		className={"faculty" + (this.props.src.usable ? "" : " locked-faculty")}
    		onClick={e => {
          this.props.select({ id: { type: "faculty", no: this.props.src.no } });
          if (this.props.src.usable && this.props.master.manager)
            this.props.master.manager.unselect();
        }}
	        onMouseMove={this.props.src.show ? e => this.showTooltip(e, this.props.src.show, true, false) : e => {}}
	        onMouseLeave={this.props.src.show ? e => this.hideTooltip() : e => {}}>
    		<div className="faculty-desc">{this.props.src.desc}</div>
    		<div className="faculty-cost">{this.props.src.cost}</div>
		</div>
    )
  }
}