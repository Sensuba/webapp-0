import Animation from './Animation';
import './Ability.css';

export default class Ability extends Animation {

	constructor (master, card, target) {

		super(master, 800);
		this.card = card;
		this.target = target;
		this.loadAudio("ability");
	}

	run () {

		var el = document.querySelector("#sensuba-card-" + this.card + " .sensuba-card");
		if (el) {
			el.classList.add("sensuba-card-ability");
			setTimeout(() => el.classList.remove("sensuba-card-ability"), 800);
		}
		if (this.target) {
			el = document.getElementById("sensuba-tile-" + this.target.no);
			if (el) {
				el.classList.add("sensuba-tile-target");
				setTimeout(() => el.classList.remove("sensuba-tile-target"), 2000);
			}
		}
	}
}