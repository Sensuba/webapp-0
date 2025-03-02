var Bloc = require('./Bloc');
var Types = require('./Types');

class ActivationThreshold extends Bloc {

	constructor (src, ctx) {

		super("activationthreshold", src, ctx);
		this.f = (src, ins) => [ins[0].mecha ? (ins[0].activation || 0) : 0];
		this.types = [Types.card];
	}
}

module.exports = ActivationThreshold;