import React, { Component } from 'react';
import './DecksPage.css';
import Deck from './Deck.js';
import { Input, Label } from 'reactstrap';
import Nav from '../Nav';
import User from '../../services/User';
import sorter from '../../utility/CollectionSorter';
import Lightbox from '../utility/Lightbox';

export default class DecksPage extends Component {

	constructor (props) {

		super(props);

		if (!User.isConnected()) this.props.history.push('/home');

		var decklist = [];
		if (sessionStorage.getItem("decklist") !== null)
	      decklist = JSON.parse(sessionStorage.getItem("decklist"));
	    else
	      this.props.api.getMyDecks(decks => {
	        var d = decks.map(deck => this.readDeck(deck));
	        sessionStorage.setItem("decklist", JSON.stringify(d));
	        this.setState({decks: d})
	      });

	  console.log(decklist);

		this.state = { decks: decklist };
	}

	readDeck (deck) {

		return Object.assign(deck, JSON.parse(window.atob(deck.supercode)));
	}

	render () {

		return (
		<div>
	        <Nav api={this.props.api} history={this.props.history}/>
	      	<main>
          		<div className="sensuba-deck-container">
          		{
          			this.state.decks.map((deck, i) => <Deck key={i} src={deck}/>)
          		}
	      		</div>
	            <button className="editor-button" onClick={() => this.props.history.push('/decks/builder')}>
	              <img className="editor-button-img" src="/deckbuilder.jpg" alt="editor-kun"/>
	              <div className="editor-button-text">Create a deck</div>
	            </button>
	      	</main>
	    </div>
		)
	}
}