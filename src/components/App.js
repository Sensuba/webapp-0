import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import './handled/Handled.css';
import Cards from './cards/CardsPage';
import Editor from './cards/Editor/EditorPage';
import Play from './play/PlayPage';
import Room from './play/room/RoomPage';
import Loading from './loading/LoadingPage';
import Rules from './rules/RulesPage';
import Profile from './profile/ProfilePage';
import Decks from './decks/DecksPage';
import Deckbuilder from './decks/deckbuilder/DeckbuilderPage';
import Home from './home/HomePage';
import User from '../services/User';

const serverURL = process.env.SERVER_URL /*|| 'http://localhost:8080'*/ || 'https://sensuba-server.herokuapp.com/';

export default class App extends Component {

  constructor (props) {

    super(props);
    this.state = {};

    var readObject = obj => Object.assign(obj, JSON.parse(window.atob(obj.supercode)));
    var sortDecks = (a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);

    var cards = localStorage.getItem("cardlist");
    if (cards)
      this.state.cards = JSON.parse(cards);
    else
      this.props.options.api.getCards(cards => {
        var c = cards.map(card => readObject(card));
        this.setState({cards: c});
        localStorage.setItem("cardlist", JSON.stringify(c));
      });

    if (User.isConnected()) {
      var decks = localStorage.getItem("decklist");
      if (decks)
        this.state.decks = JSON.parse(decks);
      else
        this.props.options.api.getMyDecks(decks => {
          var d = decks.map(deck => readObject(deck)).sort(sortDecks);
          localStorage.setItem("decklist", JSON.stringify(d));
          this.setState({decks: d})
        }, err => this.setState({decks: []}));

      var ccards = localStorage.getItem("customcardlist");
      if (ccards !== null)
        this.state.customCards = JSON.parse(ccards);
      else
        this.props.options.api.getCustomCards(cards => {
          var c = cards.map(card => readObject(card));
          localStorage.setItem("customcardlist", JSON.stringify(c));
          this.setState({customCards: c});
        }, err => this.setState({customCards: []}));
    }
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
            <Route exact path="/cards/:focus" component={({ match, history }) => (<Cards focus={match.params.focus} cards={this.state.cards} customs={this.state.customCards} history={history} api={this.props.options.api}/>)}/>
            <Route exact path="/cards/editor" component={({ match, history }) => <Editor history={history} api={this.props.options.api}/>}/>
            <Route path="/cards/editor/:card" component={({ match, history }) => (User.isConnected() ? <Editor card={this.state.customCards.find(card => card.idCardmodel.toString() === match.params.card)} history={history} api={this.props.options.api}/> : <Redirect to="/cards"/>)}/>
            <Route exact path="/play" component={({ match, history }) => (<Play decks={this.state.decks} server={serverURL} history={history} api={this.props.options.api}/>)}/>
            <Route path="/play/:room" component={({ match, history }) => (<Room server={serverURL} room={match.params.room} history={history} api={this.props.options.api}/>)}/>
            <Route exact path="/profile" component={({ match, history }) => (<Profile history={history} api={this.props.options.api}/>)}/>
            <Route exact path="/decks" component={({ match, history }) => (<Decks history={history} decks={this.state.decks} api={this.props.options.api}/>)}/>
            <Route exact path="/decks/builder" component={({ match, history }) => (<Deckbuilder history={history} api={this.props.options.api}/>)}/>
            <Route path="/decks/builder/:deck" component={({ match, history }) => (User.isConnected() ? <Deckbuilder deck={match.params.deck} history={history} api={this.props.options.api}/> : <Redirect to="/decks"/>)}/>
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