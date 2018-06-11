import React, { Component } from 'react';
import Card from './Card';
import './CardsPage.css';
import Nav from '../Nav';

export default class CardsPage extends Component {

	constructor (props) {

		super(props);

    this.state = {
      cards: []
    };

    this.props.api.getCards(cards => this.setState({cards: cards}));
	}
  render() {
    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <div className="sensuba-card-container">
      		  { this.state.cards.map(card => <Card key={card.idCardmodel} src={card}/>) }
          </div>
      	</main>
      </div>
    );
  }
}