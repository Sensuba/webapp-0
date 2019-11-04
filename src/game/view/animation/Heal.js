import Animation from './Animation';
import './Heal.css';

export default class Heal extends Animation {

	constructor (card) {

		super(0);
		this.card = card;
		this.loadAudio("heal");
	}

	run () {

		var el = document.querySelector("#sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-heal");
			setTimeout(() => el.classList.remove("sensuba-card-heal"), 1000);
		}
	}
}