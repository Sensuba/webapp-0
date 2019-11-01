var Bloc = require('./Bloc');
var Types = require('./Types');

class FindRandomModel extends Bloc {

	constructor (src, ctx) {

		super("findmodel", src, ctx);
		this.f = (src, ins) => {
			//var items = Bank.list().filter(card => ins[0](card));
			//var item = items.length > 0 ? items[Math.floor(Math.random()*items.length)] : null;
			var item = null;
			return [item, item !== null];
		};
		this.types = [Types.cardfilter];
	}
}

module.exports = FindRandomModel;