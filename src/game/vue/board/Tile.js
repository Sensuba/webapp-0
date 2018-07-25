import * as BABYLON from 'babylonjs';
import node from '../Node';

export default class Tile {

	constructor (parent, noId, position, rotation) {

		this.parent = parent;
		this.scene = parent.scene;
		this.id = { type: "tile", no: noId };
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
}