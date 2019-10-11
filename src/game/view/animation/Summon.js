import Animation from './Animation';
import './Summon.css';

export default class Summon extends Animation {

	constructor (card) {

		super(0);
		this.card = card;
		this.loadAudio("summon");
	}

	run () {

		var el = document.querySelector("#sensuba-card-" + this.card + " .sensuba-card");
		if (el) {
			el.classList.add("sensuba-card-summon");
			setTimeout(() => el.classList.remove("sensuba-card-summon"), 400);
		}
	}
}