import React, { Component } from 'react';
import Card from './Card';
import './CardsPage.css';
import { Input, Label, Button } from 'reactstrap';
import Nav from '../Nav';
import User from '../../services/User';

export default class CardsPage extends Component {

	constructor (props) {

		super(props);

    var cardlist = [], ccardlist = [];

    if (sessionStorage.getItem("cardlist") !== null)
      cardlist = JSON.parse(sessionStorage.getItem("cardlist"));
    else
      this.props.api.getCards(cards => {
        var c = cards.map(card => this.readCard(card));
        sessionStorage.setItem("cardlist", JSON.stringify(c));
        this.setState({officialCards: c})
      });

    if (sessionStorage.getItem("customcardlist") !== null)
      ccardlist = JSON.parse(sessionStorage.getItem("customcardlist"));
    else
      this.props.api.getCustomCards(cards => {
        var c = cards.map(card => this.readCard(card));
        sessionStorage.setItem("customcardlist", JSON.stringify(c));
        this.setState({customCards: c})
      });

    this.state = {
      officialCards: cardlist,
      customCards: ccardlist,
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
              <div className="vintage-radio">
                <Input id="official-card-collection" type="radio" name="card-collection" onChange={() => this.displayCustoms(false)} defaultChecked/>
                <Label for="official-card-collection">Official</Label>
                <Input id="custom-card-collection" type="radio" name="card-collection" onChange={() => this.displayCustoms(true)}/>
                <Label for="custom-card-collection">Customs</Label>
              </div>
            </div>
            : <span/>
          }
          <div className="sensuba-card-container">
      		  {
              this.state.customs ?
                this.state.customCards.map(card => <a className="sensuba-card-link" onClick={() => this.props.history.push(`/cards/editor/${card.idCardmodel}`)} key={card.idCardmodel}><Card key={card.idCardmodel} src={card}/></a>)
                :
                this.state.officialCards.map(card => <Card key={card.idCardmodel} src={card}/>)
            }
          </div>
          {
            this.state.customs ?
            <button className="editor-button" onClick={() => this.props.history.push('/cards/editor')}>
              <img className="editor-button-img" src="/editor.png"/>
              <div className="editor-button-text">Open the editor</div>
            </button>
            : <span/>
          }
      	</main>
      </div>
    );
  }
}