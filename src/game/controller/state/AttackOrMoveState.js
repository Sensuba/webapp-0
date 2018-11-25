export default class AttackOrMoveState {

	constructor (manager, card) {

		this.manager = manager;
		this.card = card;
	}

	select (target) {

		if (target.area.isPlaying) {
			if (this.card.canMoveOn(target)) {
				this.manager.command({ type: "move", id: this.card.id, to: target.id });
				this.manager.controller = this.manager.states.playing;
			}
		} else {
			if (target.occupied && this.card.canAttack(target.card)) {
				this.manager.command({ type: "attack", id: this.card.id, target: target.card.id });
				this.manager.controller = this.manager.states.playing;
			}
		}
	}

	haloFor (card) {

		return this.card === card ? "sensuba-card-selected" : (this.card.canAttack(card) ? "sensuba-card-targetable" : "");
	}

	targetable (tile) {

		return this.card.canMoveOn(tile) || (tile.occupied && this.card.canAttack(tile.card)) ? "sensuba-tile-targetable" : "";
	}
}