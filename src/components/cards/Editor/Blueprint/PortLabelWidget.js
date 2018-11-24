import * as React from "react";
import PortWidget from "./PortWidget";
import { BaseWidget } from "storm-react-diagrams";

export default class PortLabelWidget extends BaseWidget<DefaultPortLabelProps, DefaultPortLabelState> {
	constructor(props) {
		super("srd-default-port", props);
	}

	getClassName() {
		return super.getClassName() + (this.props.model.in ? this.bem("--in") : this.bem("--out"));
	}

	render() {

		var color = this.props.model.color;

		var style = {borderColor: color};
		var className = this.props.model.type === "exe" || this.props.model.type === "effect" ? "exe" : "";
		if (this.props.model.count > 0) {
			style.backgroundColor = color;
			className += " linked";
		}

		var port = <PortWidget className={className} style={style} node={this.props.model.getParent()} name={this.props.model.name} />;
		var label = <div className="name">{this.props.model.label}</div>;
		var value = null;
		var update = e => this.props.model.value = e.target.value;
		if (this.props.model.in)
		switch (this.props.model.type) {
		case "int": value = <input onChange={update} type="number" className="value"/>; break;
		case "string": value = <input onChange={update} type="text" className="value"/>; break;
		case "bool": this.props.model.value = this.props.model.value || "true"; value = <select onChange={update} className="value"><option>true</option><option>false</option></select>; break;
		case "state": this.props.model.value = this.props.model.value || "initiative"; value = <select onChange={update} className="value"><option>initiative</option><option>rush</option><option>fury</option><option>exaltation</option><option>flying</option><option>lethal</option><option>frozen</option><option>concealed</option><option>cover neighbors</option></select>; break;
		case "cardfilter": this.props.model.value = this.props.model.value || ""; value = <select onChange={update} className="value"><option></option><option>hero</option><option>figure</option><option>character</option><option>entity</option><option>spell</option><option>artifact</option><option>damaged</option></select>; break;
		case "tilefilter": this.props.model.value = this.props.model.value || ""; value = <select onChange={update} className="value"><option></option><option>empty</option><option>entity</option><option>character</option><option>hero</option><option>figure</option><option>artifact</option><option>friendly</option><option>friendly empty</option><option>enemy entity</option><option>friendly character</option><option>friendly figure</option><option>enemy</option><option>enemy empty</option><option>enemy entity</option><option>enemy character</option><option>enemy figure</option></select>; break;
		case "card": this.props.model.value = this.props.model.value || "this"; value = <select onChange={update} className="value"><option>this</option><option>your hero</option><option>opponent's hero</option></select>; break;
		case "period": this.props.model.value = this.props.model.value || "this turn"; value = <select onChange={update} className="value"><option>this turn</option><option>opponent's turn</option><option>since previous turn</option><option>previous turn</option><option>all game</option></select>; break;
		case "timestamp": this.props.model.value = this.props.model.value || "end of turn"; value = <select onChange={update} className="value"><option>end of turn</option><option>start of turn</option><option>end of your turn</option><option>start of your turn</option><option>end of opponent's turn</option><option>start of opponent's turn</option></select>; break;
		case "effecttype": this.props.model.value = this.props.model.value || ""; value = <select onChange={update} className="value"><option></option><option>play</option><option>skill</option><option>action</option><option>last will</option><option>frenzy</option></select>; break;
		case "model": this.props.model.value = this.props.model.value || "this"; value = <select onChange={update} className="value"><option>this</option></select>; break;
		case "location": this.props.model.value = this.props.model.value || "this"; value = <select onChange={update} className="value"><option>this</option><option>hand</option><option>deck</option><option>cemetery</option><option>opponent's hand</option><option>opponent's deck</option><option>opponent's cemetery</option></select>; break;
		case "locations": this.props.model.value = this.props.model.value || "board"; value = <select onChange={update} className="value"><option>board</option><option>field</option><option>front</option><option>back</option><option>hand</option><option>deck</option><option>cemetery</option><option>opponent's field</option><option>opponent's front</option><option>opponent's back</option><option>opponent's hand</option><option>opponent's deck</option><option>opponent's cemetery</option></select>; break;
		case "area": this.props.model.value = this.props.model.value || "self"; value = <select onChange={update} className="value"><option>self</option><option>opponent</option></select>; break;
		default: break;
		}

		return (
			<div {...this.getProps()} onKeyUp={e => e.stopPropagation()}>
				{this.props.model.in ? port : label}
				{this.props.model.in ? label : port}
				{value}
			</div>
		);
	}
}