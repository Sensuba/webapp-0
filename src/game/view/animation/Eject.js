import Animation from './Animation';
import './Eject.css';

export default class Eject extends Animation {

	constructor (master, card) {

		super(master, 300);
		this.card = card;
		this.loadAudio("pilot");
	}

	run () {

		var el = document.getElementById("sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-eject");
			setTimeout(() => el.classList.remove("sensuba-card-eject"), 300);
		}
	}
}