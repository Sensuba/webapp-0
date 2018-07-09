import React, { Component } from 'react';
import Card from './Card';
import './CardsPage.css';
import { Input, Label, Button } from 'reactstrap';
import Nav from '../Nav';
import User from '../../services/User';

export default class CardsPage extends Component {

	constructor (props) {

		super(props);

    var cardlist = [];

    if (localStorage.getItem(Card.list) !== null)
      cardlist = JSON.parse(localStorage.getItem(Card.list));
    else
      this.props.api.getCards(cards => {
        var c = cards.map(card => this.readCard(card));
        localStorage.setItem(Card.list, JSON.stringify(c));
        this.setState({officialCards: c})
      });

    this.state = {
      officialCards: cardlist,
      customCards: [],
      customs: false,
      loadedCustoms: false
    };

    
	}

  readCard (card) {

    return Object.assign(card, JSON.parse(window.atob(card.supercode)));
  }

  displayCustoms (customs) {

    if (customs && !this.state.loadedCustoms) {

      this.props.api.getCustomCards(cards => this.setState({customCards: cards.map(card => this.readCard(card))}));
    }

    this.setState({
      customs: customs,
      loadedCustoms: this.state.loadedCustoms || customs
    });
  }
  
  render() {
    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          {
            User.isConnected() ?
            <div className="card-collection-choicer">
              <div className="modern-radio">
                <Input id="official-card-collection" type="radio" name="card-collection" onChange={() => this.displayCustoms(false)} defaultChecked/>
                <Label for="official-card-collection">Official</Label>
                <Input id="custom-card-collection" type="radio" name="card-collection" onChange={() => this.displayCustoms(true)}/>
                <Label for="custom-card-collection">Customs</Label>
              </div>
            </div>
            : <span/>
          }
          <div className="sensuba-card-container">
      		  { (this.state.customs ? this.state.customCards : this.state.officialCards).map(card => <Card key={card.idCardmodel} src={card}/>) }
          </div>
          {
            this.state.customs ?
            <div className="custom-cards-editor-link">
              <Button onClick={() => this.props.history.push('/cards/editor')}>Open the editor</Button>
            </div>
            : <span/>
          }
      	</main>
      </div>
    );
  }
}