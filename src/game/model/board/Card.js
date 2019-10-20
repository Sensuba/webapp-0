import Event from "./Event";
import Hand from './Hand';
import Tile from './Tile';
import Deck from './Deck';
import Mutation from './Mutation';
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

		return this.hp && this.chp && this.chp < this.eff.hp;
	}

	summon (tile) {

		if (this.onBoard && this.chp !== undefined && this.chp <= 0)
			this.resetBody();
		this.skillPt = 1;
		this.chp = this.eff.hp;
		this.goto(tile);
		if (this.isType("character"))
			this.resetSickness();
		this.activate();
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
		this.update();
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
		this.update();
	}

	get frozen () {

		return this.hasState("frozen") ? true : false;
	}

	get exalted () {

		return this.hasState("exaltation") ? true : false;
	}

	damage (dmg, src) {

		if (!this.chp || dmg <= 0)
			return;

		this.chp -= dmg;
		this.update();
		this.area.gameboard.notify("damagecard", this.id, dmg, src.id);
	}

	heal (amt, src) {

		if (!this.chp || amt <= 0)
			return;

		if (this.isType("artifact"))
			this.chp += amt;
		else
			this.chp = Math.min(this.eff.hp, this.chp + amt);
		this.update();
		this.gameboard.notify("healcard", this.id, amt, src.id);
	}

	boost (atk, hp, range) {

		if (atk === 0 && hp === 0 && range === 0)
			return;

		this.atk += atk;
		this.hp += hp;
		if (hp >= 0 || this.isType("artifact"))
			this.chp += hp;
		else
			this.chp = Math.min(this.chp, this.eff.hp);
		this.range += range;
		this.update();
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
		this.update();
		this.gameboard.notify("setcard", this.id, cost, atk, hp, range);
	}

	silence () {

		this.faculties = [];
		this.mutations = [];
		this.passives = [];
		this.events = [];
		this.states = {};
		delete this.blueprint;
		this.mana = parseInt(this.model.mana, 10);
		this.atk = parseInt(this.model.atk, 10);
		this.hp = parseInt(this.model.hp, 10);
		this.chp = Math.min(this.eff.hp, this.chp);
		this.silenced = true;
		this.update();
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

	hasState (state) {

		return this.states && this.eff.states[state] ? true : false;
	}

	identify (data) {

		if (this.nameCard)
			return;
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
		this.passives = [];
		this.mutations = [];
		if (this.isType("entity"))
			this.targets.push(Event.targets.friendlyEmpty);
		if (this.isType("hero")) {
			this.area.hero = this;
			this.chp = this.hp;
			this.actionPt = 1;
			this.skillPt = 1;
			this.activated = true;
			this.faculties.push({no: 0, desc: "Create a mana receptacle.", cost: "!"});
		}
		/*if (this.blueprint && this.blueprint.triggers && this.blueprint.triggers.some(trigger => trigger.target && trigger.type === "play")) {
			var filter = this.blueprint.triggers.find(trigger => trigger.target).in[0];
			this.targets.push((src, target) => (!filter || typeof filter === 'object') || (target.occupied && target.card.isType(filter) && !target.card.hasState("exaltation")));
		}*/
		if (this.blueprint)
			Reader.read(this.blueprint, this);
		if (this.isType("artifact"))
			this.faculties.push({no: this.faculties.length, desc: "Explode.", cost: "0"});
		this.update();
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

		this.atk = parseInt(lv.atk, 10);
		this.range = parseInt(lv.range, 10);
		this.overload = parseInt(lv.blueprint, 10);
		this.blueprint = lv.blueprint;
		this.targets = [Event.targets.friendlyEmpty];
		this.faculties = [{no: 0, desc: "Create a mana receptacle.", cost: "!"}];

		if (this.blueprint)
			Reader.read(this.blueprint, this);
		this.gameboard.update();
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
		this.gameboard.update();
	}

	possibleTargets (targets) {

		return this.gameboard.tiles.filter(tile => targets(this, tile));
	}

	get canAct () {

		var eff = this.eff;

		if (!this.onBoard)
			return false;
		if (eff.frozen)
			return false;
		if (eff.motionPt)
			return true;
		if ((eff.actionPt || (this.hasState("fury") && eff.strikes === 1)) && (!eff.firstTurn || this.hasState("rush")))
			return true;
		if (this.faculties.some(f => this.canUse(f)))
			return true;

		return false;
	}

	canUse (faculty) {

		return (this.skillPt && !isNaN(faculty.cost) && (this.isType("artifact") ? this.eff.chp >= -faculty.cost : this.area.manapool.usableMana >= faculty.cost)) || (this.actionPt && isNaN(faculty.cost));
	}

	canAttack (target) {

		var eff = this.eff;

		if (!this.isType("character") || !this.onBoard || !target.onBoard || this.area === target.area || eff.frozen || eff.atk <= 0 || eff.range <= 0)
			return false;
		if (eff.firstTurn && !this.hasState("rush"))
			return false;
		if (!eff.actionPt && (!this.hasState("fury") || eff.strikes !== 1))
			return false;

		var needed = 1;
		if (this.location.inBack)
			needed++;
		if (target.isCovered(this.hasState("flying")))
			needed++;
		if (!this.hasState("flying") && target.hasState("flying"))
			needed++;

		return eff.range >= needed;
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
		this.gameboard.update();
	}

	addShield () {

		this.shield = true;
		this.update();
	}

	breakShield () {

		this.shield = false;
		this.update();
	}

	get hasShield () {

		return this.shield ? true : false;
	}

	move () {

		this.motionPt--;
		this.gameboard.update();
	}

	setState (state, value) {

		this.states[state] = value;
		this.update();
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

	setPoints (action, skill, motion) {

		this.actionPt = action;
		this.skillPt = skill;
		this.motionPt = motion;
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

	mutate (effect, end) {

		var mut = new Mutation(effect);
		mut.attach(this);
		if (end)
			var unsub = end((t,s,d) => {
				mut.detach();
				this.update();
				unsub();
			});
		this.update();
	}

	activate () {

		this.activated = true;
		if (this.passives)
			this.passives.forEach(passive => passive.activate());
		this.gameboard.update();
	}

	deactivate () {

		this.activated = false;
		if (this.passives)
			this.passives.forEach(passive => passive.deactivate());
		this.gameboard.update();
	}

	get eff () {

		if (this.isEff || this.computing)
			return this;
		if (!this.nameCard)
			return this;
		if (!this.mutatedState)
			this.update();
		return this.mutatedState;
	}

	update () {

		if (this.isEff)
			return;
		if (!this.nameCard)
			return;
		if (this.computing)
			return;
		this.computing = true;
		var res;
		res = Object.assign({}, this);
		res.isEff = true;
		res.states = Object.assign({}, this.states);
		res = this.mutations.reduce((card, mut) => mut.apply(card), res);
		this.gameboard.auras.forEach(aura => {
			if (aura.applicable(this))
				res = aura.apply(res);
		});
		if (this.isType("character")) {
			this.php = this.php || { hp: this.hp, chp: this.chp };
			var plushp = Math.max (0, res.hp - this.php.hp);
			this.chp = Math.min(res.hp, this.chp + plushp);
			res.chp = this.chp;
			this.php = { hp: res.hp, chp: res.chp };
		}
		this.computing = false;

		this.mutatedState = res;
	}

	/*get eff () {

		if (this.computing)
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

	update () {}*/

	clearBoardInstance () {

		delete this.chp;
		delete this.actionPt;
		delete this.skillPt;
		delete this.motionPt;
		delete this.firstTurn;
		this.deactivate();
	}
}