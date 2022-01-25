import React, { Component } from 'react';
import "./PlayButton.css";

export default class PlayButton extends Component {

	switch () {

		this.paused = !this.paused;
		var el = document.getElementById("play-button");
		if (this.paused)
			el.classList.add("paused");
		else
			el.classList.remove("paused");
		this.props.switch();
	}

  render () {

    return (
    	<div id="sensuba-play" className="sensuba-play">
    		<div id="play-button" onClick={() => this.switch()} className={"play-button" + (this.paused ? " paused" : "")}/>
    	</div>
    )
  }
}