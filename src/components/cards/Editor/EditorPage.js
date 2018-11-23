import React, { Component } from 'react';
import Nav from '../../Nav';
import { Input, Label } from 'reactstrap';
import Design from './EditorDesign';
import Blueprint from './Blueprint/EditorBlueprint';
import './EditorPage.css';

export default class EditorPage extends Component {

  defaultCard = {
      nameCard: "Penguin",
      anime: "Anime",
      imgLink: "https://image.ibb.co/jbcTNJ/penguin.png",
      idColor: 0,
      cardType: "figure",
      archetypes: [],
      mana: 0,
      description: "",
      fontSize: 1.3,
      flavourText: "",
      illustrator: "",
      atk: 200,
      hp: 200,
      range: 1,
      overload: 0
  };

	constructor (props) {

		super(props);
      
    var card = Object.assign({}, this.defaultCard);
    
    if (this.props.card !== undefined) {
      var ccl = sessionStorage.getItem("customcardlist");
      if (ccl === null) this.props.history.push("/cards");
      var found = JSON.parse(sessionStorage.getItem("customcardlist")).find(el => el.idCardmodel === parseInt(this.props.card, 10));
      if (found === undefined || found === null) {
        this.props.history.push("/cards");
        return;
      }
      card = JSON.parse(window.atob(found.supercode));
    }

    this.state = { card, token: [], tab: "design" };
	}

  get currentCard() {

    var cc = this.state.card;
    this.state.token.forEach(el => cc = cc.tokens[el]);
    return cc;
  }

  set currentCard(value) {

    if (this.state.token.length === 0) {
      this.setState({card: value});
      return;
    }
    var cc = this.state.card;
    this.state.token.slice(0,-1).forEach(el => cc = cc.tokens[el]);
    cc.tokens[this.state.token[this.state.token.length-1]] = value;
    this.setState({card: this.state.card});
  }

  newToken() {
      
    var token = Object.assign({}, this.defaultCard);

    this.currentCard.tokens = this.currentCard.tokens || [];
    this.currentCard.tokens.push(token);

    var c = this.state.token;
    c.push(this.currentCard.tokens.length-1);

    this.setState({card: this.state.card, token: c});
  }

  saveCard() {

    if (this.saved)
      return;

    var shadow = this.state.card;
    delete shadow.htmlDescription;
    if (shadow.cardType === "hero") {
      if (shadow.lv2)
        delete shadow.lv2.htmlDescription;
      if (shadow.lvmax)
        delete shadow.lvmax.htmlDescription;
    }

    var supercode = window.btoa(JSON.stringify(shadow));

    var params = { supercode };

    if (this.props.card !== undefined)
      params.id = this.props.card;

    this.props.api.saveCustomCards(params, () => {

      sessionStorage.removeItem("customcardlist");
      this.props.history.push('/cards');
    })

    this.saved = true;

  }

  deleteCard() {

    if (this.state.token.length > 0) {

      var t = this.state.token[this.state.token.length-1];
      this.setState({token: this.state.token.slice(0,-1)}, () => {
        var cc = Object.assign({}, this.currentCard);
        cc.tokens = this.currentCard.tokens.filter((el, i) => i !== t);
        this.currentCard = cc;
      });
    } else {

      this.props.api.deleteCustomCards(this.props.card, () => {

        sessionStorage.removeItem("customcardlist");
        this.props.history.push('/cards');
      })
    }
  }

  changeType(newType) {

    var filter = [];
    var basis = {
        archetypes: [],
        mana: 0,
        atk: 200,
        hp: 200,
        range: 1
    };
    switch (newType) {
    case "figure": filter = ["idColor2"]; break;
    case "hero": filter = ["archetypes", "mana"]; break;
    case "spell": filter = ["idColor2", "archetypes", "atk", "hp", "range"]; break;
    case "trap": filter = ["idColor2", "archetypes", "atk", "hp", "range"]; break;
    case "artifact": filter = ["idColor2", "archetypes", "atk", "range"]; break;
    default: break;
    }

    var n = Object.assign({}, basis, this.currentCard, {cardType: newType});
    filter.forEach(f => delete n[f]);
    if (newType === "hero")
      n.idColor2 = 0;
    
    this.currentCard = n;
  }
  
  render() {

    /*var editAttribute = attr => (e => {
      var plus = {};
      this.currentCard[attr] = e.target.value;
      if (typeof plus[attr] === 'string') plus[attr].replace(/[\u0250-\ue007]/g, '');
      this.setState({card: this.state.card});
    });

    var changeArchetypes = (ar1, ar2) => {
      var ars = [];
      if (ar1 && ar1 !== "")
        ars.push(ar1.toLowerCase());
      if (ar2 && ar2 !== "")
        ars.push(ar2.toLowerCase());
      this.currentCard.archetypes = ars;
      this.setState({card: this.state.card});
    };

    var changeColor = idColor => () => {
      this.currentCard.idColor = idColor;
      this.setState({card: this.state.card});
    };

    var changeColor2 = idColor => () => {
      this.currentCard.idColor2 = idColor;
      this.setState({card: this.state.card});
    };*/

    var shadow = this.currentCard;
    delete shadow.htmlDescription;

    //var superCode = window.btoa(JSON.stringify(shadow));

    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main id="editor-page">
          <div className="editor-menu">
            <div className="editor-menu-tabs">
              <Input id="design-tab" type="radio" onChange={() => this.setState({tab: "design"})} checked={this.state.tab === "design"}/>
              <Label for="design-tab">Design</Label>
              <Input id="blueprint-tab" type="radio" onChange={() => this.setState({tab: "blueprint"})} checked={this.state.tab === "blueprint"}/>
              <Label for="blueprint-tab">Blueprint</Label>
            </div>
            <Design
              card={this.state.card}
              token={this.state.token}
              update={card => this.setState({card})}
              defaultCard={this.defaultCard}
              save={() => this.saveCard()}
              delete={() => this.deleteCard()}
              isEdit={this.props.card !== undefined}
              setToken={token => this.setState({token})}
              className={this.state.tab === "design" ? "" : "invisible"}
            />
            <Blueprint
              key={JSON.stringify(this.state.token)}
              save={bp => {
                this.currentCard.blueprint = bp;
                this.setState({card: this.state.card, tab: "design"});
              }}
              className={this.state.tab === "blueprint" ? "" : "invisible"}
            />
          </div>
      	</main>
      </div>
    );
  }
}