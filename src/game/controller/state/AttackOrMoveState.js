import PlayingState from './PlayingState';
import SelectFacultyTargetState from './SelectFacultyTargetState';

export default class AttackOrMoveState {

	constructor (manager, card) {

		this.manager = manager;
		this.card = card;
		this.manager.update({faculties: card.faculties.map(f => Object.assign({}, f, {usable: this.card.canUse(f)}))});
	}

	select (target) {

		if (target.id.type === "faculty") {
			var faculty = this.card.faculties[target.id.no];
			if (faculty.target) {
				this.manager.controller = new SelectFacultyTargetState(this.manager, this.card, faculty);
			}
			else {
				this.manager.command({ type: "faculty", id: this.card.id, faculty: target.id.no });
				this.manager.controller = new PlayingState(this.manager);
			}
			return;
		}

		if (target.id.type === "card")
			target = target.location;

		if (target.area.isPlaying) {
			if (this.card.canMoveOn(target)) {
				this.manager.command({ type: "move", id: this.card.id, to: target.id });
				this.manager.controller = new PlayingState(this.manager);
			}
		} else {
			if (target.occupied && this.card.canAttack(target.card)) {
				this.manager.command({ type: "attack", id: this.card.id, target: target.card.id });
				this.manager.controller = new PlayingState(this.manager);
			}
		}
	}

	haloFor (card) {

		return this.card === card ? "sensuba-card-selected" : (this.card.canAttack(card) ? "sensuba-card-targetable" : "");
	}

	targetable (tile) {

		return (this.card.motionPt > 0 && this.card.canMoveOn(tile)) || (tile.occupied && this.card.canAttack(tile.card)) ? "sensuba-tile-targetable" : "";
	}
}