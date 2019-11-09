import Animation from './Animation';
import './Action.css';

export default class Action extends Animation {

	constructor (master, card, target) {

		super(master, 1000);
		this.card = card;
		this.target = target;
		this.loadAudio("action");
	}

	run () {

		var el = document.querySelector("#sensuba-card-" + this.card + " .sensuba-card");
		if (el) {
			el.classList.add("sensuba-card-action");
			setTimeout(() => el.classList.remove("sensuba-card-action"), 1000);
		}
		if (this.target) {
			el = document.getElementById("sensuba-tile-" + this.target.no);
			if (el) {
				el.classList.add("sensuba-tile-target");
				setTimeout(() => el.classList.remove("sensuba-tile-target"), 2000);
			}
		}
	}
}