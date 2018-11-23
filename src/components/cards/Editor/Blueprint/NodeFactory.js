import NodeModel from "./NodeModel";
import * as React from "react";
import NodeWidget from "./NodeWidget";
import { AbstractNodeFactory } from "storm-react-diagrams";

export default class DefaultNodeFactory extends AbstractNodeFactory<NodeModel> {
	constructor() {
		super("default");
	}

	generateReactWidget(diagramEngine, node) {
		return React.createElement(NodeWidget, {
			node: node,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance(initialConfig) {
		return new NodeModel();
	}
}