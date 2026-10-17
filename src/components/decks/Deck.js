import React, { Component } from 'react';
import './Deck.css';
import Library from '../../services/Library';

export default class Deck extends Component {

	constructor(props) {
		super(props);
		this.state = {hero: null};
	}

	componentDidMount() { this.loadHero(); }
	componentDidUpdate() { this.loadHero(); }
	componentWillUnmount() { this.unmounted = true; }

	loadHero() {
		const id = Number(this.props.src && this.props.src.hero) || null;
		if (this.props.hero || this.loadedHero === id) return;
		this.loadedHero = id;
		this.setState({hero: null});
		if (id) Library.getCard(id, hero => {
			if (!this.unmounted && this.loadedHero === id) this.setState({hero});
		});
	}

	render() {

		if (!this.props.src)
			return (
				<div className="sensuba-deck-case">
					<div className="sensuba-deck-case-mask"/>
					<img className="sensuba-deck-case-bg" src="/game/back.png" alt="Deck case background"/>
					<div className="sensuba-deck-case-name">{this.props.defaultName}</div>
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

		const hero = this.props.hero || this.state.hero;
		const background = typeof this.props.src.background === 'string' ? this.props.src.background.trim() : '';
		return (
			<div className={ `sensuba-deck-case ${colorIdToClassName(this.props.src.idColor)} ${colorIdToClassName(this.props.src.idColor2)}` }>
				<div className="sensuba-deck-case-mask"/>
				<img className="sensuba-deck-case-bg" src={background || (hero && (hero.imgLink || hero.highRes)) || '/game/back.png'} alt="Deck case background"/>
				<div className="sensuba-deck-case-name">{this.props.src.name}</div>
				{ this.props.src.format ? <div className="sensuba-deck-case-format">{this.props.src.format.charAt(0).toUpperCase() + this.props.src.format.slice(1)}</div> : <span/> }
			</div>
		)
	}
}
