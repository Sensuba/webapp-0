import Animation from './Animation';
import './GainEffect.css';

export default class GainEffect extends Animation {

	constructor (master, card) {

		super(master, 0);
		this.card = card;
		//this.loadAudio("trigger");
	}

	run () {

		var el = document.querySelector("#sensuba-card-" + this.card + " .sensuba-card");
		if (el) {
			el.classList.add("sensuba-card-gaineffect");
			setTimeout(() => el.classList.remove("sensuba-card-gaineffect"), 800);
		}
	}
}