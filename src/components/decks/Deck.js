import React, { Component } from 'react';
import './Deck.css';

export default class Deck extends Component {

	render() {

		if (!this.props.src)
			return (
				<div className="sensuba-deck-case">
					<div className="sensuba-deck-case-mask"/>
					<img className="sensuba-deck-case-bg" src="/game/back.png" alt="Deck case background"/>
					<div className="sensuba-deck-case-name">Deck par défaut</div>
				</div>
			)

		var colorIdToClassName = colorId => {

	  	switch (colorId) {
	      case 0: return "neutral-mana";
	  		case 1: return "white-mana";
	  		case 2: return "red-mana";
	  		case 3: return "blue-mana";
	  		case 4: return "green-mana";
	  		case 5: return "black-mana";
	  		default: return "";
	  		}
	  	};

		return (
			<div className={ `sensuba-deck-case ${colorIdToClassName(this.props.src.idColor)} ${colorIdToClassName(this.props.src.idColor2)}` }>
				<div className="sensuba-deck-case-mask"/>
				<img className="sensuba-deck-case-bg" src={this.props.src.background} alt="Deck case background"/>
				<div className="sensuba-deck-case-name">{this.props.src.name}</div>
				{ this.props.src.format ? <div className="sensuba-deck-case-format">{this.props.src.format.charAt(0).toUpperCase() + this.props.src.format.slice(1)}</div> : <span/> }
			</div>
		)
	}
}