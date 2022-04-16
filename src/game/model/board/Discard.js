export default class Discard {

	constructor (area) {

		this.id = { type: "discard", no: area.id.no };
		area.gameboard.register(this);

		this.locationOrder = 0;

		this.area = area;

		this.cards = [];
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

		return this.area.opposite.discard;
	}

	get public () {

		return true;
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