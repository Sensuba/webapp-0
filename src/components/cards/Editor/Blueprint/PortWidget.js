import * as React from "react";
import { NodeModel } from "storm-react-diagrams";
import { BaseWidget, BaseWidgetProps } from "storm-react-diagrams";

export default class PortWidget extends BaseWidget<PortProps, PortState> {
	constructor(props) {
		super("srd-port", props);
		this.state = {
			selected: false
		};
	}

	getClassName() {
		return "port " + super.getClassName() + (this.state.selected ? this.bem("--selected") : "");
	}

	render() {
		return (
			<div
				{...this.getProps()}
				style={this.props.style}
				onMouseEnter={() => {
					this.setState({ selected: true });
				}}
				onMouseLeave={() => {
					this.setState({ selected: false });
				}}
				data-name={this.props.name}
				data-nodeid={this.props.node.getID()}
			/>
		);
	}
}