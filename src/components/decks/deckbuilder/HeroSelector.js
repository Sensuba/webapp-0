import React, { Component } from 'react';
import Deck from '../Deck.js';
import { Input, Label } from 'reactstrap';
import Nav from '../../Nav';
import Card from '../../cards/Card';

export default class HeroSelector extends Component {

	constructor (props) {

		super(props);

		//if (!User.isConnected()) this.props.history.push('/home');
	}

	render () {

		return (
		<div>
			<h1 className="big-text">Pick a hero</h1>
      <div className="hero-selector">
      </div>
	  </div>
		)
	}
}