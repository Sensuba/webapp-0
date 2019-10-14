import Animation from './Animation';
import './Fatigue.css';

export default class Fatigue extends Animation {

	constructor (area) {

		super(0);
		this.area = area;
		//this.loadAudio("fatigue");
	}

	run () {

		var el = document.querySelector("#sensuba-area-" + this.area + " .fatigue-mark");
		if (el) {
			el.classList.add("fatigue-anim");
			setTimeout(() => el.classList.remove("fatigue-anim"), 900);
		}
	}
}