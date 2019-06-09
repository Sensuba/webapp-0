import Event from "./Event";
import Hand from './Hand';
import Tile from './Tile';
import Deck from './Deck';
import Reader from '../blueprint/Reader';
import Library from '../../../services/Library';

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

	get eff () {

		if (this.computing || !this.nameCard)
			return this;
		this.computing = true;
		var res;
		if (this.isEff)
			res = this;
		else {
			res = Object.assign({}, this);
			res.isEff = true;
			res.states = Object.assign({}, this.states);
			res = this.mutations.reduce((card, mut) => mut(card), res);
		}
		this.computing = false;

		return res;
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

		if (this.onBoard && this.chp !== undefined && this.chp <= 0)
			this.resetBody();
		this.skillPt = 1;
		this.chp = this.eff.hp;
		this.goto(tile);
		if (this.isType("character"))
			this.resetSickness();
	}

	goto (loc) {

		if (this.location === loc)
			return;

		var former = this.location;
		this.location = loc;
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

		for (var k in this.model)
			this[k] = this.model[k];
		delete this.supercode;
		this.clearBoardInstance();
		if (this.blueprint)
			Reader.read(this.blueprint, this);
	}

	destroy () {

		if (this.area)
			this.area.gameboard.notify("destroycard", this.id);
		this.clearBoardInstance();
		if (this.area)
			this.goto(this.area.cemetery)
		else
			this.goto(null);
	}

	freeze () {

		this.states.frozen = true;
	}

	get frozen () {

		return this.states && this.states.frozen ? true : false;
	}

	damage (dmg, src) {

		if (!this.chp || dmg <= 0)
			return;

		this.chp -= dmg;
		this.area.gameboard.notify("damagecard", this.id, dmg, src.id);
	}

	heal (amt, src) {

		if (!this.chp || amt <= 0)
			return;

		this.chp = Math.min(this.eff.hp, this.chp + amt);
		this.gameboard.notify("healcard", this.id, amt, src.id);
	}

	boost (atk, hp, range) {

		if (atk === 0 && hp === 0 && range === 0)
			return;

		this.atk += atk;
		this.hp += hp;
		if (hp >= 0)
			this.chp += hp;
		else
			this.chp = Math.min(this.chp, this.eff.hp);
		this.range += range;
		this.gameboard.notify("boostcard", this.id, atk, hp, range);
	}

	set (cost, atk, hp, range) {

		if (cost || cost === 0)
			this.mana = cost;
		if (atk || atk === 0)
			this.atk = atk;
		if (hp || hp === 0) {
			this.hp = hp;
			this.chp = hp;
		}
		if (range || range === 0)
			this.range = range;
		this.gameboard.notify("setcard", this.id, cost, atk, hp, range);
	}

	silence () {

		this.faculties = [];
		this.mutations = [];
		this.events = [];
		this.states = {};
		delete this.blueprint;
		this.atk = parseInt(this.model.atk, 10);
		this.hp = parseInt(this.model.hp, 10);
		this.chp = Math.min(this.eff.hp, this.chp);
		this.silenced = true;
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

	hasState (state) {//if (this.states && this.nameCard && this.nameCard.startsWith("Princess")) console.log(this.states.initiative + " " + this.eff.states.initiative);

		return this.states && this.eff.states[state] ? true : false;
	}

	identify (data) {

		for (var k in data) {
			this[k] = data[k];
			if (!isNaN(this[k]))
				this[k] = parseInt(this[k], 10);
		}
		if (this.idCardmodel)
			//this.model = JSON.parse(localStorage.getItem("cardlist")).find(c => c.idCardmodel === this.idCardmodel);
			Library.getCard(this.idCardmodel, card => this.model = card);
		this.targets = [];
		this.faculties = [];
		this.mutations = [];
		if (this.isType("entity"))
			this.targets.push(Event.targets.friendlyEmpty);
		if (this.isType("hero")) {
			this.area.hero = this;
			this.chp = this.hp;
			this.actionPt = 1;
			this.skillPt = 1;
			this.faculties.push({no: 0, desc: "Create a mana receptacle.", cost: "!"});
		}
		/*if (this.blueprint && this.blueprint.triggers && this.blueprint.triggers.some(trigger => trigger.target && trigger.type === "play")) {
			var filter = this.blueprint.triggers.find(trigger => trigger.target).in[0];
			this.targets.push((src, target) => (!filter || typeof filter === 'object') || (target.occupied && target.card.isType(filter) && !target.card.hasState("exaltation")));
		}*/
		if (this.blueprint)
			Reader.read(this.blueprint, this);
		/*if (this.blueprint && this.blueprint.basis) {

			this.blueprint.basis.forEach (basis => {

				var trigger = this.blueprint[basis.type][basis.index];

				switch (trigger.type) {
				case "play":
					if (trigger.target) 
						this.targets.push(Target.read(trigger, this.blueprint));
					break;
				case "action":
					var action = {no: this.faculties.length, desc: trigger.in[1], cost: "!"};
					if (trigger.target) 
						action.target = Target.read(trigger, this.blueprint);
					this.faculties.push(action);
					break;
				case "skill":
					var skill = {no: this.faculties.length, desc: trigger.in[1], cost: trigger.in[2]};
					if (trigger.target) 
						skill.target = Target.read(trigger, this.blueprint);
					this.faculties.push(skill);
					break;
				case "passivemut":
					break;
				default:
				}
			})
		}*/
	}

	levelUp () {

		if (!this.isType("hero"))
			return;

		this.level++;
		var lv = this.level === 2 ? this.lv2 : this.lvmax;
		if (!lv) {
			this.level--;
			return;
		}

		this.atk = lv.atk;
		this.range = lv.range;
		this.overload = lv.overload;
		this.blueprint = lv.blueprint;
		this.targets = [Event.targets.friendlyEmpty];
		this.faculties = [{no: 0, desc: "Create a mana receptacle.", cost: "!"}];

		if (this.blueprint)
			Reader.read(this.blueprint, this);
	}

	get canBePaid () {

		return (this.mana || this.eff.mana === 0) && this.area && this.eff.mana <= this.area.manapool.usableMana;
	}

	get canBePlayed () {

		if (!this.inHand || !this.canBePaid || !this.area.isPlaying)
			return false;
		if (this.targets.length === 0)
			return true;

		return this.area.gameboard.tiles.some(t => this.canBePlayedOn([t]));
	}

	canBePlayedOn (targets) {

		if (!this.canBePaid || !this.area.isPlaying)
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

		return this.gameboard.tiles.filter(tile => targets(this, tile));
	}

	get canAct () {

		if (!this.onBoard || !this.area || !this.area.isPlaying)
			return false;
		if (this.frozen)
			return false;
		if (this.motionPt)
			return true;
		if ((this.actionPt || (this.hasState("fury") && this.strikes === 1)) && (!this.firstTurn || this.hasState("rush")))
			return true;
		if (this.skillPt && this.faculties && this.faculties.some(f => !isNaN(f.cost) && this.area.manapool.usableMana >= f.cost))
			return true;

		return false;
	}

	canAttack (target) {

		if (!this.isType("character") || !this.onBoard || !target.onBoard || this.area === target.area || this.frozen || this.eff.atk <= 0)
			return false;
		if (this.firstTurn && !this.hasState("rush"))
			return false;
		if (!this.actionPt && (!this.hasState("fury") || this.strikes !== 1))
			return false;

		var needed = 1;
		if (this.location.inBack)
			needed++;
		if (target.isCovered(this.hasState("flying")))
			needed++;
		if (!this.hasState("flying") && target.hasState("flying"))
			needed++;

		return this.range >= needed;
	}

	cover (other, flying = false) {

		if (!this.isType("character") || !this.onBoard || !other.onBoard)
			return false;
		return (other.location.isBehind(this.location) || (this.hasState("cover neighbors") && other.location.isNeighborTo(this.location))) && flying === this.hasState("flying");
	}

	get covered () {

		return this.isCovered();
	}

	isCovered (flying = false) {

		if (!this.onBoard)
			return false;
		return this.location.field.entities.some(e => e.cover(this, flying));
	}

	canMoveOn (tile) {

		if (!this.onBoard || !this.motionPt || this.frozen || tile.occupied)
			return false;
		return this.location.isAdjacentTo(tile);
	}

	attack () {

		if (!this.hasState("fury") || this.strikes !== 1)
			this.actionPt--;
		this.strikes++;
		this.motionPt = 0;
	}

	addShield () {

		this.shield = true;
	}

	breakShield () {

		this.shield = false;
	}

	get hasShield () {

		return this.shield ? true : false;
	}

	move () {

		this.motionPt--;
	}

	setState (state, value) {

		this.states[state] = value;
	}

	use (isAction) {

		if (isAction) {
			this.actionPt--;
			this.motionPt = 0;
		}
		else
			this.skillPt--;
	}

	get gameboard () {

		return this.location ? this.location.area.gameboard : null;
	}

	resetSickness () {

		this.actionPt = 1;
		this.motionPt = 0;
		this.firstTurn = true;
		this.strikes = 0;
	}

	refresh () {

		this.skillPt = 1;
		if (this.isType("character")) {
			this.actionPt = 1;
			this.motionPt = 1;
			this.firstTurn = false;
			this.strikes = 0;
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