import Event from "./Event";
import Hand from './Hand';
import Tile from './Tile';
import Deck from './Deck';
import Cemetery from './Cemetery';
import Discard from './Discard';
import Mutation from './Mutation';
import Reader from '../blueprint/Reader';
import Library from '../../../services/Library';

export default class Card {

	constructor (noId, location) {

		this.id = { type: "card", no: noId };
		location.area.gameboard.register(this);

		this.location = null;
		if (location) {
			//location.area.gameboard.notify("newcard", this.id, location.id);
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

		return this.location === null || this.location instanceof Cemetery || this.location instanceof Discard;
	}

	get isGhost() {

		return this.onBoard && this.chp <= 0;
	}

	get damaged() {

		return this.hp && this.chp && this.chp < this.eff.hp;
	}

	summon (tile) {

		if (this.dying)
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
		if (former instanceof Tile && !(loc instanceof Tile) && this.activated)
			this.deactivate();
		if (loc instanceof Tile && !(former instanceof Tile) && this.activated)
			this.activate();
		if (former && former.hasCard (this))
			former.removeCard (this);
		if (former && (loc === null || former.locationOrder > loc.locationOrder || former.locationOrder === 0))
			this.resetBody ();
		if (loc && !loc.hasCard (this))
			loc.addCard (this);
		/*if (former != null && !destroyed)
			Notify ("card.move", former, value);
		if (location is Tile)
			lastTileOn = location as Tile;*/
	}

	resetBody () {

		let wasActivated = this.activated;
		if (this.activated)
			this.deactivate();
		for (var k in this.model) {
			this[k] = this.model[k];
			if (!isNaN(this[k]))
				this[k] = parseFloat(this[k], 10);
		}
		delete this.supercode;
		this.faculties = [];
		this.mutations = [];
		this.cmutations = [];
		this.passives = [];
		this.events = [];
		this.states = {};
		this.shield = false;
		this.silenced = false;
		this.targets = [];
		delete this.variables;
		if (this.isType("entity"))
			this.targets.push(Event.targets.friendlyEmpty);
		this.clearBoardInstance();
		if (wasActivated)
			this.activate();
		if (this.blueprint)
			Reader.read(this.blueprint, this);
		this.update();
	}

	destroy () {

		if (this.destroyed)
			return;
		var onBoard = this.onBoard;
		//if (this.area)
			//this.area.gameboard.notify("destroycard", this.id);
		this.clearBoardInstance();
		if (this.area)
			this.goto(onBoard ? this.area.cemetery : this.area.discard)
		else
			this.goto(null);
		this.gameboard.update();
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

	get concealed () {

		return this.hasState("concealed") ? true : false;
	}

	get targetable () {

		return !this.exalted && !this.concealed;
	}

	damage (dmg, src) {

		if (!this.chp || dmg <= 0)
			return;

		this.chp -= dmg;
		this.update();
		//this.area.gameboard.notify("damagecard", this.id, dmg, src.id);
	}

	heal (amt, src) {

		if (!this.chp || amt <= 0)
			return;

		if (this.isType("artifact"))
			this.chp += amt;
		else
			this.chp = Math.min(this.eff.hp, this.chp + amt);
		this.update();
		//this.gameboard.notify("healcard", this.id, amt, src.id);
	}

	boost (atk, hp, range) {

		if (atk === 0 && hp === 0 && range === 0)
			return;

		this.atk += atk;
		this.hp += hp;
		if (hp < 0 && !this.isType("artifact"))
			this.chp = Math.min(this.chp, this.eff.hp);
		this.range += range;
		this.update();
		//this.gameboard.notify("boostcard", this.id, atk, hp, range);
	}

	changeCost (value) {

		if (value === 0)
			return;

		this.mana += value;
		this.update();
		//this.gameboard.notify("changecost", this, value);
	}

	set (cost, atk, hp, range) {

		if (cost || cost === 0) {
			this.mana = cost;
			this.originalMana = this.mana;
		}
		if (atk || atk === 0) {
			this.atk = atk;
			this.originalAtk = this.atk;
		}
		if (hp || hp === 0) {
			this.hp = hp;
			this.chp = hp;
			this.originalHp = this.hp;
		}
		if (range || range === 0) {
			this.range = range;
			this.originalRange = this.range;
		}
		this.update();
		//this.gameboard.notify("setcard", this.id, cost, atk, hp, range);
	}

	boostoverload (value) {

		if (!value)
			return;

		this.ol += value;
		this.update();
		//this.gameboard.notify("overloadcard", this, value);
	}

	silence () {

		this.deactivate();
		this.faculties = [];
		this.mutations = [];
		this.cmutations = [];
		this.passives = [];
		this.events = [];
		this.states = {};
		delete this.blueprint;
		this.mana = this.originalMana;
		this.atk = this.originalAtk;
		this.hp = this.originalHp;
		this.range = this.originalRange;
		this.chp = Math.min(this.eff.hp, this.chp);
		this.silenced = true;
		this.activate();
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
		this.become(data);
	}

	become (data) {

		let wasActivated = this.activated;
		if (this.activated)
			this.deactivate();
		for (var k in data) {
			this[k] = data[k];
			if (!isNaN(this[k]))
				this[k] = parseFloat(this[k], 10);
		}
		if (this.idCardmodel)
			Library.getCard(this.idCardmodel, card => this.model = card);
		this.originalMana = this.mana;
		this.originalAtk = this.atk;
		this.originalHp = this.hp;
		this.originalRange = this.range;
		this.targets = [];
		this.faculties = [];
		this.passives = [];
		this.mutations = [];
		this.cmutations = [];
		if (wasActivated)
			this.activate();
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
		if (this.blueprint)
			Reader.read(this.blueprint, this);
		if (this.isType("hero")) {
			let lvupf = this.faculties.find(f => f.desc.includes("Level Up"));
			if (lvupf)
				lvupf.show = Object.assign({}, this, { level: this.level === 1 ? 2 : 3 });
		}
		if (this.isType("artifact"))
			this.faculties.push({no: this.faculties.length, desc: "Explode.", cost: "0"});
		if (this.onBoard)
			this.resetSickness();
		this.update();
		if (data && data.chp) {
			this.chp = data.chp;
			this.update();
		}
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
		this.originalAtk = this.atk;
		this.originalRange = this.range;
		this.blueprint = lv.blueprint;
		this.targets = [Event.targets.friendlyEmpty];
		this.faculties = [{no: 0, desc: "Create a mana receptacle.", cost: "!"}];

		if (this.blueprint)
			Reader.read(this.blueprint, this);
		if (this.isType("hero")) {
			let lvupf = this.faculties.find(f => f.desc.includes("Level Up"));
			if (lvupf)
				lvupf.show = Object.assign({}, this, { level: this.level === 1 ? 2 : 3 });
		}
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

		if (!this.area.isPlaying)
			return false;
		if (!this.onBoard)
			return false;
		if (this.frozen)
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

		if (!this.area.isPlaying)
			return false;
		return (this.skillPt && !isNaN(faculty.cost) && (this.isType("artifact") ? this.eff.chp >= -faculty.cost : this.area.manapool.usableMana >= faculty.cost)) || (this.actionPt && isNaN(faculty.cost) && !this.firstTurn);
	}

	canAttack (target) {

		var eff = this.eff;

		if (!this.isType("character") || !this.onBoard || !target.onBoard || this.area === target.area || this.frozen || eff.atk <= 0 || eff.range <= 0 || target.concealed || this.hasState("static"))
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

	tryToCover (other, flying = false) {

		if (!this.isType("character") || !this.onBoard || !other.onBoard || this.concealed)
			return false;
		return (other.location.isBehind(this.location) || (this.hasState("cover neighbors") && other.location.isNeighborTo(this.location))) && flying === this.hasState("flying");
	}

	cover (other, flying = false) {

		return this.tryToCover(other, flying) && !other.tryToCover(this, flying);
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

		if (!this.onBoard || !this.motionPt || this.frozen || tile.occupied || this.hasState("static"))
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

		this.states = this.states || {};
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
		this.skillPt = 1;
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
			var unsub = end.subscribe((t,s,d) => {
				mut.detach();
				this.update();
				unsub();
			});
		this.update();
	}

	setVariable (name, value) {

		this.variables = this.variables || {};
		if (value === null || value === undefined) {
			delete this.variables[name];
			return;
		}
		switch (value.type) {
		case "int":
			value = value.value;
			break;
		default: break;
		}
		this.variables[name] = value;
	}

	getVariable (name) {

		return this.variables ? this.variables[name] : undefined;
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

	getEffects () {

		return this.blueprint.triggers.map(t => t.getBloc());
	}

	get eff () {

		var contacteffect = (eff) => {

			if (!this.oncontact)
				return eff;
			var res = Object.assign({}, eff);
			this.cmutations.forEach(cmut => {
				if (!cmut.targets || cmut.targets(this.oncontact))
					res = cmut.effect(res);
			});
			return res;
		}

		if (this.isEff || this.computing || !this.gameboard.started)
			return contacteffect(this.mutatedState || this);
		if (!this.nameCard)
			return contacteffect(this.mutatedState || this);
		if (!this.mutatedState)
			this.update();
		return contacteffect(this.mutatedState);
	}

	update () {

		if (this.gameboard && !this.gameboard.started)
			return;
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
		let updatephp = () => {
			if (this.isType("character")) {
				this.php = this.php || { hp: this.hp, chp: this.chp };
				var plushp = Math.max (0, res.hp - this.php.hp);
				this.chp = Math.min(res.hp, this.chp + plushp);
				res.chp = this.chp;
				this.php = { hp: res.hp, chp: res.chp };
			}
		}
		this.gameboard.auras.forEach(aura => {
			if (aura.applicable(this))
				res = aura.apply(res);
		});
		if (!this.mutatedState)
			this.mutatedState = res;
		this.mutatedState.states = Object.assign({}, res.states);
		res = this.mutations.reduce((card, mut) => mut.apply(card), res);
		updatephp();
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