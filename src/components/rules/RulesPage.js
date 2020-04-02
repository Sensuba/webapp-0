import React, { Component } from 'react';
import './RulesPage.css';
import './GlossaryPage.css';
//import { Input, Label } from 'reactstrap';
import Nav from '../Nav';
import FR from './FR/RulesFR';
//import EN from './EN/RulesEN';

export default class RulesPage extends Component {

  render() {

    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
           <FR/>
      	</main>
      </div>
    );
  }
}