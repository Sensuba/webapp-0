const targets = {

	tile: (src, target) => true,
	emptyTile: (src, target) => target.isEmpty,
	friendlyTile: (src, target) => src.area === target.area,
	emptyFriendlyTile: (src, target) => targets.emptyTile(src, target) && targets.friendlyTile(src, target),
	entity: (src, target) => target.occupied && target.card.isType("entity")
};

export default class Event {

	constructor (action, requirement) {

		this.action = action;
		this.requirement = requirement;
	}

	execute (target) {

		if (!this.requirement || this.requirement(target))
			this.action(target);
	}

	static get targets () {

		return targets;
	}
}