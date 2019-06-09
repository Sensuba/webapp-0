var Bloc = require('./Bloc');
var Types = require('./Types');

class Generate extends Bloc {

	constructor (src, ctx) {

		super("generate", src, ctx, true);
		this.f = (src, ins) => {
			return [];
		};
		this.types = [Types.model, Types.int, Types.location];
	}
}

module.exports = Generate;