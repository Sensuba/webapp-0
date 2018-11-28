import React, { Component } from 'react';
import './PlayPage.css';
import { Button, Input } from 'reactstrap'
import Nav from '../Nav';

export default class PlayPage extends Component {

	constructor (props) {

		super(props);

    this.state = {
      seeking: false
    };
	}

  seekGame (prv) {

    if (this.state.seeking)
      return;
    this.props.socket.emit('seek', prv);
    var history = this.props.history;
    this.props.socket.on('assign', function (res) {
      history.push(`/play/${res.to}`);
    });
    this.setState({seeking: true});
  }

  choice () {

    var idDeck = parseInt(document.getElementById("deck-choice").value, 10);
    if (idDeck === -1)
      localStorage.removeItem("playdeck");
    else {
      var deck = this.props.decks.find(deck => deck.idDeck === idDeck);
      var res = { hero: deck.hero, body: [] };
      Object.keys(deck.cards).forEach(c => {
        for (let i = 0; i < deck.cards[c]; i++)
          res.body.push(parseInt(c, 10));
      })
      localStorage.setItem("playdeck", JSON.stringify(res));
    }
  }

  componentDidMount () {

    this.choice();
  }

  render() {

    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <div className="main-section">
          {
            this.props.decks && this.props.decks.length > 0 ?
            <Input onChange={() => this.choice()} type="select" name="deck-choice" id="deck-choice">
              { this.props.decks.map(deck => <option key={deck.idDeck} value={deck.idDeck}>{deck.name}</option>) }
            </Input> :
            <Input onChange={() => this.choice()} type="select" name="deck-choice" id="deck-choice">
              <option value="-1">Default deck</option>
            </Input>
          }
            <Button onClick={() => this.seekGame(false)}>Quick game</Button>
            <Button onClick={() => this.seekGame(true)}>Private room</Button>
          </div>
      	</main>
      </div>
    );
  }
}