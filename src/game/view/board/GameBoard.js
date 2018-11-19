import React, { Component } from 'react';
import Area from './Area';
import Hand from './Hand';
import Deck from './Deck';
import Field from './Field';
import Row from './Row';
import Tile from './Tile';
import Court from './Court';
import Gauge from '../UI/Gauge';
import EndTurn from '../UI/EndTurn';

export default class GameBoard extends Component {

	constructor (props) {

		super(props);
		this.model = props.model;
		this.id = props.model.id;
		props.master.register(this);window.test = () => console.log(this.model.areas[0]);
	}

  render () {

    return (
    	<div className="sensuba-gameboard">
    	<Area model={this.model.areas[0]} master={this.props.master}>
    		<Hand model={this.model.areas[0].hand} master={this.props.master}/>
	    	<Field model={this.model.areas[0].field} master={this.props.master}>
	    		<Row>
	    			<Tile model={this.model.areas[0].field.tiles[4]} master={this.props.master}/>
	    			<Tile model={this.model.areas[0].field.tiles[5]} master={this.props.master}/>
	    			<Tile model={this.model.areas[0].field.tiles[6]} master={this.props.master}/>
	    			<Tile model={this.model.areas[0].field.tiles[7]} master={this.props.master}/>
	    			<Tile model={this.model.areas[0].field.tiles[8]} master={this.props.master}/>
	    		</Row>
	    		<Row>
	    			<Tile model={this.model.areas[0].field.tiles[0]} master={this.props.master}/>
	    			<Tile model={this.model.areas[0].field.tiles[1]} master={this.props.master}/>
	    			<Tile model={this.model.areas[0].field.tiles[2]} master={this.props.master}/>
	    			<Tile model={this.model.areas[0].field.tiles[3]} master={this.props.master}/>
	    		</Row>
	    	</Field>
	    	<div className="sensuba-deck-wrapper">
    			<Deck model={this.model.areas[0].deck} master={this.props.master}/>
    		</div>
	    	<Court model={this.model.areas[0].court} master={this.props.master}/>
    	</Area>
    	<div className="sensuba-gauge-wrapper">
    		<Gauge color="red" value={6000} max={6000}/>
    		<Gauge inverted color="red" value={3700} max={6000}/>
    		<Gauge color="dodgerblue" value={this.model.areas[0].manapool.mana} max={this.model.areas[0].manapool.maxMana}/>
    		<Gauge inverted color="dodgerblue" value={this.model.areas[1].manapool.mana} max={this.model.areas[1].manapool.maxMana}/>
    	</div>
    	<div className="sensuba-end-turn-wrapper">
    		<EndTurn locked={!this.model.areas[0].isPlaying} endTurn={() => this.props.master.manager.endTurn()}/>
    	</div>
    	<Area model={this.model.areas[1]} master={this.props.master}>
	    	<Court model={this.model.areas[1].court} master={this.props.master}/>
	    	<Field model={this.model.areas[1].field} master={this.props.master}>
	    		<Row>
	    			<Tile model={this.model.areas[1].field.tiles[0]} master={this.props.master}/>
	    			<Tile model={this.model.areas[1].field.tiles[1]} master={this.props.master}/>
	    			<Tile model={this.model.areas[1].field.tiles[2]} master={this.props.master}/>
	    			<Tile model={this.model.areas[1].field.tiles[3]} master={this.props.master}/>
	    		</Row>
	    		<Row>
	    			<Tile model={this.model.areas[1].field.tiles[4]} master={this.props.master}/>
	    			<Tile model={this.model.areas[1].field.tiles[5]} master={this.props.master}/>
	    			<Tile model={this.model.areas[1].field.tiles[6]} master={this.props.master}/>
	    			<Tile model={this.model.areas[1].field.tiles[7]} master={this.props.master}/>
	    			<Tile model={this.model.areas[1].field.tiles[8]} master={this.props.master}/>
	    		</Row>
	    	</Field>
	    	<div className="sensuba-deck-wrapper">
    			<Deck model={this.model.areas[1].deck} master={this.props.master}/>
    		</div>
    		<Hand model={this.model.areas[1].hand} master={this.props.master}/>
    	</Area>
      </div>
    )
  }
}