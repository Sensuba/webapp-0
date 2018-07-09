import React, { Component } from 'react';
import Card from '../Card';
import Nav from '../../Nav';
import { Form, Input, FormGroup, Label, Button } from 'reactstrap';
import './EditorPage.css';

export default class EditorPage extends Component {

	constructor (props) {

		super(props);
      
    var card = {
        nameCard: "Penguin",
        anime: "Anime",
        imgLink: "https://image.ibb.co/jbcTNJ/penguin.png",
        idColor: 0,
        idColor2: 0,
        cardType: "figure",
        archetypes: [],
        mana: 0,
        description: "",
        fontSize: 1.3,
        flavourText: "",
        atk: 200,
        hp: 200,
        range: 1
    };
    
    if (this.props.card !== undefined) {
      var ccl = localStorage.getItem("customcardlist");
      if (ccl === null) this.props.history.push("/cards");
      var found = JSON.parse(localStorage.getItem("customcardlist")).find(el => el.idCardmodel === parseInt(this.props.card, 10));
      if (found === undefined || found === null) this.props.history.push("/cards");
      card = JSON.parse(window.atob(found.supercode));
    }

    this.state = { card };
	}

  saveCard() {

    var supercode = window.btoa(JSON.stringify(this.state.card));

    var params = { supercode };

    if (this.props.card !== undefined)
      params.id = this.props.card;

    this.props.api.saveCustomCards(params, () => {

      localStorage.removeItem("customcardlist");
      this.props.history.push('/cards');
    })

  }

  deleteCard() {

    this.props.api.deleteCustomCards(this.props.card, () => {

      localStorage.removeItem("customcardlist");
      this.props.history.push('/cards');
    })
  }
  
  render() {

    var editAttribute = attr => (e => {
      var plus = {};
      plus[attr] = e.target.value;
      this.setState({card: Object.assign(this.state.card, plus)});
    });

    var changeArchetypes = (ar1, ar2) => {
      var ars = [];
      if (ar1 && ar1 !== "")
        ars.push(ar1.toLowerCase());
      if (ar2 && ar2 !== "")
        ars.push(ar2.toLowerCase());
      this.setState({card: Object.assign(this.state.card, {archetypes: ars})});
    };

    var changeType = newType => () => this.setState({card: Object.assign(this.state.card, {cardType: newType})});

    var changeColor = idColor => () => this.setState({card: Object.assign(this.state.card, {idColor: idColor})});

    var changeColor2 = idColor => () => this.setState({card: Object.assign(this.state.card, {idColor2: idColor})});

    var superCode = window.btoa(JSON.stringify(this.state.card));

    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <div className="half-section">
            <div className="editor-box">
              <Form>
                <FormGroup>
                  <div className="types-group modern-radio">
                    <Input id="hero-card" type="radio" name="sensuba-type" onChange={changeType("hero")} checked={this.state.card.cardType === "hero"}/>
                    <Label for="hero-card">Hero</Label>
                    <Input id="figure-card" type="radio" name="sensuba-type" onChange={changeType("figure")} checked={this.state.card.cardType === "figure"}/>
                    <Label for="figure-card">Figure</Label>
                    <Input id="spell-card" type="radio" name="sensuba-type" onChange={changeType("spell")} checked={this.state.card.cardType === "spell"}/>
                    <Label for="spell-card">Spell</Label>
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="form-card-name">Name</Label>
                  <Input id="form-card-name" type="text" value={this.state.card.nameCard} onChange={editAttribute("nameCard").bind(this)}/>
                </FormGroup>
                <FormGroup>
                    <Label for="form-card-anime">Anime</Label>
                    <Input id="form-card-anime" type="text" value={this.state.card.anime} onChange={editAttribute("anime").bind(this)}/>
                </FormGroup>
                <FormGroup>
                  <div className="half-section">
                    <Label>Color</Label>
                    <div className="colors-group">
                      <Input id="neutral-mana" type="radio" name="sensuba-color" onChange={changeColor(0)} checked={this.state.card.idColor === 0}/>
                      <Label for="neutral-mana"/>
                      <Input id="white-mana" type="radio" name="sensuba-color" onChange={changeColor(1)} checked={this.state.card.idColor === 1}/>
                      <Label for="white-mana"/>
                      <Input id="red-mana" type="radio" name="sensuba-color" onChange={changeColor(2)} checked={this.state.card.idColor === 2}/>
                      <Label for="red-mana"/>
                      <Input id="blue-mana" type="radio" name="sensuba-color" onChange={changeColor(3)} checked={this.state.card.idColor === 3}/>
                      <Label for="blue-mana"/>
                      <Input id="green-mana" type="radio" name="sensuba-color" onChange={changeColor(4)} checked={this.state.card.idColor === 4}/>
                      <Label for="green-mana"/>
                      <Input id="black-mana" type="radio" name="sensuba-color" onChange={changeColor(5)} checked={this.state.card.idColor === 5}/>
                      <Label for="black-mana"/>
                    </div>
                  </div>
                  {
                    this.state.card.cardType !== "hero" ?
                      <div className="half-section">
                        <Label for="form-card-mana">Mana</Label>
                        <Input id="form-card-mana" type="number" min="0" max="9" value={this.state.card.mana} onChange={editAttribute("mana").bind(this)}/>
                      </div>
                      :
                      <div className="half-section">
                        <Label>Color 2</Label>
                        <div className="colors-group">
                          <Input id="neutral-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(0)} checked={this.state.card.idColor2 === 0}/>
                          <Label for="neutral-mana-2"/>
                          <Input id="white-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(1)} checked={this.state.card.idColor2 === 1}/>
                          <Label for="white-mana-2"/>
                          <Input id="red-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(2)} checked={this.state.card.idColor2 === 2}/>
                          <Label for="red-mana-2"/>
                          <Input id="blue-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(3)} checked={this.state.card.idColor2 === 3}/>
                          <Label for="blue-mana-2"/>
                          <Input id="green-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(4)} checked={this.state.card.idColor2 === 4}/>
                          <Label for="green-mana-2"/>
                          <Input id="black-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(5)} checked={this.state.card.idColor2 === 5}/>
                          <Label for="black-mana-2"/>
                        </div>
                      </div>
                  }
                </FormGroup>
                {
                  this.state.card.cardType === "figure" ?
                  <FormGroup>
                    <div className="half-section">
                      <Label for="form-card-archetype1">Archetype 1</Label>
                      <Input id="form-card-archetype1" type="text" value={this.state.card.archetypes.length > 0 ? this.state.card.archetypes[0] : ""} onChange={e => changeArchetypes(e.target.value, document.getElementById("form-card-archetype2").value)}/>
                    </div>
                    <div className="half-section">
                      <Label for="form-card-archetype2">Archetype 2</Label>
                      <Input id="form-card-archetype2" type="text" value={this.state.card.archetypes.length > 1 ? this.state.card.archetypes[1] : ""} onChange={e => changeArchetypes(document.getElementById("form-card-archetype1").value, e.target.value)}/>
                    </div>
                  </FormGroup> : <span/>
                }
                {
                  this.state.card.cardType !== "spell" ?
                  <FormGroup>
                    <div className="third-section">
                      <Label for="form-card-atk">ATK</Label>
                      <Input id="form-card-atk" type="number" min="0" max="9999" step="100" value={this.state.card.atk} onChange={editAttribute("atk").bind(this)}/>
                    </div>
                    <div className="third-section">
                      <Label for="form-card-hp">HP</Label>
                      <Input id="form-card-hp" type="number" min="0" max="9999" step="100" value={this.state.card.hp} onChange={editAttribute("hp").bind(this)}/>
                    </div>
                    <div className="third-section">
                      <Label for="form-card-range">Range</Label>
                      <Input id="form-card-range" type="number" min="1" max="3" value={this.state.card.range} onChange={editAttribute("range").bind(this)}/>
                    </div>
                  </FormGroup> : <span/>
                }
                <FormGroup>
                  <div className="two-thirds-section">
                    <Label for="form-card-description">Description</Label>
                    <Input id="form-card-description" type="textarea" value={this.state.card.description} onChange={editAttribute("description").bind(this)}/>
                  </div>
                  <div className="third-section">
                    <Label for="form-card-font-size">Font size</Label>
                    <Input id="form-card-font-size" type="number" min="1" max="1.3" step="0.1" value={this.state.card.fontSize} onChange={editAttribute("fontSize").bind(this)}/>
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="form-card-flavour">Flavour text</Label>
                  <Input id="form-card-flavour" type="textarea" value={this.state.card.flavourText} onChange={editAttribute("flavourText").bind(this)}/>
                </FormGroup>
                <FormGroup>
                  <Label for="form-card-img">Image link</Label>
                  <Input id="form-card-img" type="url" value={this.state.card.imgLink} onChange={editAttribute("imgLink").bind(this)}/>
                </FormGroup>
              </Form>
            </div>
          </div>
          <div className="half-section">
            <div className="editor-card-visual">
              <Card id="card-preview" src={this.state.card}/>
              <Button onClick={this.saveCard.bind(this)}>{ this.props.card !== undefined ? "Edit" : "Save" }</Button>
              { this.props.card !== undefined ? <Button color="danger" onClick={this.deleteCard.bind(this)}>Delete</Button> : <span/> }
              <div className="editor-box">
                <Label for="form-card-supercode">Supercode</Label>
                <Input id="form-card-supercode" type="textarea" rows="8" value={superCode} onChange={ e => {
                    try {
                        var newCard = JSON.parse(window.atob(e.target.value))
                        this.setState({card: newCard});
                    } catch (e) { }
                } }/>
              </div>
            </div>
          </div>
      	</main>
      </div>
    );
  }
}