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
		signup: false
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
				<Form data-toggle="validator" onSubmit={()=>{}}>
					<Label for="username-login">
						<div className="label-input">Username</div>
						<Input id="username-login" type="text" name="username"/>
					</Label>
					<Label for="password-login">
						<div className="label-input">Password</div>
						<Input invalid id="password-login" type="password" name="password"/>
						<FormFeedback>Your password must contain at least 8 characters</FormFeedback>
					</Label>
					<div>
						<Button onClick={() => this.login()}>Login</Button>
						<span className="more-detail" onClick={() => this.setState({signup: true})}>Create an account</span>
					</div>
				</Form>
			</Lightbox>
			<Lightbox className="connection-lightbox" open={this.state.lightbox && this.state.signup} onClose={() => this.setState({ lightbox: false })}>
				<Label for="username-signup">
					<div className="label-input">Username</div>
					<Input id="username-signup" type="text" name="username"/>
				</Label>
				<Label for="password-signup">
					<div className="label-input">Password</div>
					<Input id="password-signup" type="password" name="password"/>
				</Label>
				<Label for="confirm-password-signup">
					<div className="label-input">Confirm password</div>
					<Input id="confirm-password-signup" type="password" name="confirm-password"/>
				</Label>
				<div>
					<Button onClick={() => this.signup()}>Sign up</Button>
					<span className="more-detail" onClick={() => this.setState({signup: false})}>I have an account</span>
				</div>
			</Lightbox>
		</Navbar>
    );
  }
}