export default class Animation {

	constructor (time, before) {

		this.time = time;
		this.before = before;
	}

	start (update) {
		
		this.run();

		if (this.sync)
			setTimeout(update, this.time);
		else
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