import Animation from './Animation';
import './Trigger.css';

export default class Trigger extends Animation {

	constructor (master, card) {

		super(master, 0);
		this.card = card;
		//this.loadAudio("blessing");
	}

	run () {

		var el = document.querySelector("#sensuba-card-" + this.card + " .sensuba-card");
		if (el) {
			el.classList.add("sensuba-card-trigger");
			setTimeout(() => el.classList.remove("sensuba-card-trigger"), 800);
		}
	}
}