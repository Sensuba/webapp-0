import React, { Component } from 'react';
import './Booster.css';
import Card from '../Card';

export default class Booster extends Component {

  render() {

    return (
    <div className={"sensuba-booster sensuba-booster-" + this.props.theme}>
      <div className="sensuba-booster-card-preview">
        <Card/>
      </div>
      <div className="sensuba-booster-extremum sensuba-booster-top"/>
      <div className="sensuba-booster-medium">
        <div className="sensuba-booster-name sensuba-booster-title">Sensuba</div>
        <div className="sensuba-booster-name sensuba-booster-expansion-name">{this.props.expansion}</div>
        <div className="sensuba-booster-name sensuba-booster-boosterpack-text">Booster Pack</div>
            <div className="sensuba-booster-image-wrap">
              <img className="sensuba-booster-bg" src={this.props.img} alt="Booster background"/>
            </div>
            <div className="sensuba-booster-filter"/>
            <div className="sensuba-booster-tear"/>
            <div className="sensuba-booster-name-emphasis"/>
        </div>
      <div className="sensuba-booster-extremum sensuba-booster-bottom"/>
    </div>
    );
  }
}