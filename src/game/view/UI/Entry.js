import React, { Component } from 'react';

const SECRET_PREVIEW = {
  cardType: "secret",
  nameCard: "Secret Inconnu",
  anime: "",
  description: "",
  flavourText: "",
  imgLink: "/game/secret.png",
  mana: 1
}

export default class Entry extends Component {

  showTooltip(e, card, left) {

  	var tooltip = document.getElementById("img-preview-tooltip");
    if (e.pageX < 300)
      left = false;
  	tooltip.setAttribute("style", `display: block; top: ${e.pageY > window.innerHeight * 0.74 - 60 + window.scrollY ? window.innerHeight * 0.74 - 60 + window.scrollY : (e.pageY < 80 + window.innerHeight * 0.2 ? 80 + window.innerHeight * 0.2 : e.pageY)}px; left: ${e.pageX}px; margin-left: ${left ? -18 : 4}em;`);
  	var src = card && card.eff ? card.eff : card;
    var target = this.props.value.target ? (this.props.value.target.eff || this.props.value.target) : undefined;
    if (this.props.value.type === "play" && card.cardType === "secret") {
      target = undefined;
      if (!src.nameCard)
        src = SECRET_PREVIEW;
    }
    var icon = undefined;
    if (target) {
      switch (this.props.value.type) {
      case "play":
      case "action":
      case "skill":
      case "attack": icon = this.props.value.type; break;
      default: break;
      }
    }
    this.props.master.updatePreview({ card: src, target, icon, text: this.props.value.text });
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
    		{ this.props.value.src ? <img crossOrigin="Anonymous" className="history-entry-bg" src={this.props.value.type === "play" && this.props.value.src.cardType === "secret" ? "/game/secret.png" : (this.props.value.src.imgLink || "/game/back.png")} alt="History card preview"/> : <span/> }
		</div>
    )
  }
}