import React, { Component } from 'react';
import Hero from './Hero';
import Figure from './Figure';
import Spell from './Spell';
import Artifact from './Artifact';
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

      desc = `<div class="sensuba-card-effect-p">${desc}</div>`;
      desc = desc.replace(/\n/g, '</div><div class="sensuba-card-effect-p">');

      desc = desc.replace(/initiative|fury|rush|exaltation|level up|lethal|conceal(ed)?|encore|frenzy:?|last will(s|:)?|silence|shield|flying|freeze|frozen|overload|trap:/gi, x => `<b>${x}</b>`);

      desc = desc.replace(/-&gt; ?/g, x =>
        `<div class="sensuba-card-summon-effect-icon">
          <svg viewBox="0 0 52.495 52.495">
            <g>
              <path d="M31.113,16.038V3.99l19.971,20.08l-19.971,20.08V32.102c0,0-17.735-4.292-29.849,16.064
                c0,0-3.02-15.536,10.51-26.794C11.774,21.371,17.903,15.64,31.113,16.038z"/>
              <path d="M0.783,50.929l-0.5-2.573c-0.031-0.161-2.974-16.25,10.852-27.753
                c0.202-0.191,6.116-5.585,18.674-5.585c0.102,0,0.203,0,0.305,0.001V1.566L52.495,24.07L30.113,46.574V32.937
                c-0.662-0.098-1.725-0.213-3.071-0.213c-5.761,0-16.657,2.073-24.918,15.953L0.783,50.929z M29.808,17.018
                c-11.776,0-17.297,5.033-17.352,5.084C2.911,30.046,1.878,40.274,2.004,45.149C14.365,27.091,31.127,31.077,31.348,31.13
                l0.765,0.185v10.411L49.674,24.07L32.113,6.413v10.654l-1.03-0.03C30.65,17.024,30.226,17.018,29.808,17.018z"/>
            </g>
          </svg>
        </div>`);

      desc = desc.replace(/(\+|\-)?(\d+|!|\*) ?:/g, x => {
        var emph = "";
        var actEmph = false;
        if (x.charAt(0) === '!') {
          emph = "!";
          actEmph = true;
        }
        else if (x === "0:" || x === "0 :" || x === "*:" || x === "* :")
          emph = " ";
        else {
          var i = 0;
          for (; x.charAt(i) !== ":"; i++)
            emph += x.charAt(i);
        }
        return `<span class="sensuba-card-effect-emphasis${ actEmph ? " sensuba-card-effect-action" : "" }">${emph}</span>:`
      });

      desc = desc.replace(/\*(\+|\-)?(\d+|!)\*/g, x => {
        var emph = "";
        var i = 1;
        for (; x.charAt(i) !== "*"; i++)
          emph += x.charAt(i);
        return `<span class="sensuba-card-effect-show">${emph}</span>`
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
    case "trap":
    case "spell": result = <Spell id={this.props.id} src={src} classColor={colorIdToClassName(this.props.src.idColor)}/>; break;
    case "artifact": result = <Artifact id={this.props.id} src={src} classColor={colorIdToClassName(this.props.src.idColor)}/>; break;
    default: break;
  	}

  	return result;
  }
}