export default class WaitingState {

	constructor (manager) {

		this.manager = manager;
		this.manager.update({faculties: undefined});
	}

	select (target) { }

	haloFor (card) {

		return "";
	}

	targetable (tile) {

		return "";
	}
}