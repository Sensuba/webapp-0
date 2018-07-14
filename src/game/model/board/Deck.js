
export default class Deck {

	constructor (area, list) {

		this.id = { type: "deck", "no": area.id.no };

		this.area = area;

		this.list = [];
		this.shuffle();
	}

	draw() {

		return this.list.pop();
	}

	shuffle() {

	    for (let i = this.list.length - 1; i > 0; i--) {
	        const j = Math.floor(Math.random() * (i + 1));
	        [this.list[i], this.list[j]] = [this.list[j], this.list[i]];
	    }
	}

	count = () => this.list.length;

	isEmpty = () => this.count() === 0;

	opposite = () => this.area.opposite.deck;
}