
export default class Deck {

	constructor (area) {

		this.id = { type: "deck", "no": area.id.no };

		this.area = area;
	}

	opposite = () => this.area.opposite.deck;
}