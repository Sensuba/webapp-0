
export default class SelectFacultyTargetState {

	constructor (manager, card, faculty, def) {

		this.manager = manager;
		this.card = card;
		this.faculty = faculty;
		this.def = def;
		this.manager.update({faculties: undefined});
	}

	select (target) {

		var ltarget = target.id.type === "card" ? target.location : target;

		if (ltarget.id.type === "tile" && this.faculty.target(this.card, ltarget)) {
			this.manager.command({ type: "faculty", id: this.card.id, faculty: this.faculty.no, target: ltarget.id });
			this.manager.controller = this.def;
			return;
		}

		if (this.def)
			this.def.select(target);
	}

	haloFor (card) {

		if (this.card === card)
			return "sensuba-card-selected";
		if (!card.onBoard)
			return "";
		return this.faculty.target(this.card, card.location) ? "sensuba-card-targetable" : "";
	}

	targetable (tile) {

		return this.faculty.target(this.card, tile) ? "sensuba-tile-targetable" : "";
	}
}