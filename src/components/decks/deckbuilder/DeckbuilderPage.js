import React, { Component } from 'react';
import './DeckbuilderPage.css';
import Nav from '../../Nav';
import Deckbuilder from './Deckbuilder';
import Selector from './HeroSelector';
import User from '../../../services/User';
import { deckContent } from '../../../services/DeckData';

export default class DeckbuilderPage extends Component {

		core = this.props.cards.filter(card => card.core)

  	formats = {
  		standard: { name: "Standard", cardlist: /*this.core.concat(this.props.collection.map(el => Object.assign({count: el.number}, this.props.cards.find(card => card.idCardmodel === el.idCardmodel))).filter(el => !this.core.find(cc => cc.idCardmodel === el.idCardmodel)))*/this.props.cards },
  		//highlander: { name: "Highlander", cardlist: this.props.cards.filter(card => card.idCardmodel !== 787 && card.idCardmodel !== 1346) },
  		display: { name: "Display", cardlist: this.props.cards },
  		custom: { name: "Custom", cardlist: /*this.core.concat(this.props.collection.map(el => Object.assign({id: el.idCardmodel, count: el.number}, this.props.cards.find(card => card.idCardmodel === el.idCardmodel)))).filter(el => !this.core.find(cc => cc.idCardmodel === el.idCardmodel)).concat(this.props.customs)*/this.props.cards.concat(this.props.customs) }
  	}

	constructor (props) {

		super(props);

		if (!User.isConnected()) this.props.history.push('/home');

    if (User.getData().authorization >= 4)
      this.formats.custom.cardlist = this.props.cards.concat(this.props.customs);

      this.deckId = this.props.deck && this.props.deck.idDeck;
	  	var deck = this.props.deck && Object.assign(deckContent(this.props.deck), {idDeck: this.deckId});
	  	var type, format;
	  	switch (this.props.type) {
	  	case "standard": type = "Deck Standard"; format = this.props.type; break;
	  	//case "highlander": type = "Deck Highlander"; format = this.props.type; break;
	  	//case "display": type = "Deck Vitrine"; format = this.props.type; break;
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

	  	this.state = { deck, new: this.deckId === undefined || this.deckId === null };
	  	if (this.props.deck)
	  		this.state.deck.format = this.findFormat();
	  	this.state.cardlist = this.loadCardlist();
	}

  componentDidMount() {
    if (this.props.consoleTools) this.props.consoleTools.attachEditor(this);
  }

  componentWillUnmount() {
    this.unmounted = true;
    if (this.props.consoleTools) this.props.consoleTools.detachEditor(this);
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
    if (c.length > 30)
      formats = formats.filter(f => f !== "standard");

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

  updateDeck (deck, update=false, done) {

  	deck = deck || this.state.deck;
    deck = deckContent(deck);
    if (!this.state.new) deck.idDeck = this.deckId;
  	this.setState({cardlist: this.loadCardlist(deck.format), deck}, update ? () => { this.updateFormat(this.findFormat()); if (done) done(); } : done);
  }

  loadCardlist(format) {

  	format = format || this.state.deck.format || this.findFormat();

  	if (format === "draft")
  		format = "standard";

  	return this.formats[format].cardlist;
  }

  onSave (params, playable, done) {
    if (this.saving) return;
    this.saving = true;
    this.setState({saving: true, error: null});
    params = {supercode: params.supercode};
    if (!this.state.new) params.id = this.deckId;
    this.props.api.saveDeck(params, id => {
      // Keep the assigned identity if refreshing fails and the user retries.
      this.deckId = id;
      this.setState({new: false});
      if (playable) User.updateDeck(Object.assign({}, playable, {id}));
      this.refreshDecks(done);
    }, error => {
      this.mutationFailed(error, 'Le deck n’a pas été enregistré. Réessayez.');
      if (done) done({ok: false, uncertain: !!(error && error.uncertain), error: error && error.uncertain
        ? 'Réponse incertaine. Rechargez pour vérifier le deck avant de réessayer.' : 'Le deck n’a pas été enregistré.'});
    });
  }

  failed (error) {
    this.saving = false;
    this.setState({saving: false, error});
  }

  mutationFailed (error, message) {
    if (error && error.uncertain) {
      this.setState({error: 'La réponse du serveur n’est pas arrivée. Rechargez la page pour vérifier le deck avant de réessayer.'});
    } else this.failed(message);
  }

  refreshDecks (done) {
    this.props.updateDecks(() => {
      this.props.history.push('/decks');
      if (done) done({ok: true, saved: true, id: Number(this.deckId)});
    }, () => {
      this.failed('Modification enregistrée, mais la liste n’a pas pu être actualisée. Rechargez la page.');
      if (done) done({ok: true, saved: true, id: Number(this.deckId), warning: 'La liste n’a pas pu être actualisée. Rechargez la page.'});
    });
  }

  onDelete () {
    if (this.saving || this.state.new) return;
    this.saving = true;
    this.setState({saving: true, error: null});
    this.props.api.deleteDeck(this.deckId, () => {
      const selected = User.getDeck();
      if (selected && String(JSON.parse(selected).id) === String(this.deckId)) User.updateDeck(null);
      this.refreshDecks();
    }, error => this.mutationFailed(error, 'Le deck n’a pas été supprimé. Réessayez.'));
  }

  isGhost (card, i) {

  	return false;
    /*if (!card || !card.idCardmodel)
      return false;

    var dis = this.formats.display.cardlist.find(l => l.idCardmodel && card.idCardmodel && l.idCardmodel.toString() === card.idCardmodel.toString());
    var std = this.formats.standard.cardlist.find(l => l.idCardmodel && card.idCardmodel && l.idCardmodel.toString() === card.idCardmodel.toString());

    return dis && (!std || i > std.count);*/
  }

	render () {

		return (
		<div>
	        <Nav api={this.props.api} history={this.props.history}/>
	      	<main>
            {this.state.error && <p role="alert">{this.state.error}</p>}
	      		{
	      			this.state.deck.hero ?
	      			(this.props.cards && this.props.cards.length > 0 ?
		      			<Deckbuilder ref={builder => { this.builder = builder; }} isGhost={(c, i) => this.isGhost(c, i)} list={this.state.list} new={this.state.new} saving={this.state.saving} onSave={this.onSave.bind(this)} onDelete={this.onDelete.bind(this)} updateDeck={this.updateDeck.bind(this)} updateFormat={this.updateFormat.bind(this)} deck={this.state.deck} cards={this.state.cardlist} type={this.props.type}/>
		      			: <span/>
	      			)
	      			:
	      			<Selector onSelect={(hero, body) => {
	      				this.setState({deck: Object.assign(this.state.deck, { hero: hero, cards: body ? Object.fromEntries(body.map(n => [n, 1])) : {}, background: this.state.cardlist.find(c => c.idCardmodel === hero).imgLink })});
	      			}} cards={this.state.cardlist} draft={this.draft}/>
	      		}
	      	</main>
	    </div>
		)
	}
}
