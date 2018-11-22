import Event from "./Event";
import Hand from './Hand';
import Tile from './Tile';
import Deck from './Deck';

export default class Card {

	constructor (noId, location) {

		this.id = { type: "card", no: noId };
		location.area.gameboard.register(this);

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

	get inHand() {

		return this.location instanceof Hand;
	}

	get inDeck() {

		return this.location instanceof Deck;
	}

	get onBoard() {

		return this.location instanceof Tile;
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

		for (var k in data)
			this[k] = data[k];
		this.targets = [];
		if (this.isType("entity"))
			this.targets.push(Event.targets.emptyFriendlyTile);
		if (this.blueprint && this.blueprint.triggers && this.blueprint.triggers.some(trigger => trigger.target)) {
			var filter = this.blueprint.triggers.find(trigger => trigger.target).in[0];
			this.targets.push((src, target) => !filter || target.occupied && target.card.isType(filter));
		}
		if (this.isType("hero"))
			this.area.hero = this;
	}

	get canBePaid () {

		return this.mana && this.area && this.mana <= this.area.manapool.usableMana;
	}

	get canBePlayed () {

		if (!this.canBePaid)
			return false;
		if (this.targets.length === 0)
			return true;

		return this.area.gameboard.tiles.some(t => this.canBePlayedOn([t]));
	}

	canBePlayedOn (targets) {

		if (!this.canBePaid)
			return false;
		if (this.targets.length === 0)
			return true;
		if (targets.length === 0)
			return false;

		return targets.every((t, i) => this.targets[i](this, t));
	}

	play (targets) {

		this.area.manapool.use(this.mana);
		switch(this.cardType) {
		case "figure":
			this.summon(targets[0]);
			break;
		case "spell":
			this.goto(this.area.court);
			if (this.event)
				this.event.execute(targets ? targets[0] : undefined);
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