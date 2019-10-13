import React, { Component } from 'react';
import Area from './Area';
import Hand from './Hand';
import Deck from './Deck';
import Field from './Field';
import GemPool from './GemPool';
import Row from './Row';
import Tile from './Tile';
import Court from './Court';
import Gauge from '../UI/Gauge';
import EndTurn from '../UI/EndTurn';

export default class GameBoard extends Component {

  render () {

  	var no = this.props.master.no || 0;

  	var model = this.props.model;

    return (
    	<div className="sensuba-gameboard" onClick={() => this.props.master.manager.unselect()}>
    	<div className="sensuba-board">
    	<Hand model={model.areas[1-no].hand} master={this.props.master}/>
	    	<Area model={model.areas[1-no]} master={this.props.master}>
		    	<Field model={model.areas[1-no].field} master={this.props.master}>
		    		<Row>
		    			<Tile model={model.areas[1-no].field.tiles[4]} master={this.props.master}/>
		    			<Tile model={model.areas[1-no].field.tiles[5]} master={this.props.master}/>
		    			<Tile model={model.areas[1-no].field.tiles[6]} master={this.props.master}/>
		    			<Tile model={model.areas[1-no].field.tiles[7]} master={this.props.master}/>
		    			<Tile model={model.areas[1-no].field.tiles[8]} master={this.props.master}/>
		    		</Row>
		    		<Row>
		    			<Tile model={model.areas[1-no].field.tiles[0]} master={this.props.master}/>
		    			<Tile model={model.areas[1-no].field.tiles[1]} master={this.props.master}/>
		    			<Tile model={model.areas[1-no].field.tiles[2]} master={this.props.master}/>
		    			<Tile model={model.areas[1-no].field.tiles[3]} master={this.props.master}/>
		    		</Row>
		    	</Field>
		    	<div className="sensuba-deck-wrapper">
	    			<Deck model={model.areas[1-no].deck} master={this.props.master}/>
	    		</div>
	    		<GemPool model={model.areas[1-no].manapool} master={this.props.master}/>
		    	<Court model={model.areas[1-no].court} master={this.props.master}/>
	    	</Area>
	    	<div className="sensuba-gauge-wrapper">
	    		<Gauge color="red" value={model.areas[no].hero ? model.areas[no].hero.chp : 0} max={model.areas[no].hero && model.areas[no].hero.hp ? model.areas[no].hero.hp : 0}/>
	    		<Gauge inverted color="red" value={model.areas[1-no].hero ? model.areas[1-no].hero.chp : 0} max={model.areas[1-no].hero && model.areas[1-no].hero.hp ? model.areas[1-no].hero.hp : 0}/>
	    		<Gauge color="dodgerblue" value={model.areas[no].manapool.mana} max={model.areas[no].manapool.maxMana}/>
	    		<Gauge inverted color="dodgerblue" value={model.areas[1-no].manapool.mana} max={model.areas[1-no].manapool.maxMana}/>
	    	</div>
	    	<div className="sensuba-end-turn-wrapper">
	    		<EndTurn locked={!this.props.master.isPlaying} endTurn={() => this.props.master.manager.endTurn()}/>
	    	</div>
	    	<Area model={model.areas[no]} master={this.props.master}>
		    	<Court model={model.areas[no].court} master={this.props.master}/>
		    	<Field model={model.areas[no].field} master={this.props.master}>
		    		<Row>
		    			<Tile model={model.areas[no].field.tiles[0]} master={this.props.master}/>
		    			<Tile model={model.areas[no].field.tiles[1]} master={this.props.master}/>
		    			<Tile model={model.areas[no].field.tiles[2]} master={this.props.master}/>
		    			<Tile model={model.areas[no].field.tiles[3]} master={this.props.master}/>
		    		</Row>
		    		<Row>
		    			<Tile model={model.areas[no].field.tiles[4]} master={this.props.master}/>
		    			<Tile model={model.areas[no].field.tiles[5]} master={this.props.master}/>
		    			<Tile model={model.areas[no].field.tiles[6]} master={this.props.master}/>
		    			<Tile model={model.areas[no].field.tiles[7]} master={this.props.master}/>
		    			<Tile model={model.areas[no].field.tiles[8]} master={this.props.master}/>
		    		</Row>
		    	</Field>
		    	<div className="sensuba-deck-wrapper">
	    			<Deck model={model.areas[no].deck} master={this.props.master}/>
	    		</div>
	    		<GemPool model={model.areas[no].manapool} master={this.props.master}/>
	    	</Area>
    	<Hand model={model.areas[no].hand} master={this.props.master}/>
    	</div>
      </div>
    )
  }
}