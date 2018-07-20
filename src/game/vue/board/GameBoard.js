import * as BABYLON from 'babylonjs';
import Area from './Area';

export default class GameBoard {

	constructor (scene) {

		this.scene = scene;
		this.id = { type: "gameboard", no: 0 };
		this.scene.manager.addItem(this);
		this.mount();
	}

	mount () {

		this.areas = [
			new Area(this, 0, new BABYLON.Vector3(0, 0, -7), new BABYLON.Vector3(0, 0, 0)),
	 		new Area(this, 1, new BABYLON.Vector3(0, 0, 7), new BABYLON.Vector3(0, Math.PI, 0))
		];
	}
}