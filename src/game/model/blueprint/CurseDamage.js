var Bloc = require('./Bloc');
var Types = require('./Types');

class CurseDamage extends Bloc {

	constructor (src, ctx) {

		super("cursedmg", src, ctx);
		this.f = (src, ins) => [ins[0].deck.curse, ins[0].deck.curseInc];
		this.types = [Types.area];
	}
}

module.exports = CurseDamage;