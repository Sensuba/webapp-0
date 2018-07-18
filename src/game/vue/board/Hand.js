import * as BABYLON from 'babylonjs';
import Card from './Card';

export default class Hand {

	constructor (parent, position, rotation) {

		this.parent = parent;
		this.scene = parent.scene;
		this.mount();
		this.obj.position = position;
		this.obj.rotation = rotation;
	}

	mount () {

      var obj = BABYLON.Mesh.CreateGround("hand", 0, 0, 0, this.scene);
      this.obj = obj;
      this.obj.isVisible = false;
      this.obj.parent = this.parent.obj;

      //new Card(this.scene, new BABYLON.Vector3(0, 1, 0), new BABYLON.Vector3(0, 0, 0)).move(new BABYLON.Vector3(0, 5, 0), new BABYLON.Vector3(-1, 0, 0));

      new Card(this, new BABYLON.Vector3(-5, 0, 0), new BABYLON.Vector3(0, 0, 0));
      new Card(this, new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 0));
      new Card(this, new BABYLON.Vector3(5, 0, 0), new BABYLON.Vector3(0, 0, 0));
	}
}