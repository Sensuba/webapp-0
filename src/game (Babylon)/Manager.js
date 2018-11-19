import Chain from './vue/sequence/Chain';
import WaitingState from './controller/state/WaitingState';
import PlayingState from './controller/state/PlayingState';

export default class Manager {

	constructor (model, command) {

		this.model = model;
		this.command = command;
		this.items = {};
		this.sequencer = new Chain();
		this.controller = new WaitingState(this);
	}

	addItem (item) {

		var id = item.id;
		this.items[id.type] = this.items[id.type] || {};
		this.items[id.type][id.no] = item;
	}

	find (id) {

		return this.items[id.type][id.no];
	}

	addSequence (seq) {

		this.sequencer.add(seq);
	}

	select (target) {

		this.controller.select(target);
	}
}