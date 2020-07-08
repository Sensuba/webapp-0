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
			this.master.damageAnim = this.master.damageAnim || {};
			this.master.damageAnim[this.card] = this;
			if (el.classList.contains("sensuba-card-damage"))
				el.classList.remove("sensuba-card-damage");
			el.classList.add("sensuba-card-damage");
			setTimeout(() => {
				if (this.master.damageAnim[this.card] === this) {
					el.classList.remove("sensuba-card-damage");
					delete this.master.damageAnim[this.card];
				}
			}, 600);
			document.querySelector("#sensuba-card-" + this.card + " .sensuba-card-digitanim").innerHTML = this.value;
		}
	}
}