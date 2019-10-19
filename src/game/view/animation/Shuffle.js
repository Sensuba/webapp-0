import Animation from './Animation';
import './Shuffle.css';

export default class Shuffle extends Animation {

	constructor (card) {

		super(0);
		this.card = card;
	}

	run () {

		var el = document.getElementById("sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-shuffle");
			setTimeout(() => el.classList.remove("sensuba-card-shuffle"), 800);
		}
	}
}