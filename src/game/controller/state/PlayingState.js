import SelectTargetState from './SelectTargetState';

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
		}
	}
}