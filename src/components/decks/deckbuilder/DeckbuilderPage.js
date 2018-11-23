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

		var cardlist = [];

		if (sessionStorage.getItem("cardlist") !== null)
		  cardlist = JSON.parse(sessionStorage.getItem("cardlist"));
		else
		  this.props.api.getCards(cards => {
		    var c = cards.map(card => this.readCard(card));
		    sessionStorage.setItem("cardlist", JSON.stringify(c));
		    this.setState({cards: c});
		  });

		this.deckEdit = null;
		if (this.props.deck && sessionStorage.getItem("decklist") !== null)
	      this.deckEdit = JSON.parse(sessionStorage.getItem("decklist")).find(el => el.idDeck.toString() === this.props.deck)

		this.state = { cards: cardlist, hero: this.deckEdit ? this.deckEdit.hero : null };
	}

  readCard (card) {

    return Object.assign(card, JSON.parse(window.atob(card.supercode)));
  }

  onSave (params) {

  	this.props.api.saveDeck(params, () => {

      sessionStorage.removeItem("decklist");
      this.props.history.push('/decks');
    })
  }

  onDelete (id) {

  	this.props.api.deleteDeck(id, () => {

      sessionStorage.removeItem("decklist");
      this.props.history.push('/decks');
    })
  }

	render () {

		return (
		<div>
	        <Nav api={this.props.api} history={this.props.history}/>
	      	<main>
	      		{
	      			this.state.hero ?
	      			(this.state.cards && this.state.cards.length > 0 ?
		      			<Deckbuilder onSave={this.onSave.bind(this)} onDelete={this.onDelete.bind(this)} deck={this.deckEdit} hero={this.state.hero} cards={this.state.cards}/>
		      			: <span/>
	      			)
	      			:
	      			<Selector onSelect={hero => this.setState({hero: hero})} cards={this.state.cards}/>
	      		}
	      	</main>
	    </div>
		)
	}
}