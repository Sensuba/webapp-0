import Animation from './Animation';
import './Target.css';

export default class Target extends Animation {

	constructor (master, tile) {

		super(master, 0);
		this.tile = tile;
	}

	run () {

		var el = document.getElementById("sensuba-tile-" + this.tile);
		if (el) {
			el.classList.add("sensuba-tile-target");
			setTimeout(() => el.classList.remove("sensuba-tile-target"), 2000);
		}
	}
}