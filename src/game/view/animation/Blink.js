import Animation from './Animation';
import './Blink.css';

export default class Blink extends Animation {

	constructor (master, card) {

		super(master, 500);
		this.card = card;
		//this.loadAudio("trigger");
	}

	run () {

		var el = document.querySelector("#sensuba-card-" + this.card + " .sensuba-card");
		if (el) {
			el.classList.add("sensuba-card-blink");
			setTimeout(() => el.classList.remove("sensuba-card-blink"), 800);
		}
	}
}