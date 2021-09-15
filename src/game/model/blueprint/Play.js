var Bloc = require('./Bloc');
var Types = require('./Types');
//var Event = require('../Event');

class Play extends Bloc {

	constructor (src, ctx, target) {

		super("play", src, ctx, true);
		this.f = (src, ins) => [this, this.chosen ? this.chosen.card : null, this.chosen];
		this.types = [Types.tilefilter];
		this.target = target;
		this.out = [this, null, null];
	}

	setup (owner, image) {

		var req = this.computeIn()[0];
		var tar = this.target ? (req ? (src, target) => {
			let res = this.in[0]()(src, target);
			if (res === "player")
				return true;
			return res && (!target.card || target.card.targetableBy(owner));
		} : (src, target) => true) : null;
		if (this.target && !(typeof tar === "string")) 
			owner.targets.push(tar);
	}
}

module.exports = Play;