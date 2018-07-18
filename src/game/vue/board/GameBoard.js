import * as BABYLON from 'babylonjs';
import Area from './Area';

export default class GameBoard {

	constructor (scene) {

		this.scene = scene;
		this.mount();
	}

	mount () {

		this.areas = [
			new Area(this, new BABYLON.Vector3(0, 0, -7), new BABYLON.Vector3(0, 0, 0)),
	 		new Area(this, new BABYLON.Vector3(0, 0, 7), new BABYLON.Vector3(0, Math.PI, 0))
		];
	}
}