import React, { Component } from 'react';
import Card from './Card';
import './CardsPage.css';
import { Input, Label } from 'reactstrap';
import Nav from '../Nav';
import User from '../../services/User';
import sorter from '../../utility/CollectionSorter';
import Lightbox from '../utility/Lightbox';

export default class CardsPage extends Component {

	constructor (props) {

		super(props);

    var cardlist = [], ccardlist = [];

    if (sessionStorage.getItem("cardlist") !== null)
      cardlist = JSON.parse(sessionStorage.getItem("cardlist"));
    else
      this.props.api.getCards(cards => {
        var c = cards.map(card => this.readCard(card));
        sessionStorage.setItem("cardlist", JSON.stringify(c));
        this.setState({officialCards: c});
      });

    if (sessionStorage.getItem("customcardlist") !== null)
      ccardlist = JSON.parse(sessionStorage.getItem("customcardlist"));
    else
      this.props.api.getCustomCards(cards => {
        var c = cards.map(card => this.readCard(card));
        sessionStorage.setItem("customcardlist", JSON.stringify(c));
        this.setState({customCards: c})
      });

    this.state = {
      officialCards: cardlist,
      customCards: ccardlist,
      customs: false,
      loadedCustoms: false,
      filter: {orderBy: "type", colors: []},
      focus: null
    };

    
	}

  readCard (card) {

    return Object.assign(card, JSON.parse(window.atob(card.supercode)));
  }

  displayCustoms (customs) {

    if (customs && !this.state.loadedCustoms) {

      this.props.api.getCustomCards(cards => this.setState({customCards: cards.map(card => this.readCard(card))}));
    }

    this.setState({
      customs: customs,
      loadedCustoms: this.state.loadedCustoms || customs
    });
  }

  filterCards (cards) {

    cards = sorter.filter(cards, this.state.filter);

    //console.log(cards)

    return cards;
  }
  
  render() {

    var cards = this.state.customs ? this.state.customCards : this.state.officialCards;
    cards = this.filterCards(cards);

    var editFilter = attr => (e => {
      var plus = {};
      plus[attr] = e.target.value;
      this.setState({filter: Object.assign(this.state.filter, plus)});
    });

    var colorFilter = color => (e => {
      var colors = this.state.filter.colors;
      if (e.target.checked)
        colors.push(color);
      else
        colors = colors.filter(c => c !== color);
      this.setState({filter: Object.assign(this.state.filter, {colors: colors})});
    });

    return (
      <div>
        <Lightbox className="sensuba-focus-box" open={this.state.focus !== null} onClose={() => this.setState({focus: null})}>
          {
            (() => {

              if (this.state.focus === null) return <span/>;

              var cf = [cards[this.state.focus]];

              var addTokens = parent => {
                if (parent.tokens) {
                  cf = cf.concat(parent.tokens);
                  parent.tokens.forEach(addTokens);
                }
              }
              addTokens(cf[0]);

              return <div className="sensuba-card-focus">{ cf.map((card, i) => <Card key={i} src={card}/>) }</div>;
            })()
          }
        </Lightbox>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          {
            User.isConnected() ?
            <div className="card-collection-choicer">
              <div className="vintage-radio">
                <Input id="official-card-collection" type="radio" name="card-collection" onChange={() => this.displayCustoms(false)} defaultChecked/>
                <Label for="official-card-collection">Official</Label>
                <Input id="custom-card-collection" type="radio" name="card-collection" onChange={() => this.displayCustoms(true)}/>
                <Label for="custom-card-collection">Customs</Label>
              </div>
            </div>
            : <span/>
          }
          <div className="sensuba-card-search">
            <div className="third-section">
              <Input id="sensuba-search-text" type="text" placeholder="Search" onChange={editFilter("search").bind(this)}/>
              <Label for="sensuba-search-edition" className="sensuba-search-select-label">Edition</Label>
              <select id="sensuba-search-edition" onChange={editFilter("edition").bind(this)}>
                <option value="">---</option>
                <option value="1">1st edition</option>
                <option value="2">Next to come</option>
              </select>
              <div>
                { (cards.length > 0 ? <b>{ cards.length }</b> : "No")}{ " card" + (cards.length > 1 ? "s" : "") + " found" }
              </div>
            </div>
            <div className="third-section">
              <Input id="sensuba-search-archetype" type="text" placeholder="Archetype" onChange={editFilter("archetype").bind(this)}/>
              <Label for="sensuba-search-type" className="sensuba-search-select-label">Type</Label>
              <select id="sensuba-search-type" onChange={editFilter("type").bind(this)}>
                <option value="">---</option>
                <option value="hero">Hero</option>
                <option value="figure">Figure</option>
                <option value="spell">Spell</option>
                <option value="artifact">Artifact</option>
              </select>
            </div>
            <div className="third-section">
              <div className="colors-group">
                <Input id="neutral-mana" type="checkbox" name="sensuba-color" onChange={colorFilter(0)}/>
                <Label for="neutral-mana"/>
                <Input id="white-mana" type="checkbox" name="sensuba-color" onChange={colorFilter(1)}/>
                <Label for="white-mana"/>
                <Input id="red-mana" type="checkbox" name="sensuba-color" onChange={colorFilter(2)}/>
                <Label for="red-mana"/>
                <Input id="blue-mana" type="checkbox" name="sensuba-color" onChange={colorFilter(3)}/>
                <Label for="blue-mana"/>
                <Input id="green-mana" type="checkbox" name="sensuba-color" onChange={colorFilter(4)}/>
                <Label for="green-mana"/>
                <Input id="black-mana" type="checkbox" name="sensuba-color" onChange={colorFilter(5)}/>
                <Label for="black-mana"/>
              </div>
              <Label for="sensuba-search-orderby" className="sensuba-search-select-label">Order by</Label>
              <select id="sensuba-search-orderby" onChange={editFilter("orderBy").bind(this)}>
                <option value="type">Type</option>
                <option value="mana">Mana</option>
                <option value="atk">ATK</option>
                <option value="hp">HP</option>
                <option value="range">Range</option>
              </select>
            </div>
          </div>
          <div className="sensuba-card-container">
      		  {
              this.state.customs ?
                cards.map(card => <a className="sensuba-card-link" onClick={() => this.props.history.push(`/cards/editor/${card.idCardmodel}`)} key={card.idCardmodel}><Card key={card.idCardmodel} src={card}/></a>)
                :
                cards.map((card, i) => <a className="sensuba-card-link" key={card.idCardmodel} onClick={() => this.setState({focus: i})}><Card src={card}/></a>)
            }
          </div>
          {
            this.state.customs ?
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