import React, { Component } from 'react';
import './DecksPage.css';
import Deck from './Deck.js';
import Nav from '../Nav';
import User from '../../services/User';

export default class DecksPage extends Component {

	constructor (props) {

		super(props);

		if (!User.isConnected())
			this.props.history.push('/home');
	}

	render () {

		return (
		<div>
	        <Nav api={this.props.api} history={this.props.history}/>
	      	<main>
          		<div className="sensuba-deck-container">
          		{
          			(this.props.decks || []).map((deck, i) => <a className="sensuba-card-link" onClick={() => this.props.history.push(`/decks/builder/${deck.idDeck}`)} key={deck.idDeck}><Deck src={deck}/></a>)
          		}
	      		</div>
	            <button className="editor-button" onClick={() => this.props.history.push('/decks/builder')}>
	              <img className="editor-button-img" src="/deckbuilder.png" alt="deckbuilder-chan"/>
	              <div className="editor-button-text">Create a deck</div>
	            </button>
	            <button className="editor-button reverse-editor-button" onClick={() => this.props.history.push('/decks/miracle')}>
	              <img className="editor-button-img editor-button-miracle" src="/deckbuilder.png" alt="miracle-chan"/>
	              <div className="editor-button-text">Create a miracle</div>
	            </button>
	      	</main>
	    </div>
		)
	}
}