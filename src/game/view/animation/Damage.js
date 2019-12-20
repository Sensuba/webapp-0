import Animation from './Animation';
import './Damage.css';

export default class Damage extends Animation {

	constructor (master, card, value) {

		super(master, 0);
		this.card = card;
		this.value = value;
		this.loadAudio("damage");
	}

	run () {

		var el = document.getElementById("sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-damage");
			setTimeout(() => el.classList.remove("sensuba-card-damage"), 600);
			document.querySelector("#sensuba-card-" + this.card + " .sensuba-card-digitanim").innerHTML = this.value;
		}
	}
}