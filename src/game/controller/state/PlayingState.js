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
				if (target.targets.length === 0)
					this.manager.controller = new WaitForConfirmState(this.manager, target, this);
				else
					this.manager.controller = new SelectTargetState(this.manager, target, [], this);
				return;
			}
		} else if (target.onBoard) {
			if (target.canAct) {
				this.manager.controller = new AttackOrMoveState(this.manager, target, this);
				return;
			}
		}
		
		this.manager.controller = this;
	}

	haloFor (card) {

		return card.canBePlayed ? "sensuba-card-playable" : "";
	}

	targetable (tile) {

		return "";
	}
}