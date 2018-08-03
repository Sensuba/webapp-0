import React, { Component } from 'react';
import Deck from '../Deck.js';
import { Input, Label } from 'reactstrap';
import Nav from '../../Nav';
import Card from '../../cards/Card';

export default class Deckbuilder extends Component {

	constructor (props) {

		super(props);

		//if (!User.isConnected()) this.props.history.push('/home');

		this.state = { deck: { hero: null, cards: {} }, filter: "", preview: null };
	}

  addCard (id) {

  	var c = this.state.deck.cards;
  	c[id] = Math.min(2, (c[id] || 0) + 1);
  	this.setState({deck: { hero: null, cards: c }});
  }

  removeCard(id) {

  	var c = this.state.deck.cards;
  	c[id] = Math.max(0, (c[id] || 0) - 1);
  	if (c[id] === 0)
  		delete c[id];
  	this.setState({deck: { hero: null, cards: c }});
  }

  showTooltip(e, card, left) {

  	var tooltip = document.getElementById("img-preview-tooltip");
  	tooltip.setAttribute("style", `display: block; top: ${e.pageY}px; left: ${e.pageX}px; margin-left: ${left ? -18 : 0}em`);
  	this.setState({preview: card});
  }

  hideTooltip() {

  	var tooltip = document.getElementById("img-preview-tooltip");
  	tooltip.setAttribute("style", `display: none`);
  	console.log("hide")
  }

	render () {

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

		return (
		<div>
			<div id="img-preview-tooltip" data-toggle="tooltip" data-placement="right" src="" alt="preview" data-animation="false" data-trigger="manual">
				{ this.state.preview ? <Card src={this.state.preview}/> : <span/> }
			</div>
      		<div className="half-section">
      			<Deck src={{nameDeck: "Shiroe Exodia", imgLink: "https://image.ibb.co/hS7WzT/shiroe.jpg"}}/>
      		</div>
      		<div className="half-section">
      		</div>
      		<div className="sensuba-deckbuilder">
      			<div className="sensuba-deckbuilder-list">
      				<div className="sensuba-deckbuilder-list-cards">
      					{
      						Object.keys(this.state.deck.cards).map((g, i) => {

      							var model = this.props.cards.find(c => c.idCardmodel == g);
      							var arr = [];
      							var j = 0;
      							while (j++ < this.state.deck.cards[g])
      								arr.push(j);

      							return <div key={i} className="sensuba-deckbuilder-list-group" onClick={() => this.removeCard(model.idCardmodel)}>{arr.map(i => <Card key={i} src={model}/>)}</div>;
      						})
      					}
      				</div>
      			</div>
      			<div className="sensuba-deckbuilder-search">
      				<Input type="text" placeholder="Search" className="sensuba-deckbuilder-search-input" value={this.state.filter} onChange={e => this.setState({filter: e.target.value})}/>
      				<div className="sensuba-deckbuilder-search-list">
      				{
      					this.props.cards.filter(c => c.nameCard.toLowerCase().includes(this.state.filter.toLowerCase())).map((c, i) =>
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