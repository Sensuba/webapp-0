import React, { Component } from 'react';
import Deck from '../Deck.js';
import { Input, Label } from 'reactstrap';
import Card from '../../cards/Card';
import sorter from '../../../utility/CollectionSorter';
import { Progress } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import User from '../../../services/User';

export default class Deckbuilder extends Component {

	constructor (props) {

		super(props);

    var choices;
    if (this.miracle) {
      this.miracleColorList = this.getColorList();
      choices = this.generateMiracleChoice(this.miracleColorList.cards);
    }

		this.state = { filter: "", preview: null, miracle: this.miracle, choices };
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
	}

  get miracle () {

    return this.props.type === "miracle";
  }

  generateMiracleChoice (cards) {

    var pickRandomCard = list => list[Math.floor(Math.random()*list.length)];

      var miraclelist = [];
      for (let i = 0; i < 3;) {
        let miraclenew = pickRandomCard(cards);

        if (miraclelist.some(card => card === miraclenew))
          continue;
        if (miraclenew.idColor === 0 && Math.random() < 0.5)
          continue;
        if (this.props.deck.cards[miraclenew.idCardmodel] && this.props.deck.cards[miraclenew.idCardmodel] >= Math.min(2, miraclenew.count || 2))
          continue;
        miraclelist.push(miraclenew);
        i++;
      }
      return miraclelist;
  }

	get count () {

		return Object.values(this.props.deck.cards).reduce((acc, val) => acc + val, 0)
	}

  addCard (id) {

  	if (this.count >= 30)
  		return;
  	var c = this.props.deck.cards;
  	c[id] = Math.min(2, (c[id] || 0) + 1);
    var cc = this.props.cards.find(card => card.idCardmodel === id);
    if (cc && cc.count === 1)
      this.hideTooltip();
  	this.props.updateDeck();
  }

  addMiracleCard (id) {

    var end = this.count >= 29;
    var c = this.props.deck.cards;
    c[id] = (c[id] || 0) + 1;
    this.props.updateDeck();
    this.setState({choices: this.generateMiracleChoice(this.miracleColorList.cards), miracle: !end});
  }

  removeCard(id) {

  	var c = this.props.deck.cards;
  	c[id] = Math.max(0, (c[id] || 0) - 1);
  	if (c[id] === 0)
  		delete c[id];
  	this.props.updateDeck();
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

    /*var currentDeck = User.getDeck();
    if (currentDeck) {
      currentDeck = JSON.parse(currentDeck);

      if (currentDeck.id === this.state.deck.idDeck) {*/

        var deck = this.props.deck;
        var res = { id: deck.idDeck, hero: deck.hero, body: [], format: deck.format };
        var cc = this.props.cards.find(el => el.idCardmodel === parseInt(deck.hero, 10));
        if (cc && !cc.idEdition)
          res.hero = cc;
        Object.keys(deck.cards).forEach(c => {
          for (let i = 0; i < deck.cards[c]; i++) {
            var cc = this.props.cards.find(el => el.idCardmodel === parseInt(c, 10));
            if (cc) {
              if (cc.idEdition)
                res.body.push(parseInt(c, 10));
              else
                res.body.push(cc);
            }
          }
        })
        if (deck.format !== "display" && Object.values(deck.cards).reduce((a, b) => a + b, 0) === 30)
          User.updateDeck(res);
    //  }
    //}
    
    var copycode = Object.assign({}, this.props.deck);
    delete copycode.idDeck;
    var supercode = window.btoa(JSON.stringify(copycode).replace(/[^\x00-\x7F]/g, ""));

    var params = { supercode };

    if (!this.state.new)
      params.id = this.props.deck.idDeck;

    this.props.onSave(params);

    this.setState({saved: true});
  }

  deleteDeck() {

    if (this.state.saved)
      return;

    var currentDeck = User.getDeck();
    if (currentDeck) {
      currentDeck = JSON.parse(currentDeck);
      if (currentDeck.id === this.props.deck.idDeck)
        User.updateDeck(null);
    }

    this.props.onDelete(this.props.deck.idDeck);

    this.setState({saved: true});
  }

  getColorList () {

    var clist = {};
    clist.hero = this.props.cards.find(c => c.idCardmodel === (this.props.deck.hero.idCardmodel || this.props.deck.hero));
    clist.cards = this.props.cards.filter(c => c.cardType !== "hero" && (c.idColor === 0 || c.idColor === clist.hero.idColor || c.idColor === clist.hero.idColor2) && (c.count !== 1 || !this.props.deck.cards[c.idCardmodel]));
    return clist;
  }

	render () {

    var clist = this.getColorList();

		var hero = clist.hero;
		var cards = clist.cards;

		var listCards = Object.keys(this.props.deck.cards).map(g => this.props.cards.find(c => c.idCardmodel.toString() === g)).filter(c => c !== undefined);
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

      var copycode = Object.assign({}, this.props.deck);
      delete copycode.idDeck;
      delete copycode.author;
      delete copycode.list;
      delete copycode.supercode;
      var superCode = window.btoa(JSON.stringify(copycode).replace(/[^\x00-\x7F]/g, ""));

    	var nbFigures = listCards.filter(c => c.cardType === "figure").map(c => this.props.deck.cards[c.idCardmodel]).reduce((acc, val) => acc + val, 0);
    	var nbSpells = listCards.filter(c => c.cardType === "spell").map(c => this.props.deck.cards[c.idCardmodel]).reduce((acc, val) => acc + val, 0);

    	var chartFilter = (type, mana, plus = false) => listCards.filter(c => c.cardType === type && (plus ? c.mana >= mana : c.mana === mana.toString())).map(c => this.props.deck.cards[c.idCardmodel]).reduce((acc, val) => acc + val, 0);

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
        {
          this.state.miracle ?
          <div>
          <h1 className="big-text">Pick a card</h1>
            <div className="hero-selector">
              <div className="hero-list">
              {
                this.state.choices.map((h, i) => <div key={i} className="select-hero-card main-hero-card" onClick={() => {
                  this.addMiracleCard(h.idCardmodel);
                }}><Card src={h}/></div>)
              }
              </div>
            </div>
          </div>
          :
          <div>
        		<div className="half-section deck-image-preview">
        			<Deck src={{name: this.props.deck.name, background: this.props.deck.background, idColor: hero.idColor, idColor2: hero.idColor2, format: this.props.deck.format }}/>
        			<button className="menu-button" onClick={this.saveDeck.bind(this)}>{ !this.props.new ? "Edit" : "Save" }</button>
              { !this.props.new ? <button className="red menu-button" onClick={this.deleteDeck.bind(this)}>Delete</button> : <span/> }
        		</div>
        		<div className="half-section">
        			<div className="editor-box">
        				<Label for="deck-name-form">Deck name</Label>
        				<Input type="text" id="deck-name-form" value={this.props.deck.name} onChange={e => { var d = Object.assign(this.props.deck, {name: e.target.value}); this.setState({deck: d}); }}/>
        				<Label for="deck-background-form">Image link</Label>
                <Input type="text" id="deck-background-form" value={this.props.deck.background} onChange={e => { var d = Object.assign(this.props.deck, {background: e.target.value}); this.setState({deck: d}); }}/>
                <Label for="deck-format-form">Format</Label>
                <Input type="select" id="deck-format-form" value={this.props.deck.format} onChange={e => this.props.updateFormat(e.target.value)}>
                  <option value="standard">Standard</option>
                  <option value="custom">Custom</option>
                  <option value="display">Display</option>
                </Input>
                <Label for="deck-supercode-form">Supercode</Label>
  	                <Input id="deck-supercode-form" type="textarea" rows="4" value={superCode} onChange={ e => {
  	                    try {
  	                        var d = JSON.parse(window.atob(e.target.value));
  	                        this.props.updateDeck(d);
  	                    } catch (e) { }
  	                } }/>
        			</div>
        		</div>
          </div>
        }
      		<div className="sensuba-deckbuilder">
      			<div className="sensuba-deckbuilder-list">
      				<div className="sensuba-deckbuilder-list-cards">
      					{
      						listCards.map((model, i) => {

      							var arr = [];
      							var j = 0;
      							while (j++ < this.props.deck.cards[model.idCardmodel])
      								arr.push(j);

      							return <div key={i} className="sensuba-deckbuilder-list-group" onClick={this.state.miracle ? () => {} : () => this.removeCard(model.idCardmodel)}>{arr.map(i => <Card key={i} src={model}/>)}</div>;
      						})
      					}
      				</div>
      				<div className="sensuba-deckbuilder-list-count">{this.count}</div>
      			</div>
            {
            this.state.miracle ?
            <span/>
            :
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
            }
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