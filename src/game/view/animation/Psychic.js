import Animation from './Animation';
import './Psychic.css';

export default class Psychic extends Animation {

	constructor (card) {

		super(0);
		this.card = card;
		this.loadAudio("silence");
	}

	run () {

		var el = document.querySelector("#sensuba-card-" + this.card + " .sensuba-card");
		if (el) {
			el.classList.add("sensuba-card-psychic");
			setTimeout(() => el.classList.remove("sensuba-card-psychic"), 1000);
		}
	}
}