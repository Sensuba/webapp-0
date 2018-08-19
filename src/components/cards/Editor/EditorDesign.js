import React, { Component } from 'react';
import Card from '../Card';
import Nav from '../../Nav';
import { Form, Input, FormGroup, Label } from 'reactstrap';

export default class EditorPage extends Component {

  state = { level: 1 }

  get currentCard() {

    var cc = this.props.card;
    this.props.token.forEach(el => cc = cc.tokens[el]);
    return cc;
  }

  set currentCard(value) {

    if (this.props.token.length === 0) {
      this.props.update(value);
      return;
    }
    var cc = this.props.card;
    this.props.token.slice(0,-1).forEach(el => cc = cc.tokens[el]);
    cc.tokens[this.props.token[this.props.token.length-1]] = value;
    this.props.update(this.props.card);
  }

  newToken() {
      
    var token = Object.assign({}, this.props.defaultCard);

    this.currentCard.tokens = this.currentCard.tokens || [];
    this.currentCard.tokens.push(token);

    var c = this.props.token;
    c.push(this.currentCard.tokens.length-1);

    this.props.update(this.props.card);
    this.props.setToken(c);
  }

  changeType(newType) {

    var filter = [];
    var basis = {
        archetypes: [],
        mana: 0,
        atk: 200,
        hp: 200,
        range: 1,
        lv2: {
          atk: 200,
          range: 1,
          description: "",
          fontSize: 1.3,
          overload: 0
        },
        lvmax: {
          atk: 200,
          range: 1,
          description: "",
          fontSize: 1.3,
          overload: 0
        }
    };
    switch (newType) {
    case "figure": filter = ["lv2", "lvmax", "idColor2"]; break;
    case "hero": filter = ["archetypes", "mana"]; break;
    case "spell": filter = ["lv2", "lvmax", "idColor2", "archetypes", "atk", "hp", "range"]; break;
    case "trap": filter = ["lv2", "lvmax", "idColor2", "archetypes", "atk", "hp", "range"]; break;
    case "artifact": filter = ["lv2", "lvmax", "idColor2", "archetypes", "atk", "range"]; break;
    default: break;
    }

    var n = Object.assign({}, basis, this.currentCard, {cardType: newType});
    filter.forEach(f => delete n[f]);
    if (newType === "hero")
      n.idColor2 = 0;
    
    this.currentCard = n;
  }
  
  render() {

    var editAttribute = attr => (e => {
      this.currentCard[attr] = e.target.value;
      if (typeof this.currentCard[attr] === 'string') this.currentCard[attr].replace(/[\u0250-\ue007]/g, '');
      this.props.update(this.props.card);
    });

    var editLevelAttribute = attr => ((e, l) => {
      l[attr] = e.target.value;
      if (typeof l[attr] === 'string') l[attr].replace(/[\u0250-\ue007]/g, '');
      this.props.update(this.props.card);
    });

    var changeArchetypes = (ar1, ar2) => {
      var ars = [];
      if (ar1 && ar1 !== "")
        ars.push(ar1.toLowerCase());
      if (ar2 && ar2 !== "")
        ars.push(ar2.toLowerCase());
      this.currentCard.archetypes = ars;
     this.props.update(this.props.card);
    };

    var changeColor = idColor => () => {
      this.currentCard.idColor = idColor;
      this.props.update(this.props.card);
    };

    var changeColor2 = idColor => () => {
      this.currentCard.idColor2 = idColor;
      this.props.update(this.props.card);
    };

    var shadow = this.currentCard;
    delete shadow.htmlDescription;

    var superCode = window.btoa(JSON.stringify(shadow));

    var currentLevel = this.currentCard.cardType !== "hero" ? null : (this.state.level === 1 ? this.currentCard : (this.state.level === 2 ? this.currentCard.lv2 : this.currentCard.lvmax));

    return (
      <div className={this.props.className}>
        <div className="half-section">
          <div className="editor-box">
            <Form>
              <FormGroup>
                <div className="types-group vintage-radio">
                  <Input id="hero-card" type="radio" name="sensuba-type" onChange={() => this.changeType("hero")} checked={this.currentCard.cardType === "hero"}/>
                  <Label for="hero-card">Hero</Label>
                  <Input id="figure-card" type="radio" name="sensuba-type" onChange={() => this.changeType("figure")} checked={this.currentCard.cardType === "figure"}/>
                  <Label for="figure-card">Figure</Label>
                  <Input id="spell-card" type="radio" name="sensuba-type" onChange={() => this.changeType("spell")} checked={this.currentCard.cardType === "spell"}/>
                  <Label for="spell-card">Spell</Label>
                  <Input id="trap-card" type="radio" name="sensuba-type" onChange={() => this.changeType("trap")} checked={this.currentCard.cardType === "trap"}/>
                  {
                    this.props.token.length > 0
                    ? <Label for="trap-card">Trap</Label>
                    : <span/>
                  }
                  <Input id="artifact-card" type="radio" name="sensuba-type" onChange={() => this.changeType("artifact")} checked={this.currentCard.cardType === "artifact"}/>
                  <Label for="artifact-card">Artifact</Label>
                </div>
              </FormGroup>
              <FormGroup>
                <Label for="form-card-name">Name</Label>
                <Input id="form-card-name" type="text" value={this.currentCard.nameCard} onChange={editAttribute("nameCard").bind(this)}/>
              </FormGroup>
              {
                this.currentCard.cardType !== "hero" ?
                  <FormGroup>
                      <Label for="form-card-anime">Anime</Label>
                      <Input id="form-card-anime" type="text" value={this.currentCard.anime} onChange={editAttribute("anime").bind(this)}/>
                  </FormGroup>
                  :
                  <FormGroup>
                      <div className="two-thirds-section">
                        <Label for="form-card-anime">Anime</Label>
                        <Input id="form-card-anime" type="text" value={this.currentCard.anime} onChange={editAttribute("anime").bind(this)}/>
                      </div>
                      <div className="third-section">
                        <Label for="form-card-hp">HP</Label>
                        <Input id="form-card-hp" type="number" min="100" max="9999" step="100" value={this.currentCard.hp} onChange={editAttribute("hp").bind(this)}/>
                      </div>
                  </FormGroup>
              }
              <FormGroup>
                <div className="half-section">
                  <Label>Color</Label>
                  <div className="colors-group">
                    <Input id="neutral-mana" type="radio" name="sensuba-color" onChange={changeColor(0)} checked={this.currentCard.idColor === 0}/>
                    <Label for="neutral-mana"/>
                    <Input id="white-mana" type="radio" name="sensuba-color" onChange={changeColor(1)} checked={this.currentCard.idColor === 1}/>
                    <Label for="white-mana"/>
                    <Input id="red-mana" type="radio" name="sensuba-color" onChange={changeColor(2)} checked={this.currentCard.idColor === 2}/>
                    <Label for="red-mana"/>
                    <Input id="blue-mana" type="radio" name="sensuba-color" onChange={changeColor(3)} checked={this.currentCard.idColor === 3}/>
                    <Label for="blue-mana"/>
                    <Input id="green-mana" type="radio" name="sensuba-color" onChange={changeColor(4)} checked={this.currentCard.idColor === 4}/>
                    <Label for="green-mana"/>
                    <Input id="black-mana" type="radio" name="sensuba-color" onChange={changeColor(5)} checked={this.currentCard.idColor === 5}/>
                    <Label for="black-mana"/>
                  </div>
                </div>
                {
                  this.currentCard.cardType !== "hero" ?
                    <div className="half-section">
                      <Label for="form-card-mana">Mana</Label>
                      <Input id="form-card-mana" type="number" min="0" max="9" value={this.currentCard.mana} onChange={editAttribute("mana").bind(this)}/>
                    </div>
                    :
                    <div className="half-section">
                      <Label>Color 2</Label>
                      <div className="colors-group">
                        <Input id="neutral-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(0)} checked={this.currentCard.idColor2 === 0}/>
                        <Label for="neutral-mana-2"/>
                        <Input id="white-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(1)} checked={this.currentCard.idColor2 === 1}/>
                        <Label for="white-mana-2"/>
                        <Input id="red-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(2)} checked={this.currentCard.idColor2 === 2}/>
                        <Label for="red-mana-2"/>
                        <Input id="blue-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(3)} checked={this.currentCard.idColor2 === 3}/>
                        <Label for="blue-mana-2"/>
                        <Input id="green-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(4)} checked={this.currentCard.idColor2 === 4}/>
                        <Label for="green-mana-2"/>
                        <Input id="black-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(5)} checked={this.currentCard.idColor2 === 5}/>
                        <Label for="black-mana-2"/>
                      </div>
                    </div>
                }
              </FormGroup>
              {
                this.currentCard.cardType === "figure" ?
                <FormGroup>
                  <div className="half-section">
                    <Label for="form-card-archetype1">Archetype 1</Label>
                    <Input id="form-card-archetype1" type="text" value={(this.currentCard.archetypes && this.currentCard.archetypes.length > 0) ? this.currentCard.archetypes[0] : ""} onChange={e => changeArchetypes(e.target.value, document.getElementById("form-card-archetype2").value)}/>
                  </div>
                  <div className="half-section">
                    <Label for="form-card-archetype2">Archetype 2</Label>
                    <Input id="form-card-archetype2" type="text" value={(this.currentCard.archetypes && this.currentCard.archetypes.length > 1) ? this.currentCard.archetypes[1] : ""} onChange={e => changeArchetypes(document.getElementById("form-card-archetype1").value, e.target.value)}/>
                  </div>
                </FormGroup> : <span/>
              }
              {
                this.currentCard.cardType === "figure" ?
                <FormGroup>
                  <div className="third-section">
                    <Label for="form-card-atk">ATK</Label>
                    <Input id="form-card-atk" type="number" min="0" max="9999" step="100" value={this.currentCard.atk} onChange={editAttribute("atk").bind(this)}/>
                  </div>
                  <div className="third-section">
                    <Label for="form-card-hp">HP</Label>
                    <Input id="form-card-hp" type="number" min="100" max="9999" step="100" value={this.currentCard.hp} onChange={editAttribute("hp").bind(this)}/>
                  </div>
                  <div className="third-section">
                    <Label for="form-card-range">Range</Label>
                    <Input id="form-card-range" type="number" min="1" max="3" value={this.currentCard.range} onChange={editAttribute("range").bind(this)}/>
                  </div>
                </FormGroup> : <span/>
              }
              {
                this.currentCard.cardType === "hero" ?
                <div className="editor-menu">
                  <div className="editor-menu-tabs">
                    <Input id="level1-tab" type="radio" onChange={() => this.setState({level: 1})} checked={this.state.level === 1}/>
                    <Label for="level1-tab">LV 1</Label>
                    <Input id="level2-tab" type="radio" onChange={() => this.setState({level: 2})} checked={this.state.level === 2}/>
                    <Label for="level2-tab">LV 2</Label>
                    <Input id="levelmax-tab" type="radio" onChange={() => this.setState({level: 3})} checked={this.state.level === 3}/>
                    <Label for="levelmax-tab">LV MAX</Label>
                  </div>
                  <div className="editor-box">
                    <FormGroup>
                      <div className="half-section">
                        <Label for="form-card-atk">ATK</Label>
                        <Input id="form-card-atk" type="number" min="0" max="9999" step="100" value={currentLevel.atk} onChange={e => editLevelAttribute("atk")(e, currentLevel)}/>
                      </div>
                      <div className="half-section">
                        <Label for="form-card-range">Range</Label>
                        <Input id="form-card-range" type="number" min="1" max="3" value={currentLevel.range} onChange={e => editLevelAttribute("range")(e, currentLevel)}/>
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <div className="two-thirds-section">
                        <Label for="form-card-description">Description</Label>
                        <Input id="form-card-description" rows="4" type="textarea" value={currentLevel.description} onChange={e => editLevelAttribute("description")(e, currentLevel)}/>
                      </div>
                      <div className="third-section">
                        <Label for="form-card-font-size">Font size</Label>
                        <Input id="form-card-font-size" type="number" min="0.95" max="1.3" step="0.05" value={currentLevel.fontSize} onChange={e => editLevelAttribute("fontSize")(e, currentLevel)}/>
                        <Label for="form-card-overload">Overload</Label>
                        <Input id="form-card-overload" type="number" min="0" max="10000" step="10" value={currentLevel.overload} onChange={e => editLevelAttribute("overload")(e, currentLevel)}/>
                      </div>
                    </FormGroup>
                  </div>
                </div> : <span/>
              }
              {
                this.currentCard.cardType === "artifact" ?
                <FormGroup>
                    <Label for="form-card-hp">Durability</Label>
                    <Input id="form-card-hp" type="number" min="100" max="9999" step="100" value={this.currentCard.hp} onChange={editAttribute("hp").bind(this)}/>
                </FormGroup> : <span/>
              }
              {
                this.currentCard.cardType !== "hero" ?
                <FormGroup>
                <div className="two-thirds-section">
                  <Label for="form-card-description">Description</Label>
                  <Input id="form-card-description" rows="4" type="textarea" value={this.currentCard.description} onChange={editAttribute("description").bind(this)}/>
                </div>
                <div className="third-section">
                  <Label for="form-card-font-size">Font size</Label>
                  <Input id="form-card-font-size" type="number" min="0.95" max="1.3" step="0.05" value={this.currentCard.fontSize} onChange={editAttribute("fontSize").bind(this)}/>
                  <Label for="form-card-overload">Overload</Label>
                  <Input id="form-card-overload" type="number" min="0" max="10000" step="10" value={this.currentCard.overload} onChange={editAttribute("overload").bind(this)}/>
                </div>
              </FormGroup> : <span/>
              }
              <FormGroup>
                <Label for="form-card-flavour">Flavour text</Label>
                <Input id="form-card-flavour" type="textarea" value={this.currentCard.flavourText} onChange={editAttribute("flavourText").bind(this)}/>
              </FormGroup>
              <FormGroup>
                <Label for="form-card-img">Image link</Label>
                <Input id="form-card-img" type="url" value={this.currentCard.imgLink} onChange={editAttribute("imgLink").bind(this)}/>
              </FormGroup>
              <FormGroup>
                <Label for="form-card-illustrator">Illustrator</Label>
                <Input id="form-card-illustrator" type="text" value={this.currentCard.illustrator} onChange={editAttribute("illustrator").bind(this)}/>
              </FormGroup>
            </Form>
          </div>
        </div>
        <div className="half-section">
          <div className="editor-card-visual">
            <Card id="card-preview" src={this.currentCard}/>
            { this.props.token.length === 0 ? <button className="menu-button" onClick={() => this.props.save()}>{ this.props.isEdit ? "Edit" : "Save" }</button> : <span/> }
            { this.props.card !== undefined || this.props.token.length > 0 ? <button className="red menu-button" onClick={() => this.props.delete()}>Delete</button> : <span/> }
            <div className="editor-box">
              <Label for="form-card-supercode">Supercode</Label>
              <Input id="form-card-supercode" type="textarea" rows="8" value={superCode} onChange={ e => {
                  try {
                      this.currentCard = JSON.parse(window.atob(e.target.value));
                  } catch (e) { }
              } }/>
            </div>
            <div className="token-menu">
              {
                this.props.token.length > 0 ? <button className="menu-button" onClick={() => this.props.setToken(this.props.token.slice(0,-1))}>Parent</button> : <span/>
              }
              {
                (() => {

                  if (this.currentCard.tokens)
                    return this.currentCard.tokens.map((token, i) => <button key={i} className="menu-button" onClick={() => this.props.setToken(this.props.token.concat([i]))}>{ token.nameCard }</button>)
                  return null;
                })()
              }
              <button className="red menu-button" onClick={() => this.newToken()}>New token</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}