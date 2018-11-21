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
		props.master.register(this);
	}

  render () {

  	var no = this.props.master.no || 0;

    return (
    	<div className="sensuba-gameboard">
    	<Area model={this.model.areas[1-no]} master={this.props.master}>
    		<Hand model={this.model.areas[1-no].hand} master={this.props.master}/>
	    	<Field model={this.model.areas[1-no].field} master={this.props.master}>
	    		<Row>
	    			<Tile model={this.model.areas[1-no].field.tiles[4]} master={this.props.master}/>
	    			<Tile model={this.model.areas[1-no].field.tiles[5]} master={this.props.master}/>
	    			<Tile model={this.model.areas[1-no].field.tiles[6]} master={this.props.master}/>
	    			<Tile model={this.model.areas[1-no].field.tiles[7]} master={this.props.master}/>
	    			<Tile model={this.model.areas[1-no].field.tiles[8]} master={this.props.master}/>
	    		</Row>
	    		<Row>
	    			<Tile model={this.model.areas[1-no].field.tiles[0]} master={this.props.master}/>
	    			<Tile model={this.model.areas[1-no].field.tiles[1]} master={this.props.master}/>
	    			<Tile model={this.model.areas[1-no].field.tiles[2]} master={this.props.master}/>
	    			<Tile model={this.model.areas[1-no].field.tiles[3]} master={this.props.master}/>
	    		</Row>
	    	</Field>
	    	<div className="sensuba-deck-wrapper">
    			<Deck model={this.model.areas[1-no].deck} master={this.props.master}/>
    		</div>
	    	<Court model={this.model.areas[1-no].court} master={this.props.master}/>
    	</Area>
    	<div className="sensuba-gauge-wrapper">
    		<Gauge color="red" value={6000} max={6000}/>
    		<Gauge inverted color="red" value={3700} max={6000}/>
    		<Gauge color="dodgerblue" value={this.model.areas[1-no].manapool.mana} max={this.model.areas[1-no].manapool.maxMana}/>
    		<Gauge inverted color="dodgerblue" value={this.model.areas[no].manapool.mana} max={this.model.areas[no].manapool.maxMana}/>
    	</div>
    	<div className="sensuba-end-turn-wrapper">
    		<EndTurn locked={!this.props.master.isPlaying} endTurn={() => this.props.master.manager.endTurn()}/>
    	</div>
    	<Area model={this.model.areas[no]} master={this.props.master}>
	    	<Court model={this.model.areas[no].court} master={this.props.master}/>
	    	<Field model={this.model.areas[no].field} master={this.props.master}>
	    		<Row>
	    			<Tile model={this.model.areas[no].field.tiles[0]} master={this.props.master}/>
	    			<Tile model={this.model.areas[no].field.tiles[1]} master={this.props.master}/>
	    			<Tile model={this.model.areas[no].field.tiles[2]} master={this.props.master}/>
	    			<Tile model={this.model.areas[no].field.tiles[3]} master={this.props.master}/>
	    		</Row>
	    		<Row>
	    			<Tile model={this.model.areas[no].field.tiles[4]} master={this.props.master}/>
	    			<Tile model={this.model.areas[no].field.tiles[5]} master={this.props.master}/>
	    			<Tile model={this.model.areas[no].field.tiles[6]} master={this.props.master}/>
	    			<Tile model={this.model.areas[no].field.tiles[7]} master={this.props.master}/>
	    			<Tile model={this.model.areas[no].field.tiles[8]} master={this.props.master}/>
	    		</Row>
	    	</Field>
	    	<div className="sensuba-deck-wrapper">
    			<Deck model={this.model.areas[no].deck} master={this.props.master}/>
    		</div>
    		<Hand model={this.model.areas[no].hand} master={this.props.master}/>
    	</Area>
      </div>
    )
  }
}