export default class PlayingState {

	constructor (manager) {

		this.manager = manager;
	}

	select (target) {
		
		this.manager.command(target);
	}
}