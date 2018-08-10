import { LinkModel as SuperLinkModel, LinkModelListener } from "storm-react-diagrams";
import { BaseEvent } from "storm-react-diagrams";
import * as _ from "lodash";
import { PointModel } from "storm-react-diagrams";
import { DiagramEngine } from "storm-react-diagrams";
import { DefaultLabelModel } from "storm-react-diagrams";
import { LabelModel } from "storm-react-diagrams";

export default class LinkModel extends SuperLinkModel {

	constructor(type = "default") {
		super(type);
		this.color = "rgba(255,255,255,0.5)";
		this.width = 1;
		this.curvyness = 50;
	}

	serialize() {console.log("serialize")
		return _.merge(super.serialize(), {
			width: this.width,
			color: this.color,
			curvyness: this.curvyness
		});
	}

	deSerialize(ob, engine) {
		super.deSerialize(ob, engine);
		this.color = ob.color;
		this.width = ob.width;
		this.curvyness = ob.curvyness;
	}

	addLabel(label) {
		if (label instanceof LabelModel) {
			return super.addLabel(label);
		}
		let labelOb = new DefaultLabelModel();
		labelOb.setLabel(label);
		return super.addLabel(labelOb);
	}

	setWidth(width) {
		this.width = width;
		this.iterateListeners((listener, event) => {
			if (listener.widthChanged) {
				listener.widthChanged({ ...event, width: width });
			}
		});
	}

	setColor(color) {
		this.color = color;
		this.iterateListeners((listener, event) => {
			if (listener.colorChanged) {
				listener.colorChanged({ ...event, color: color });
			}
		});
	}

	setSourcePort(port) {

		super.setSourcePort(port);
		this.color = port.color;
		if (port.type === "exe" || port.type === "effect")
			this.width = 2;
	}
}