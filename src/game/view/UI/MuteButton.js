import React, { Component } from 'react';
import "./MuteButton.css";
import Slider from '../../../components/utility/Slider';

export default class MuteButton extends Component {

	constructor (props) {

		super(props);
		if (this.props.defaultMute)
			this.muted = true;
	}

	switch () {

		this.muted = !this.muted;
		var el = document.getElementById("mute-button");
		if (this.muted)
			el.classList.add("muted");
		else
			el.classList.remove("muted");
		this.props.switch();
	}

  render () {

    return (
    	<div id="sensuba-sound" className="sensuba-sound">
    		<div id="mute-button" onClick={() => this.switch()} className={"mute-button" + (this.props.defaultMute && this.muted ? " muted" : "")}/>
    		<Slider onChange={value => this.props.changeVolume(value)}/>
    	</div>
    )
  }
}