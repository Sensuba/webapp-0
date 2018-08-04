import React, { Component } from 'react';
import './GlossaryPage.css';
import { Input, Label } from 'reactstrap';
import Nav from '../Nav';
import FR from './FR/GlossaryFR';
import EN from './EN/GlossaryEN';

export default class GlossaryPage extends Component {

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
            <Input id="en-lang-glossary" type="radio" name="lang-glossary" onChange={() => this.props.history.push('/glossary/en')} checked={this.props.lang === "en"}/>
            <Label for="en-lang-glossary">English</Label>
            <Input id="fr-lang-glossary" type="radio" name="lang-glossary" onChange={() => this.props.history.push('/glossary/fr')} checked={this.props.lang === "fr"}/>
            <Label for="fr-lang-glossary">Français</Label>
          </div>
          { rules }
      	</main>
      </div>
    );
  }
}