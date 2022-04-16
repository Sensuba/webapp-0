const HAZARDS_GROUPS = [["fire", "water", "flowers", "butterflies"], ["wind"], ["shadow"], ["portal", "seal"], ["landmark"]]

export default class Tile {

	constructor (id, field) {

		this.id = { type: "tile", no: id };
		field.area.gameboard.register(this);

		this.locationOrder = 3;

		this.field = field;

		this.card = null;
		this.hazards = [];
	}

	get isEmpty () {

		return this.card === null || this.card === undefined || this.card.destroyed || this.card.isGhost;
	}

	get occupied () {

		return !this.isEmpty;
	}

	get cards () {

		return [this.card];
	}

	get firstCard () {

		return this.isEmpty ? null : this.card;
	}

	get lastCard () {

		return this.isEmpty ? null : this.card;
	}

	place (card) {

		if (this.card !== null)
			this.card.destroy();
		this.card = card;
		if (card.location !== this)
			card.goto(this);
	}

	free() {

		var c = this.card;
		this.card = null;
		if (c !== null && c.location === this)
			c.goto(null);
	}

	addCard (card) {

		card.identify();
		this.place(card);
	}

	removeCard (card) {

		if (this.card === card)
			this.free ();
	}

	hasCard (card) {

		return this.card === card;
	}

	get area () {

		return this.field.area;
	}

	get inFront () {

		return this.field.front.includes(this);
	}

	get inBack () {

		return this.field.back.includes(this);
	}

	get public () {

		return true;
	}

	get neighbors () {

		var n = [], i;
		var line = this.inFront ? this.field.front : this.field.back;
		for (i = 0; i < line.length-1; i++)
			if (line[i] === this)
				n.push(line[i+1]);
		for (i = 1; i < line.length; i++)
			if (line[i] === this)
				n.push(line[i-1]);
		return n;
	}

	isNeighborTo (other) {

		return this.neighbors.includes(other);
	}

	get left () {

		var line = this.inFront ? this.field.front : this.field.back;
		for (var i = 1; i < line.length; i++)
			if (line[i] === this)
				return line[i-1];
		return null;
	}

	get right () {

		var line = this.inFront ? this.field.front : this.field.back;
		for (var i = 0; i < line.length-1; i++)
			if (line[i] === this)
				return line[i+1];
		return null;
	}

	get mirror () {

		for (var i = 0; i < this.field.tiles.length; i++)
			if (this.field.tiles[i] === this)
				return this.field.opposite.tiles[i];
		return null;
	}

	get tilesBehind () {

		var b = [];
		if (this.inBack)
			return b;
		for (var i = 0; i < this.field.front.length; i++)
			if (this.field.front[i] === this) {
				b.push (this.field.back[i]);
				b.push (this.field.back[i+1]);
			}
		return b;
	}

	get tilesAhead () {

		var a = [], i;
		if (this.inFront)
			return a;
		for (i = 0; i < this.field.back.length-1; i++)
			if (this.field.back[i] === this)
				a.push (this.field.front[i]);
		for (i = 1; i < this.field.back.length; i++)
			if (this.field.back[i] === this)
				a.push (this.field.front[i-1]);
		return a;
	}

	get adjacents () {

		return this.neighbors.concat(this.inFront ? this.tilesBehind : this.tilesAhead);
	}

	isAdjacentTo (other) {

		return this.adjacents.includes(other);
	}

	isBehind (other) {

		return this.tilesAhead.includes(other);
	}

	isAhead (other) {

		return this.tilesBehind.includes(other);
	}

	distanceTo (other) {

		if (this.area !== other.area || other.id.type !== "tile")
			return -1;

		var num = this.id.no - 9 * this.field.id.no;
		num = num > 3 ? (num - 4) * 2 : num * 2 + 1;
		var numo = other.id.no - 9 * other.field.id.no;
		numo = numo > 3 ? (numo - 4) * 2 : numo * 2 + 1;

		return Math.ceil(Math.abs(num - numo)/2);
	}

	addHazards (hazards) {

		if (!hazards || this.hasHazards(hazards))
			return;
		if (this.hazards.length === 0)
			this.hazards.push(hazards)
		else {
			let groupindex = HAZARDS_GROUPS.findIndex(group => group.includes(hazards));
			let index = this.hazards.findIndex(h => HAZARDS_GROUPS[groupindex].includes(h));
			if (index > -1)
				this.hazards[index] = hazards;
			else this.hazards.push(hazards);
		}
		this.area.gameboard.update();
	}

	hasHazards (hazards) {

		return this.hazards.includes(hazards);
	}

	clearHazards (hazards) {

		if (!hazards)
			this.hazards = [];
		else {
			let index = this.hazards.indexOf(hazards);
			if (index > -1)
			  this.hazards.splice(index, 1);
		}
	}
}