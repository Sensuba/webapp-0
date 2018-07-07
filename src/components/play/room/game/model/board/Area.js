import Deck from "./Deck";

export default class Area {

	constructor (id, gameboard) {

		this.id = { type: "area", "no": id };

		this.gameboard = gameboard;
		this.deck = new Deck(this);
	}

	opposite = () => this.gameboard.areas[1 - this.id];
}