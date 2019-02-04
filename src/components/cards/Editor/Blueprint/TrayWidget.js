import React, { Component } from 'react';

export default class TrayWidget extends Component {

	render() {
		return (
			<div
				onMouseMove={this.props.onMouseMove}
				onMouseLeave={this.props.onMouseLeave}
				style={{ borderColor: this.props.color }}
				draggable={true}
				onDragStart={event => {
					event.dataTransfer.setData("storm-diagram-node", JSON.stringify({ type: this.props.type, name: this.props.name, color: this.props.color, model: this.props.model, event: this.props.event }));
				}}
				className={"tray-item blueprint-tool" + (this.props.color === "#202020" ? " blueprint-tool-operator" : "")}
			>
				<div className="blueprint-tool-icon" style={{backgroundColor: this.props.color}}/>
				<span className="blueprint-tool-name">{this.props.name}</span>
			</div>
		);
	}
}