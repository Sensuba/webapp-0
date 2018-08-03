import React, { Component } from 'react';
import Deck from '../Deck.js';
import { Input, Label } from 'reactstrap';
import Nav from '../../Nav';
import Card from '../../cards/Card';

export default class HeroSelector extends Component {

	constructor (props) {

		super(props);

		//if (!User.isConnected()) this.props.history.push('/home');

    var heroes = this.props.cards.filter(c => c.cardType === "hero");

    this.state = { heroes: heroes, focus: 0 }
	}

	render () {

		return (
		<div>
			<h1 className="big-text">Pick a hero</h1>
      <div className="hero-selector">
        <div className="select-hero-card shadow-hero-card"><Card src={this.state.heroes[this.state.focus === 0 ? this.state.heroes.length-1 : this.state.focus-1]}/></div>
        <div className="select-hero-card main-hero-card"><Card src={this.state.heroes[this.state.focus]}/></div>
        <div className="select-hero-card shadow-hero-card"><Card src={this.state.heroes[(this.state.focus+1)%this.state.heroes.length]}/></div>
      </div>
	  </div>
		)
	}
}