import * as _ from "lodash";
import { PortModel as SuperPortModel, DiagramEngine } from "storm-react-diagrams";
import LinkModel from "./LinkModel";

export default class PortModel extends SuperPortModel {

	constructor(isInput, name, type = "exe", label = " ", id = null) {
		super(name, "default", id);
		this.in = isInput;
		this.type = type;
		this.label = label || name;
		this.updateColor();
	}

	deSerialize(object, engine) {
		super.deSerialize(object, engine);
		this.in = object.in;
		this.label = object.label;
	}

	serialize() {
		return _.merge(super.serialize(), {
			in: this.in,
			type: this.type,
			label: this.label
		});
	}

	link(port) {
		let link = this.createLinkModel();
		link.setSourcePort(this);
		link.setTargetPort(port);
		return link;
	}

	canLinkToPort(port) {
		if (port instanceof PortModel) {
			return this.in !== port.in && this.type === port.type;
		}
		return true;
	}

	get count () {

		return Object.keys(this.getLinks()).length;
	}

	createLinkModel() {
		let link = super.createLinkModel();
		return link || new LinkModel();
	}

	updateColor () {

		switch (this.type) {
		case "effect":
		case "event": this.color ="#871212"; break;
		case "exe": this.color = "#F0F0F0"; break;
		case "int": this.color = "#35e8b8"; break;
		case "bool": this.color ="#3d49a5"; break;
		case "state": this.color ="#ffe521"; break;
		case "string": this.color ="#c8ce18"; break;
		case "card": this.color ="#73BEC8"; break;
		case "cardfilter": this.color = "#f23ece"; break;
		case "tilefilter": this.color = "#fc5d5d"; break;
		case "model": this.color = "#8930b2"; break;
		case "location": this.color = "#ffa126"; break;
		case "locations": this.color = "#b77012"; break;
		case "mutation": this.color = "#12d22c"; break;
		case "area": this.color = "#19601c"; break;
		case "period":
		case "timestamp": this.color = "#404040"; break;
		default: this.color = "#ffffff"; break;
		}
	}
}