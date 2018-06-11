import React, { Component } from 'react';
import './PlayPage.css';
import { Button } from 'reactstrap'
import Nav from '../Nav';

export default class CardsPage extends Component {

	constructor (props) {

		super(props);

    this.props.api.getCards(cards => this.setState({cards: cards}));
	}
  render() {
    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <div className="main-section">
            <Button>Créer une partie</Button>
          </div>
          <div className="main-section">
            <h2>Parties en cours</h2>
          </div>
      	</main>
      </div>
    );
  }
}