import React, { Component } from 'react';
import './DeckbuilderPage.css';
import Nav from '../../Nav';
import Deckbuilder from './Deckbuilder';
import Selector from './HeroSelector';
import User from '../../../services/User';

export default class DeckbuilderPage extends Component {

	constructor (props) {

		super(props);

		if (!User.isConnected()) this.props.history.push('/home');

/*
		this.deckEdit = null;
		if (this.props.deck && localStorage.getItem("decklist") !== null)
	      this.deckEdit = JSON.parse(localStorage.getItem("decklist")).find(el => el.idDeck.toString() === this.props.deck)
*/
	  	var deck = this.props.deck;
	  	if (!deck)
		  	deck = {
		  		hero: null,
		  		cards: {},
		  		name: "Custom Deck"
		  	}

	  	this.state = { deck, new: deck === null || deck === undefined };
		//this.state = { hero: this.deckEdit ? this.deckEdit.hero : null };
	}

  onSave (params) {

  	this.props.api.saveDeck(params, () => {

  		this.props.updateDecks();
      this.props.history.push('/decks');
    })
  }

  onDelete (id) {

  	this.props.api.deleteDeck(id, () => {

  		this.props.updateDecks();
      this.props.history.push('/decks');
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
		      			<Deckbuilder new={this.state.new} onSave={this.onSave.bind(this)} onDelete={this.onDelete.bind(this)} deck={this.state.deck} cards={this.props.cards}/>
		      			: <span/>
	      			)
	      			:
	      			<Selector onSelect={hero => this.setState({deck: Object.assign(this.state.deck, { hero })})} cards={this.props.cards}/>
	      		}
	      	</main>
	    </div>
		)
	}
}