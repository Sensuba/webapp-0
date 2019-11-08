import React, { Component } from 'react';
import './DeckbuilderPage.css';
import Nav from '../../Nav';
import Deckbuilder from './Deckbuilder';
import Selector from './HeroSelector';
import User from '../../../services/User';
import sorter from '../../../utility/CollectionSorter';

export default class DeckbuilderPage extends Component {

	constructor (props) {

		super(props);

		if (!User.isConnected()) this.props.history.push('/home');

	  	var deck = this.props.deck;
	  	if (!deck)
		  	deck = {
		  		hero: null,
		  		cards: {},
		  		name: this.props.miracle ? "Miracle Deck" : "Custom Deck",
		  		list: { hero: null, cards: [] }
		  	}

	  	this.state = { deck, new: deck.hero === null || deck.hero === undefined };
	}

  onSave (params) {

  	this.props.api.saveDeck(params, () => {

      	this.props.history.push('/decks');
  		this.props.updateDecks();
    })
  }

  onDelete (id) {

  	this.props.api.deleteDeck(id, () => {

      	this.props.history.push('/decks');
  		this.props.updateDecks();
    })
  }

	render () {

		return (
		<div>
	        <Nav api={this.props.api} history={this.props.history}/>
	      	<main>
	      		{
	      			this.state.deck.hero ?
	      			(this.props.cards && this.props.cards.length > 0 ?
		      			<Deckbuilder ref={this.builder} list={this.state.list} new={this.state.new} onSave={this.onSave.bind(this)} onDelete={this.onDelete.bind(this)} deck={this.state.deck} cards={this.props.cards} miracle={this.props.miracle}/>
		      			: <span/>
	      			)
	      			:
	      			<Selector onSelect={hero => {
	      				var chero = this.props.cards.find(c => c.idCardmodel === hero);
					    var cards = this.props.cards.filter(c => c.idEdition === 1 && c.cardType !== "hero" && (c.idColor === 0 || c.idColor === chero.idColor || c.idColor === chero.idColor2))
					    sorter.sort(cards, "name");
	      				this.setState({deck: Object.assign(this.state.deck, { hero }), list: {hero: chero, cards}});
	      			}} cards={this.props.cards} miracle={this.props.miracle}/>
	      		}
	      	</main>
	    </div>
		)
	}
}