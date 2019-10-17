var Bloc = require('./Bloc');
var Types = require('./Types');
var Mutation = require('../board/Mutation');

class PassiveMutation extends Bloc {

	constructor (src, ctx) {

		super("passivemut", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [Types.mutation];
		this.out = [this];
	}

	setup (owner, image) {

		var cpt = this.computeIn();
		var mut = cpt[0];
		new Mutation(mut).attach(owner);
	}
}

module.exports = PassiveMutation;