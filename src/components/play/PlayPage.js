import React, { Component } from 'react';
import './PlayPage.css';
import { Input } from 'reactstrap'
import Nav from '../Nav';
import Deck from '../decks/Deck';
import User from '../../services/User';

export default class PlayPage extends Component {

	constructor (props) {

		super(props);

    var deck = User.getDeck();
    if (!User.isConnected())
      deck = null;
    else if (deck) {
      deck = JSON.parse(deck);
      if (deck.id === undefined) {
        if (this.props.decks && this.props.decks.length > 0)
          deck.id = this.props.decks.reduce((max, el) => Math.max(max, el.idDeck), null);
      }
    }
    else if (this.props.decks && this.props.decks.length > 0) {
      this.setDeck(this.props.decks[0], false);
      deck = this.props.decks[0];
    }
    else
      deck = null;

    this.state = {
      seeking: false,
      deck: deck,
      filter: ""
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

  choice (idDeck) {

    if (idDeck === -1) {
      User.updateDeck(null);
      this.setState({deck: null});
    }
    else
      this.setDeck(this.props.decks.find(deck => deck.idDeck === idDeck));
  }

  setDeck (deck, setState = true) {

    var res = { id: deck.idDeck, hero: deck.hero, body: [] };
    Object.keys(deck.cards).forEach(c => {
        for (let i = 0; i < deck.cards[c]; i++) {
          var cc = this.props.cards.find(el => el.idCardmodel === parseInt(c, 10));
          if (cc) {
            if (cc.idEdition)
              res.body.push(parseInt(c, 10));
            else
              res.body.push(cc);
          }
        }
    })
    User.updateDeck(res);
    if (setState)
      this.setState({deck: res});
  }

  render() {

    var colorIdToClassName = colorId => {

      switch (colorId) {
        case 0: return "neutral-mana";
        case 1: return "white-mana";
        case 2: return "red-mana";
        case 3: return "blue-mana";
        case 4: return "green-mana";
        case 5: return "black-mana";
        default: return "";
        }
      }

    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <div className="main-section">
            <div className="deck-selection-area">
            {
              this.state.deck ?
              <div className="deck-selection-memberlist">
                <div className="half-section">
                  <Deck src={this.props.decks ? this.props.decks.find(deck => deck.idDeck === this.state.deck.id) : null}/>
                </div>
                <div className="half-section">
                  <div className="sensuba-deckbuilder-search">
                    <Input type="text" placeholder="Search" className="sensuba-deckbuilder-search-input" value={this.state.filter} onChange={e => this.setState({filter: e.target.value})}/>
                    <div className="sensuba-deckbuilder-search-list">
                    {
                      (this.props.decks || []).filter(c => c.name.toLowerCase().includes(this.state.filter.toLowerCase())).map((c, i) => {
                        var hero;
                        if (c.hero.idCardmodel && !c.hero.idEdition)
                          hero = c;
                        else {
                          var idHero = c.hero.idCardmodel || c.hero;
                          hero = this.props.cards.find(s => s.idCardmodel === idHero);
                        }
                        return (
                          <div key={i} className={"sensuba-deckbuilder-tag " + colorIdToClassName(hero.idColor) + " " + colorIdToClassName(hero.idColor2)} onClick={() => this.choice(c.idDeck)}>
                            <div className="sensuba-deckbuilder-tag-name">{c.name}</div>
                            <img className="sensuba-deckbuilder-tag-img" src={c.background} alt={c.name}/>
                          </div>
                        )
                      })
                    }
                    </div>
                  </div>
                </div>
              </div>
              : <Deck/>
            }
            </div>
            <div className="play-panel-wrapper">
              <div onClick={() => this.seekGame(false)} className="play-panel panel-left">
                <img className="play-panel-background" src="/play1.jpg" alt="bg"/>
                <div className="play-panel-text">
                  <h3>Quick game</h3>
                </div>
              </div>
              <div onClick={() => this.seekGame(true)} className="play-panel panel-right">
                <img className="play-panel-background" src="/play2.jpg" alt="bg"/>
                <div className="play-panel-text">
                  <h3>Private room</h3>
                </div>
              </div>
            </div>
          </div>
      	</main>
      </div>
    );
  }
}