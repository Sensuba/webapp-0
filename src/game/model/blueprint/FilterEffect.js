var Bloc = require('./Bloc');
var Types = require('./Types');

class FilterEffect extends Bloc {

	constructor (src, ctx) {

		super("filtereffect", src, ctx);
		this.f = (src, ins) => [target => target && ((ins[0] === 'last will' && target.lastwill) || (ins[0] === 'frenzy' && target.frenzy)), model => false];
		this.types = [Types.effecttype];
	}
}

module.exports = FilterEffect;