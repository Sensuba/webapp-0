import Deck from "./Deck";
//import Card from "./Card";
import Field from "./Field";
import Hand from "./Hand";
import Court from "./Court";
import Cemetery from "./Cemetery";
import ManaPool from "./ManaPool";

export default class Area {

	constructor (noId, gameboard) {

		this.id = { type: "area", no: noId };
		gameboard.register(this);

		this.gameboard = gameboard;
		this.deck = new Deck(this);
		this.field = new Field(this);
		this.hand = new Hand(this);
		this.manapool = new ManaPool(this);
		this.court = new Court(this);
		this.cemetery = new Cemetery(this);
	}

	get opposite () {

		return this.gameboard.areas[1 - this.id.no];
	}

	draw () {

		this.gameboard.update();
	}

	get isPlaying () {

		return this.gameboard.currentArea === this;
	}

	newTurn () {

		this.manapool.reload();
		this.field.entities.forEach(e => e.refresh());
		this.gameboard.update();
	}

	endTurn () {

		if (this.isPlaying)
			this.gameboard.newTurn();
	}
}