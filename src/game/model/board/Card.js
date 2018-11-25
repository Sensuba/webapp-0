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

	get destroyed() {

		return this.location === null;
	}

	get damaged() {

		return this.hp && this.chp && this.chp < this.hp;
	}

	summon (tile) {

		this.skillPt = 1;
		this.chp = this.hp;
		this.goto(tile);
		if (this.isType("character"))
			this.resetSickness();
		this.area.gameboard.notify("summon", this.id, tile.id);
	}

	goto (loc) {

		if (this.location === loc)
			return;

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
		this.clearBoardInstance();
		if (this.blueprint)
			;//Reader.read(this.blueprint, this);
	}

	destroy () {

		this.area.gameboard.notify("destroycard", this.id);
		this.clearBoardInstance();
		this.goto(null);
	}

	damage (dmg, src) {

		if (!this.chp || dmg <= 0)
			return;

		this.chp -= dmg;
		this.area.gameboard.notify("damagecard", this.id, dmg, src.id);
		//if (this.chp <= 0)
		//	this.destroy();
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
			this.targets.push((src, target) => !filter || (target.occupied && target.card.isType(filter)));
		}
		if (this.isType("hero")) {
			this.area.hero = this;
			this.chp = this.hp;
			this.actionPt = 1;
			this.motionPt = 1;
			this.skillPt = 1;
		}
	}

	get canBePaid () {

		return this.mana && this.area && this.mana <= this.area.manapool.usableMana;
	}

	get canBePlayed () {

		if (!this.inHand || !this.canBePaid)
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
			if (this.event)
				this.event.execute(this.gameboard, targets ? targets[1] : undefined);
			break;
		case "spell":
			this.goto(this.area.court);
			if (this.event)
				this.event.execute(this.gameboard, targets ? targets[0] : undefined);
			this.destroy();
			break;
		default: break;
		}
	}

	possibleTargets (targets) {

		return this.gameboard.tiles.map(tile => targets(this, tile));
	}

	canAttack (target) {

		if (this.firstTurn || !this.actionPt || !this.isType("character") || !this.onBoard || !target.onBoard || this.area === target.area)
			return false;

		var needed = 1;
		if (this.location.inBack)
			needed++;
		if (target.covered)
			needed++;

		return this.range >= needed;
	}

	cover (other) {

		if (!this.isType("character") || !this.onBoard || !other.onBoard)
			return false;
		return other.location.isBehind(this.location);
	}

	get covered () {

		if (!this.onBoard)
			return false;
		return this.location.field.entities.some(e => e.cover(this));
	}

	canMoveOn (tile) {

		if (!this.onBoard || !this.motionPt)
			return;
		return this.location.isAdjacentTo(tile);
	}

	attack () {

		this.actionPt--;
	}

	move () {

		this.motionPt--;
	}

	get gameboard () {

		return this.location ? this.location.area.gameboard : null;
	}

	resetSickness () {

		this.actionPt = 1;
		this.motionPt = 0;
		this.firstTurn = true;
	}

	refresh () {

		this.skillPt = 1;
		if (this.isType("character")) {
			this.actionPt = 1;
			this.motionPt = 1;
			this.firstTurn = false;
		}
	}

	clearBoardInstance () {

		delete this.chp;
		delete this.actionPt;
		delete this.skillPt;
		delete this.motionPt;
		delete this.firstTurn;
	}
}