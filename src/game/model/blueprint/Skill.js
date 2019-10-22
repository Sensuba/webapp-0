var Bloc = require('./Bloc');
var Types = require('./Types');

class Skill extends Bloc {

	constructor (src, ctx, target) {

		super("skill", src, ctx, true);
		this.f = (src, ins) => [this, this.chosen ? this.chosen.card : null, this.chosen];
		this.types = [Types.tilefilter, Types.string, Types.int];
		this.target = target;
		this.out = [this, null, null];
	}

	setup (owner, image) {

		var cpt = this.computeIn();
		var req = cpt[0];
		var tar = this.target ? (req ? (src, target) => (req(src, target) && (!target.card || target.card.targetable)) : (src, target) => true) : null;
		/*owner.faculties.push(new ESkill(new Event(target => {
			if (target)
				this.chosen = target;
			this.execute(image);
		}, req), ins[2]));*/
		var skill = {no: owner.faculties.length, desc: cpt[1], cost: cpt[2]};
		if (this.target) 
			skill.target = tar;
		owner.faculties.push(skill);
	}
}

module.exports = Skill;