import React, { Component } from 'react';
import './Avatar.css';

export default class Avatar extends Component {

  render() {
    return (
      <div className="profile-avatar">
        <img src={this.props.src} alt="Avatar"/>
      </div>
    );
  }
}