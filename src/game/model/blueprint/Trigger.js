var Bloc = require('./Bloc');

class Trigger extends Bloc {

	constructor (name, src, ctx, event) {

		super(name, src, ctx);
		this.f = (src, ins) => [f => {}];
		this.types = [];
	}
}

module.exports = Trigger;