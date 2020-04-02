import React, { Component } from 'react';
import './ProfilePage.css';
import { Input, Label, FormGroup, FormFeedback } from 'reactstrap'
import Nav from '../Nav';
import User from '../../services/User';
import Avatar from './Avatar';

export default class ProfilePage extends Component {

  sha1 = require('sha1');

	constructor (props) {

		super(props);

    var user = User.getData();

    this.state = {
      user: user,
      avatarUrl: user.avatarUrl,
      usernameprofilevalid: true,
      passwordvalid: true
    }
	}

  save () {

    if (!this.state.usernameprofilevalid || this.waiting)
      return;

    var username = document.getElementById("sensuba-profile-username").value;
    var avatar = document.getElementById("sensuba-profile-avatar").value;
    var cpassword = this.sha1(document.getElementById("sensuba-profile-confirm-password").value);

    this.waiting = true;
    this.props.api.editProfile({username, avatar, cpassword},
      () => {
        User.updateProfile({username, avatarUrl: avatar});
        window.location.reload();
      },
      () => {
        this.waiting = false;
        this.setState({"passwordvalid": false});
      });
  }

  saveOptions () {

    if (this.waiting)
      return;

    var theme = document.getElementById("sensuba-profile-theme").value;

    this.waiting = true;
    this.props.api.editProfile({theme},
      () => {
        User.updateProfile({theme});
        window.location.reload();
      },
      () => {
        this.waiting = false;
      });
  }

  render() {
    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main id="profile-page">
          <div className="profile-part">
          <div className="rule-part">Profil</div>
            <div className="two-thirds-section profile-form">
              <FormGroup>
                <div className="third-section">
                  <Label for="sensuba-profile-username" className="sensuba-profile-label">Nom d'utilisateur</Label>
                </div>
                <div className="two-thirds-section">
                  <Input onChange={() => this.setState({"usernameprofilevalid": document.getElementById("sensuba-profile-username").value.length >= 4})} invalid={!this.state.usernameprofilevalid} id="sensuba-profile-username" type="text" defaultValue={ this.state.user.username }/>
                  <FormFeedback>Votre nom d'utilisateur doit comporter au moins 4 caractères</FormFeedback>
                </div>
              </FormGroup>
              <FormGroup>
                <div className="third-section">
                  <Label for="sensuba-profile-avatar" className="sensuba-profile-label">Avatar</Label>
                </div>
                <div className="two-thirds-section">
                  <Input id="sensuba-profile-avatar" type="text" onChange={ e => this.setState({ avatarUrl: e.target.value }) } defaultValue={ this.state.avatarUrl }/>
                </div>
              </FormGroup>
              <FormGroup>
                <div className="third-section">
                  <div className="sensuba-profile-label">Date d'inscription</div>
                </div>
                <div className="two-thirds-section">
                  <div className="sensuba-profile-label">{ this.state.user.date ? this.state.user.date.slice(0, 10) : "[?]" }</div>
                </div>
              <FormGroup>
              </FormGroup>
                <div className="third-section">
                  <div className="sensuba-profile-label">Fleurs</div>
                </div>
                <div className="two-thirds-section">
                  <div className="sensuba-profile-label"><span className="sensuba-credits">{ this.state.user.credit || "0" }</span></div>
                </div>
              </FormGroup>
              <FormGroup>
                <div className="third-section">
                  <Label for="sensuba-profile-confirm-password" className="sensuba-profile-label">Confirmation du mot de passe</Label>
                </div>
                <div className="two-thirds-section">
                  <Input invalid={!this.state.passwordvalid} id="sensuba-profile-confirm-password" type="password"/>
                  <FormFeedback>Mot de passe incorrect</FormFeedback>
                </div>
              </FormGroup>
              <button className="menu-button" onClick={() => this.save()}>Enregistrer</button>
            </div>
            <div className="third-section">
              <Avatar src={ this.state.avatarUrl }/>
              {
                (() => {
                  switch (this.state.user.authorization) {
                  case 1: return <div className="profile-status profile-status-platinum"/>
                  case 2: return <div className="profile-status profile-status-vip"/>
                  case 3: return <div className="profile-status profile-status-admin"/>
                  default: return <span/>;
                  }
                })()
              }
            </div>
          </div>
          <div className="options-part">
            <div className="rule-part">Options</div>
            <div className="two-thirds-section profile-form">
              <FormGroup>
                <div className="third-section">
                  <Label for="sensuba-profile-theme" className="sensuba-profile-label">Thème d'affichage</Label>
                </div>
                <div className="two-thirds-section">
                  <Input id="sensuba-profile-theme" defaultValue={this.props.theme} type="select">
                    <option value="">Clair</option>
                    <option value="dark">Sombre</option>
                  </Input>
                </div>
              </FormGroup>
              <button className="menu-button" onClick={() => this.saveOptions()}>Enregistrer</button>
            </div>
            <div className="third-section"/>
          </div>
      	</main>
      </div>
    );
  }
}