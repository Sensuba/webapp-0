import React, { Component } from 'react';
import './Deck.css';

export default class Deck extends Component {

	render() {

		return (
			<div className="sensuba-deck-case blue-mana green-mana">
				<div className="sensuba-deck-case-mask"/>
				<img className="sensuba-deck-case-bg" src={this.props.src.imgLink} alt="Deck case background"/>
				<div className="sensuba-deck-case-name">{this.props.src.nameDeck}</div>
			</div>
		)
	}
}