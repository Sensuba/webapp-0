var Bloc = require('./Bloc');
var Types = require('./Types');

class Token extends Bloc {

	constructor (src, ctx) {

		super("token", src, ctx);
		this.f = (src, ins) => {
			return [];
		};
		this.types = [Types.int];
	}
}

module.exports = Token;