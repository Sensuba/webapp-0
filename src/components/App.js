import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Cards from './cards/CardsPage';
import Editor from './cards/Editor/EditorPage';
import SENS from './cards/Editor/SENS/SENSPage';
import Play from './play/PlayPage';
import Room from './play/room/RoomPage';
import Loading from './loading/LoadingPage';
import Rules from './rules/RulesPage';
import Profile from './profile/ProfilePage';
import Decks from './decks/DecksPage';
import Deckbuilder from './decks/deckbuilder/DeckbuilderPage';
import Home from './home/HomePage';
import User from '../services/User';

const serverURL = process.env.SERVER_URL || 'http://localhost:8080' || 'https://sensuba-server.herokuapp.com/';

export default class App extends Component {

  constructor (props) {

    super(props);
    this.state = {};

    var cards = sessionStorage.getItem("cardlist");
    if (cards)
      this.state.cards = JSON.parse(cards);
    else
      this.props.options.api.getCards(cards => {
        var c = cards.map(card => this.readCard(card));
        this.setState({cards: c});
        sessionStorage.setItem("cardlist", JSON.stringify(c));
      });
  }

  readCard (card) {

    return Object.assign(card, JSON.parse(window.atob(card.supercode)));
  }

  render() {

    if (!this.state.cards)
      return <Loading/>;

    return (
      <BrowserRouter>
          <Switch>
            <Route exact path="/" component={({ match, history }) => (<Redirect to="/home"/>)}/>
            <Route exact path="/home" component={({ match, history }) => (<Home history={history} api={this.props.options.api}/>)}/>
            <Route exact path="/cards" component={({ match, history }) => (<Cards history={history} api={this.props.options.api}/>)}/>
            <Route exact path="/cards/editor" component={({ match, history }) => <Editor history={history} api={this.props.options.api}/>}/>
            <Route exact path="/sens" component={({ match, history }) => <SENS history={history} api={this.props.options.api}/>}/>
            <Route path="/cards/editor/:card" component={({ match, history }) => (User.isConnected() ? <Editor card={match.params.card} history={history} api={this.props.options.api}/> : <Redirect to="/cards"/>)}/>
            <Route exact path="/play" component={({ match, history }) => (<Play server={serverURL} history={history} api={this.props.options.api}/>)}/>
            <Route path="/play/:room" component={({ match, history }) => (<Room server={serverURL} room={match.params.room} history={history} api={this.props.options.api}/>)}/>
            <Route exact path="/profile" component={({ match, history }) => (<Profile history={history} api={this.props.options.api}/>)}/>
            <Route exact path="/decks" component={({ match, history }) => (<Decks history={history} api={this.props.options.api}/>)}/>
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