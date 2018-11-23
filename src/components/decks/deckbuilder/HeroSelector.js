import React, { Component } from 'react';
import Card from '../../cards/Card';
import sorter from '../../../utility/CollectionSorter';

export default class HeroSelector extends Component {

	constructor (props) {

		super(props);

    var heroes = sorter.filter(this.props.cards, { type: "hero", orderBy: "name" });

    this.state = { heroes: heroes }
	}

  componentDidMount () {

    if (this.state.heroes.length > 0)
     this.setFocus(Math.floor(Math.random() * Math.floor(this.state.heroes.length)));
  }

  setFocus (i) {

    var shift = val => {

      if (val < 0)
        return this.state.heroes.length + val;
      return val % this.state.heroes.length;
    }

    var list = document.getElementsByClassName("select-hero-card");

    for (var k = 0; k < list.length; k++) {
      list[k].classList.remove('main-hero-card');
      list[k].classList.remove('shadow-hero-card');
      list[k].classList.remove('small-shadow-hero-card');
    }

    //var selector = document.getElementById("hero-selector");

    document.getElementById(`select-hero-${i}`).classList.add('main-hero-card');
    if (i > 0)
    document.getElementById(`select-hero-${shift(i-1)}`).classList.add('shadow-hero-card');
    if (i < this.state.heroes.length-1)
    document.getElementById(`select-hero-${shift(i+1)}`).classList.add('shadow-hero-card');
    if (i > 1)
    document.getElementById(`select-hero-${shift(i-2)}`).classList.add('small-shadow-hero-card');
    if (i < this.state.heroes.length-2)
    document.getElementById(`select-hero-${shift(i+2)}`).classList.add('small-shadow-hero-card');
  }

	render () {

		return (
		<div>
			<h1 className="big-text">Pick a hero</h1>
      <div id="hero-selector" className="hero-selector">
      {
        this.state.heroes.map((h, i) => <div key={i} id={`select-hero-${i}`} className="select-hero-card" onClick={() => {
          if (document.getElementById(`select-hero-${i}`).classList.contains('main-hero-card'))
            this.props.onSelect(h);
          else
            this.setFocus(i);
        }}><Card switch="timer" src={h}/></div>)
      }
      </div>
	  </div>
		)
	}
}