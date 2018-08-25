import * as BABYLON from 'babylonjs';
import Area from './Area';

export default class GameBoard {

	constructor (scene, model) {

		this.scene = scene;
		this.model = model
		this.id = model.id;
		this.scene.manager.addItem(this);
		this.mount();
	}

	mount () {

		this.areas = [
			new Area(this, this.model.areas[0], new BABYLON.Vector3(0, 0, -7), new BABYLON.Vector3(0, 0, 0)),
	 		new Area(this, this.model.areas[1], new BABYLON.Vector3(0, 0, 7), new BABYLON.Vector3(0, Math.PI, 0))
		];
	}
}