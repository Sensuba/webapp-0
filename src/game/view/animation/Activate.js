import Animation from './Animation';
import './Activate.css';

export default class Activate extends Animation {

	constructor (master, card) {

		super(master, 500);
		this.card = card;
		this.loadAudio("activate");
	}

	run () {

		var el = document.getElementById("sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-activate");
			setTimeout(() => el.classList.remove("sensuba-card-activate"), 1000);
		}
	}
}