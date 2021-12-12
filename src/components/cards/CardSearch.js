import React, { Component } from 'react';
import './CardsPage.css';
import { Input, Label } from 'reactstrap';
import User from '../../services/User';

export default class CardSearch extends Component {

	constructor (props) {

		super (props);

    this.timers = {};

    this.state = {
      advsearch: false
    };
	}

  search (filter, mode, page) {

    filter.colors = filter.colors.length > 0 ? filter.colors.reduce((acc, color) => acc + "," + color) : "";
    filter.mode = mode;
    filter.page = page;

    var display = new URL(window.location.href).searchParams.get("display") || this.props.size;
    if (display !== this.props.size)
      filter.display = display;

    var suf = "";

    var addFilter = param => {

      if (param === "orderBy" && filter[param] === "type")
        return;
      if (filter[param] !== undefined && filter[param] !== null && filter[param].length !== 0) {
        suf += suf.length === 0 ? "?" : "&";
        suf += param + "=" + encodeURIComponent(filter[param]);
      }
    }
    ["mode", "search", "archetype", "colors", "edition", "type", "name", "description", "anime", "flavour", "rarity", "mana", "manaop", "atk", "atkop", "hp", "hpop", "range", "rangeop", "orderBy", "page", "display", "collection"].forEach(param => addFilter(param));
    /*if (customs) {
        suf += suf.length === 0 ? "?" : "&";
        suf += "customs=1";
    }*/
    

    this.props.history.push(`/cards${suf}${suf[suf.length-1] === ' ' ? "&" : ""}`);
  }

  render() {

    var mode = this.props.mode;

    var editText = attr => (e => {

      this.timers[attr] = Date.now();
      var val = e.target.value;
      setTimeout(() => {
        if (Date.now() - this.timers[attr] < 790)
          return;
        editFilter(attr)(val);
      }, 800)
    })

    var editFilter = attr => (e => {
      var plus = {};
      plus[attr] = e.target ? e.target.value : e;
      this.search(Object.assign({}, this.props.filter, plus), mode);
    });

    var colorFilter = color => (e => {
      var colors = this.props.filter.colors.slice();
      if (e.target.checked)
        colors.push(color);
      else
        colors = colors.filter(c => c !== color);
      this.search(Object.assign(this.props.filter, {colors: colors}), mode);
    });

    var goPage = p => this.search(this.props.filter, mode, p);

    return (
    	<div className="sensuba-card-search-box">
      <div className="sensuba-card-search">
            <div className="third-section">
              <Input id="sensuba-search-text" defaultValue={this.props.filter.search} type="text" placeholder="Recherche" onChange={editText("search").bind(this)}/>
              <Label for="sensuba-search-edition" className="sensuba-search-select-label">Edition</Label>
              <select value={this.props.filter.edition} id="sensuba-search-edition" onChange={editFilter("edition").bind(this)}>
                <option value="">---</option>
                <option value="1">Basique</option>
                <option value="2">Classique</option>
                <option value="3">Etoile Gardienne</option>
                <option value="4">Grand Bal Masqué</option>
                <option value="5">Croisée des Horizons</option>
                <option value="6">Académie Supermagique</option>
                { (() => { if (User.isConnected() && User.getData().authorization > 3) return <option value="7">A venir</option> })() }
              </select>
              <div>
                { (this.props.count > 0 ? <b>{ this.props.count }</b> : "Aucune")}{ " carte" + (this.props.count > 1 ? "s" : "") + " trouvée" + (this.props.count > 1 ? "s" : "") }
              </div>
            </div>
            <div className="third-section">
              <Label for="sensuba-search-type" className="sensuba-search-select-label">Type</Label>
              <select value={this.props.filter.type} id="sensuba-search-type" onChange={editFilter("type").bind(this)}>
                <option value="">---</option>
                <option value="hero">Héros</option>
                <option value="figure">Figure</option>
                <option value="spell">Sort</option>
                <option value="secret">Secret</option>
                <option value="artifact">Artéfact</option>
              </select>
              <Label for="sensuba-search-rarity" className="sensuba-search-select-label">Rareté</Label>
              <select value={this.props.filter.rarity} id="sensuba-search-rarity" onChange={editFilter("rarity").bind(this)}>
                <option value="">---</option>
                <option value="basic">Basique</option>
                <option value="common">Commune</option>
                <option value="uncommon">Insolite</option>
                <option value="rare">Rare</option>
              </select>
              <div className="sensuba-search-page">
               {
                this.props.display && this.props.count > this.props.display ?
                <div>
                  <span className={"sensuba-search-page-button" + (this.props.page > 0 ? "" : " sensuba-search-page-locked-button")} onClick={this.props.page > 0 ? () => goPage(this.props.page-1) : () => {}}>&#11164;</span>
                  <span className="sensuba-search-page-text">{ (this.props.page + 1) + " / " + (Math.floor((this.props.count-1) / this.props.display + 1)) }</span>
                  <span className={"sensuba-search-page-button" + (this.props.page < Math.floor((this.props.count-1) / this.props.display) ? "" : " sensuba-search-page-locked-button")} onClick={this.props.page < Math.floor((this.props.count-1) / this.props.display) ? () => goPage(this.props.page+1) : () => {}}>&#11166;</span> 
                </div>
                : <span/>
               }
              </div>
            </div>
            <div className="third-section">
              <div className="colors-group">
                <Input id="neutral-mana" type="checkbox" checked={this.props.filter.colors.includes(0)} name="sensuba-color" onChange={colorFilter(0)}/>
                <Label for="neutral-mana"/>
                <Input id="white-mana" type="checkbox" checked={this.props.filter.colors.includes(1)} name="sensuba-color" onChange={colorFilter(1)}/>
                <Label for="white-mana"/>
                <Input id="red-mana" type="checkbox" checked={this.props.filter.colors.includes(2)} name="sensuba-color" onChange={colorFilter(2)}/>
                <Label for="red-mana"/>
                <Input id="blue-mana" type="checkbox" checked={this.props.filter.colors.includes(3)} name="sensuba-color" onChange={colorFilter(3)}/>
                <Label for="blue-mana"/>
                <Input id="green-mana" type="checkbox" checked={this.props.filter.colors.includes(4)} name="sensuba-color" onChange={colorFilter(4)}/>
                <Label for="green-mana"/>
                <Input id="black-mana" type="checkbox" checked={this.props.filter.colors.includes(5)} name="sensuba-color" onChange={colorFilter(5)}/>
                <Label for="black-mana"/>
                {
                  User.isConnected() ?
                  <div>
                  <Input id="collection-check" type="checkbox" className={this.props.filter.collection} name="sensuba-color" onChange={e => this.search(Object.assign(this.props.filter, {collection: this.props.filter.collection ? (this.props.filter.collection === "true" ? "false" : undefined) : "true"}), mode)}/>
                  <Label for="collection-check"/>
                  </div> : <span/>
                }
                
              </div>
              <Label for="sensuba-search-orderby" className="sensuba-search-select-label">Trier par</Label>
              <select value={this.props.filter.orderBy} id="sensuba-search-orderby" onChange={editFilter("orderBy").bind(this)}>
                <option value="type">Type</option>
                <option value="name">Nom</option>
                <option value="mana">Mana</option>
                <option value="atk">ATK</option>
                <option value="hp">PV</option>
                <option value="range">Portée</option>
                <option value="color">Couleur</option>
                <option value="rarity">Rareté</option>
                <option value="edition">Edition</option>
                <option value="anime">Anime</option>
              </select>
              <div className="sensuba-search-interact" onClick={e => this.setState({advsearch: !this.state.advsearch})}>Plus d'options &#10148;</div>
            </div>
          </div>
          {
            this.state.advsearch ?
            <div className="sensuba-card-search">
              <div className="third-section">
                <Input id="sensuba-search-name" defaultValue={this.props.filter.name} type="text" placeholder="Nom" onChange={editText("name").bind(this)}/>
                <Input id="sensuba-search-description" defaultValue={this.props.filter.description} type="text" placeholder="Description" onChange={editText("description").bind(this)}/>
                <Input id="sensuba-search-archetype" defaultValue={this.props.filter.archetype} type="text" placeholder="Archétype" onChange={editText("archetype").bind(this)}/>
                <Input id="sensuba-search-anime" defaultValue={this.props.filter.anime} type="text" placeholder="Anime" onChange={editText("anime").bind(this)}/>
              </div>
              <div className="two-thirds-section">
                <div className="third-section">
                  <div className="sensuba-search-label-section"><div className="sensuba-search-select-label">Mana</div></div>
                  <div className="sensuba-search-label-section"><div className="sensuba-search-select-label">ATK</div></div>
                  <div className="sensuba-search-label-section"><div className="sensuba-search-select-label">PV</div></div>
                  <div className="sensuba-search-label-section"><div className="sensuba-search-select-label">Portée</div></div>
                </div>
                <div className="third-section">
                  <select value={this.props.filter.manaop} id="sensuba-search-mana-op" onChange={editFilter("manaop").bind(this)}>
                    <option value=""></option>
                    <option value="1">&gt;</option>
                    <option value="2">&ge;</option>
                    <option value="3">&#61;</option>
                    <option value="4">&ne;</option>
                    <option value="5">&le;</option>
                    <option value="6">&lt;</option>
                  </select>
                  <select value={this.props.filter.atkop} id="sensuba-search-atk-op" onChange={editFilter("atkop").bind(this)}>
                    <option value=""></option>
                    <option value="1">&gt;</option>
                    <option value="2">&ge;</option>
                    <option value="3">&#61;</option>
                    <option value="4">&ne;</option>
                    <option value="5">&le;</option>
                    <option value="6">&lt;</option>
                  </select>
                  <select value={this.props.filter.hpop} id="sensuba-search-hp-op" onChange={editFilter("hpop").bind(this)}>
                    <option value=""></option>
                    <option value="1">&gt;</option>
                    <option value="2">&ge;</option>
                    <option value="3">&#61;</option>
                    <option value="4">&ne;</option>
                    <option value="5">&le;</option>
                    <option value="6">&lt;</option>
                  </select>
                  <select value={this.props.filter.rangeop} id="sensuba-search-range-op" onChange={editFilter("rangeop").bind(this)}>
                    <option value=""></option>
                    <option value="1">&gt;</option>
                    <option value="2">&ge;</option>
                    <option value="3">&#61;</option>
                    <option value="4">&ne;</option>
                    <option value="5">&le;</option>
                    <option value="6">&lt;</option>
                  </select>
                </div>
                <div className="third-section">
                  <Input id="sensuba-search-mana" defaultValue={this.props.filter.mana} type="text" onChange={editText("mana").bind(this)}/>
                  <Input id="sensuba-search-atk" defaultValue={this.props.filter.atk} type="text" onChange={editText("atk").bind(this)}/>
                  <Input id="sensuba-search-hp" defaultValue={this.props.filter.hp} type="text" onChange={editText("hp").bind(this)}/>
                  <Input id="sensuba-search-range" defaultValue={this.props.filter.range} type="text" onChange={editText("range").bind(this)}/>
                </div>
              </div>
            </div>
            : <span/>
          }
          </div>
    );
  }
}