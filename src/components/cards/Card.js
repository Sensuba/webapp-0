import React, { Component } from 'react';
import Hero from './Hero';
import Figure from './Figure';
import Spell from './Spell';
import Secret from './Secret';
import World from './World';
import Trial from './Trial';
import Artifact from './Artifact';
import './Card.css';

export default class Card extends Component {

  render() {

    if (!this.props.src)
      return <img className="sensuba-card" src="/game/back.png" alt="back"/>

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

      if (!desc)
        return;

      desc = escapeHtml(desc);

      desc = desc.replace(/\n/g, '</div><div class="sensuba-card-effect-p">');

      desc = desc.replace(/initiative|furie|hâte|exaltation|niveau supérieur|niveau inférieur|létal|talent:?|camoufle(r)?|camouflé(e)?(s)?|empoisonné(e)?(s)?|poison|insensible(s)?|frénésie:?|dernière volonté(:)?|dernières volontés(:)?|silence|bouclier(s)?|don du vol|(dé)?gèle(nt)?|gelé(e)?(s)?|surcharge|condition:|auto:/gi, x => `<b>${x}</b>`);

      desc = desc.replace(/(\+|-)?(\d+|!|\*) ?:/g, x => {
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

      desc = desc.replace(/\*(\+|-)?(\d+|!)\*/g, x => {
        var emph = "";
        var i = 1;
        for (; x.charAt(i) !== "*"; i++)
          emph += x.charAt(i);
        return `<span class="sensuba-card-effect-show">${emph}</span>`
      });
      desc = desc.replace(/\&#039;/g,`<span class="sensuba-card-effect-apostrophe"></span>`);
      if (this.props.src.lb || (this.props.src.ol && this.props.src.overload && this.props.src.ol >= this.props.src.overload))
        desc = desc.replace(/[^>]\d+[^<]/g, x => {
          let before = "", number = "", after = "";
          let state = 0;
          let isDigit = c => c >= '0' && c <= '9';
          for (let i = 0; i < x.length; i++) {
            let c = x.charAt(i);
            switch(state) {
              case 0:
                if (isDigit(c)) { number += c; state++; }
                else before += c;
                break;
              case 1:
                if (!isDigit(c)) { after += c; state++; }
                else number += c;
                break;
              case 2:
                after += c;
                break;
              default: break;
            }
          }
          number = parseInt(number, 10) + Math.floor(this.props.src.lb || (this.props.src.ol / this.props.src.overload));
          return `${before}<span class="sensuba-card-effect-limit-break">${number}</span>${after}`
        });

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
      
      desc = `<div class="sensuba-card-effect-p">${desc} ${(this.props.src.ol && this.props.src.overload) ? `<span class="sensuba-card-effect-overload">[${this.props.src.ol}]</span>` : ""}</div>`;

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

    if (src.cardType === "hero" && !src.lv2)
      src.lv2 = { atk: 200, range: 1, description: "", fontSize: 1.3, overload: 0 }
    if (src.cardType === "hero" && !src.lvmax)
      src.lvmax = { atk: 200, range: 1, description: "", fontSize: 1.3, overload: 0 }
    if (this.props.src.cardType === "hero") {
      src.lv2 = Object.assign(src.lv2, {htmlDescription: descHTML(src.lv2.description)});
      src.lvmax = Object.assign(src.lvmax, {htmlDescription: descHTML(src.lvmax.description)});
    }
    if (this.props.src.cardType === "trial")
      src.htmlDescription2 = descHTML(src.description2);

    var holographic = this.props.holographic !== undefined ? this.props.holographic : this.props.src.holographic ;

  	switch (this.props.src.cardType) {
    case "hero": result = <Hero model={this.props.model} holographic={holographic} className={this.props.className} level={this.props.level} switch={this.props.switch} id={this.props.id} src={src} classColor={{color1: colorIdToClassName(this.props.src.idColor), color2: colorIdToClassName(this.props.src.idColor2)}}/>; break;
  	case "figure": result = <Figure model={this.props.model} holographic={holographic} className={this.props.className} id={this.props.id} src={src} classColor={colorIdToClassName(this.props.src.idColor)}/>; break;
    case "spell": result = <Spell model={this.props.model} holographic={holographic} className={this.props.className} id={this.props.id} src={src} classColor={colorIdToClassName(this.props.src.idColor)}/>; break;
    case "artifact": result = <Artifact model={this.props.model} holographic={holographic} className={this.props.className} id={this.props.id} src={src} classColor={colorIdToClassName(this.props.src.idColor)}/>; break;
    case "secret": result = <Secret model={this.props.model} holographic={holographic} className={this.props.className} id={this.props.id} src={src} classColor={colorIdToClassName(this.props.src.idColor)}/>; break;
    case "trial": result = <Trial model={this.props.model} holographic={holographic} className={this.props.className} id={this.props.id} src={src} classColor={colorIdToClassName(this.props.src.idColor)}/>; break;
    case "world": result = <World model={this.props.model} holographic={holographic} className={this.props.className} id={this.props.id} src={src} classColor={colorIdToClassName(this.props.src.idColor)}/>; break;
    default: break;
  	}

  	return result;
  }
}