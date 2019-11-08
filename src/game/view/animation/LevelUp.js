import Animation from './Animation';
import './LevelUp.css';

export default class LevelUp extends Animation {

	constructor (master, card) {

		super(master, 1000);
		this.card = card;
		this.loadAudio("bonus");
	}

	run () {

		var el = document.querySelector("#sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-levelup");
			setTimeout(() => el.classList.remove("sensuba-card-levelup"), 1000);
		}
	}
}