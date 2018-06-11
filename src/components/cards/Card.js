import React, { Component } from 'react';

export default class Card extends Component {

  render() {
    return (
      <div className="sensuba-card">
    	 <img className="sensuba-card-img" src={this.props.src.imgLink} alt={this.props.src.nameCard}/>
      </div>
    );
  }
}