import Animation from './Animation';

export default class NewTurn extends Animation {

	constructor () {

		super(1000);
		this.loadAudio("gong");
	}

	run () {

		var el = document.querySelector("#newturn-frame");
		if (el) {
			el.classList.add("newturn-anim");
			setTimeout(() => el.classList.remove("newturn-anim"), 3000);
		}
	}
}