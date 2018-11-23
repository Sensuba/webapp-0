import * as _ from "lodash";
import { NodeModel as SuperNodeModel, Toolkit } from "storm-react-diagrams";
import Port from './PortModel'

export default class NodeModel extends SuperNodeModel {

	constructor(type = "Untitled", name = "Untitled", color = "rgb(0,192,255)") {
		super("default");
		this.nodeType = type;
		this.name = name;
		this.color = color;
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

	setStateEvent(stateEvent) {

		if (this.stateEvent === undefined || this.stateEvent !== stateEvent)
			this.switch();
	}

	switch () {

		var ports = this.getPorts();
		Object.keys(ports).forEach(keyp => this.removePort(ports[keyp]));
		if (this.stateEvent === undefined)
			this.stateEvent = false;
		else
			this.stateEvent = !this.stateEvent;
		(this.stateEvent ? this.event : this.model).forEach(inout => {

			if (inout.inout === "in")
				this.addInPort(inout.type, inout.name);
			else
				this.addOutPort(inout.type, inout.name);
		});
		if (this.forceUpdate)
			this.forceUpdate();
	}
}