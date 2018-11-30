import React, { Component } from 'react';
import Deck from '../Deck.js';
import { Input, Label } from 'reactstrap';
import Card from '../../cards/Card';
import sorter from '../../../utility/CollectionSorter';
import { Progress } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default class Deckbuilder extends Component {

	constructor (props) {

		super(props);

		var deck = { hero: this.props.deck.hero, cards: {}, name: "Custom Deck", background: this.props.cards.find(c => c.idCardmodel === this.props.deck.hero).imgLink };

		deck = Object.assign(deck, this.props.deck);

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

    if (!this.state.new)
      params.id = this.props.deck.idDeck;

    this.props.onSave(params);

    this.setState({saved: true});
  }

  deleteDeck() {

    if (this.state.saved)
      return;

    this.props.onDelete(this.state.deck.idDeck);

    this.setState({saved: true});
  }

	render () {

		var hero = this.props.cards.find(c => c.idCardmodel === this.state.deck.hero);
		var cards = this.props.cards.filter(c => c.idEdition === 1 && c.cardType !== "hero" && (c.idColor === 0 || c.idColor === hero.idColor || c.idColor === hero.idColor2))
		sorter.sort(cards, "name");

		var listCards = Object.keys(this.state.deck.cards).map(g => this.props.cards.find(c => c.idCardmodel.toString() === g));
		sorter.sort(listCards, "type");

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

    	var nbFigures = listCards.filter(c => c.cardType === "figure").map(c => this.state.deck.cards[c.idCardmodel]).reduce((acc, val) => acc + val, 0);
    	var nbSpells = listCards.filter(c => c.cardType === "spell").map(c => this.state.deck.cards[c.idCardmodel]).reduce((acc, val) => acc + val, 0);

    	var chartFilter = (type, mana, plus = false) => listCards.filter(c => c.cardType === type && (plus ? c.mana >= mana : c.mana === mana.toString())).map(c => this.state.deck.cards[c.idCardmodel]).reduce((acc, val) => acc + val, 0);

    	var chart = [
    		{name: "0", figures: chartFilter("figure", 0), spells: chartFilter("spell", 0), artifacts: chartFilter("artifact", 0)},
    		{name: "1", figures: chartFilter("figure", 1), spells: chartFilter("spell", 1), artifacts: chartFilter("artifact", 1)},
    		{name: "2", figures: chartFilter("figure", 2), spells: chartFilter("spell", 2), artifacts: chartFilter("artifact", 2)},
    		{name: "3", figures: chartFilter("figure", 3), spells: chartFilter("spell", 3), artifacts: chartFilter("artifact", 3)},
    		{name: "4", figures: chartFilter("figure", 4), spells: chartFilter("spell", 4), artifacts: chartFilter("artifact", 4)},
    		{name: "5", figures: chartFilter("figure", 5), spells: chartFilter("spell", 5), artifacts: chartFilter("artifact", 5)},
    		{name: "6+", figures: chartFilter("figure", 6, true), spells: chartFilter("spell", 6, true), artifacts: chartFilter("artifact", 6, true)}
    	];

		return (
		<div>
			<div id="img-preview-tooltip" data-toggle="tooltip" data-placement="right" src="" alt="preview" data-animation="false" data-trigger="manual">
				{ this.state.preview ? <Card src={this.state.preview}/> : <span/> }
			</div>
      		<div className="half-section deck-image-preview">
      			<Deck src={{name: this.state.deck.name, background: this.state.deck.background, idColor: hero.idColor, idColor2: hero.idColor2 }}/>
      			<button className="menu-button" onClick={this.saveDeck.bind(this)}>{ !this.props.new ? "Edit" : "Save" }</button>
            { !this.props.new ? <button className="red menu-button" onClick={this.deleteDeck.bind(this)}>Delete</button> : <span/> }
      		</div>
      		<div className="half-section">
      			<div className="editor-box">
      				<Label for="deck-name-form">Deck name</Label>
      				<Input type="text" id="deck-name-form" value={this.state.deck.name} onChange={e => { var d = Object.assign(this.state.deck, {name: e.target.value}); this.setState({deck: d}); }}/>
      				<Label for="deck-background-form">Image link</Label>
      				<Input type="text" id="deck-background-form" value={this.state.deck.background} onChange={e => { var d = Object.assign(this.state.deck, {background: e.target.value}); this.setState({deck: d}); }}/>
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
      						listCards.map((model, i) => {

      							var arr = [];
      							var j = 0;
      							while (j++ < this.state.deck.cards[model.idCardmodel])
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
      		<div>
      			<div className="half-section">
      			<div className="half-section deckbuilder-hero-preview">
      				<Card switch="manual" src={hero}/>
      			</div>
      			<div className="half-section deckbuilder-type-repartition">
      				<Progress className="figures empty" type="circle" percent={nbFigures * 100 / this.count} format={percent => `${nbFigures} figure${nbFigures > 1 ? "s" : ""}`}/>
      				<Progress className="spells empty" type="circle" percent={nbSpells * 100 / this.count} format={percent => `${nbSpells} spell${nbSpells > 1 ? "s" : ""}`}/>
      			</div>
      			</div>
      			<div className="half-section deckbuilder-cost-repartition">
      				<BarChart width={500} height={250} data={chart}>
			       <CartesianGrid strokeDasharray="3 3"/>
			       <XAxis dataKey="name"/>
			       <YAxis/>
			       <Tooltip/>
			       <Legend />
			       <Bar dataKey="figures" stackId="a" fill="#FF6000" />
			       <Bar dataKey="spells" stackId="a" fill="rgb(16, 142, 233)" />
			       <Bar dataKey="artifacts" stackId="a" fill="#20caFF" />
			      </BarChart>
      			</div>
      		</div>
	    </div>
		)
	}
}