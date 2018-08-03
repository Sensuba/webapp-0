import React, { Component } from 'react';
import Deck from '../Deck.js';
import { Input, Label } from 'reactstrap';
import Nav from '../../Nav';
import Card from '../../cards/Card';
import sorter from '../../../utility/CollectionSorter';

export default class Deckbuilder extends Component {

	constructor (props) {

		super(props);

		var deck = { hero: this.props.hero.idCardmodel, cards: {}, name: "Deck Custom", background: this.props.hero.imgLink };

		if (this.props.deck)
			deck = this.props.deck;

		this.state = { deck: deck, filter: "", preview: null };
	}

	get count () {

		return Object.values(this.state.deck.cards).reduce((acc, val) => acc + val, 0)
	}

  addCard (id) {

  	if (this.count >= 30)
  		return;
  	var c = this.state.deck.cards;
  	c[id] = Math.min(2, (c[id] || 0) + 1);
  	this.setState({deck: this.state.deck});
  }

  removeCard(id) {

  	var c = this.state.deck.cards;
  	c[id] = Math.max(0, (c[id] || 0) - 1);
  	if (c[id] === 0)
  		delete c[id];
  	this.setState({deck: this.state.deck});
  }

  showTooltip(e, card, left) {

  	var tooltip = document.getElementById("img-preview-tooltip");
  	tooltip.setAttribute("style", `display: block; top: ${e.pageY}px; left: ${e.pageX}px; margin-left: ${left ? -18 : 0}em`);
  	this.setState({preview: card});
  }

  hideTooltip() {

  	var tooltip = document.getElementById("img-preview-tooltip");
  	tooltip.setAttribute("style", `display: none`);
  }

  saveDeck() {

    if (this.state.saved)
      return;

    var supercode = window.btoa(JSON.stringify(this.state.deck));

    var params = { supercode };

    if (this.props.deck)
      params.id = this.props.deck.idDeck;

    this.props.onSave(params);

    this.state.saved = true;

  }

	render () {

		var hero = this.props.hero.idColor ? this.props.hero : this.props.cards.find(c => c.idCardmodel == this.props.hero);
		var cards = this.props.cards.filter(c => c.cardType !== "hero" && (c.idColor === 0 || c.idColor === hero.idColor || c.idColor === hero.idColor2))
		sorter.sort(cards, "name");

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
	  	}

    	var superCode = window.btoa(JSON.stringify(this.state.deck));

		return (
		<div>
			<div id="img-preview-tooltip" data-toggle="tooltip" data-placement="right" src="" alt="preview" data-animation="false" data-trigger="manual">
				{ this.state.preview ? <Card src={this.state.preview}/> : <span/> }
			</div>
      		<div className="half-section deck-image-preview">
      			<Deck src={{name: this.state.deck.name, background: this.state.deck.background, idColor: hero.idColor, idColor2: hero.idColor2 }}/>
      			<button className="menu-button" onClick={this.saveDeck.bind(this)}>{ this.props.deck ? "Edit" : "Save" }</button>
      		</div>
      		<div className="half-section">
      			<div className="editor-box">
      				<Label for="deck-name-form">Deck name</Label>
      				<Input type="text" id="deck-name-form" value={this.state.deck.name} onChange={e => { this.state.deck.name = e.target.value; this.setState({deck: this.state.deck});}}/>
      				<Label for="deck-background-form">Image link</Label>
      				<Input type="text" id="deck-background-form" value={this.state.deck.background} onChange={e => { this.state.deck.background = e.target.value; this.setState({deck: this.state.deck});}}/>
      				<Label for="deck-supercode-form">Supercode</Label>
	                <Input id="deck-supercode-form" type="textarea" rows="6" value={superCode} onChange={ e => {
	                    try {
	                        var d = JSON.parse(window.atob(e.target.value));
	                        this.setState({deck: d});
	                    } catch (e) { }
	                } }/>
      			</div>
      		</div>
      		<div className="sensuba-deckbuilder">
      			<div className="sensuba-deckbuilder-list">
      				<div className="sensuba-deckbuilder-list-cards">
      					{
      						Object.keys(this.state.deck.cards).map((g, i) => {

      							var model = cards.find(c => c.idCardmodel == g);
      							var arr = [];
      							var j = 0;
      							while (j++ < this.state.deck.cards[g])
      								arr.push(j);

      							return <div key={i} className="sensuba-deckbuilder-list-group" onClick={() => this.removeCard(model.idCardmodel)}>{arr.map(i => <Card key={i} src={model}/>)}</div>;
      						})
      					}
      				</div>
      				<div className="sensuba-deckbuilder-list-count">{this.count}</div>
      			</div>
      			<div className="sensuba-deckbuilder-search">
      				<Input type="text" placeholder="Search" className="sensuba-deckbuilder-search-input" value={this.state.filter} onChange={e => this.setState({filter: e.target.value})}/>
      				<div className="sensuba-deckbuilder-search-list">
      				{
      					cards.filter(c => c.nameCard.toLowerCase().includes(this.state.filter.toLowerCase())).map((c, i) =>
      						<div key={i} className={"sensuba-deckbuilder-tag " + colorIdToClassName(c.idColor)} onMouseMove={e => this.showTooltip(e, c, true)} onMouseLeave={e => this.hideTooltip()} onClick={() => this.addCard(c.idCardmodel)}>
      							<div className="sensuba-deckbuilder-tag-name">{c.nameCard}</div>
      							<img className="sensuba-deckbuilder-tag-img" src={c.imgLink} alt={c.nameCard}/>
      						</div>)
      				}
      				</div>
      			</div>
      		</div>
	    </div>
		)
	}
}