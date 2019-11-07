import Animation from './Animation';
import './Burn.css';

export default class Burn extends Animation {

	constructor (card) {

		super(800);
		this.card = card;
	}

	run () {

		var el = document.getElementById("sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-burn");
			setTimeout(() => el.classList.remove("sensuba-card-burn"), 800);
		}
	}
}