import Animation from './Animation';
import './Heal.css';

export default class Heal extends Animation {

	constructor (master, card, value) {

		super(master, 0);
		this.card = card;
		this.value = value;
		this.loadAudio("heal");
	}

	run () {

		var el = document.querySelector("#sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-heal");
			setTimeout(() => el.classList.remove("sensuba-card-heal"), 1000);
			document.querySelector("#sensuba-card-" + this.card + " .sensuba-card-digitanim").innerHTML = this.value;
		}
	}
}