import React, { Component } from 'react';
import './DecksPage.css';
import Deck from './Deck.js';
import Nav from '../Nav';
import User from '../../services/User';
import { Input, FormGroup } from 'reactstrap';

export default class DecksPage extends Component {

	constructor (props) {

		super(props);

		if (!User.isConnected())
			this.props.history.push('/home');

		this.deckbuilderType = "builder";
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
	            <button className="editor-button" onClick={() => this.props.history.push('/decks/' + this.deckbuilderType)}>
	              <img className="editor-button-img" src="/deckbuilder.png" alt="deckbuilder-chan"/>
	              <div className="editor-button-text">Construire un deck</div>
	            </button>
	            <div className="editor-select">
	            	<FormGroup row>
			          <Input type="select" name="select" id="form-deckbuilder-type" defaultValue="builder" onChange={e => this.deckbuilderType = e.target.value}>
			            <option value="builder">Standard</option>
			            <option value="display">Vitrine</option>
			            <option value="custom">Personnalisé</option>
			            <option value="draft">Draft</option>
			          </Input>
			        </FormGroup>
	            </div>
	      	</main>
	    </div>
		)
	}
}