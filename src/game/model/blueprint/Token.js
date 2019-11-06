var Bloc = require('./Bloc');
var Types = require('./Types');
//var Bank = require("../../Bank");

class Token extends Bloc {

	constructor (src, ctx) {

		super("token", src, ctx);
		this.f = (src, ins) => {
			return [];
		};
		this.types = [Types.int];
	}

	genParent (src) {

		if (src.idCardmodel)
			return src.idCardmodel;
		return { parent: this.genParent(src.parent), token: src.parent.tokens.findIndex((token, i) => i === src.notoken) };
	}
}

module.exports = Token;