import Animation from './Animation';
import './Poison.css';

export default class Poison extends Animation {

	constructor (master, card) {

		super(master, 0);
		this.card = card;
		//this.loadAudio("damage");
	}

	run () {

		var el = document.getElementById("sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-poison");
			setTimeout(() => el.classList.remove("sensuba-card-poison"), 500);
		}
	}
}