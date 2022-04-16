var Bloc = require('./Bloc');
var Types = require('./Types');

class FilterPlayedLeftRight extends Bloc {

	constructor (src, ctx) {

		super("filterplaylr", src, ctx);
		this.f = (src, ins) => [target => false];
		this.types = [Types.bool, Types.bool];
	}
}

module.exports = FilterPlayedLeftRight;