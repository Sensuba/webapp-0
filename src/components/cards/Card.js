import React, { Component } from 'react';
import Hero from './Hero';
import Figure from './Figure';
import Spell from './Spell';
import './Card.css';

export default class Card extends Component {

  render() {

    var escapeHtml = text => {
      var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };

      return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    var descHTML = desc => {

      desc = escapeHtml(desc);

      desc = desc.replace(/\n/g, "<br/>");

      desc = desc.replace(/initiative|fury|rush|exaltation|lethal|frenzy:?|last will:?|shield|flying|freeze|frozen/gi, x => `<b>${x}</b>`);

      desc = desc.replace(/(\d+|!|\*) ?:/g, x => {
        var emph = "";
        if (x.charAt(0) === '!')
          emph = "!";
        else if (x === "0:" || x === "0 :" || x === "*:" || x === "* :")
          emph = " ";
        else {
          var i = 0;
          for (; !isNaN(parseInt(x.charAt(i), 10)); i++)
            emph += x.charAt(i);
        }
        return `<span class="sensuba-card-effect-emphasis">${emph}</span>:`
      });

      return desc;
    }

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

  	var result = <div/>;

    var src = Object.assign(this.props.src, {htmlDescription: descHTML(this.props.src.description)});

  	switch (this.props.src.cardType) {
    case "hero": result = <Hero id={this.props.id} src={src} classColor={{color1: colorIdToClassName(this.props.src.idColor), color2: colorIdToClassName(this.props.src.idColor2)}}/>; break;
  	case "figure": result = <Figure id={this.props.id} src={src} classColor={colorIdToClassName(this.props.src.idColor)}/>; break;
    case "spell": result = <Spell id={this.props.id} src={src} classColor={colorIdToClassName(this.props.src.idColor)}/>; break;
    default: break;
  	}

  	return result;
  }
}