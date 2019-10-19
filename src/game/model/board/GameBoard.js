import Area from './Area';

export default class GameBoard {

	constructor () {

		this.id = { type: "gameboard", no: 0 };
		this.items = {};
		this.auras = [];
		this.register(this);
		this.started = false;
		this.gamestate = 0; // 0: ongoing ; 1: win ; 2: lose
		this.subscriptions = {};
		this.indexSubscription = 0;

		this.areas = [
			new Area(0, this),
			new Area(1, this)
		];
	}

	get tiles() {

		return this.areas[0].field.tiles.concat(this.areas[1].field.tiles);
	}

	start () {

		this.started = true;
	}

	end (win) {

		this.gamestate = win ? 1 : 2;
	}

	newTurn (noArea) {

		this.currentArea = this.areas[noArea];
		this.currentArea.newTurn();
	}

	register (item) {

		var id = item.id;
		this.items[id.type] = this.items[id.type] || {};
		this.items[id.type][id.no] = item;
	}

	notify (type, src, data) {

		if (!this.subscriptions[type])
			return;
		this.subscriptions[type].slice().forEach(sub => sub.notify(type, src, data));
	}

	subscribe (type, notify) {

		if (!this.subscriptions[type])
			this.subscriptions[type] = [];
		let id = this.indexSubscription++;
		this.subscriptions[type].push({ id, notify });
		return () => this.subscriptions[type].splice(this.subscriptions[type].findIndex(sub => sub.id === id), 1);
	}

	addAura (aura) {

		this.auras.push(aura);
	}

	clearAura (aura) {

		this.auras = this.auras.filter(a => a !== aura)
	}

	update () {

		if (this.items && this.items.card)
			Object.keys(this.items.card).forEach(k => this.items.card[k].update());
	}

	find (id) {

		return this.items[id.type] ? this.items[id.type][id.no] : undefined;
	}
}