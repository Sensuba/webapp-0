import React, { Component } from 'react';
import View from '../../../components/cards/Card';

const marks = ["sakuramark", "reipromote", "acceleratorvector", "chiseenchant", "atsukobewitch", "natsumemark"];

export default class Card extends Component {

  showTooltip(e, card, left, bottom) {

    var tooltip = document.getElementById("img-preview-tooltip");
    if (e) {
      if (e.pageX < 400)
        left = false;
      tooltip.setAttribute("style", `display: block; top: ${e.pageY > window.innerHeight * 0.74 - 60 + window.scrollY ? window.innerHeight * 0.74 - 60 + window.scrollY : (e.pageY < 140 + window.innerHeight * 0.2 ? 140 + window.innerHeight * 0.2 : e.pageY)}px; left: ${e.pageX}px; margin-left: ${left ? -18 : 4}em`);
    }
    else tooltip.setAttribute("style", `display: block`);
    this.show = true;
    this.props.master.updatePreview({ card: card.eff, target: card.pilot ? card.pilot.eff : undefined });
    //setState({preview: card.eff});
  }

  hideTooltip() {

  	var tooltip = document.getElementById("img-preview-tooltip");
  	tooltip.setAttribute("style", `display: none`);
    this.show = false;
  }

  componentWillUnmount() {

    if (this.props.master.state.preview && this.props.model && this.props.master.state.preview.id === this.props.model.id) 
      this.hideTooltip();
  }

  render () {

    var model = this.props.model;
    var master = this.props.master;

    var visible = model.nameCard && (!model.invisible || model.invisible.for !== master.no) && (model.location.public || model.area === master.state.model.areas[master.no] || (master.access && master.access.some(no => no === model.area.id.no)) || model.location.id.type === "deck");

    return (
      <div
        id={"sensuba-card-" + model.id.no}
        style={this.props.style}
        onMouseMove={visible ? e => this.showTooltip(e, model, true, false/*model && model.inHand*/) : e => {}}
        onMouseLeave={visible ? e => this.hideTooltip() : e => {}}
        className={(this.props.className || "") + " sensuba-card-view" + (model.hasState("flying") ? " flying" : "") + (visible && model.hasState("glazed") ? " glazed" : "") + (model.concealed ? " concealed" : "") + (visible && model.hasState("temporary") ? " temporary" : "") /*+ (model.firstTurn && !model.hasState("rush") && model.area.isPlaying ? " firstturn" : "")*/ + (this.props.hidden ? " invisible" : "")}
        onTouchEnd={e => this.touched = !this.show || !this.props.master.state.preview || this.props.master.state.preview.id !== this.props.model.id }
        onClick={e => {
          if (this.touched) {
            this.showTooltip(null, model, true);
            this.touched = false;
          }
          if (this.props.select) {
            this.props.select(model);
            document.getElementById("faculty-tooltip").setAttribute("style", `top: ${e.pageY}px; left: ${e.pageX}px; margin-left: 4em`);
          }
          e.stopPropagation();
        }}>
          <div className="sensuba-card-container">
      	   <View model={model.model} level={model.level} src={visible ? model.eff : null} className={master.manager ? master.manager.controller.haloFor(model) : ""}/>
          { model.lastwill && model.onBoard ? <div className="sensuba-card-lastwill"/> : "" }
          { model.concealed && model.onBoard ? <div className="sensuba-card-conceal"/> : "" }
          { model.hasState("fury") && model.onBoard ? <div className="sensuba-card-fury"/> : "" }
          { model.hasState("poisoned") && model.onBoard ? <div className="sensuba-card-poisoned"/> : "" }
          { model.eff.armor && model.onBoard ? <div className="sensuba-card-armor"/> : "" }
          { model.exalted && model.onBoard ? <div className="sensuba-card-exalt"/> : "" }
          { visible && model.hasState("glazed") ? <div className="sensuba-card-glaze"/> : "" }
          { visible && model.hasState("temporary") ? <div className="sensuba-card-temporary"/> : "" }
          { visible && model.hasState("bonus") ? <div className="sensuba-card-bonus"/> : "" }
          { model.hasState("static") && model.onBoard && (!master.props.mission || master.props.mission.mission !== "tutorial") ? <div className="sensuba-card-static"/> : "" }
          { visible && model.hasState("immune") && model.onBoard ? <div className="sensuba-card-immune"/> : "" }
          { model.frozen && model.onBoard ? <div className="sensuba-card-freeze"/> : "" }
          { model.hasShield && model.onBoard ? <div className="sensuba-card-shield"/> : "" }
          { model.hasState("initiative") && model.onBoard ? <div className="sensuba-card-initiative"/> : "" }
          { model.hasState("lethal") && model.onBoard ? <div className="sensuba-card-lethal"/> : "" }
          { model.silenced && model.onBoard ? <div className="sensuba-card-silence"/> : "" }
          { model.hasState("cover neighbors") && model.onBoard ? <div className="sensuba-card-cover-neighbors"/> : "" }
          { model.charges !== undefined && model.charges !== null ? <div className="sensuba-card-charge">{[1,2,3,4,5].map(i => <div key={i} className={"sensuba-card-charge-count " + (model.charges >= i ? "sensuba-card-charge-on" : "")}/>)}</div> : "" }
          { model.isType("artifact") && model.mecha && model.onBoard ? <div className="sensuba-card-activation">{(model.activationPt || 0) + "/" + model.activation}</div> : "" }
          { model.variables && marks.find(m => model.variables[m]) ? <div className={"sensuba-card-mark sensuba-card-mark-" + marks.find(m => model.variables[m])}/> : "" }
          { model.isType("figure") && model.mecha && model.onBoard && model.pilot ? <div className="sensuba-card-piloted"/> : "" }
          <div className="sensuba-card-covers">{ model.covered ? <div className="sensuba-card-cover"/> : "" }{ model.isCovered(true) ? <div className="sensuba-card-cover sensuba-card-cover-air"/> : "" }</div>
          </div>
        <div className="sensuba-card-animmask"/><div className="sensuba-card-digitanim"/>
      </div>
    )
  }
}