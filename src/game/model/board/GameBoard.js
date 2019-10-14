import Area from './Area';

export default class GameBoard {

	constructor () {

		this.id = { type: "gameboard", no: 0 };
		this.items = {};
		this.register(this);
		this.started = false;
		this.gamestate = 0; // 0: ongoing ; 1: win ; 2: lose

		this.areas = [
			new Area(0, this),
			new Area(1, this)
		];

		this.notify = () => {};
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

	find (id) {

		return this.items[id.type] ? this.items[id.type][id.no] : undefined;
	}
}