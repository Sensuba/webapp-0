import React, { Component } from 'react';
import { Navbar, NavbarBrand, Breadcrumb, BreadcrumbItem, Input, Button, Label, Form, FormFeedback } from 'reactstrap';
import Lightbox from './utility/Lightbox';
import './Nav.css';
import User from '../services/User'

export default class Nav extends Component {

	guest_links = [
		{ name: "Home", path: "/home" },
		{ name: "Cards", path: "/cards" },
		{ name: "Play", path: "/play" },
		{ name: "Stats", path: "/stats" },
		{ name: "Login", action: () => this.setState({ lightbox: true, signup: false }) },
	];

	member_links = [
		{ name: "Home", path: "/home" },
		{ name: "Cards", path: "/cards" },
		{ name: "Play", path: "/play" },
		{ name: "Stats", path: "/stats" },
		{ name: "Collection", path: "/collection" },
		{ name: "Profile", path: "/profile" },
		{ name: "Logout", action: () => this.logout() },
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

		this.props.api.login(
			document.getElementById("username-login").value,
			this.sha1(document.getElementById("password-login").value),
			() => window.location.reload());
	}

	logout () {

		User.disconnect();
		window.location.reload();
	}

	signup () {

		if (document.getElementById("username-signup").value.length < 5 ||
			document.getElementById("password-signup").value.length < 8 ||
			document.getElementById("password-signup").value !== document.getElementById("confirm-password-signup").value)
			return;

		this.props.api.signup(
			document.getElementById("username-signup").value,
			this.sha1(document.getElementById("password-signup").value),
			() => window.location.reload());
	}

  render() {
    return (
		<Navbar>
			<NavbarBrand><h2>Sensuba</h2></NavbarBrand>
			<Breadcrumb>
				{
					(User.isConnected() ? this.member_links : this.guest_links).map(link =>
						<BreadcrumbItem
							className={"nav-item" + (this.props.history.location.pathname.startsWith(link.path) ? "" : " enabled-nav-item")}
							key={link.name}
							onClick={ link.path ? () => this.props.history.push(link.path) : link.action }
							active={this.props.history.location.pathname.startsWith(link.path)}>
								{ link.name }
						</BreadcrumbItem>
					)
				}
			</Breadcrumb>
			<Lightbox className="connection-lightbox" open={this.state.lightbox && !this.state.signup} onClose={() => this.setState({ lightbox: false })}>
				<Form onSubmit={e => {e.preventDefault(); this.login();}}>
					<Label for="username-login">
						<div className="label-input">Username</div>
						<Input id="username-login" type="text" name="username"/>
					</Label>
					<Label for="password-login">
						<div className="label-input">Password</div>
						<Input id="password-login" type="password" name="password"/>
					</Label>
					<div>
						<Button>Login</Button>
						<span className="more-detail" onClick={() => this.setState({signup: true})}>Create an account</span>
					</div>
				</Form>
			</Lightbox>
			<Lightbox className="connection-lightbox" open={this.state.lightbox && this.state.signup} onClose={() => this.setState({ lightbox: false })}>
				<Form onSubmit={e => {e.preventDefault(); this.signup();}}>
					<Label for="username-signup">
						<div className="label-input">Username</div>
						<Input onChange={() => this.setState({"usernamesignupvalid": document.getElementById("username-signup").value.length >= 4})} invalid={!this.state.usernamesignupvalid} id="username-signup" type="text" name="username"/>
						<FormFeedback>Your username must contain at least 4 characters</FormFeedback>
					</Label>
					<Label for="password-signup">
						<div className="label-input">Password</div>
						<Input onChange={() => this.setState({"passwordsignupvalid": document.getElementById("password-signup").value.length >= 8})} invalid={!this.state.passwordsignupvalid} id="password-signup" type="password" name="password"/>
						<FormFeedback>Your password must contain at least 8 characters</FormFeedback>
					</Label>
					<Label for="confirm-password-signup">
						<div className="label-input">Confirm password</div>
						<Input onChange={() => this.setState({"confirmpasswordsignupvalid": document.getElementById("confirm-password-signup").value === document.getElementById("password-signup").value})} invalid={!this.state.confirmpasswordsignupvalid} id="confirm-password-signup" type="password" name="confirm-password"/>
						<FormFeedback>Your passwords doesn't match</FormFeedback>
					</Label>
					<div>
						<Button>Sign up</Button>
						<span className="more-detail" onClick={() => this.setState({signup: false})}>I have an account</span>
					</div>
				</Form>
			</Lightbox>
		</Navbar>
    );
  }
}