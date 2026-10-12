import PlayingState from './PlayingState';

export default class ChooseboxState {

	constructor (manager, choosebox) {

		this.manager = manager;
		this.choosebox = choosebox;
		this.manager.update({faculties: undefined});
	}

	select (target) {

		if (this.choosebox.opened && target.location === this.choosebox && this.choosebox.hasCard(target)) {
			const result = this.manager.command({ type: "choose", id: target.id });
			if (!result || !result.ok) return;
			this.manager.controller = new PlayingState(this.manager);
			return;
		}
	}

	haloFor (card) {

		return "";
	}

	targetable (tile) {

		return "";
	}
}
