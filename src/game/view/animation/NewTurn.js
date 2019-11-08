import Animation from './Animation';

export default class NewTurn extends Animation {

	constructor (master) {

		super(master, 1000);
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