var Bloc = require('./Bloc');
var Types = require('./Types');

class Trial extends Bloc {

	constructor (src, ctx) {

		super("trial", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [Types.bool, Types.int, Types.int];
		this.out = [this];
	}

	setup (owner, image) {

		var that = this;
		owner.steps = owner.steps || [];
		var step = {
			step: this.in[1](),
			condition: () => that.in[0](),
			completed: false
		}
		let i = 0;
		while (i < owner.steps.length) {
			if (owner.steps[i].step > step.step)
				break;
			i++;
		}
		owner.steps.splice(i, 0, step);
	}
}

module.exports = Trial;