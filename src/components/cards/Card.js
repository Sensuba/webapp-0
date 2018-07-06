import React, { Component } from 'react';
import Hero from './Hero';
import Figure from './Figure';
import Spell from './Spell';
import './Card.css';

export default class Card extends Component {

  render() {

  	var colorIdToClassName = colorId => {

  		switch (colorId) {
      case 0: return "neutral-mana";
  		case 1: return "white-mana";
  		case 2: return "red-mana";
  		case 3: return "blue-mana";
  		case 4: return "green-mana";
  		case 5: return "black-mana";
  		default: return "";
  		}
  	}

  	var result = <div/>

  	switch (this.props.src.cardType) {
    case "hero": result = <Hero src={this.props.src} classColor={{color1: colorIdToClassName(this.props.src.idColor), color2: colorIdToClassName(this.props.src.idColor2)}}/>; break;
  	case "figure": result = <Figure src={this.props.src} classColor={colorIdToClassName(this.props.src.idColor)}/>; break;
    case "spell": result = <Spell src={this.props.src} classColor={colorIdToClassName(this.props.src.idColor)}/>; break;
    default: break;
  	}

  	return result;
  }
}