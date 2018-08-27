import Area from './Area';

export default class GameBoard {

	constructor () {

		this.id = { type: "gameboard", no: 0 };

		this.areas = [
			new Area(0, this),
			new Area(1, this)
		];

		this.notify = () => {};
	}

	get tiles() {

		return this.areas[0].field.tiles.concat(this.areas[1].field.tiles);
	}

	newTurn () {

		this.currentArea = this.currentArea.opposite;
		this.currentArea.newTurn();
	}
}