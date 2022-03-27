//import Card from "./Card";

const CURSE_DAMAGE = 500;
const CURSE_INC = 100;

export default class Deck {

	constructor (area) {

		this.id = { type: "deck", no: area.id.no };
		area.gameboard.register(this);

		this.locationOrder = 1;

		this.area = area;
		this.curse = CURSE_DAMAGE;

		this.cards = [];
	}

	draw() {

		return this.cards[0];
	}

	fatigue() {

		this.curse += CURSE_INC;
	}

	lockStartingDeck() {

		this.starting = this.cards.map(card => card.model || { idCardmodel: card.idCardmodel });
		this.highlander = new Set(this.starting.map(card => card.idCardmodel)).size === this.starting.length;
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

	get public () {

		return false;
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