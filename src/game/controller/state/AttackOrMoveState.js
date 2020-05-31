import SelectFacultyTargetState from './SelectFacultyTargetState';

export default class AttackOrMoveState {

	constructor (manager, card, def) {

		this.manager = manager;
		this.card = card;
		this.def = def;
		this.manager.update({faculties: card.faculties.map(f => Object.assign({}, f, {usable: this.card.canUse(f)})), secret: card.isType("secret"), secretcount: card.isType("secret") ? card.secretcount : -1});
	}

	select (target) {

		if (target === this.card) 
			return;
		
		if (target.id.type === "faculty") {
			var faculty = this.card.faculties[target.id.no];
			if (this.card.isType("secret")){
				if (faculty.no === this.card.faculties.length-1)
					this.manager.command({ type: "param", id: this.card.id, option: "destroy" });
				else {
					this.card.secreteffect = target.id.no;
					this.manager.command({ type: "param", id: this.card.id, option: "seteffect", value: faculty.no });
				}
				this.manager.controller = this.def;
	          	this.manager.unselect();
	          	return;
			}
			if (faculty.target) {
				this.manager.controller = new SelectFacultyTargetState(this.manager, this.card, faculty, this.def);
			}
			else {
				this.manager.command({ type: "faculty", id: this.card.id, faculty: target.id.no });
				this.manager.controller = this.def;
	          	this.manager.unselect();
			}
			return;
		} else if (target.id.type === "parameter") {
			this.card.secretcount = target.id.no;
			this.manager.command({ type: "param", id: this.card.id, option: "setcount", value: target.id.no });
			this.manager.controller = this.def;
          	this.manager.unselect();
		}

		var ltarget = target.id.type === "card" ? target.location : target;

		if (ltarget.id.type === "tile" && ltarget.area.isPlaying) {
			if (this.card.canMoveOn(ltarget)) {
				this.manager.command({ type: "move", id: this.card.id, to: ltarget.id });
				this.manager.controller = this.def;
	          	this.manager.unselect();
				return;
			}
		} else {
			if (ltarget.occupied && this.card.canAttack(ltarget.card)) {
				this.manager.command({ type: "attack", id: this.card.id, target: ltarget.card.id });
				this.manager.controller = this.def;
	          	this.manager.unselect();
				return;
			}
		}

		if (this.def)
			this.def.select(target);
	}

	haloFor (card) {

		return this.card === card ? "sensuba-card-selected" : (this.card.canAttack(card) ? "sensuba-card-targetable" : "");
	}

	targetable (tile) {

		return (this.card.motionPt > 0 && this.card.canMoveOn(tile)) || (tile.occupied && this.card.canAttack(tile.card)) ? "sensuba-tile-targetable" : "";
	}
}