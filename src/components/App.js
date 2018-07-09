import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Cards from './cards/CardsPage';
import Editor from './cards/Editor/EditorPage';
import Play from './play/PlayPage';
import Room from './play/room/RoomPage';
import Profile from './profile/ProfilePage';
import User from '../services/User';

const serverURL = process.env.SERVER_URL | 'http://localhost:8080';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
          <Switch>
            <Route exact path="/" component={({ match, history }) => (<Cards history={history} api={this.props.options.api}/>)}/>
            <Route exact path="/home" component={({ match, history }) => (<Redirect to="/"/>)}/>
            <Route exact path="/cards" component={({ match, history }) => (<Cards history={history} api={this.props.options.api}/>)}/>
            <Route exact path="/cards/editor" component={({ match, history }) => (User.isConnected() ? <Redirect to="/cards"/> : <Editor history={history} api={this.props.options.api}/>)}/>
            <Route exact path="/play" component={({ match, history }) => (<Play server={serverURL} history={history} api={this.props.options.api}/>)}/>
            <Route path="/play/:room" component={({ match, history }) => (<Room server={serverURL} room={match.params.room} history={history} api={this.props.options.api}/>)}/>
            <Route exact path="/profile" component={({ match, history }) => (<Profile history={history} api={this.props.options.api}/>)}/>
          </Switch>
      </BrowserRouter>
    );
  }
}
/*
App.propTypes = {
  state: PropTypes.object.isRequired,
}*/