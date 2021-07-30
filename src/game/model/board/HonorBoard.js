export default class HonorBoard {

	constructor (area) {

		this.id = { type: "honorboard", no: area.id.no };
		area.gameboard.register(this);

		this.area = area;

		this.locationOrder = 3;
		this.public = true;

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

	addCard (card) {

		card.identify();
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