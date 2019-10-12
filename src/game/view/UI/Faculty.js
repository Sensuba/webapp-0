import React, { Component } from 'react';

export default class Faculty extends Component {

  render () {

    return (
    	<div className={"faculty" + (this.props.src.usable ? "" : " locked-faculty")} onClick={e => this.props.select({ id: { type: "faculty", no: this.props.src.no } })}>
    		<div className="faculty-desc">{this.props.src.desc}</div>
    		<div className="faculty-cost">{this.props.src.cost}</div>
		</div>
    )
  }
}