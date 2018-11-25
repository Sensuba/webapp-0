import React, { Component } from 'react';
import './PlayPage.css';
import { Button, Input } from 'reactstrap'
import Nav from '../Nav';
import openSocket from 'socket.io-client';
import User from '../../services/User';

export default class PlayPage extends Component {

	constructor (props) {

		super(props);

    console.log(this.props);
    console.log(process.env)

    const socket = openSocket(this.props.server);

    socket.on('connected', function () {
      //console.log("YEAH")
    });

    var sortDecks = (a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);

    var decklist = [];
    if (User.isConnected()) {
      if (sessionStorage.getItem("decklist") !== null)
        decklist = JSON.parse(sessionStorage.getItem("decklist"));
      else
        this.props.api.getMyDecks(decks => {
          var d = decks.map(deck => this.readDeck(deck));
          sessionStorage.setItem("decklist", JSON.stringify(d));
          this.setState({decks: d.sort(sortDecks)})
        });
    }

    this.state = {
      socket: socket,
      seeking: false,
      decklist: decklist.sort(sortDecks)
    };
	}
  componentWillUnmount () {

    this.state.socket.disconnect();
  }

  handleData (data) {

  }

  seekGame (prv) {

    if (this.state.seeking)
      return;
    this.state.socket.emit('seek', prv);
    var history = this.props.history;
    this.state.socket.on('assign', function (res) {
      history.push(`/play/${res.to}`);
    });
    this.setState({seeking: true});
  }

  readDeck (deck) {

    return Object.assign(deck, JSON.parse(window.atob(deck.supercode)));
  }

  choice () {

    var idDeck = parseInt(document.getElementById("deck-choice").value, 10);
    if (idDeck === -1)
      sessionStorage.removeItem("playdeck");
    else {
      var deck = this.state.decklist.find(deck => deck.idDeck === idDeck);
      var res = { hero: deck.hero, body: [] };
      Object.keys(deck.cards).forEach(c => {
        for (let i = 0; i < deck.cards[c]; i++)
          res.body.push(parseInt(c, 10));
      })
      sessionStorage.setItem("playdeck", JSON.stringify(res));
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
            this.state.decklist.length > 0 ?
            <Input onChange={() => this.choice()} type="select" name="deck-choice" id="deck-choice">
              { this.state.decklist.map(deck => <option key={deck.idDeck} value={deck.idDeck}>{deck.name}</option>) }
            </Input> :
            <Input onChange={() => this.choice()} type="select" name="deck-choice" id="deck-choice">
              <option value="-1">Beginner deck</option>
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