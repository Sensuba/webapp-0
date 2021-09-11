var Bloc = require('./Bloc');
var Types = require('./Types');
//var EAction = require('../Action');
//var Event = require('../Event');

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
		var tar = this.target ? (req ? (src, target) => (this.in[0]()(src, target) && (!target.card || target.card.targetableBy(owner))) : (src, target) => true) : null;
		var action = {no: owner.faculties.length, desc: cpt[1], cost: "!"};
		if (this.target) 
			action.target = tar;
		owner.faculties.push(action);
	}
}

module.exports = Action;