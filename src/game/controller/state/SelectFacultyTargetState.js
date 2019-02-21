import PlayingState from './PlayingState';

export default class SelectFacultyTargetState {

	constructor (manager, card, faculty) {

		this.manager = manager;
		this.card = card;
		this.faculty = faculty;
		this.manager.update({faculties: undefined});
	}

	select (target) {

		if (target.id.type === "card")
			target = target.location;

		if (this.faculty.target(this.card, target)) {
			this.manager.command({ type: "faculty", id: this.card.id, faculty: this.faculty.no, target: target.id });
			this.manager.controller = new PlayingState(this.manager);
		}
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