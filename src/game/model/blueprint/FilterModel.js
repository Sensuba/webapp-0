var Bloc = require('./Bloc');
var Types = require('./Types');

class FilterModel extends Bloc {

	constructor (src, ctx) {

		super("filtermodel", src, ctx);
		this.f = (src, ins) => [ target => {
			if (!target || !ins[0])
				return false;
			if (target.idCardmodel || ins[0].idCardmodel)
				return target.idCardmodel === ins[0].idCardmodel;
			if (target.parent && ins[0].parent)
				return target.parent === ins[0].parent && target.notoken === ins[0].token;
			return false;
		} ]
		this.types = [Types.model];
	}
}

module.exports = FilterModel;