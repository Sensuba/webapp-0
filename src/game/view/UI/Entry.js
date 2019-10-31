import React, { Component } from 'react';

export default class Entry extends Component {

  render () {

    return (
    	<div className={"history-entry history-" + this.props.value.type}>
    		<img crossOrigin="Anonymous" className="history-entry-bg" src={this.props.value.src.imgLink} alt="History card preview"/>
		</div>
    )
  }
}