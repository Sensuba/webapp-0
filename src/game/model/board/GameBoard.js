import Area from './Area';
import Log from './Log';

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
		this.log = new Log(this);

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
		this.areas.forEach(area => area.deck.lockStartingDeck());
	}

	end (state) {

		this.gamestate = state;
	}

	newTurn (noArea) {
		
		if (this.currentArea && this.currentArea.choosebox.opened)
			this.currentArea.choosebox.close();
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

		if (this.updateState) {
			this.updateState = 2;
			return;
		}
		try {
			let passes = 0;
			// State-dependent auras must settle before the view or controller reads them.
			do {
				this.updateState = 1;
				const cards = Object.values((this.items && this.items.card) || {});
				[3, 2, 1, 0].forEach(prio => cards.filter(card => card.location && card.location.locationOrder === prio)
					.forEach(card => card.update()));
				// Invalid, mutually negating auras must not hang the game.
				if (++passes >= Math.max(32, cards.length * 4)) break;
			} while (this.updateState === 2);
		} finally {
			delete this.updateState;
		}
	}

	find (id) {

		return id ? (this.items[id.type] ? this.items[id.type][id.no] : undefined) : id;
	}
}
