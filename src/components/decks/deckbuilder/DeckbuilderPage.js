import React, { Component } from 'react';
import './DeckbuilderPage.css';
import Nav from '../../Nav';
import Deckbuilder from './Deckbuilder';
import Selector from './HeroSelector';
import User from '../../../services/User';

export default class DeckbuilderPage extends Component {

  	formats = {
  		standard: { name: "Standard", cardlist: this.props.cards },
  		display: { name: "Display", cardlist: this.props.cards },
  		custom: { name: "Custom", cardlist: this.props.cards.concat(this.props.customs) }
  	}

	constructor (props) {

		super(props);

		if (!User.isConnected()) this.props.history.push('/home');

	  	var deck = this.props.deck;
	  	var type, format;
	  	switch (this.props.type) {
	  	case "standard": type = "Standard"; format = this.props.type; break;
	  	case "display": type = "Display"; format = this.props.type; break;
	  	case "miracle": type = "Miracle"; format = "standard"; break;
	  	case "custom": type = "Custom"; format = this.props.type; break;
	  	default: type = "New"; format = "display"; break;
	  	}

	  	if (!deck)
		  	deck = {
		  		hero: null,
		  		cards: {},
		  		name: type + " Deck",
		  		format: format
		  	}

	  	this.state = { deck, new: deck.hero === null || deck.hero === undefined };
	  	if (this.props.deck)
	  		this.state.deck.format = this.findFormat();
	  	this.state.cardlist = this.loadCardlist();
	}

  get miracle () {

    return this.props.type === "miracle";
  }

  get custom () {

    return this.props.type === "custom";
  }

  findFormat () {

  	var formats = [];
  	Object.keys(this.formats).forEach(k => formats.push(k));

  	var c = Object.keys(this.state.deck.cards);
  	c.push(this.state.deck.hero);
  	c.forEach (card => {
  		formats.slice().forEach(f => {
  			if (!this.formats[f].cardlist.find(l => l.idCardmodel.toString() === card.toString()))
  				formats.splice(formats.indexOf(f), 1);
  		})
  	})

  	return formats[0];
  }

  updateFormat (format) {

  	var f = this.formats[format];
  	var d = this.state.deck;
  	if (!f)
  		return;
  	if (!f.cardlist.find(l => l.idCardmodel.toString() === d.hero.toString()))
  		return;

  	var cl = this.loadCardlist(format);
  	Object.keys(d.cards).forEach (card => {
		if (!f.cardlist.find(l => l.idCardmodel.toString() === card.toString()))
			delete d.cards[card];
  	});
  	d.format = format;

  	this.setState({cardlist: cl, deck: d});
  }

  updateDeck (deck) {

  	deck = deck || this.state.deck;
  	this.setState({cardlist: this.loadCardlist(deck.format), deck});
  }

  loadCardlist(format) {

  	format = format || this.state.deck.format;

  	if (format === "miracle")
  		format = "standard";

  	return this.formats[format].cardlist;
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
		      			<Deckbuilder ref={this.builder} list={this.state.list} new={this.state.new} onSave={this.onSave.bind(this)} onDelete={this.onDelete.bind(this)} updateDeck={this.updateDeck.bind(this)} updateFormat={this.updateFormat.bind(this)} deck={this.state.deck} cards={this.state.cardlist} type={this.props.type}/>
		      			: <span/>
	      			)
	      			:
	      			<Selector onSelect={hero => {
	      				this.setState({deck: Object.assign(this.state.deck, { hero: hero, background: this.state.cardlist.find(c => c.idCardmodel === hero).imgLink })});
	      			}} cards={this.state.cardlist} miracle={this.miracle}/>
	      		}
	      	</main>
	    </div>
		)
	}
}