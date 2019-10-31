import React, { Component } from 'react';
import Entry from "./Entry.js";
import "./History.css";

export default class History extends Component {

  render () {

    return (
    	<div className="history">
      {
        this.props.entries.map((f, i) => <Entry key={i} value={f} select={this.props.select}/>)
      }
		</div>
    )
  }
}