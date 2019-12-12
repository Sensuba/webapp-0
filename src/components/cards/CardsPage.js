import React, { Component } from 'react';
import Card from './Card';
import './CardsPage.css';
import { Input, Label } from 'reactstrap';
import Nav from '../Nav';
import User from '../../services/User';
import Library from '../../services/Library';
import sorter from '../../utility/CollectionSorter';
import Lightbox from '../utility/Lightbox';

export default class CardsPage extends Component {

	constructor (props) {

		super(props);

    this.state = {
      advsearch: false
    };

    window.search = name => sorter.filter(this.isCustoms ? this.props.customs : this.props.cards, {orderBy: "name", search: name});
    window.update = () => Library.clear();
	}

  get filter () {

    var url = new URL(window.location.href);

    var colors = url.searchParams.get("colors");
    colors = colors ? colors.split(",").filter(color => !isNaN(color)).map(color => parseInt(color, 10)) : [];

    return {
      orderBy: url.searchParams.get("orderBy") || "type",
      colors: colors,
      search: url.searchParams.get("search") || "",
      archetype: url.searchParams.get("archetype") || "",
      type: url.searchParams.get("type") || "",
      edition: url.searchParams.get("edition") || "",
      name: url.searchParams.get("name") || "",
      description: url.searchParams.get("description") || "",
      anime: url.searchParams.get("anime") || "",
      flavour: url.searchParams.get("flavour") || "",
      cost: url.searchParams.get("cost") || "",
      costop: url.searchParams.get("costop") || "",
      atk: url.searchParams.get("atk") || "",
      atkop: url.searchParams.get("atkop") || "",
      hp: url.searchParams.get("hp") || "",
      hpop: url.searchParams.get("hpop") || "",
      range: url.searchParams.get("range") || "",
      rangeop: url.searchParams.get("rangeop") || "",
    };
  }

  get isCustoms () {

    var url = new URL(window.location.href);
    return url.searchParams.get("customs");
  }

  displayCustoms (customs) {

    //var s = new URL(window.location.href).search;
    //this.props.history.push(`/cards${s ? (s + (customs ? "&customs=1") : "") : (customs ? "&customs" : )}`)
    this.search(this.filter, customs);

    //this.setState({customs: customs});
  }

  filterCards (cards) {

    cards = sorter.filter(cards, this.filter);

    return cards;
  }

  focus (card) {

    this.props.history.push(`/cards${card ? "/focus/" + card : ""}${new URL(window.location.href).search}`);
  }

  search (filter, customs) {

    filter.colors = filter.colors.length > 0 ? filter.colors.reduce((acc, color) => acc + "," + color) : "";

    var suf = "";

    var addFilter = param => {

      if (param === "orderBy" && filter[param] === "type")
        return;
      if (filter[param] !== undefined && filter[param].length !== 0) {
        suf += suf.length === 0 ? "?" : "&";
        suf += param + "=" + filter[param];
      }
    }
    ["search", "archetype", "colors", "edition", "type", "name", "description", "anime", "flavour", "cost", "costop", "atk", "atkop", "hp", "hpop", "range", "rangeop", "orderBy"].forEach(param => addFilter(param));
    if (customs) {
        suf += suf.length === 0 ? "?" : "&";
        suf += "customs=1";
    }
    

    this.props.history.push(`/cards${suf}${suf[suf.length-1] === ' ' ? "&" : ""}`);
  }
  
  render() {

    var isCustoms = this.isCustoms;
    var cards = isCustoms ? this.props.customs : this.props.cards;
    cards = this.filterCards(cards);
    window.result = cards;

    var editFilter = attr => (e => {
      var plus = {};
      plus[attr] = e.target.value;
      this.search(Object.assign({}, this.filter, plus), isCustoms);
    });

    var colorFilter = color => (e => {
      var colors = this.filter.colors.slice();
      if (e.target.checked)
        colors.push(color);
      else
        colors = colors.filter(c => c !== color);
      this.search(Object.assign(this.filter, {colors: colors}), isCustoms);
    });

    return (
      <div>
        <Lightbox className="sensuba-focus-box" open={this.props.focus !== undefined} onClose={() => this.focus(null)}>
          {
            (() => {

              if (!this.props.focus) return <span/>;

              var cf = [this.props.cards.find(card => card.idCardmodel.toString() === this.props.focus)];

              var addTokens = parent => {
                if (parent.tokens) {
                  parent.tokens.forEach(token => {
                    cf.push(token);
                    addTokens(token);
                  });
                }
              }
              addTokens(cf[0]);

              return <div className="sensuba-card-focus">{ cf.map((card, i) => <Card switch="manual" key={i} src={card}/>) }</div>;
            })()
          }
        </Lightbox>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          {
            User.isConnected() ?
            <div className="card-collection-choicer">
              <div className="vintage-radio">
                <Input id="official-card-collection" type="radio" name="card-collection" onChange={() => this.displayCustoms(false)} defaultChecked={!isCustoms} value={!isCustoms}/>
                <Label for="official-card-collection">Official</Label>
                <Input id="custom-card-collection" type="radio" name="card-collection" onChange={() => this.displayCustoms(true)} defaultChecked={isCustoms} value={isCustoms}/>
                <Label for="custom-card-collection">Customs</Label>
              </div>
            </div>
            : <span/>
          }
          <div className="sensuba-card-search">
            <div className="third-section">
              <Input id="sensuba-search-text" value={this.filter.search} type="text" placeholder="Search" onChange={editFilter("search").bind(this)}/>
              <Label for="sensuba-search-edition" className="sensuba-search-select-label">Edition</Label>
              <select value={this.filter.edition} id="sensuba-search-edition" onChange={editFilter("edition").bind(this)}>
                <option value="">---</option>
                <option value="1">1st edition</option>
                <option value="2">Next to come</option>
              </select>
              <div>
                { (cards.length > 0 ? <b>{ cards.length }</b> : "No")}{ " card" + (cards.length > 1 ? "s" : "") + " found" }
              </div>
            </div>
            <div className="third-section">
              <Input id="sensuba-search-archetype" value={this.filter.archetype} type="text" placeholder="Archetype" onChange={editFilter("archetype").bind(this)}/>
              <Label for="sensuba-search-type" className="sensuba-search-select-label">Type</Label>
              <select value={this.filter.type} id="sensuba-search-type" onChange={editFilter("type").bind(this)}>
                <option value="">---</option>
                <option value="hero">Hero</option>
                <option value="figure">Figure</option>
                <option value="spell">Spell</option>
                <option value="artifact">Artifact</option>
              </select>
            </div>
            <div className="third-section">
              <div className="colors-group">
                <Input id="neutral-mana" type="checkbox" checked={this.filter.colors.includes(0)} name="sensuba-color" onChange={colorFilter(0)}/>
                <Label for="neutral-mana"/>
                <Input id="white-mana" type="checkbox" checked={this.filter.colors.includes(1)} name="sensuba-color" onChange={colorFilter(1)}/>
                <Label for="white-mana"/>
                <Input id="red-mana" type="checkbox" checked={this.filter.colors.includes(2)} name="sensuba-color" onChange={colorFilter(2)}/>
                <Label for="red-mana"/>
                <Input id="blue-mana" type="checkbox" checked={this.filter.colors.includes(3)} name="sensuba-color" onChange={colorFilter(3)}/>
                <Label for="blue-mana"/>
                <Input id="green-mana" type="checkbox" checked={this.filter.colors.includes(4)} name="sensuba-color" onChange={colorFilter(4)}/>
                <Label for="green-mana"/>
                <Input id="black-mana" type="checkbox" checked={this.filter.colors.includes(5)} name="sensuba-color" onChange={colorFilter(5)}/>
                <Label for="black-mana"/>
              </div>
              <Label for="sensuba-search-orderby" className="sensuba-search-select-label">Order by</Label>
              <select value={this.filter.orderBy} id="sensuba-search-orderby" onChange={editFilter("orderBy").bind(this)}>
                <option value="type">Type</option>
                <option value="mana">Mana</option>
                <option value="atk">ATK</option>
                <option value="hp">HP</option>
                <option value="range">Range</option>
              </select>
              <div className="sensuba-search-interact" onClick={e => this.setState({advsearch: !this.state.advsearch})}>More filters &#10148;</div>
            </div>
          </div>
          {
            this.state.advsearch ?
            <div className="sensuba-card-search">
              <div className="third-section">
                <Input id="sensuba-search-name" value={this.filter.name} type="text" placeholder="Name" onChange={editFilter("name").bind(this)}/>
                <Input id="sensuba-search-description" value={this.filter.description} type="text" placeholder="Description" onChange={editFilter("description").bind(this)}/>
                <Input id="sensuba-search-anime" value={this.filter.anime} type="text" placeholder="Anime" onChange={editFilter("anime").bind(this)}/>
                <Input id="sensuba-search-flavour" value={this.filter.flavour} type="text" placeholder="Flavour text" onChange={editFilter("flavour").bind(this)}/>
              </div>
              <div className="two-thirds-section">
                <div className="third-section">
                  <div className="sensuba-search-label-section"><div className="sensuba-search-select-label">Cost</div></div>
                  <div className="sensuba-search-label-section"><div className="sensuba-search-select-label">ATK</div></div>
                  <div className="sensuba-search-label-section"><div className="sensuba-search-select-label">HP</div></div>
                  <div className="sensuba-search-label-section"><div className="sensuba-search-select-label">Range</div></div>
                </div>
                <div className="third-section">
                  <select value={this.filter.costop} id="sensuba-search-cost-op" onChange={editFilter("costop").bind(this)}>
                    <option value=""></option>
                    <option value="1">&gt;</option>
                    <option value="2">&ge;</option>
                    <option value="3">&#61;</option>
                    <option value="4">&ne;</option>
                    <option value="5">&le;</option>
                    <option value="6">&lt;</option>
                  </select>
                  <select value={this.filter.atkop} id="sensuba-search-atk-op" onChange={editFilter("atkop").bind(this)}>
                    <option value=""></option>
                    <option value="1">&gt;</option>
                    <option value="2">&ge;</option>
                    <option value="3">&#61;</option>
                    <option value="4">&ne;</option>
                    <option value="5">&le;</option>
                    <option value="6">&lt;</option>
                  </select>
                  <select value={this.filter.hpop} id="sensuba-search-hp-op" onChange={editFilter("hpop").bind(this)}>
                    <option value=""></option>
                    <option value="1">&gt;</option>
                    <option value="2">&ge;</option>
                    <option value="3">&#61;</option>
                    <option value="4">&ne;</option>
                    <option value="5">&le;</option>
                    <option value="6">&lt;</option>
                  </select>
                  <select value={this.filter.rangeop} id="sensuba-search-range-op" onChange={editFilter("rangeop").bind(this)}>
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
                  <Input id="sensuba-search-cost" value={this.filter.cost} type="text" onChange={editFilter("cost").bind(this)}/>
                  <Input id="sensuba-search-atk" value={this.filter.atk} type="text" onChange={editFilter("atk").bind(this)}/>
                  <Input id="sensuba-search-hp" value={this.filter.hp} type="text" onChange={editFilter("hp").bind(this)}/>
                  <Input id="sensuba-search-range" value={this.filter.range} type="text" onChange={editFilter("range").bind(this)}/>
                </div>
              </div>
            </div>
            : <span/>
          }
          <div className="sensuba-card-container">
      		  {
              isCustoms ?
                cards.map(card => <a className="sensuba-card-link" onClick={() => this.props.history.push(`/cards/editor/${card.idCardmodel}`)} key={card.idCardmodel}><Card switch="timer" key={card.idCardmodel} src={card}/></a>)
                :
                cards.map((card, i) => <a className="sensuba-card-link" key={card.idCardmodel} onClick={() => this.focus(card.idCardmodel)}><Card switch="timer" src={card}/></a>)
            }
          </div>
          {
            isCustoms ?
            <button className="editor-button" onClick={() => this.props.history.push('/cards/editor')}>
              <img className="editor-button-img" src="/editor.png" alt="editor-chan"/>
              <div className="editor-button-text">Open the editor</div>
            </button>
            : <span/>
          }
      	</main>
      </div>
    );
  }
}