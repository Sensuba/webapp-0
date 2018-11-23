import * as React from "react";
import LinkWidget from "./LinkWidget";
import { AbstractLinkFactory } from "storm-react-diagrams";
import LinkModel from "./LinkModel";

export default class LinkFactory extends AbstractLinkFactory<LinkModel> {
	constructor() {
		super("default");
	}

	generateReactWidget(diagramEngine, link) {
		return React.createElement(LinkWidget, {
			link: link,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance(initialConfig) {
		return new LinkModel();
	}

	generateLinkSegment(model, widget, selected, path) {
		return (
			<path
				className={selected ? widget.bem("--path-selected") : ""}
				strokeWidth={model.width}
				stroke={model.color}
				d={path}
			/>
		);
	}
}