export default class Animation {

	constructor (time, before) {

		this.time = time;
		this.before = before;
	}

	loadAudio (name) {

		this.audio = new Audio("/audio/" + name + ".ogg");
		this.audio.setAttribute("type", "audio/ogg");
	}

	start (update) {
		
		if (this.audio)
			this.audio.play();
		this.run();

		if (this.sync)
			setTimeout(update, this.time);
		else if (update)
			update();
	}

	run () {

	}

	async () {

		this.time = 0;
	}

	get sync () {

		return this.time > 0;
	}
}