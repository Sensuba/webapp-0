import SelectTargetState from './SelectTargetState';
import AttackOrMoveState from './AttackOrMoveState';
import WaitForConfirmState from './WaitForConfirmState';

export default class PlayingState {

	constructor (manager) {

		this.manager = manager;
		this.manager.update({faculties: undefined});
	}

	select (target) {

		if (target.inHand) {
			if (target.canBePlayed) {
				delete this.highlight;
				if (target.targets.length === 0)
					this.manager.controller = new WaitForConfirmState(this.manager, target, this);
				else
					this.manager.controller = new SelectTargetState(this.manager, target, [], this);
				return;
			}
		} else if (target.onBoard) {
			if (target.canAct) {
				delete this.highlight;
				this.manager.controller = new AttackOrMoveState(this.manager, target, this);
				return;
			}
		}
		
		this.manager.controller = this;
	}

	haloFor (card) {

		if (this.highlight && this.highlight.no === card.id.no)
			return "sensuba-card-highlight";

		return card.canBePlayed ? "sensuba-card-playable" : "";
	}

	targetable (tile) {

		return "";
	}
}