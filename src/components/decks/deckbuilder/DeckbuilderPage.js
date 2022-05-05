import React, { Component } from 'react';
import './DeckbuilderPage.css';
import Nav from '../../Nav';
import Deckbuilder from './Deckbuilder';
import Selector from './HeroSelector';
import User from '../../../services/User';

export default class DeckbuilderPage extends Component {

		core = this.props.cards.filter(card => card.core)

  	formats = {
  		standard: { name: "Standard", cardlist: this.core.concat(this.props.collection.map(el => Object.assign({count: el.number}, this.props.cards.find(card => card.idCardmodel === el.idCardmodel))).filter(el => !this.core.find(cc => cc.idCardmodel === el.idCardmodel))) },
  		display: { name: "Display", cardlist: this.props.cards },
  		custom: { name: "Custom", cardlist: this.core.concat(this.props.collection.map(el => Object.assign({id: el.idCardmodel, count: el.number}, this.props.cards.find(card => card.idCardmodel === el.idCardmodel)))).filter(el => !this.core.find(cc => cc.idCardmodel === el.idCardmodel)).concat(this.props.customs) }
  	}

	constructor (props) {

		super(props);

		if (!User.isConnected()) this.props.history.push('/home');

    if (User.getData().authorization >= 4)
      this.formats.custom.cardlist = this.props.cards.concat(this.props.customs);

	  	var deck = this.props.deck;
	  	var type, format;
	  	switch (this.props.type) {
	  	case "standard": type = "Deck Standard"; format = this.props.type; break;
	  	case "display": type = "Deck Vitrine"; format = this.props.type; break;
	  	case "draft": type = "Deck Draft"; format = "standard"; break;
	  	case "custom": type = "Deck Personnalisé"; format = this.props.type; break;
	  	default: type = "Nouveau deck"; format = "display"; break;
	  	}

	  	if (!deck)
		  	deck = {
		  		hero: null,
		  		cards: {},
		  		name: type,
		  		format: format
		  	}

	  	this.state = { deck, new: deck.hero === null || deck.hero === undefined };
	  	if (this.props.deck)
	  		this.state.deck.format = this.findFormat();
	  	this.state.cardlist = this.loadCardlist();
	}

  get draft () {

    return this.props.type === "draft";
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
        var cc = this.formats[f].cardlist.find(l => l.idCardmodel && l.idCardmodel.toString() === card.toString());
  			if (!cc || (cc.count === 1 && this.state.deck.cards[card] > 1))
  				formats.splice(formats.indexOf(f), 1);
  		})
  	})

  	return formats[0] || "display";
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
      var cc = f.cardlist.find(l => l.idCardmodel.toString() === card.toString());
  		if (!cc)
  			delete d.cards[card];
      else if (cc.count === 1)
        d.cards[card] = 1;
  	});
  	d.format = format;

  	this.setState({cardlist: cl, deck: d});
  }

  updateDeck (deck, update=false) {

  	deck = deck || this.state.deck;
  	this.setState({cardlist: this.loadCardlist(deck.format), deck}, update ? () => this.updateFormat(this.findFormat()) : undefined);
  }

  loadCardlist(format) {

  	format = format || this.state.deck.format || this.findFormat();

  	if (format === "draft")
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

  isGhost (card, i) {

    if (!card || !card.idCardmodel)
      return false;

    var dis = this.formats.display.cardlist.find(l => l.idCardmodel && card.idCardmodel && l.idCardmodel.toString() === card.idCardmodel.toString());
    var std = this.formats.standard.cardlist.find(l => l.idCardmodel && card.idCardmodel && l.idCardmodel.toString() === card.idCardmodel.toString());

    return dis && (!std || i > std.count);
  }

	render () {

		return (
		<div>
	        <Nav api={this.props.api} history={this.props.history}/>
	      	<main>
	      		{
	      			this.state.deck.hero ?
	      			(this.props.cards && this.props.cards.length > 0 ?
		      			<Deckbuilder ref={this.builder} isGhost={(c, i) => this.isGhost(c, i)} list={this.state.list} new={this.state.new} onSave={this.onSave.bind(this)} onDelete={this.onDelete.bind(this)} updateDeck={this.updateDeck.bind(this)} updateFormat={this.updateFormat.bind(this)} deck={this.state.deck} cards={this.state.cardlist} type={this.props.type}/>
		      			: <span/>
	      			)
	      			:
	      			<Selector onSelect={hero => {
	      				this.setState({deck: Object.assign(this.state.deck, { hero: hero, background: this.state.cardlist.find(c => c.idCardmodel === hero).imgLink })});
	      			}} cards={this.state.cardlist} draft={this.draft}/>
	      		}
	      	</main>
	    </div>
		)
	}
}