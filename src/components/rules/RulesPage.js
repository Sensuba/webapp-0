import React, { Component } from 'react';
import './RulesPage.css';
import './GlossaryPage.css';
import { Input, Label } from 'reactstrap';
import Nav from '../Nav';
import FR from './FR/RulesFR';
import EN from './EN/RulesEN';

export default class RulesPage extends Component {

  render() {

    var rules = <div/>;

    switch (this.props.lang) {
    case "en": rules = <EN/>; break;
    case "fr": rules = <FR/>; break;
    default: break;
    }

    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <div className="vintage-radio">
            <Input id="en-lang-rules" type="radio" name="lang-rules" onChange={() => this.props.history.push('/rules/en')} checked={this.props.lang === "en"}/>
            <Label for="en-lang-rules">English</Label>
            <Input id="fr-lang-rules" type="radio" name="lang-rules" onChange={() => this.props.history.push('/rules/fr')} checked={this.props.lang === "fr"}/>
            <Label for="fr-lang-rules">Français</Label>
          </div>
          { rules }
      	</main>
      </div>
    );
  }
}