export default class Choosebox {

	constructor (area) {

		this.id = { type: "choosebox", no: area.id.no };
		area.gameboard.register(this);

		this.locationOrder = 0;

		this.area = area;

		this.cards = [];
	}

	get count () {

		return this.cards.length;
	}

	get isEmpty () {

		return this.count === 0;
	}

	get opposite () {

		return this.area.opposite.capsule;
	}

	get public () {

		return true;
	}

	open () {

		this.opened = true;
	}

	close () {

		this.opened = false;
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