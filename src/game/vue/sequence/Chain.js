import Sequence from "./Sequence";

export default class Chain extends Sequence {

	constructor (async) {

		super(async);
		this.syncs = [];
	}

	start () {


	}

	next () {

		if (this.syncs.length > 0) {
			var seq = this.syncs[0];
			if (seq.async) {
				seq.start();
				this.syncs.shift();
				this.next();
			} else {
				seq.callback = () => {
					this.syncs.shift();
					this.next();
				}
				seq.start();
			}
		}
	}

	add (seq) {

		this.syncs.push(seq);
		if (this.syncs.length === 1)
			this.next();
	}
}