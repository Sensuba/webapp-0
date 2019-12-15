import PlayingState from './PlayingState';

export default class WaitForConfirmState {

	constructor (manager, choosebox) {

		this.manager = manager;
		this.choosebox = choosebox;
		this.manager.update({faculties: undefined});
	}

	select (target) {

		if (target.location && target.location.id.type === "choosebox") {
			this.manager.command({ type: "choose", id: target.id });
			this.manager.controller = new PlayingState(this.manager);
			this.choosebox.close();
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