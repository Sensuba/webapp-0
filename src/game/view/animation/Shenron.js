import Animation from './Animation';
import './Shenron.css';

export default class Shenron extends Animation {

	constructor (master) {

		super(master, 4500);
		this.loadAudio("dragon", 800);
	}

	run () {

		var el = document.querySelector("#screen-anim");
		var inner = el.firstChild;
		var shenron = document.createElement("div");
		shenron.classList.add("shenron");
		inner.appendChild(shenron);
		var dbs = document.createElement("div");
		dbs.classList.add("dragonballs");
		inner.appendChild(dbs);
		["one", "two", "three", "four", "five", "six", "seven"].forEach((key, i) => {
			var db = document.createElement("div");
			db.classList.add("dragonball");
			db.classList.add(key);
			dbs.appendChild(db);
			setTimeout(() => {
				let audio = new Audio("/audio/light.ogg");
				audio.setAttribute("type", "audio/ogg");
				if (!this.master.mute) {
					audio.volume = this.master.volume;
					audio.playbackRate = 1 + i*0.15;
					audio.preservesPitch = false;
					audio.mozPreservesPitch = false;
					audio.play();
				}
			}, 100 + i * 230)
		})
		if (el) {
			el.classList.add("shenron-animation");
			setTimeout(() => {
				el.classList.remove("shenron-animation");
				shenron.remove();
				dbs.remove();
			}, 4500);
		}
	}
}