
export default class WaitForConfirmState {

	constructor (manager, card, def) {

		this.manager = manager;
		this.card = card;
		this.def = def;
		this.manager.update({faculties: undefined});
	}

	select (target) {

		if (target === this.card) {
			this.manager.command({ type: "play", id: target.id });
			this.manager.controller = this.def;
			return;
		}

		if (this.def)
			this.def.select(target);
	}

	haloFor (card) {

		return this.card === card ? "sensuba-card-selected" : "";
	}

	targetable (tile) {

		return "";
	}
}