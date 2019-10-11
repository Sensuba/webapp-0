import Animation from './Animation';
import './Action.css';

export default class Action extends Animation {

	constructor (card) {

		super(1000);
		this.card = card;
		this.loadAudio("action");
	}

	run () {

		var el = document.querySelector("#sensuba-card-" + this.card + " .sensuba-card");
		if (el) {
			el.classList.add("sensuba-card-action");
			setTimeout(() => el.classList.remove("sensuba-card-action"), 1000);
		}
	}
}