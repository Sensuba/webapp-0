import Animation from './Animation';
import './Destroy.css';

export default class Destroy extends Animation {

	constructor (card) {

		super(400, true);
		this.card = card;
		this.loadAudio("vanish");
	}

	run () {

		var el = document.getElementById("sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-destroy");
			setTimeout(() => el.classList.remove("sensuba-card-destroy"), 400);
		}
	}
}