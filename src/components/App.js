import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import './style/Handled.css';
import './style/DarkTheme.css';
import './style/Mozilla.css';
import Cards from './cards/CardsPage';
import Editor from './cards/Editor/EditorPage';
import Play from './play/PlayPage';
import Room from './play/room/RoomPage';
import Solo from './solo/SoloPage';
import Mission from './solo/mission/MissionPage';
import Replay from './play/room/ReplayPage';
import Loading from './loading/LoadingPage';
import Rules from './rules/RulesPage';
import Profile from './profile/ProfilePage';
import Decks from './decks/DecksPage';
import Deckbuilder from './decks/deckbuilder/DeckbuilderPage';
import Home from './home/HomePage';
import User from '../services/User';
import Library from '../services/Library';
import io from 'socket.io-client';
import sorter from '../utility/CollectionSorter';

const serverURL = /*process.env.SERVER_URL || 'http://localhost:8080' ||*/ 'https://sensuba.herokuapp.com/';

const nocards = 850;

export default class App extends Component {

  constructor (props) {

    super(props);
    this.state = { browser: this.checkBrowser() };

    this.socket = io(serverURL);

    window.disconnect = () => {this.socket.close(); setTimeout(() => this.reconnect(), 500);}

    setTimeout(() => {
      if (this.socket.connected){
        this.socket.on("disconnect", () => {

          console.log("Disconnected from server");
          this.socket.close();
          this.reconnect();
        })
      }
      else setTimeout(() => this.reconnect(), 10000);
    }, 500);

    if (User.isConnected()) {

      var user = User.getData();
      this.state.theme = user.theme;
    }

    this.readObject = obj => Object.assign(obj, JSON.parse(window.atob(obj.supercode)));
    this.filterCardData = obj => {
      delete obj.supercode;
      delete obj.blueprint;
      delete obj.author;
      if (obj.tokens)
        obj.tokens = obj.tokens.map(token => this.filterCardData(token));
      return obj;
    }

    Library.instantiate(() => {

      var f = () => {
        Library.getCardList(list => {

          if (list && list.length && list.length >= nocards) {
            sorter.sort(list, "type");
            this.setState({cards: list});
          }
          else
            this.updateCardlist();
        })

        if (User.isConnected()) {

          Library.getCollection(list => {

            if (list && list.length)
              this.setState({collection: list});
            else
              this.updateCollection();
          })

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

  reconnect () {

    var socket = io(serverURL);

    setTimeout(() => {
      if (socket.connected) {
        console.log("Reconnected to server");
        socket.on("disconnect", () => {

          console.log("Disconnected from server");
          this.socket.close();
          this.reconnect();
        })
        this.socket = socket;
      }
      else setTimeout(() => this.reconnect(), 10000);
    }, 500);
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

  checkBrowser () {

    var browser = "unknown";
    var c = navigator.userAgent.search("Chrome");
    var f = navigator.userAgent.search("Firefox");
    var m8 = navigator.userAgent.search("MSIE 8.0");
    var m9 = navigator.userAgent.search("MSIE 9.0");
    if (c > -1) {
        browser = "chrome";
    } else if (f > -1) {
        browser = "firefox";
    } else if (m9 > -1) {
        browser ="msie9";
    } else if (m8 > -1) {
        browser ="msie8";
    }
    return browser;
  }

  updateCardlist () {

    this.props.options.api.getCards(cards => {
      if (cards && cards.length >= nocards) {
        var c = cards.map(card => this.filterCardData(this.readObject(card)));
        sorter.sort(c, "type");
        this.setState({cards: c});
        Library.update(c);
      } else this.updateCardlist();
    });
  }

  updateCustoms () {

    this.props.options.api.getCustomCards(cards => {
      var c = cards.map(card => this.readObject(card));
      this.setState({customCards: c});
      Library.updateCustoms(c);
    }, err => this.setState({customCards: []}));
  }

  updateCollection () {

    this.props.options.api.getCollection(cards => {
      this.setState({collection: cards});
      Library.updateCollection(cards);
    }, err => this.setState({collection: []}));
  }

  updateDecks () {

    this.props.options.api.getMyDecks(decks => {
      var d = decks.map(deck => this.readObject(deck));
      let sortDecks = (a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
      this.setState({decks: d.sort(sortDecks)});
      Library.updateDecks(d);
    }, err => this.setState({decks: []}));
  }

  getSocket () {

    return this.socket;
  }

  render() {

    if (!this.state.cards || (User.isConnected() && (!this.state.decks || !this.state.customCards || !this.state.collection)))
      return <Loading className={(this.state.theme ? this.state.theme + "-theme" : "")}/>;

    return (
      <div className={"sensuba-app " + (this.state.theme ? this.state.theme + "-theme " : "") + (this.state.browser + "-browser")}>
        <BrowserRouter>
            <Switch>
              <Route exact path="/" component={({ match, history }) => (<Redirect to="/home"/>)}/>
              <Route exact path="/home" component={({ match, history }) => (<Home history={history} api={this.props.options.api}/>)}/>
              <Route exact path="/cards" component={({ match, history }) => (<Cards cards={this.state.cards} customs={this.state.customCards} collection={this.state.collection} updateCollection={this.updateCollection.bind(this)} history={history} api={this.props.options.api}/>)}/>
              <Route path="/cards/focus/:focus" component={({ match, history }) => (<Cards focus={match.params.focus} cards={this.state.cards} customs={this.state.customCards} collection={this.state.collection} updateCollection={this.updateCollection.bind(this)} history={history} api={this.props.options.api}/>)}/>
              <Route path="/cards/shop" component={({ match, history }) => <Cards cards={this.state.cards} customs={this.state.customCards} collection={this.state.collection} updateCollection={this.updateCollection.bind(this)} shop={true} history={history} api={this.props.options.api}/>}/>
              <Route exact path="/cards/editor" component={({ match, history }) => <Editor history={history} updateCustoms={this.updateCustoms.bind(this)} api={this.props.options.api}/>}/>
              <Route path="/cards/editor/:card" component={({ match, history }) => (User.isConnected() ? <Editor updateCustoms={this.updateCustoms.bind(this)} idmodel={match.params.card} card={this.state.customCards.find(card => card.idCardmodel.toString() === match.params.card)} history={history} api={this.props.options.api}/> : <Redirect to="/cards"/>)}/>
              <Route exact path="/solo" component={({ match, history }) => (<Solo getSocket={() => this.getSocket()} history={history} api={this.props.options.api}/>)}/>
              <Route exact path="/solo/mission/:mission/:chapter" component={({ match, history }) => (<Mission mission={{mission: match.params.mission, chapter: match.params.chapter}} getSocket={() => this.getSocket()} history={history} api={this.props.options.api}/>)}/>
              <Route exact path="/play" component={({ match, history }) => (<Play cards={this.state.cards} customs={this.state.customCards} collection={this.state.collection} decks={this.state.decks} getSocket={() => this.getSocket()} history={history} api={this.props.options.api}/>)}/>
              <Route path="/play/:room" component={({ match, history }) => (<Room getSocket={() => this.getSocket()} room={match.params.room} history={history} api={this.props.options.api}/>)}/>
              <Route path="/replay/:room" component={({ match, history }) => (<Replay getSocket={() => this.getSocket()} room={match.params.room} history={history} api={this.props.options.api}/>)}/>
              <Route path="/training" component={({ match, history }) => (<Mission cards={this.state.cards} getSocket={() => this.getSocket()} training={1} history={history} api={this.props.options.api}/>)}/>
              <Route exact path="/profile" component={({ match, history }) => ( (User.isConnected() ? <Profile history={history} api={this.props.options.api} theme={this.state.theme}/> : <Redirect to="/home"/>)  )}/>
              <Route exact path="/decks" component={({ match, history }) => (<Decks cards={this.state.cards} history={history} decks={this.state.decks} api={this.props.options.api}/>)}/>
              <Route exact path="/decks/builder" component={({ match, history }) => (<Deckbuilder cards={this.state.cards} customs={this.state.customCards} collection={this.state.collection} updateDecks={this.updateDecks.bind(this)} history={history} api={this.props.options.api} type="standard"/>)}/>
              <Route exact path="/decks/miracle" component={({ match, history }) => (<Deckbuilder cards={this.state.cards} customs={this.state.customCards} collection={this.state.collection} updateDecks={this.updateDecks.bind(this)} history={history} api={this.props.options.api} type="miracle"/>)}/>
              <Route exact path="/decks/custom" component={({ match, history }) => (<Deckbuilder cards={this.state.cards} customs={this.state.customCards} collection={this.state.collection} updateDecks={this.updateDecks.bind(this)} history={history} api={this.props.options.api} type="custom"/>)}/>
              <Route exact path="/decks/display" component={({ match, history }) => (<Deckbuilder cards={this.state.cards} customs={this.state.customCards} collection={this.state.collection} updateDecks={this.updateDecks.bind(this)} history={history} api={this.props.options.api} type="display"/>)}/>
              <Route path="/decks/builder/:deck" component={({ match, history }) => (User.isConnected() ? <Deckbuilder cards={this.state.cards} customs={this.state.customCards} collection={this.state.collection} updateDecks={this.updateDecks.bind(this)} deck={this.state.decks.find(deck => deck.idDeck.toString() === match.params.deck)} history={history} api={this.props.options.api}/> : <Redirect to="/decks"/>)}/>
              <Route exact path="/rules" component={({ match, history }) => (<Rules history={history} api={this.props.options.api}/>)}/>
              { /* <Route path="/rules/:lang" component={({ match, history }) => (<Rules lang={match.params.lang} history={history} api={this.props.options.api}/>)}/> */ }
            </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
/*
App.propTypes = {
  state: PropTypes.object.isRequired,
}*/