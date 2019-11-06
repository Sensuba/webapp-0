var Bloc = require('./Bloc');
var Types = require('./Types');
//var Bank = require("../../Bank");

class FindRandomModel extends Bloc {

	constructor (src, ctx) {

		super("findmodel", src, ctx);
		this.f = (src, ins) => {
			return [null, false];
		};
		this.types = [Types.modelfilter];
	}
}

module.exports = FindRandomModel;