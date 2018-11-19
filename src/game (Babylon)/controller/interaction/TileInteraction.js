import * as BABYLON from 'babylonjs';
import Interaction from './Interaction';

export default class TileInteraction extends Interaction {

	constructor (tile) {

		super();
		this.tile = tile;
	}

	onMouseDown() {

		this.tile.scene.manager.select(this.tile.model);
	}

	update(state) {}
}