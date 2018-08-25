import Event from "./Event";

export default class Card {

	constructor (noId, location) {

		this.id = { type: "card", no: noId };

		this.location = null;
		if (location) {
			location.area.gameboard.notify("newcard", this.id, location.id);
			this.goto(location);
		}
	}

	get data() {

		var copy = Object.assign({}, this);
		delete copy.location;
		return copy;
	}

	set data(value) {

		for (var k in value)
			this[k] = value[k];
	}

	summon (tile) {

		if (tile.occupied || tile.card === this)
			return;
		this.skillPt = 1;
		this.goto(tile);
		if (this.isType("character"))
			this.resetSickness();
	}

	goto (loc) {

		var former = this.location;
		this.location = loc;
		if (this.area)
			this.area.gameboard.notify("cardmove", this.id, loc.id);
		if (former && former.hasCard (this))
			former.removeCard (this);
		if (former && (loc === null || former.locationOrder > loc.locationOrder || loc.locationOrder === 0))
			this.resetBody ();
		if (loc && !loc.hasCard (this))
			loc.addCard (this);
		/*if (former != null && !destroyed)
			Notify ("card.move", former, value);
		if (location is Tile)
			lastTileOn = location as Tile;*/
	}

	resetBody () {

		var model = null;//Bank.get(this.model);
		for (var k in model)
			this[k] = model[k];
		delete this.supercode;
		if (this.blueprint)
			;//Reader.read(this.blueprint, this);
	}

	destroy () {

		this.area.gameboard.notify("destroycard", this.id);
		this.goto(null);
	}

	get area () {

		return this.location ? this.location.area : null;
	}

	isType (type) {

		switch (type) {
		case "entity": return this.isType("character") || this.isType("artifact");
		case "character" : return this.isType("hero") || this.isType("figure");
		default: return this.cardType === type;
		}
	}

	isArchetype (arc) {

		return this.archetypes && this.archetypes.includes(arc);
	}

	identify (data) {

		if (this.identified)
			return;
		this.data = data;
		this.identified = true;
	}

	get canBePaid () {

		return this.mana && this.area && this.mana <= this.area.manapool.usableMana;
	}

	play (target) {

		switch(this.cardType) {
		case "figure":
			this.summon(target);
			break;
		case "spell":
			this.goto(this.area.court);
			if (this.event)
				this.event.execute(target);
			this.destroy();
			break;
		default: break;
		}
	}

	resetSickness () {

		this.actionPt = 1;
		this.skillPt = 1;
		this.motionPt = 0;
		this.firstTurn = true;
	}
}