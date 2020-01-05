import React, { Component } from 'react';
import Card from './Card';
import './CardsPage.css';
import { Input, Label } from 'reactstrap';
import Nav from '../Nav';
import User from '../../services/User';
import Library from '../../services/Library';
import sorter from '../../utility/CollectionSorter';
import Lightbox from '../utility/Lightbox';
import Loader from '../utility/Loader';
import Booster from './shop/Booster';

export default class CardsPage extends Component {

	constructor (props) {

		super(props);

    this.state = {
      advsearch: false
    };

    window.search = name => sorter.filter(this.cardlist, {orderBy: "name", search: name});
    window.update = () => Library.clear();
	}

  get cardlist () {

    if (!User.isConnected())
      return this.props.cards;

    var url = new URL(window.location.href);
    var mode = url.searchParams.get("mode");
    switch (mode) {
      case "custom": return this.props.customs;
      case "collection": return this.props.cards.filter(card => card.idEdition === 1).concat(this.props.collection.map(el => Object.assign({count: el.number}, this.props.cards.find(card => card.idCardmodel === el.idCardmodel))));
      default: return this.props.cards;
    }
  }

  get filter () {

    var url = new URL(window.location.href);

    var colors = url.searchParams.get("colors");
    colors = colors ? colors.split(",").filter(color => !isNaN(color)).map(color => parseInt(color, 10)) : [];

    return {
      mode: url.searchParams.get("mode") || "",
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
      rarity: url.searchParams.get("rarity") || "",
      cost: url.searchParams.get("cost") || "",
      costop: url.searchParams.get("costop") || "",
      atk: url.searchParams.get("atk") || "",
      atkop: url.searchParams.get("atkop") || "",
      hp: url.searchParams.get("hp") || "",
      hpop: url.searchParams.get("hpop") || "",
      range: url.searchParams.get("range") || "",
      rangeop: url.searchParams.get("rangeop") || ""
    };
  }

  get isCustoms () {

    var url = new URL(window.location.href);
    var mode = url.searchParams.get("mode");
    return mode && mode === "custom";
  }

  changeMode (mode) {

    //var s = new URL(window.location.href).search;
    //this.props.history.push(`/cards${s ? (s + (customs ? "&customs=1") : "") : (customs ? "&customs" : )}`)
    this.search(this.filter, mode);

    //this.setState({customs: customs});
  }

  filterCards (cards) {

    cards = sorter.filter(cards, this.filter);

    return cards;
  }

  focus (card) {

    this.props.history.push(`/cards${card ? "/focus/" + card : ""}${new URL(window.location.href).search}`);
  }

  shop (value) {

    this.props.history.push(`/cards${value ? "/shop" : ""}${new URL(window.location.href).search}`);
  }

  reload () {

    window.update();
    window.location.reload();
  }

  search (filter, mode, page) {

    filter.colors = filter.colors.length > 0 ? filter.colors.reduce((acc, color) => acc + "," + color) : "";
    filter.mode = mode;
    filter.page = page;

    var suf = "";

    var addFilter = param => {

      if (param === "orderBy" && filter[param] === "type")
        return;
      if (filter[param] !== undefined && filter[param] !== null && filter[param].length !== 0) {
        suf += suf.length === 0 ? "?" : "&";
        suf += param + "=" + filter[param];
      }
    }
    ["mode", "search", "archetype", "colors", "edition", "type", "name", "description", "anime", "flavour", "rarity", "cost", "costop", "atk", "atkop", "hp", "hpop", "range", "rangeop", "orderBy", "page"].forEach(param => addFilter(param));
    /*if (customs) {
        suf += suf.length === 0 ? "?" : "&";
        suf += "customs=1";
    }*/
    

    this.props.history.push(`/cards${suf}${suf[suf.length-1] === ' ' ? "&" : ""}`);
  }

  buyBooster (edition) {

    if (this.state.waiting || User.getData().credit < 100)
      return;
    var props = {
      type: "booster",
      edition: edition
    }
    this.setState({waiting: true})
    this.props.api.shop(props, (e) => {
      var opening = e.map(nc => { return {no:nc, recto: false}; });
      this.setState({waiting: false, opening});
      User.updateCredit(User.getData().credit - 100);
    }, () => this.setState({waiting: false}))
  }

  buyCard (id, price) {

    if (this.state.waiting || User.getData().credit < price)
      return;
    var props = {
      type: "buycard",
      cardmodel: id
    }
    this.setState({waiting: true})
    this.props.api.shop(props, (e) => {
      this.setState({waiting: false});
      this.props.updateCollection();
      User.updateCredit(User.getData().credit - price);
    }, () => this.setState({waiting: false}))
  }

  sellCard (id, price) {

    if (this.state.waiting)
      return;
    var props = {
      type: "sellcard",
      cardmodel: id
    }
    this.setState({waiting: true})
    this.props.api.shop(props, (e) => {
      this.setState({waiting: false});
      this.props.updateCollection();
      User.updateCredit(User.getData().credit + price);
    }, () => this.setState({waiting: false}))
  }
  
  render() {

    var isCustoms = this.isCustoms;
    var cards = this.cardlist;
    cards = this.filterCards(cards);
    window.result = cards;
    var nocards = cards.length;

    var url = new URL(window.location.href);
    var mode = url.searchParams.get("mode");

    var page = 0;
    if (nocards > 100) {
      var fpage = url.searchParams.get("page") || "";
      if (fpage && !isNaN(fpage))
        page = parseInt(fpage, 10);
      cards = cards.slice(100*page, 100*(page+1));
    }

    var goPage = p => this.search(this.filter, mode, p);

    var editFilter = attr => (e => {
      var plus = {};
      plus[attr] = e.target.value;
      this.search(Object.assign({}, this.filter, plus), mode);
    });

    var colorFilter = color => (e => {
      var colors = this.filter.colors.slice();
      if (e.target.checked)
        colors.push(color);
      else
        colors = colors.filter(c => c !== color);
      this.search(Object.assign(this.filter, {colors: colors}), mode);
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

              var pbuy = 0, psell = 0;
              switch (cf[0].rarity) {
              case 1: pbuy = 20; psell = 4; break;
              case 2: pbuy = 40; psell = 8; break;
              case 3: pbuy = 80; psell = 16; break;
              case 4: pbuy = 200; psell = 20; break;
              default: break;
              }

              return <div>
                  <div className="sensuba-card-focus">{ cf.map((card, i) => <Card switch="manual" key={i} src={card}/>) }</div>
                  { User.isConnected() && cf[0].rarity ? <div className="sensuba-focus-shop">
                    <div onClick={() => this.buyCard(cf[0].idCardmodel, pbuy)} className="shop-button">Buy <span className="sensuba-credits">{ pbuy }</span></div>
                    { this.props.collection.find(card => card.idCardmodel.toString() === this.props.focus) ? <div onClick={() => this.sellCard(cf[0].idCardmodel, psell)} className="shop-button">Sell <span className="sensuba-credits">{ psell }</span></div> : <span/> }
                  </div> : <span/> }
                </div>
            })()
          }
        </Lightbox>
        {
          User.isConnected() ?
          <Lightbox className="sensuba-shop-box" open={this.props.shop === true} onClose={() => this.shop(false)}>
            <h2>Upgrade your collection !</h2>
            <h3>10 cards / <span className="sensuba-credits">100</span></h3>
            <div className="sensuba-shop-credits">
              <span className="sensuba-credits">{ User.getData().credit }</span>
            </div>
            <div onClick={() => this.buyBooster(2)} className="sensuba-shop-booster"><Booster expansion="Classic" theme="lightblue" img="/game/back.png"/></div>
            {/*<div onClick={() => this.buyBooster(3)} className="sensuba-shop-booster"><Booster expansion="Guardian Star" theme="darksky" img="/guardianstar.jpg"/></div>*/}
          </Lightbox> : <span/>
        }
        {
          this.state.opening ?
          <div id="opening-cards-container" className="lightbox-container">
            <div className="lightbox-inner">
              <div className="opening-card-list">
                {
                  this.state.opening.map((c, i) => <div onClick={() => {
                    var opening = this.state.opening;
                    if (opening[i].recto)
                      return;
                    opening[i].recto = true;
                    this.setState({opening});
                    if (opening.every(c => c.recto))
                      setTimeout(() => this.props.updateCollection(), 1500);
                  }} key={i} className="sensuba-opening-card"><Card src={c.recto ? this.props.cards.find(off => off.idCardmodel === c.no) : undefined}/></div>)
                }
              </div>
            </div>
          </div> : <span/>
        }
        {
          this.state.waiting ?
          <div className="lightbox-container">
            <div className="lightbox-inner">
              <Loader/>
            </div>
          </div> : <span/>
        }
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          {
            User.isConnected() ?
            <div className="card-collection-choicer">
              <div className="vintage-radio">
                <Input id="official-card-collection" type="radio" name="card-collection" onChange={() => this.changeMode()} defaultChecked={mode === undefined || mode === null} value={mode === undefined || mode === null}/>
                <Label for="official-card-collection">Official</Label>
                <Input id="collection-card-collection" type="radio" name="card-collection" onChange={() => this.changeMode("collection")} defaultChecked={mode === "collection"} value={mode === "collection"}/>
                <Label for="collection-card-collection">Collection</Label>
                <Input id="custom-card-collection" type="radio" name="card-collection" onChange={() => this.changeMode("custom")} defaultChecked={mode === "custom"} value={mode === "custom"}/>
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
                <option value="1">Basic</option>
                <option value="2">Classic</option>
                <option value="3">Next to come</option>
              </select>
              <div>
                { (nocards > 0 ? <b>{ nocards }</b> : "No")}{ " card" + (nocards > 1 ? "s" : "") + " found" }
              </div>
            </div>
            <div className="third-section">
              <Label for="sensuba-search-type" className="sensuba-search-select-label">Type</Label>
              <select value={this.filter.type} id="sensuba-search-type" onChange={editFilter("type").bind(this)}>
                <option value="">---</option>
                <option value="hero">Hero</option>
                <option value="figure">Figure</option>
                <option value="spell">Spell</option>
                <option value="artifact">Artifact</option>
              </select>
              <Label for="sensuba-search-rarity" className="sensuba-search-select-label">Rarity</Label>
              <select value={this.filter.rarity} id="sensuba-search-rarity" onChange={editFilter("rarity").bind(this)}>
                <option value="">---</option>
                <option value="basic">Basic</option>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
              </select>
              <div className="sensuba-search-page">
               {
                nocards > 100 ?
                <div>
                  <span className={"sensuba-search-page-button" + (page > 0 ? "" : " sensuba-search-page-locked-button")} onClick={page > 0 ? () => goPage(page-1) : () => {}}>&#11164;</span>
                  <span className="sensuba-search-page-text">{ (page + 1) + " / " + (Math.floor((nocards-1) / 100 + 1)) }</span>
                  <span className={"sensuba-search-page-button" + (page < Math.floor((nocards-1) / 100) ? "" : " sensuba-search-page-locked-button")} onClick={page < Math.floor((nocards-1) / 100) ? () => goPage(page+1) : () => {}}>&#11166;</span> 
                </div>
                : <span/>
               }
              </div>
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
                <option value="name">Name</option>
                <option value="mana">Mana</option>
                <option value="atk">ATK</option>
                <option value="hp">HP</option>
                <option value="range">Range</option>
                <option value="color">Color</option>
                <option value="rarity">Rarity</option>
                <option value="anime">Anime</option>
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
                <Input id="sensuba-search-archetype" value={this.filter.archetype} type="text" placeholder="Archetype" onChange={editFilter("archetype").bind(this)}/>
                <Input id="sensuba-search-anime" value={this.filter.anime} type="text" placeholder="Anime" onChange={editFilter("anime").bind(this)}/>
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
                cards.map((card, i) => <a className="sensuba-card-link" key={card.idCardmodel} onClick={() => this.focus(card.idCardmodel)}>
                  <Card switch="timer" src={card}/>
                  { mode === "collection" && !(card.count === undefined && card.cardType === "hero") && card.count !== 1 ? <div className="sensuba-card-count">{"x" + (card.count || 2)}</div> : <span/> }
                  </a>)
            }
          </div>
          {
            mode === "collection" ?
            <button className="editor-button" onClick={() => this.shop(true)}>
              <img className="editor-button-img" src="/shop.png" alt="shop-chan"/>
              <div className="editor-button-text">Buy cards</div>
            </button>
            : <span/>
          }
          {
            isCustoms ?
            <button className="editor-button" onClick={() => this.props.history.push('/cards/editor')}>
              <img className="editor-button-img" src="/editor.png" alt="editor-chan"/>
              <div className="editor-button-text">Open the editor</div>
            </button>
            : <span/>
          }
          <div className="bottom-info"><span onClick={() => this.reload()}>Reload the cards</span></div>
      	</main>
      </div>
    );
  }
}