import * as _ from "lodash";
import { NodeModel as SuperNodeModel, Toolkit } from "storm-react-diagrams";
import Port from './PortModel'

export default class NodeModel extends SuperNodeModel {

	constructor(type = "Untitled", name = "Untitled", color = "rgb(0,192,255)") {
		super("default");
		this.defaultNodeType = type;
		this.name = name;
		this.color = color;
	}

	get nodeType () {

		switch (this.stateEvent) {
		case 1: return this.defaultNodeType + "-trigger";
		case 2: return this.defaultNodeType + "-data";
		default: return this.defaultNodeType;
		}
	}

	addInPort(type, label) {
		return this.addPort(new Port(true, Toolkit.UID(), type, label));
	}

	addOutPort(type, label) {
		return this.addPort(new Port(false, Toolkit.UID(), type, label));
	}

	deSerialize(object, engine) {
		super.deSerialize(object, engine);
		this.name = object.name;
		this.color = object.color;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name,
			color: this.color
		});
	}

	getInPorts() {
		return _.filter(this.ports, portModel => {
			return portModel.in;
		});
	}

	getOutPorts() {
		return _.filter(this.ports, portModel => {
			return !portModel.in;
		});
	}

	switch () {

		var ports = this.getPorts();
		Object.keys(ports).forEach(keyp => this.removePort(ports[keyp]));
		if (this.stateEvent === undefined)
			this.stateEvent = 0;
		else
			this.stateEvent = (this.stateEvent + 1) % 3;
		var model;
		switch (this.stateEvent) {
		case 1: model = [ {inout: "out", type: "event", name: "event"} ]; break;
		case 2: model = this.event; break;
		default: model = this.model; break;
		}
		model.forEach(inout => {

			if (inout.inout === "in")
				this.addInPort(inout.type, inout.name);
			else
				this.addOutPort(inout.type, inout.name);
		});
		if (this.forceUpdate)
			this.forceUpdate();
	}
}