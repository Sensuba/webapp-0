import Animation from './Animation';
import './Quake.css';

export default class Quake extends Animation {

	constructor (master, strength) {

		super(master, 0);
		this.strength = strength;
		//this.loadAudio("damage");
	}

	run () {

		var el = document.getElementById("sensuba-board");
		if (el) {
			el.classList.add("sensuba-board-quake-" + this.strength);
			setTimeout(() => el.classList.remove("sensuba-board-quake-" + this.strength), 1000);
		}
	}
}