var Bloc = require('./Bloc');
var Types = require('./Types');

class Action extends Bloc {

	constructor (src, ctx, target) {

		super("action", src, ctx, true);
		this.f = (src, ins) => [this, this.chosen ? this.chosen.card : null, this.chosen];
		this.types = [Types.tilefilter, Types.string];
		this.target = target;
		this.out = [this, null, null];
	}

	setup (owner, image) {

		var cpt = this.computeIn();
		var req = cpt[0];
		req = this.target ? (req ? req : (src, target) => true) : null;
		/*owner.faculties.push(new EAction(new Event(target => {
			if (target)
				this.chosen = target;
			this.execute(image);
		}, req)));*/
		var action = {no: owner.faculties.length, desc: cpt[1], cost: "!"};
		if (this.target) 
			action.target = req;
		owner.faculties.push(action);
	}
}

module.exports = Action;