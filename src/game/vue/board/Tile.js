import * as BABYLON from 'babylonjs';
import node from '../Node';
import Instant from '../sequence/Instant';

export default class Tile {

	constructor (parent, model, position, rotation) {

		this.parent = parent;
		this.scene = parent.scene;
		this.card = null;
		this.model = model;
		this.id = model.id;
		this.scene.manager.addItem(this);
		this.mount();
		this.obj.position = position;
		this.obj.rotation = rotation;
	}

	mount () {

        var shape = [new BABYLON.Vector3(-1.5, 0, -2),
            new BABYLON.Vector3(-1.5, 0, 2),
            new BABYLON.Vector3(1.5, 0, 2),
            new BABYLON.Vector3(1.5, 0, -2)];
        this.obj = BABYLON.Mesh.CreatePolygon("tile", shape, this.scene);
        this.obj.parent = this.parent.obj
	}

	addCard (card) {

		this.card = card;
		this.scene.manager.addSequence(new Instant(() => card.changeParent(this)));
		this.scene.manager.addSequence(card.move(false, new BABYLON.Vector3(0, 0.05, 0), new BABYLON.Vector3(0, 0, 0)));
	}

	removeCard (card) {

		this.card = null;
	}
}