import React, { Component } from 'react';
import "./TextBox.css";

export default class TextBox extends Component {

  render () {

    return (
        <div onClick={e => this.props.unselect(e)} className="sensuba-mission-text">
            <div className="sensuba-textbox">
                <p>{ this.props.text }</p>
            </div>
        </div>
    )
  }
}