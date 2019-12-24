import React, { Component } from 'react';
import Area from './Area';
import Hand from './Hand';
import Deck from './Deck';
import Field from './Field';
import GemPool from './GemPool';
import Row from './Row';
import Tile from './Tile';
import Court from './Court';
import Choosebox from './Choosebox';
import Gauge from '../UI/Gauge';
import EndTurn from '../UI/EndTurn';
import Avatar from '../../../components/profile/Avatar';

export default class GameBoard extends Component {

	unselect (e) {

		if (this.props.master.manager)
			this.props.master.manager.unselect();
		e.stopPropagation();
        e.cancelBubble = true;
        e.preventDefault();
		return false;
	}

  render () {

  	var master = this.props.master;
  	var no = master.no || 0;

  	var model = this.props.model;

    return (
    	<div className="sensuba-gameboard" onClick={e => this.unselect(e)} onTouchEnd={e => document.getElementById("img-preview-tooltip").setAttribute("style", `display: none`)} onContextMenu={e => this.unselect(e)}>
    	<div className="sensuba-board">
    	<Hand model={model.areas[1-no].hand} master={master}/>
	    	<Area model={model.areas[1-no]} master={master}>
		    	{ model.areas[1-no].avatar ? <div className="sensuba-avatar-wrapper"><Avatar src={model.areas[1-no].avatar}/></div> : <span/> }
		    	<Field model={model.areas[1-no].field} master={master}>
		    		<Row>
		    			<Tile model={model.areas[1-no].field.tiles[4]} master={master}/>
		    			<Tile model={model.areas[1-no].field.tiles[5]} master={master}/>
		    			<Tile model={model.areas[1-no].field.tiles[6]} master={master}/>
		    			<Tile model={model.areas[1-no].field.tiles[7]} master={master}/>
		    			<Tile model={model.areas[1-no].field.tiles[8]} master={master}/>
		    		</Row>
		    		<Row>
		    			<Tile model={model.areas[1-no].field.tiles[0]} master={master}/>
		    			<Tile model={model.areas[1-no].field.tiles[1]} master={master}/>
		    			<Tile model={model.areas[1-no].field.tiles[2]} master={master}/>
		    			<Tile model={model.areas[1-no].field.tiles[3]} master={master}/>
		    		</Row>
		    	</Field>
		    	<div className="sensuba-deck-wrapper">
	    			<Deck model={model.areas[1-no].deck} master={master}/>
	    			<div className="sensuba-username-wrapper">
	    				<div className={"sensuba-username" + (model.areas[1-no].name && model.areas[1-no].name.length > 7 ? (model.areas[1-no].name.length > 10 ? " sensuba-username-extra-small" : " sensuba-username-small") : "")}>{model.areas[1-no].name || ""}</div>
	    			</div>
	    		</div>
	    		<GemPool model={model.areas[1-no].manapool} master={master}/>
		    	<Court model={model.areas[1-no].court} master={master}/>
	    	</Area>
	    	<div className="sensuba-gauge-wrapper">
	    		<Gauge color="#e0000080" value={(model.areas[no].hero ? model.areas[no].hero.chp : 0) || 0} max={model.areas[no].hero ? model.areas[no].hero.hp : 0}/>
	    		<Gauge inverted color="#e00000A0" value={(model.areas[1-no].hero ? model.areas[1-no].hero.chp : 0) || 0} max={model.areas[1-no].hero ? model.areas[1-no].hero.hp : 0}/>
	    		<Gauge color="#1e90ff80" value={model.areas[no].manapool.mana + model.areas[no].manapool.extramana} max={model.areas[no].manapool.maxMana}/>
	    		<Gauge inverted color="#1e90ff80" value={model.areas[1-no].manapool.mana + model.areas[1-no].manapool.extramana} max={model.areas[1-no].manapool.maxMana}/>
	    	</div>
	    	<div className={"sensuba-end-turn-wrapper " + (master.manager ? "" : "hidden")}>
	    		<EndTurn locked={!master.isPlaying} extra={model.areas[no].extraTurns} endTurn={() => master.manager.endTurn()}/>
	    	</div>
	    	<Area model={model.areas[no]} master={master}>
		    	<Court model={model.areas[no].court} master={master}/>
		    	{ model.areas[no].avatar ? <div className="sensuba-avatar-wrapper" onClick={this.props.openConcedeWindow}><Avatar src={model.areas[no].avatar}/></div> : <span/> }
		    	<Field model={model.areas[no].field} master={master}>
		    		<Row>
		    			<Tile model={model.areas[no].field.tiles[0]} master={master}/>
		    			<Tile model={model.areas[no].field.tiles[1]} master={master}/>
		    			<Tile model={model.areas[no].field.tiles[2]} master={master}/>
		    			<Tile model={model.areas[no].field.tiles[3]} master={master}/>
		    		</Row>
		    		<Row>
		    			<Tile model={model.areas[no].field.tiles[4]} master={master}/>
		    			<Tile model={model.areas[no].field.tiles[5]} master={master}/>
		    			<Tile model={model.areas[no].field.tiles[6]} master={master}/>
		    			<Tile model={model.areas[no].field.tiles[7]} master={master}/>
		    			<Tile model={model.areas[no].field.tiles[8]} master={master}/>
		    		</Row>
		    	</Field>
		    	<div className="sensuba-deck-wrapper">
	    			<Deck model={model.areas[no].deck} master={master}/>
	    			<div className="sensuba-username-wrapper">
	    				<div className={"sensuba-username" + (model.areas[no].name && model.areas[no].name.length > 7 ? (model.areas[no].name.length > 10 ? " sensuba-username-extra-small" : " sensuba-username-small") : "")}>{model.areas[no].name || ""}</div>
	    			</div>
	    		</div>
	    		<GemPool model={model.areas[no].manapool} master={master}/>
	    	</Area>
    	<Hand model={model.areas[no].hand} master={master}/>
    	</div>
		<Choosebox model={model.areas[no].choosebox} master={master}/>
      </div>
    )
  }
}