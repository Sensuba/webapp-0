import SelectTargetState from './SelectTargetState';
import AttackOrMoveState from './AttackOrMoveState';

export default class PlayingState {

	constructor (manager) {

		this.manager = manager;
	}

	select (target) {

		if (target.inHand) {
			if (target.canBePlayed) {
				if (target.targets.length === 0)
					this.manager.command({ type: "play", id: target.id });
				else
					this.manager.controller = new SelectTargetState(this.manager, target);
			}
		} else if (target.onBoard) {
			if (target.motionPt || target.actionPt)
				this.manager.controller = new AttackOrMoveState(this.manager, target);
		}
	}

	haloFor (card) {

		return card.canBePlayed ? "sensuba-card-playable" : "";
	}

	targetable (tile) {

		return "";
	}
}