import React, { Component } from 'react';
import { Input } from 'reactstrap'
import Card from '../../cards/Card';
import sorter from '../../../utility/CollectionSorter';
import packages from './draft-packages.json';

export default class HeroSelector extends Component {

	constructor (props) {

		super(props);

    var heroes = sorter.filter(this.props.cards, { type: "hero", orderBy: "name" });

    if (this.draft) 
      heroes = this.generateDraftChoice(heroes);
    else heroes = heroes.map(h => [h]);

    this.state = { heroes: heroes }
	}

  get draft () {

    return this.props.draft;
  }

  generateDraftChoice (heroes) {

    var pickRandomHero = list => list[Math.floor(Math.random()*list.length)];

      var draftlist = [];
      for (let i = 0; i < 3;) {
        let draftnewhero = pickRandomHero(heroes);

        if (draftlist.map(other => other[0]).some(other => (other.idColor === draftnewhero.idColor || other.idColor === draftnewhero.idColor2) && (other.idColor2 === draftnewhero.idColor || other.idColor2 === draftnewhero.idColor2)))
          continue;

        let validpackages = packages.filter(p => p.hero === draftnewhero.idCardmodel)

        if (validpackages.length <= 0)
          continue;

        let pk = validpackages[Math.floor(Math.random()*validpackages.length)];
        let shuffled = [...pk.body].sort(() => Math.random() - 0.5);

        draftlist.push([draftnewhero, ...shuffled.slice(0, 3).map(no => this.props.cards.find(c => c.idCardmodel === no))]);
        i++;
      }
      return draftlist;
  }

  componentDidMount () {

    if (this.state.heroes.length > 0) {
      if (this.draft)
        this.setFocus(1)
      else
        this.setFocus(Math.floor(Math.random() * Math.floor(this.state.heroes.length)));
    }
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

  searchFor (hero) {

    if (hero.length === 0)
      return;
    var index = this.state.heroes.findIndex(h => h[0].nameCard.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(hero.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
    if (index >= 0) 
      this.setFocus(index);
    else {
      index = this.state.heroes.findIndex(h => h[0].nameCard.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(hero.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
      if (index >= 0)
        this.setFocus(index);
    }
  }

	render () {

		return (
		<div>
			<h1 className="big-text">Choisissez un héros</h1>
      <div id="hero-selector" className={"hero-selector" + (this.draft ? " draft-hero" : "")}>
        <div id="hero-list" className="hero-list">
        {
          this.state.heroes.map((h, i) => <div key={i} id={`select-hero-${i}`} className="select-hero-card" onClick={() => {
            if (document.getElementById(`select-hero-${i}`).classList.contains('main-hero-card'))
              this.props.onSelect(h[0].idCardmodel, h.length > 1 ? h.slice(1).map(c => c.idCardmodel) : undefined);
            else
              this.setFocus(i);
          }}>
            <Card switch="timer" src={h[0]}/>
            {
              this.draft && <div className="draft-package">
              {
                this.state.heroes[i].slice(1).map(card => <Card src={card}/>)
              }
            </div>
            }
          </div>)
        }
        </div>
        {
          !this.draft &&
          <div className="search-hero-wrapper">
            <Input onChange={e => this.searchFor(e.target.value)} type="text"/>
          </div>
        }
      </div>
	  </div>
		)
	}
}