import Animation from './Animation';
import './ExtraTurn.css';

export default class ExtraTurn extends Animation {

	constructor (master) {

		super(master, 4000);
		this.loadAudio("church");
	}

	run () {

		var el = document.querySelector("#screen-anim");
		if (el) {
			el.classList.add("extra-turn-animation");
			setTimeout(() => el.classList.remove("extra-turn-animation"), 4000);
		}
	}
}