import React, { Component } from 'react';
import "./MuteButton.css";
import Slider from '../../../components/utility/Slider';

export default class MuteButton extends Component {

	constructor (props) {

		super(props);
		this.defaultMute = this.props.defaultMute || localStorage.getItem("sound.muted");
		if (this.defaultMute)
			this.muted = true;
	}

	switch () {

		this.muted = !this.muted;
		var el = document.getElementById("mute-button");
		if (this.muted) {
			el.classList.add("muted");
			localStorage.setItem("sound.muted", "true");
		} else {
			el.classList.remove("muted");
			localStorage.removeItem("sound.muted");
		}
		this.props.switch();
	}

  render () {

    return (
    	<div id="sensuba-sound" className="sensuba-sound">
    		<div id="mute-button" onClick={() => this.switch()} className={"mute-button" + (this.defaultMute && this.muted ? " muted" : "")}/>
    		<div className="sound-slider-case"><div id="sfx-slider-icon" className="sound-slider-icon"/><Slider defaultValue={localStorage.getItem('sound.sfx')} onChange={value => { this.props.changeVolume(value, true); localStorage.setItem("sound.sfx", value); }}/></div>
    		<div className="sound-slider-case"><div id="music-slider-icon" className="sound-slider-icon"/><Slider defaultValue={localStorage.getItem('sound.music')} onChange={value => { this.props.changeVolume(value, false); localStorage.setItem("sound.music", value); }}/></div>
    	</div>
    )
  }
}