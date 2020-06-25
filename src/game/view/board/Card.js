import React, { Component } from 'react';
import View from '../../../components/cards/Card';

const marks = ["sakuramark", "reipromote"];

export default class Card extends Component {

  showTooltip(e, card, left, bottom) {

    var tooltip = document.getElementById("img-preview-tooltip");
    if (e) {
      if (e.pageX < 300)
        left = false;
      tooltip.setAttribute("style", `display: block; top: ${e.pageY > window.innerHeight * 0.74 - 60 + window.scrollY ? window.innerHeight * 0.74 - 60 + window.scrollY : (e.pageY < 80 + window.innerHeight * 0.2 ? 80 + window.innerHeight * 0.2 : e.pageY)}px; left: ${e.pageX}px; margin-left: ${left ? -18 : 4}em`);
    }
    else tooltip.setAttribute("style", `display: block`);
    this.show = true;
    this.props.master.setState({preview: card.eff});
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
        className={"sensuba-card-view" + (model.hasState("flying") ? " flying" : "") + (visible && model.hasState("glazed") ? " glazed" : "") + (model.concealed ? " concealed" : "") /*+ (model.firstTurn && !model.hasState("rush") && model.area.isPlaying ? " firstturn" : "")*/ + (this.props.hidden ? " invisible" : "")}
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
          { model.lastwill && model.onBoard ? <div className="sensuba-card-lastwill"/> : <span/> }
          { model.concealed && model.onBoard ? <div className="sensuba-card-conceal"/> : <span/> }
          { model.hasState("fury") && model.onBoard ? <div className="sensuba-card-fury"/> : <span/> }
          { model.exalted && model.onBoard ? <div className="sensuba-card-exalt"/> : <span/> }
          { visible && model.hasState("glazed") ? <div className="sensuba-card-glaze"/> : <span/> }
          { model.hasState("static") && model.onBoard && (!master.props.mission || master.props.mission.mission !== "tutorial") ? <div className="sensuba-card-static"/> : <span/> }
          { visible && model.hasState("immune") && model.onBoard ? <div className="sensuba-card-immune"/> : <span/> }
          { model.frozen && model.onBoard ? <div className="sensuba-card-freeze"/> : <span/> }
          { model.hasShield && model.onBoard ? <div className="sensuba-card-shield"/> : <span/> }
          { model.hasState("initiative") && model.onBoard ? <div className="sensuba-card-initiative"/> : <span/> }
          { model.hasState("lethal") && model.onBoard ? <div className="sensuba-card-lethal"/> : <span/> }
          { model.silenced && model.onBoard ? <div className="sensuba-card-silence"/> : <span/> }
          { model.hasState("cover neighbors") && model.onBoard ? <div className="sensuba-card-cover-neighbors"/> : <span/> }
          { model.variables && marks.find(m => model.variables[m]) ? <div className={"sensuba-card-mark sensuba-card-mark-" + marks.find(m => model.variables[m])}/> : <span/> }
          <div className="sensuba-card-covers">{ model.covered ? <div className="sensuba-card-cover"/> : <span/> }{ model.isCovered(true) ? <div className="sensuba-card-cover sensuba-card-cover-air"/> : <span/> }</div>
          </div>
        <div className="sensuba-card-animmask"/><div className="sensuba-card-digitanim"/>
      </div>
    )
  }
}