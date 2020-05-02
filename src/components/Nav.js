import React, { Component } from 'react';
import { Navbar, NavbarBrand, Breadcrumb, BreadcrumbItem, Input, Button, Label, Form, FormFeedback } from 'reactstrap';
import Lightbox from './utility/Lightbox';
import './Nav.css';
import User from '../services/User'

export default class Nav extends Component {

	constructor (props) {

		super(props);

		this.waiting = false;
	}

	guest_links = [
		{ name: "Accueil", path: "/home" },
		{ name: "Cartes", path: "/cards" },
		{ name: "Solo", path: "/solo" },
		{ name: "Jouer", path: "/play" },
		{ name: "Règles", path: "/rules" },
		{ name: "Connexion", action: () => this.setState({ lightbox: true, signup: false }) },
	];

	member_links = [
		{ name: "Accueil", path: "/home" },
		{ name: "Cartes", path: "/cards" },
		{ name: "Solo", path: "/solo" },
		{ name: "Jouer", path: "/play" },
		{ name: "Règles", path: "/rules" },
		{ name: "Mes decks", path: "/decks" },
		{ name: "Profil", path: "/profile" },
		{ name: "Déconnexion", action: () => this.logout() },
	];

	sha1 = require('sha1');

	state = {
		lightbox: false,
		signup: false,
		usernamesignupvalid: true,
		passwordsignupvalid: true,
		confirmpasswordsignupvalid: true
	};

	login () {

		if (this.waiting)
			return;
		this.waiting = true;
		this.props.api.login(
			document.getElementById("username-login").value,
			this.sha1(document.getElementById("password-login").value),
			() => window.location.reload(),
			() => this.waiting = false);
	}

	logout () {

		User.disconnect(() => window.location.reload());
	}

	signup () {

		if (this.waiting)
			return;
		this.waiting = true;
		if (document.getElementById("username-signup").value.length < 4 ||
			document.getElementById("password-signup").value.length < 8 ||
			document.getElementById("password-signup").value !== document.getElementById("confirm-password-signup").value)
			return;

		this.props.api.signup(
			document.getElementById("username-signup").value,
			this.sha1(document.getElementById("password-signup").value),
			() => window.location.reload(),
			() => this.waiting = false);
	}

  render() {
    return (
		<Navbar>
			<NavbarBrand><h2>Sensuba</h2></NavbarBrand>
			<Breadcrumb>
				{
					(User.isConnected() ? this.member_links : this.guest_links).map(link =>
						<BreadcrumbItem
							className={"nav-item" + (this.props.history.location.pathname === link.path ? "" : " enabled-nav-item")}
							key={link.name}
							onClick={ link.path ? () => this.props.history.push(link.path) : link.action }
							active={this.props.history.location.pathname === link.path}>
								{ link.name }
						</BreadcrumbItem>
					)
				}
			</Breadcrumb>
			<Lightbox className="connection-lightbox" open={this.state.lightbox && !this.state.signup} onClose={() => this.setState({ lightbox: false })}>
				<Form onSubmit={e => {e.preventDefault(); this.login();}}>
					<Label for="username-login">
						<div className="label-input">Nom d'utilisateur</div>
						<Input id="username-login" type="text" name="username"/>
					</Label>
					<Label for="password-login">
						<div className="label-input">Mot de passe</div>
						<Input id="password-login" type="password" name="password"/>
					</Label>
					<div>
						<Button>Connexion</Button>
						<span className="more-detail" onClick={() => this.setState({signup: true})}>Créer un compte</span>
					</div>
				</Form>
			</Lightbox>
			<Lightbox className="connection-lightbox" open={this.state.lightbox && this.state.signup} onClose={() => this.setState({ lightbox: false })}>
				<Form onSubmit={e => {e.preventDefault(); this.signup();}}>
					<Label for="username-signup">
						<div className="label-input">Nom d'utilisateur</div>
						<Input onChange={() => this.setState({"usernamesignupvalid": document.getElementById("username-signup").value.length >= 4})} invalid={!this.state.usernamesignupvalid} id="username-signup" type="text" name="username"/>
						<FormFeedback>Votre nom d'utilisateur doit contenir au moins 4 caractères</FormFeedback>
					</Label>
					<Label for="password-signup">
						<div className="label-input">Mot de passe</div>
						<Input onChange={() => this.setState({"passwordsignupvalid": document.getElementById("password-signup").value.length >= 8})} invalid={!this.state.passwordsignupvalid} id="password-signup" type="password" name="password"/>
						<FormFeedback>Votre mot de passe doit contenir au moins 8 caractères</FormFeedback>
					</Label>
					<Label for="confirm-password-signup">
						<div className="label-input">Confirmation du mot de passe</div>
						<Input onChange={() => this.setState({"confirmpasswordsignupvalid": document.getElementById("confirm-password-signup").value === document.getElementById("password-signup").value})} invalid={!this.state.confirmpasswordsignupvalid} id="confirm-password-signup" type="password" name="confirm-password"/>
						<FormFeedback>Vos mots de passe ne correspondent pas</FormFeedback>
					</Label>
					<div>
						<Button>Inscription</Button>
						<span className="more-detail" onClick={() => this.setState({signup: false})}>J'ai déjà un compte</span>
					</div>
				</Form>
			</Lightbox>
		</Navbar>
    );
  }
}