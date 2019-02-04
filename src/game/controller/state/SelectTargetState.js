import PlayingState from './PlayingState';

export default class SelectTargetState {

	constructor (manager, card, targets) {

		this.manager = manager;
		this.card = card;
		this.targets = targets || [];
		this.manager.update({faculties: undefined});
	}

	select (target) {

		if (target.id.type === "card")
			target = target.location;

		var targets = this.targets.slice(0);
		targets.push(target);
		if (this.card.canBePlayedOn(targets)) {
			if (targets.length >= this.card.targets.length || this.card.possibleTargets(this.card.targets[targets.length]).length === 0) {
				this.manager.command({ type: "play", targets: targets.map(t => t.id), id: this.card.id });
				this.manager.controller = new PlayingState(this.manager);
			} else
				this.manager.controller = new SelectTargetState(this.manager, this.card, targets);
		}
	}

	haloFor (card) {

		if (this.card === card)
			return "sensuba-card-selected";
		if (!card.onBoard)
			return "";
		var targets = this.targets.slice(0);
		targets.push(card.location);
		return this.card.canBePlayedOn(targets) ? "sensuba-card-targetable" : "";
	}

	targetable (tile) {

		var targets = this.targets.slice(0);
		targets.push(tile);
		return this.card.canBePlayedOn(targets) ? "sensuba-tile-targetable" : "";
	}
}