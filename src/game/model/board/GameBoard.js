import Area from "./Area";

export default class GameBoard {

	constructor () {

		this.id = { type: "gameboard", "no": 0 };

		this.areas = [
			new Area(0, this),
			new Area(1, this)
		]
	}
}