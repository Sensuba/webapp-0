import React, { Component } from 'react';
import Nav from '../../../Nav';
import { Input, Label } from 'reactstrap';
import FR from './lang/SensFR';
import EN from './lang/SensEN';
import './SENSPage.css';

export default class SENSPage extends Component {

	constructor (props) {

		super(props);

	    this.state = {lang: "en"};
	}

	render() {

	    var rules = <div/>;

	    var regexHTML = regex => {

	    	regex = regex.replace(/\||\(|\)|\[|\]|\?|\+|\-|\*/g, x => `<span class="sens-regex-p-syntax">${x}</span>`);

	    	regex = regex.replace(/\\<span class="sens-regex-p-syntax">.<\/span>/g, x => `<span class="sens-regex-c-syntax">${"\\" + x.substring(35, x.length)}`);

	    	regex = regex.replace(/[A-Z_]+/g, x => `<span class="sens-regex-k-syntax">${x}</span>`);

	    	return regex;
	    }

	    switch (this.state.lang) {
	    case "en": rules = <EN regex={regexHTML}/>; break;
	    case "fr": rules = <FR regex={regexHTML}/>; break;
	    default: break;
	    }

		return (
			<div>
        		<Nav api={this.props.api} history={this.props.history}/>
      			<main id="sens-page" className="dark-page">
      			<div className="vintage-radio">
		            <Input id="en-lang-sens" type="radio" name="lang-sens" onChange={() => this.setState({lang: "en"})} checked={this.state.lang === "en"}/>
		            <Label for="en-lang-sens">English</Label>
		            <Input id="fr-lang-sens" type="radio" name="lang-sens" onChange={() => this.setState({lang: "fr"})} checked={this.state.lang === "fr"}/>
		            <Label for="fr-lang-sens">Français</Label>
		        </div>
		        { rules }
      			</main>
			</div>
		);
	}
}