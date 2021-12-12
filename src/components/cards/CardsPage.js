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
import CardSearch from './CardSearch';

const PAGE_SIZE = 50;

export default class CardsPage extends Component {

	constructor (props) {

		super(props);

    this.state = {};

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
      case "collection": return this.props.cards.filter(card => card.idEdition === 1).concat(this.props.collection.map(el => Object.assign({count: el.number, holographic: el.holographic}, this.props.cards.find(card => card.idCardmodel === el.idCardmodel))));
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
      mana: url.searchParams.get("mana") || "",
      manaop: url.searchParams.get("manaop") || "",
      atk: url.searchParams.get("atk") || "",
      atkop: url.searchParams.get("atkop") || "",
      hp: url.searchParams.get("hp") || "",
      hpop: url.searchParams.get("hpop") || "",
      range: url.searchParams.get("range") || "",
      rangeop: url.searchParams.get("rangeop") || "",
      collection: url.searchParams.get("collection") || ""
    };
  }

  get isCustoms () {

    var url = new URL(window.location.href);
    var mode = url.searchParams.get("mode");
    return mode && mode === "custom";
  }

  changeMode (mode) {

    //var s = new URL(window.location.href).search;
    var nf = this.filter;
    nf.mode = mode;
    var suf = "";
    Object.keys(nf).forEach(k => {
      if (k === "orderBy" && nf[k] === "type")
        return;
      if (nf[k]) {
        suf += suf.length === 0 ? "?" : "&";
        suf += k + "=" + encodeURIComponent(nf[k]);
      }
    })
    this.props.history.push(`/cards${suf}${suf[suf.length-1] === ' ' ? "&" : ""}`);
    //this.search(this.filter, mode);

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

    if (User.isConnected() && this.props.collection && this.filter.collection) {
      if (this.filter.collection === "true")
        cards = cards.filter(card => card.idEdition === 1 || this.props.collection.find(c => card.idCardmodel.toString() === c.idCardmodel.toString()));
      else
        cards = cards.filter(card => !(card.idEdition === 1 || this.props.collection.find(c => card.idCardmodel.toString() === c.idCardmodel.toString())));
    }
    
    window.result = cards;
    var nocards = cards.length;

    var url = new URL(window.location.href);
    var mode = url.searchParams.get("mode");

    var page = 0;
    var displaysize = url.searchParams.get("display") || PAGE_SIZE;
    if (nocards > displaysize) {
      var fpage = url.searchParams.get("page") || "";
      if (fpage && !isNaN(fpage))
        page = parseInt(fpage, 10);
      cards = cards.slice(displaysize*page, displaysize*(page+1));
    }

    var goPage = nopage => {

      console.log(this.props.history);

      //this.props.history.push(`/cards${suf}${suf[suf.length-1] === ' ' ? "&" : ""}`);
    }

    return (
      <div>
        <Lightbox className="sensuba-focus-box" open={this.props.focus !== undefined} onClose={() => this.focus(null)}>
          {
            (() => {

              if (!this.props.focus) return <span/>;

              var cf = [this.props.cards.find(card => card.idCardmodel.toString() === this.props.focus)];

              if (!cf || !cf[0]) return;

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
              case 1: pbuy = 25; psell = 4; break;
              case 2: pbuy = 50; psell = 8; break;
              case 3: pbuy = 100; psell = 16; break;
              case 4: pbuy = 200; psell = 20; break;
              default: break;
              }

              var shop = false, shopcount = 0;

              if (User.isConnected() && cf[0].rarity && cf[0].idEdition <= 6) {
                shop = true;
                let shopcollec = this.props.collection.find(card => card.idCardmodel.toString() === this.props.focus);
                if (shopcollec)
                  shopcount = shopcollec.number;
              }

              return <div>
                  <div className="sensuba-card-focus">{ cf.map((card, i) => <Card switch="manual" key={i} src={card} holographic={mode === "collection" && cards.find(c => c.idCardmodel.toString() === this.props.focus) && cards.find(c => c.idCardmodel.toString() === this.props.focus).holographic === 1}/>) }</div>
                  { shop ? <div className="sensuba-focus-shop">
                    { <div className="sensuba-shop-count">{"x" + shopcount}</div> }
                    { shopcount < 1 || (shopcount < 2 && cf[0].rarity !== 4) ? <div onClick={() => this.buyCard(cf[0].idCardmodel, pbuy)} className="shop-button">Acheter <span className="sensuba-credits">{ pbuy }</span></div> : <span/> }
                    { shopcount ? <div onClick={() => this.sellCard(cf[0].idCardmodel, psell)} className="shop-button">Vendre <span className="sensuba-credits">{ psell }</span></div> : <span/> }
                  </div> : <span/> }
                </div>
            })()
          }
        </Lightbox>
        {
          User.isConnected() ?
          <Lightbox className="sensuba-shop-box" open={this.props.shop === true} onClose={() => this.shop(false)}>
            <h2>Améliorez votre collection !</h2>
            <h3>10 cartes / <span className="sensuba-credits">100</span></h3>
            <div className="sensuba-shop-credits">
              <span className="sensuba-credits">{ User.getData().credit }</span>
            </div>
            <div className="sensuba-shop-boosters">
              <div onClick={() => this.buyBooster(2)} className="sensuba-shop-booster"><Booster expansion="Classic" theme="lightblue" img="/game/back.png"/></div>
              <div onClick={() => this.buyBooster(3)} className="sensuba-shop-booster"><Booster expansion="Etoile Gardienne" theme="darksky" img="/guardianstar.jpg"/></div>
              <div onClick={() => this.buyBooster(4)} className="sensuba-shop-booster"><Booster expansion="Grand Bal Masqué" theme="hot" img="/masquerade.jpg"/></div>
              <div onClick={() => this.buyBooster(5)} className="sensuba-shop-booster"><Booster expansion="Croisée des Horizons" theme="aquamarine" img="/lands.png"/></div>
              <div onClick={() => this.buyBooster(6)} className="sensuba-shop-booster"><Booster expansion="Academie Supermagique" theme="purple" img="/magic.jpg"/></div>
            </div>
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
                <Label for="official-card-collection">Officiel</Label>
                <Input id="collection-card-collection" type="radio" name="card-collection" onChange={() => this.changeMode("collection")} defaultChecked={mode === "collection"} value={mode === "collection"}/>
                <Label for="collection-card-collection">Collection</Label>
                <Input id="custom-card-collection" type="radio" name="card-collection" onChange={() => this.changeMode("custom")} defaultChecked={mode === "custom"} value={mode === "custom"}/>
                <Label for="custom-card-collection">Personnalisé</Label>
              </div>
            </div>
            : <span/>
          }
          <CardSearch size={PAGE_SIZE} filter={this.filter} count={nocards} display={displaysize} page={page} mode={mode} history={this.props.history}/>
          
          <div className="sensuba-card-container">
      		  {
              isCustoms ?
                cards.map(card => <a className="sensuba-card-link" onClick={() => this.props.history.push(`/cards/editor/${card.idCardmodel}`)} key={card.idCardmodel}><Card switch="timer" key={card.idCardmodel} src={card} holographic={false}/></a>)
                :
                cards.map((card, i) => <a className="sensuba-card-link" key={card.idCardmodel} onClick={() => this.focus(card.idCardmodel)}>
                  <Card switch="timer" src={card} holographic={card.holographic === 1}/>
                  { mode === "collection" && !(card.count === undefined && card.cardType === "hero") && card.count !== 1 ? <div className="sensuba-card-count">{"x" + (card.count || 2)}</div> : <span/> }
                  </a>)
            }
          </div>
              <div className="sensuba-search-page sensuba-search-page-bottom">
               {
                displaysize && nocards > displaysize ?
                <div>
                  <span className={"sensuba-search-page-button" + (page > 0 ? "" : " sensuba-search-page-locked-button")} onClick={page > 0 ? () => goPage(page-1) : () => {}}>&#11164;</span>
                  <span className="sensuba-search-page-text">{ (page + 1) + " / " + (Math.floor((nocards-1) / displaysize + 1)) }</span>
                  <span className={"sensuba-search-page-button" + (page < Math.floor((nocards-1) / displaysize) ? "" : " sensuba-search-page-locked-button")} onClick={page < Math.floor((nocards-1) / displaysize) ? () => goPage(page+1) : () => {}}>&#11166;</span> 
                </div>
                : <span/>
               }
              </div>
          {/*<div className="sensuba-search-page sensuba-search-page-bottom">
           {
            nocards > displaysize ?
            <div>
              <span className={"sensuba-search-page-button" + (page > 0 ? "" : " sensuba-search-page-locked-button")} onClick={page > 0 ? () => goPage(page-1) : () => {}}>&#11164;</span>
              <span className="sensuba-search-page-text">{ (page + 1) + " / " + (Math.floor((nocards-1) / displaysize + 1)) }</span>
              <span className={"sensuba-search-page-button" + (page < Math.floor((nocards-1) / displaysize) ? "" : " sensuba-search-page-locked-button")} onClick={page < Math.floor((nocards-1) / displaysize) ? () => goPage(page+1) : () => {}}>&#11166;</span> 
            </div>
            : <span/>
           }
          </div> */}
          {
            mode === "collection" || (!mode && User.isConnected()) ?
            <button className="editor-button" onClick={() => this.shop(true)}>
              <img className="editor-button-img" src="/shop.png" alt="shop-chan"/>
              <div className="editor-button-text">Acheter des cartes</div>
            </button>
            : <span/>
          }
          {
            isCustoms ?
            <button className="editor-button" onClick={() => this.props.history.push('/cards/editor')}>
              <img className="editor-button-img" src="/editor.png" alt="editor-chan"/>
              <div className="editor-button-text">Ouvrir l'éditeur</div>
            </button>
            : <span/>
          }
          <div className="bottom-info"><span onClick={() => this.reload()}>Recharger les cartes</span></div>
      	</main>
      </div>
    );
  }
}