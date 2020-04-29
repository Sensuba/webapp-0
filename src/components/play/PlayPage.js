import React, { Component } from 'react';
import './PlayPage.css';
import { Input } from 'reactstrap'
import Nav from '../Nav';
import Deck from '../decks/Deck';
import User from '../../services/User';

export default class PlayPage extends Component {

  formats = {
      standard: { name: "Standard", cardlist: this.props.cards.filter(card => card.idEdition === 1).concat((this.props.collection || []).map(el => Object.assign({count: el.number}, this.props.cards.find(card => card.idCardmodel === el.idCardmodel)))) },
      display: { name: "Vitrine", cardlist: this.props.cards },
      custom: { name: "Personnalisé", cardlist: this.props.cards.filter(card => card.idEdition === 1).concat((this.props.collection || []).map(el => Object.assign({count: el.number}, this.props.cards.find(card => card.idCardmodel === el.idCardmodel)))).concat(this.props.customs) }
    }

	constructor (props) {

		super(props);

    var deck = User.getDeck();
    var decklist = User.isConnected() ? (User.getData().authorization >= 2 ? this.props.decks : this.props.decks.filter(d => this.findFormat(d) !== "display").filter(d => Object.values(d.cards).reduce((a, b) => a + b, 0) === 30)) : undefined;
    if (!User.isConnected())
      deck = null;
    else if (deck) {
      deck = JSON.parse(deck);
      if (deck.id === undefined) {
        if (decklist && decklist.length > 0)
          deck.id = decklist.reduce((max, el) => Math.max(max, el.idDeck), null);
      }
    }
    else if (decklist && decklist.length > 0) {
      this.setDeck(decklist[0], false);
      deck = decklist[0];
    }
    else
      deck = null;

    this.state = {
      cards: this.props.cards.concat(this.props.customs),
      decklist: decklist,
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
      this.setDeck(this.state.decklist.find(deck => deck.idDeck === idDeck));
  }

  findFormat (deck) {

    var formats = [];
    Object.keys(this.formats).forEach(k => formats.push(k));

    var c = Object.keys(deck.cards);
    c.push(deck.hero);
    c.forEach (card => {
      formats.slice().forEach(f => {
        var cc = this.formats[f].cardlist.find(l => l.idCardmodel && l.idCardmodel.toString() === card.toString());
        if (!cc || (cc.count === 1 && deck.cards[card] > 1))
          formats.splice(formats.indexOf(f), 1);
      })
    })

    return formats[0] || "display";
  }

  setDeck (deck, setState = true) {

    var listsrc = setState ? this.state.cards : this.props.cards.concat(this.props.customs);
    var res = { id: deck.idDeck, hero: deck.hero, body: [] };
    var cc = listsrc.find(el => el.idCardmodel === parseInt(deck.hero, 10));
    if (cc && !cc.idEdition)
      res.hero = cc;
    Object.keys(deck.cards).forEach(c => {
        for (let i = 0; i < deck.cards[c]; i++) {
          cc = listsrc.find(el => el.idCardmodel === parseInt(c, 10));
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
                  <Deck src={this.state.decklist ? this.state.decklist.find(deck => deck.idDeck === this.state.deck.id) : null}/>
                </div>
                <div className="half-section">
                  <div className="sensuba-deckbuilder-search">
                    <Input type="text" placeholder="Recherche" className="sensuba-deckbuilder-search-input" value={this.state.filter} onChange={e => this.setState({filter: e.target.value})}/>
                    <div className="sensuba-deckbuilder-search-list">
                    {
                      (this.state.decklist || []).filter(c => c.name.toLowerCase().includes(this.state.filter.toLowerCase())).map((c, i) => {
                        var hero;
                        var idHero = c.hero.idCardmodel || c.hero;
                        hero = this.state.cards.find(s => s.idCardmodel === idHero);
                        return (
                          hero ?
                          <div key={i} className={"sensuba-deckbuilder-tag " + colorIdToClassName(hero.idColor) + " " + colorIdToClassName(hero.idColor2)} onClick={() => this.choice(c.idDeck)}>
                            <div className="sensuba-deckbuilder-tag-name">{c.name}</div>
                            <img className="sensuba-deckbuilder-tag-img" src={c.background} alt={c.name}/>
                          </div>
                          : <span/>
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
                  <h3>Partie rapide</h3>
                </div>
              </div>
              <div onClick={() => this.seekGame(true)} className="play-panel panel-right">
                <img className="play-panel-background" src="/play2.jpg" alt="bg"/>
                <div className="play-panel-text">
                  <h3>Partie privée</h3>
                </div>
              </div>
            </div>
          </div>
      	</main>
      </div>
    );
  }
}