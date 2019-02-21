import Event from './Event';

export default class Target {

	constructor (predicate) {

		this.predicate = predicate;
	}

	static read (trigger, ctx) {

		if (!trigger.target)
			return;

		var t = new Target();

		var stringToPredicate = (value) => {

			if (!(typeof value === 'string'))
				return value;
			switch (value) {
			case 'empty': return Event.targets.empty;
			case 'entity': return Event.targets.entity;
			case 'character': return Event.targets.character;
			case 'hero': return Event.targets.hero;
			case 'figure': return Event.targets.figure;
			case 'artifact': return Event.targets.artifact;
			case 'friendly': return Event.targets.friendly;
			case 'friendly empty': return Event.targets.friendlyEmpty;
			case 'friendly entity': return Event.targets.friendlyEntity;
			case 'friendly character': return Event.targets.friendlyCharacter;
			case 'friendly figure': return Event.targets.friendlyFigure;
			case 'enemy': return Event.targets.enemy;
			case 'enemy empty': return Event.targets.enemyEmpty;
			case 'enemy entity': return Event.targets.enemyEntity;
			case 'enemy character': return Event.targets.enemyCharacter;
			case 'enemy figure': return Event.targets.enemyFigure;
			default: return Event.targets.tile;
			}
		}

		var filter = trigger.in[0];

		if (!filter) {
			t.predicate = (src, target) => true;
			return t;
		} else if (typeof filter === "object") {
			t.predicate = (src, target) => true;
			return t;
		} else {
			t.predicate = stringToPredicate(filter);
			return t;
		}
	}

	check (src, target) {

		return this.predicate ? this.predicate(src, target) : true;
	}
}