import React, { Component } from 'react';
import Card from '../Card';
import Nav from '../../Nav';
import { Form, Input, FormGroup, Label } from 'reactstrap';
import './EditorPage.css';

export default class EditorPage extends Component {

	constructor (props) {

		super(props);

    this.state = {
      card: {
        nameCard: "Penguin",
        anime: "Anime",
        imgLink: "https://image.ibb.co/jbcTNJ/penguin.png",
        idColor: 0,
        cardType: "figure",
        mana: 0,
        description: "",
        flavourText: "",
        atk: 200,
        hp: 200,
        range: 1
      }
    };
	}
  
  render() {

    var editAttribute = attr => (e => {
      var plus = {};
      plus[attr] = e.target.value;
      this.setState({card: Object.assign(this.state.card, plus)})
    });

    var changeColor = idColor => () => this.setState({card: Object.assign(this.state.card, {idColor: idColor})});

    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <div className="half-section">
            <div className="editor-box">
              <Form>
                <FormGroup>
                  <div className="types-group">
                    <Input id="hero-card" type="radio" name="sensuba-type" onChange={()=>{}}/>
                    <Label for="hero-card">Héros</Label>
                    <Input id="figure-card" type="radio" name="sensuba-type" onChange={()=>{}} defaultChecked/>
                    <Label for="figure-card">Figure</Label>
                    <Input id="spell-card" type="radio" name="sensuba-type" onChange={()=>{}}/>
                    <Label for="spell-card">Sort</Label>
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="form-card-name">Name</Label>
                  <Input id="form-card-name" type="text" defaultValue={this.state.card.nameCard} onChange={editAttribute("nameCard").bind(this)}/>
                </FormGroup>
                <FormGroup>
                    <Label for="form-card-anime">Anime</Label>
                    <Input id="form-card-anime" type="text" defaultValue={this.state.card.anime} onChange={editAttribute("anime").bind(this)}/>
                </FormGroup>
                <FormGroup>
                  <div className="half-section">
                    <Label>Color</Label>
                    <div className="colors-group">
                      <Input id="neutral-mana" type="radio" name="sensuba-color" onChange={changeColor(0)} defaultChecked/>
                      <Label for="neutral-mana"/>
                      <Input id="white-mana" type="radio" name="sensuba-color" onChange={changeColor(1)}/>
                      <Label for="white-mana"/>
                      <Input id="red-mana" type="radio" name="sensuba-color" onChange={changeColor(2)}/>
                      <Label for="red-mana"/>
                      <Input id="blue-mana" type="radio" name="sensuba-color" onChange={changeColor(3)}/>
                      <Label for="blue-mana"/>
                      <Input id="green-mana" type="radio" name="sensuba-color" onChange={changeColor(4)}/>
                      <Label for="green-mana"/>
                      <Input id="black-mana" type="radio" name="sensuba-color" onChange={changeColor(5)}/>
                      <Label for="black-mana"/>
                    </div>
                  </div>
                  <div className="half-section">
                    <Label for="form-card-mana">Mana</Label>
                    <Input id="form-card-mana" type="number" min="0" max="9" defaultValue={this.state.card.mana} onChange={editAttribute("mana").bind(this)}/>
                  </div>
                </FormGroup>
                <FormGroup>
                  <div className="third-section">
                    <Label for="form-card-atk">ATK</Label>
                    <Input id="form-card-atk" type="number" min="0" max="9999" step="100" defaultValue={this.state.card.atk} onChange={editAttribute("atk").bind(this)}/>
                  </div>
                  <div className="third-section">
                    <Label for="form-card-hp">HP</Label>
                    <Input id="form-card-hp" type="number" min="0" max="9999" step="100" defaultValue={this.state.card.hp} onChange={editAttribute("hp").bind(this)}/>
                  </div>
                  <div className="third-section">
                    <Label for="form-card-range">Range</Label>
                    <Input id="form-card-range" type="number" min="1" max="3" defaultValue={this.state.card.range} onChange={editAttribute("range").bind(this)}/>
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="form-card-description">Description</Label>
                  <Input id="form-card-description" type="textarea" defaultValue={this.state.card.description} onChange={editAttribute("description").bind(this)}/>
                </FormGroup>
                <FormGroup>
                  <Label for="form-card-flavour">Flavour text</Label>
                  <Input id="form-card-flavour" type="textarea" defaultValue={this.state.card.flavourText} onChange={editAttribute("flavourText").bind(this)}/>
                </FormGroup>
                <FormGroup>
                  <Label for="form-card-img">Image link</Label>
                  <Input id="form-card-img" type="url" defaultValue={this.state.card.imgLink} onChange={editAttribute("imgLink").bind(this)}/>
                </FormGroup>
              </Form>
            </div>
          </div>
          <div className="half-section">
            <div className="editor-card-visual">
              <Card src={this.state.card}/>
            </div>
          </div>
      	</main>
      </div>
    );
  }
}