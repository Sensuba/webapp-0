import React, { Component } from 'react';
import './RulesPage.css';
import { Input, Label } from 'reactstrap';
import Nav from '../Nav';
import FR from './lang/RulesFR';
import EN from './lang/RulesEN';

export default class RulesPage extends Component {

	constructor (props) {

		super(props);

    this.state = {lang: "en"};
	}

  render() {

    var rules = <div/>;

    switch (this.state.lang) {
    case "en": rules = <EN/>; break;
    case "fr": rules = <FR/>; break;
    default: break;
    }

    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <div className="vintage-radio">
            <Input id="en-lang-rules" type="radio" name="lang-rules" onChange={() => this.setState({lang: "en"})} checked={this.state.lang === "en"}/>
            <Label for="en-lang-rules">English</Label>
            <Input id="fr-lang-rules" type="radio" name="lang-rules" onChange={() => this.setState({lang: "fr"})} checked={this.state.lang === "fr"}/>
            <Label for="fr-lang-rules">Français</Label>
          </div>
          { rules }
      	</main>
      </div>
    );
  }
}