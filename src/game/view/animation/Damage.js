import Animation from './Animation';
import './Damage.css';

export default class Damage extends Animation {

	constructor (card) {

		super(0);
		this.card = card;
		this.loadAudio("damage");
	}

	run () {

		var el = document.getElementById("sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-damage");
			setTimeout(() => el.classList.remove("sensuba-card-damage"), 200);
		}
	}
}