import Chain from './vue/sequence/Chain';

export default class Manager {

	constructor (model) {

		this.model = model;
		this.items = {};
		this.sequencer = new Chain();
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
}