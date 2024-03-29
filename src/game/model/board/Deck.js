//import Card from "./Card";

const CURSE_DAMAGE = 500;
const CURSE_INC = 100;

export default class Deck {

	constructor (area) {

		this.id = { type: "deck", no: area.id.no };
		area.gameboard.register(this);

		this.locationOrder = 1;
		this.public = false;

		this.area = area;
		this.curse = CURSE_DAMAGE;
		this.curseInc = CURSE_INC;

		this.cards = [];
	}

	draw() {

		return this.cards[0];
	}

	fatigue() {

		this.curse += this.curseInc;
	}

	editFatigue (damage, increment) {

		if (damage !== null && damage !== undefined)
			this.curse = damage;
		if (increment !== null && increment !== undefined)
			this.curseInc = increment;
	}

	lockStartingDeck() {

		this.starting = this.cards.map(card => card.model || { idCardmodel: card.idCardmodel });
		this.highlander = new Set(this.starting.map(card => card.idCardmodel)).size === this.starting.length;
	}

	get firstCard () {

		return this.isEmpty ? null : this.cards[0];
	}

	get lastCard () {

		return this.isEmpty ? null : this.cards[this.count-1];
	}

	get count () {

		return this.cards.length;
	}

	get isEmpty () {

		return this.count === 0;
	}

	get opposite () {

		return this.area.opposite.deck;
	}

	addCard (card) {

		this.cards.push(card);
		if (card.location !== this)
				card.goto(this);
	}

	removeCard (card) {

		if (this.cards.includes (card)) {
			this.cards = this.cards.filter (el => el !== card);
			if (card !== null && card.location === this)
				card.goto(null);
		}
	}

	hasCard (card) {

		return this.cards.includes (card);
	}
}