import Animation from './Animation';
import './LensFlare.css';

export default class LensFlare extends Animation {

	constructor (master) {

		super(master, 4000);
		this.loadAudio("flare");
	}

	run () {

		var el = document.querySelector("#screen-anim");
		var inner = el.firstChild;
		var f1 = document.createElement("div");
		f1.classList.add("flare");
		f1.classList.add("one");
		inner.appendChild(f1);
		var f2 = document.createElement("div");
		f2.classList.add("flare");
		f2.classList.add("two");
		f1.appendChild(f2);
		var f5 = document.createElement("div");
		f5.classList.add("flare");
		f5.classList.add("five");
		f2.appendChild(f5);
		var f6 = document.createElement("div");
		f6.classList.add("flare");
		f6.classList.add("six");
		f2.appendChild(f6);
		var f3 = document.createElement("div");
		f3.classList.add("flare");
		f3.classList.add("three");
		f2.appendChild(f3);
		var f4 = document.createElement("div");
		f4.classList.add("flare");
		f4.classList.add("four");
		f3.appendChild(f4);
		if (el) {
			el.classList.add("lens-flare-animation");
			setTimeout(() => {
				el.classList.remove("lens-flare-animation");
				f1.remove();
			}, 4000);
		}
	}
}