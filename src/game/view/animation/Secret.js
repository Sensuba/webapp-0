import Animation from './Animation';
import './Secret.css';

export default class Secret extends Animation {

	constructor (master, card) {

		super(master, 0);
		this.card = card;
		this.loadAudio("secret");
	}

	run () {

		var el = document.querySelector("#sensuba-card-" + this.card + " .sensuba-card");
		if (el) {
			el.classList.add("sensuba-card-secret");
			setTimeout(() => el.classList.remove("sensuba-card-secret"), 600);
		}
	}
}