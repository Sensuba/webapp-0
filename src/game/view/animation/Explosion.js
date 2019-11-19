import Animation from './Animation';
import './Explosion.css';

export default class Explosion extends Animation {

	constructor (master, card) {

		super(master, 3500);
		this.card = card;
		//this.loadAudio("damage");
	}

	run () {

		var el = document.getElementById("sensuba-card-" + this.card);
		if (el) {
			//el.classList.add("sensuba-card-damage");
			//setTimeout(() => el.classList.remove("sensuba-card-damage"), 200);
		}
	}
}

/*<div class="sensuba-card-anim-explosion"><div class="sensuba-card-anim-explosion-core"></div><div class="sensuba-card-anim-explosion-lanes"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="sensuba-card-anim-explosion-lanes sensuba-card-anim-explosion-lanes-2"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div></div>*/