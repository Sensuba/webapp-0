import React, { Component } from 'react';
import './ProfilePage.css';
import { Input } from 'reactstrap'
import Nav from '../Nav';
import User from '../../services/User'

export default class ProfilePage extends Component {

	constructor (props) {

		super(props);

    this.state = {
      user: User.getData()
    }
	}
  render() {
    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <div className="main-section">
            <Input type="text">{ this.state.user.username }</Input>
          </div>
      	</main>
      </div>
    );
  }
}