import Animation from './Animation';
import './Load.css';

export default class Load extends Animation {

	constructor (master, card) {

		super(master, 300);
		this.card = card;
		this.loadAudio("pilot");
	}

	run () {

		var el = document.getElementById("sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-load");
			setTimeout(() => el.classList.remove("sensuba-card-load"), 300);
		}
	}
}