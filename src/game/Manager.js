export default class Manager {

	constructor (model) {

		this.model = model;
		this.items = {};
	}

	addItem (item) {

		var id = item.id;
		this.items[id.type] = this.items[id.type] || {};
		this.items[id.type][id.no] = item;
	}

	find (id) {

		return this.items[id.type][id.no];
	}
}