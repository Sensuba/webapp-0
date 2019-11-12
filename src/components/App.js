import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import './handled/Handled.css';
import Cards from './cards/CardsPage';
import Editor from './cards/Editor/EditorPage';
import Play from './play/PlayPage';
import Room from './play/room/RoomPage';
import Replay from './play/room/ReplayPage';
import Loading from './loading/LoadingPage';
import Rules from './rules/RulesPage';
import Profile from './profile/ProfilePage';
import Decks from './decks/DecksPage';
import Deckbuilder from './decks/deckbuilder/DeckbuilderPage';
import Home from './home/HomePage';
import User from '../services/User';
import Library from '../services/Library';
import openSocket from 'socket.io-client';
import sorter from '../utility/CollectionSorter';

const serverURL = /*process.env.SERVER_URL ||*/ 'http://localhost:8080' || 'https://sensuba-server.herokuapp.com/';

export default class App extends Component {

  constructor (props) {

    super(props);
    this.state = {};

    this.state.socket = openSocket(serverURL);

    this.readObject = obj => Object.assign(obj, JSON.parse(window.atob(obj.supercode)));

    Library.instantiate(() => {

      var f = () => {
        Library.getCardList(list => {

          if (list && list.length) {
            sorter.sort(list, "type");
            this.setState({cards: list});
          }
          else
            this.props.options.api.getCards(cards => {
              var c = cards.map(card => this.readObject(card));
              sorter.sort(c, "type");
              this.setState({cards: c});
              Library.update(c);
            });
        })

        if (User.isConnected()) {

          Library.getCustomCardList(list => {

            if (list && list.length)
              this.setState({customCards: list});
            else
              this.updateCustoms();
          })

          Library.getDeckList(list => {

            let sortDecks = (a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);

            if (list && list.length)
              this.setState({decks: list.sort(sortDecks)});
            else
              this.updateDecks();
          })
        }
      }

      if (Library.upToDate())
        f();
      else
        Library.clearAll(f);
    })

    /*var cards = localStorage.getItem("cardlist");
    if (cards)
      this.state.cards = JSON.parse(cards);
    else
      this.props.options.api.getCards(cards => {
        var c = cards.map(card => this.readObject(card));
        this.setState({cards: c}); c = c.slice(10, 30);
        localStorage.setItem("cardlist", JSON.stringify(c));
      });*/

    /*if (User.isConnected()) {
      var decks = localStorage.getItem("decklist");
      if (decks)
        this.state.decks = JSON.parse(decks);
      else
        this.updateDecks();

      var ccards = localStorage.getItem("customcardlist");
      if (ccards !== null)
        this.state.customCards = JSON.parse(ccards);
      else
        this.updateCustoms();
    }*/
  }

  /*updateDecks () {

    var sortDecks = (a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);

    this.setState({decks: null});
    this.props.options.api.getMyDecks(decks => {
      var d = decks.map(deck => this.readObject(deck)).sort(sortDecks);
      localStorage.setItem("decklist", JSON.stringify(d));
      this.setState({decks: d})
    }, err => this.setState({decks: []}));
  }

  updateCustoms () {

    this.setState({customCards: null});
    this.props.options.api.getCustomCards(cards => {
      var c = cards.map(card => this.readObject(card));
      localStorage.setItem("customcardlist", JSON.stringify(c));
      this.setState({customCards: c});
    }, err => this.setState({customCards: []}));
  }*/

  updateCustoms () {

    this.props.options.api.getCustomCards(cards => {
      var c = cards.map(card => this.readObject(card));
      this.setState({customCards: c});
      Library.updateCustoms(c);
    }, err => this.setState({customCards: []}));
  }

  updateDecks () {

    this.props.options.api.getMyDecks(decks => {
      var d = decks.map(deck => this.readObject(deck));
      let sortDecks = (a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
      this.setState({decks: d.sort(sortDecks)});
      Library.updateDecks(d);
    }, err => this.setState({decks: []}));
  }

  render() {

    if (!this.state.cards || (User.isConnected() && (!this.state.decks || !this.state.customCards)))
      return <Loading/>;

    return (
      <BrowserRouter>
          <Switch>
            <Route exact path="/" component={({ match, history }) => (<Redirect to="/home"/>)}/>
            <Route exact path="/home" component={({ match, history }) => (<Home history={history} api={this.props.options.api}/>)}/>
            <Route exact path="/cards" component={({ match, history }) => (<Cards cards={this.state.cards} customs={this.state.customCards} history={history} api={this.props.options.api}/>)}/>
            <Route path="/cards/focus/:focus" component={({ match, history }) => (<Cards focus={match.params.focus} cards={this.state.cards} customs={this.state.customCards} history={history} api={this.props.options.api}/>)}/>
            <Route exact path="/cards/editor" component={({ match, history }) => <Editor history={history} updateCustoms={this.updateCustoms.bind(this)} api={this.props.options.api}/>}/>
            <Route path="/cards/editor/:card" component={({ match, history }) => (User.isConnected() ? <Editor updateCustoms={this.updateCustoms.bind(this)} card={this.state.customCards.find(card => card.idCardmodel.toString() === match.params.card)} history={history} api={this.props.options.api}/> : <Redirect to="/cards"/>)}/>
            <Route exact path="/play" component={({ match, history }) => (<Play cards={this.state.cards} decks={this.state.decks} socket={this.state.socket} history={history} api={this.props.options.api}/>)}/>
            <Route path="/play/:room" component={({ match, history }) => (<Room socket={this.state.socket} room={match.params.room} history={history} api={this.props.options.api}/>)}/>
            <Route path="/replay/:room" component={({ match, history }) => (<Replay socket={this.state.socket} room={match.params.room} history={history} api={this.props.options.api}/>)}/>
            <Route exact path="/profile" component={({ match, history }) => (<Profile history={history} api={this.props.options.api}/>)}/>
            <Route exact path="/decks" component={({ match, history }) => (<Decks cards={this.state.cards} history={history} decks={this.state.decks} api={this.props.options.api}/>)}/>
            <Route exact path="/decks/builder" component={({ match, history }) => (<Deckbuilder cards={this.state.cards} updateDecks={this.updateDecks.bind(this)} history={history} api={this.props.options.api}/>)}/>
            <Route exact path="/decks/miracle" component={({ match, history }) => (<Deckbuilder cards={this.state.cards} updateDecks={this.updateDecks.bind(this)} history={history} api={this.props.options.api} miracle={true}/>)}/>
            <Route path="/decks/builder/:deck" component={({ match, history }) => (User.isConnected() ? <Deckbuilder cards={this.state.cards} updateDecks={this.updateDecks.bind(this)} deck={this.state.decks.find(deck => deck.idDeck.toString() === match.params.deck)} history={history} api={this.props.options.api}/> : <Redirect to="/decks"/>)}/>
            <Route exact path="/rules" component={({ match, history }) => (<Redirect to="/rules/en"/>)}/>
            <Route path="/rules/:lang" component={({ match, history }) => (<Rules lang={match.params.lang} history={history} api={this.props.options.api}/>)}/>
          </Switch>
      </BrowserRouter>
    );
  }
}
/*
App.propTypes = {
  state: PropTypes.object.isRequired,
}*/