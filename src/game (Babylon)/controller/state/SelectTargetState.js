import PlayingState from './PlayingState';

export default class SelectTargetState {

	constructor (manager, card, targets) {

		this.manager = manager;
		this.card = card;
		this.targets = targets || [];
	}

	select (target) {

		var targets = this.targets.slice(0);
		targets.push(target);
		if (this.card.canBePlayedOn(targets)) {
			this.manager.command({ type: "play", targets: targets.map(t => t.id), id: this.card.id });
			this.manager.controller = new PlayingState(this.manager);
		}
	}
}