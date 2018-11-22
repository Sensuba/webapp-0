import Deck from "./Deck";
import Card from "./Card";
import Field from "./Field";
import Hand from "./Hand";
import Court from "./Court";
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
	}

	get opposite () {

		return this.gameboard.areas[1 - this.id.no];
	}

	draw (n = 1) {

		if (n <= 0) return;
		var d = this.deck.draw();
		d.goto(this.hand);
		this.gameboard.notify("draw", this.id, d.id);
		if (n > 1)
			this.draw(n-1);
	}

	get isPlaying () {

		return this.gameboard.currentArea === this;
	}

	newTurn () {

		this.manapool.refill();
		//this.draw();
		/*if (this.hand.cards[0].isType("figure"))
			this.hand.cards[0].play(this.field.tiles[1]);
		else if (this.hand.cards[1].isType("figure"))
			this.hand.cards[1].play(this.field.tiles[1]);*/
	}

	endTurn () {

		if (this.isPlaying)
			this.gameboard.newTurn();
	}
}