var Bloc = require('./Bloc');
var Types = require('./Types');
//var ESkill = require('../Skill');
//var ASkill = require('../ArtifactSkill');
//var Event = require('../Event');

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
		var costText = cpt[2];
		if (owner.isType("artifact") && costText > 0)
			costText = "+" + costText;
		var skill = {no: owner.faculties.length, desc: cpt[1], cost: costText};
		if (this.target) 
			skill.target = tar;
		owner.faculties.push(skill);
	}
}

module.exports = Skill;