var Bloc = require('./Bloc');
var Types = require('./Types');

class Secret extends Bloc {

	constructor (src, ctx, target) {

		super("secret", src, ctx, true);
		this.f = (src, ins) => [this, null];
		this.types = [Types.string, Types.int];
		this.out = [this, null];
	}

	setup (owner, image) {

		var cpt = this.computeIn();
		var skill = {no: owner.faculties.length, desc: cpt[0], cost: cpt[1]};
		owner.faculties.push(skill);
	}
}

module.exports = Secret;