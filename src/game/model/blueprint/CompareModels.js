var Bloc = require('./Bloc');
var Types = require('./Types');

class CompareModels extends Bloc {

	constructor (src, ctx) {

		super("cmpmodels", src, ctx);
		this.f = (src, ins) => [ins[0].idCardmodel === ins[1].idCardmodel];
		this.types = [Types.model, Types.model];
	}
}

module.exports = CompareModels;