import * as BABYLON from 'babylonjs';
import Card from './Card';
import node from '../Node';

export default class Hand {

	constructor (parent, noId, position, rotation) {

		this.area = parent;
		this.scene = parent.scene;
		this.id = { type: "hand", no: noId };
		this.scene.manager.addItem(this);
		this.mount();
		this.obj.position = position;
		this.obj.rotation = rotation;
	}

	mount () {

      this.obj = node.create("hand", this.area.obj);

      new Card(this, new BABYLON.Vector3(-5, 0, 0), new BABYLON.Vector3(0, 0, 0));
      new Card(this, new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 0));
      new Card(this, new BABYLON.Vector3(5, 0, 0), new BABYLON.Vector3(0, 0, 0));
	}
}