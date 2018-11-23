//import Card from "./Card";

export default class Deck {

	constructor (area) {

		this.id = { type: "deck", no: area.id.no };
		area.gameboard.register(this);

		this.locationOrder = 1;

		this.area = area;

		this.cards = [];
	}

	draw() {

		return this.cards[0];
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