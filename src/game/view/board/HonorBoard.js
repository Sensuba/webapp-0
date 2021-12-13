import React, { Component } from 'react';

export default class HonorBoard extends Component {

  showTooltip(e, card, left, bottom) {

    var tooltip = document.getElementById("img-preview-tooltip");
    if (e) {
      if (e.pageX < 400)
        left = false;
      tooltip.setAttribute("style", `display: block; top: ${e.pageY > window.innerHeight * 0.74 - 60 + window.scrollY ? window.innerHeight * 0.74 - 60 + window.scrollY : (e.pageY < 140 + window.innerHeight * 0.2 ? 140 + window.innerHeight * 0.2 : e.pageY)}px; left: ${e.pageX}px; margin-left: ${left ? -18 : 4}em`);
    }
    else tooltip.setAttribute("style", `display: block`);
    this.show = true;
    this.props.master.updatePreview({ card: card.eff });
    //setState({preview: card.eff});
  }

  hideTooltip() {

    var tooltip = document.getElementById("img-preview-tooltip");
    tooltip.setAttribute("style", `display: none`);
    this.show = false;
  }

  render () {

    //var master = this.props.master;
    var model = this.props.model;

    return (
      <div
      id={"sensuba-honorboard-" + model.id.no}
      className={"sensuba-honorboard"}>
      {
        this.props.model.cards.map((model, i) => {
          return (
            <div key={model.id.no} style={{left: (2*i) + "vw", top:(0.3*i) + "vw"}} className="sensuba-seal-icon"
              onMouseMove={e => this.showTooltip(e, model, true, false)}
              onMouseLeave={e => this.hideTooltip()}
              >
              <img id={model.id.no + "-icon"} crossOrigin="Anonymous" className="sensuba-seal-icon-img" src={model.icon || '/cards/neutralblack.png'} alt={model.nameCard + " icon"}/>
            </div>)
        })
      }
      </div>
    )
  }
}