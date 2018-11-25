import React, { Component } from 'react';
import "./Gauge.css";

export default class Gauge extends Component {

  render () {

    return (
    	<div className="gauge">
    		<div className="gauge-text">{this.props.value + "/" + this.props.max}</div>
			<div className={"gauge-progress-bar" + (this.props.inverted ? " inverted-gauge" : "")}>
				<div className="gauge-progress-bar-value" style={{ backgroundColor: this.props.color, width: (this.props.value*100/(this.props.max||1)) + "%" }}></div>
			</div>
		</div>
    )
  }
}