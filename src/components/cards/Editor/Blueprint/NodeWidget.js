import * as React from "react";
import * as _ from "lodash";
import PortLabel from "./PortLabelWidget";
import { BaseWidget } from "storm-react-diagrams";

export default class NodeWidget extends BaseWidget<DefaultNodeProps, DefaultNodeState> {
	constructor(props) {
		super("srd-default-node", props);
		this.state = {};
	}

	generatePort(port) {
		return <PortLabel model={port} key={port.id} />;
	}

	render() {
		return (
			<div {...this.getProps()} style={{ background: this.props.node.color }}>
				<div className={(this.props.node.color === "#202020" ? "node-operator " : "") + (this.props.node.name.length > 2 ? "node-minmax " : "") + this.bem("__title")}>
					<div style={{background: `linear-gradient(to right, ${this.props.node.color}, #404040)`}} className={this.bem("__name")}>{this.props.node.name}</div>
					{ this.props.node.event ? <label className={this.bem("__event")}><input id={"event_" + this.props.node.id} type="button" onClick={() => { this.props.node.switch(); /*document.getElementById("event_" + this.props.node.id).parentElement.classList.toggle("checked");*/ }}/></label> : <span/> }
				</div>
				<div className={this.bem("__ports")}>
					<div className={this.bem("__in")}>
						{_.map(this.props.node.getInPorts(), this.generatePort.bind(this))}
					</div>
					<div className={this.bem("__out")}>
						{_.map(this.props.node.getOutPorts(), this.generatePort.bind(this))}
					</div>
				</div>
			</div>
		);
	}
}