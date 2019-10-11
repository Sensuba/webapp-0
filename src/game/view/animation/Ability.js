import Animation from './Animation';
import './Ability.css';

export default class Action extends Animation {

	constructor (card) {

		super(800);
		this.card = card;
		this.loadAudio("ability");
	}

	run () {

		var el = document.querySelector("#sensuba-card-" + this.card + " .sensuba-card");
		if (el) {
			el.classList.add("sensuba-card-ability");
			setTimeout(() => el.classList.remove("sensuba-card-ability"), 800);
		}
	}
}