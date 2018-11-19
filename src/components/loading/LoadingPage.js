import React, { Component } from 'react';
import Loader from '../utility/Loader';
import "./LoadingPage.css";

export default class LoadingPage extends Component {
  
  render() {

    return (
      <div className="page-wrapper">
        <div className="vertical-middle">
          <Loader/>
        </div>
      </div>
    );
  }
}