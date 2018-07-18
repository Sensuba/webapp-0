import * as BABYLON from 'babylonjs';
import Hand from './Hand';

export default class Area {

	constructor (parent, position, rotation) {

		this.parent = parent;
		this.scene = parent.scene;
		this.mount();
		this.obj.position = position;
		this.obj.rotation = rotation;
		console.log(this.obj)
	}

	mount () {

      var board = BABYLON.Mesh.CreateGround("gameboard", 24, 12, 2, this.scene);
      this.obj = board;

      var materialSphere2 = new BABYLON.StandardMaterial("texture2", this.scene);
	  materialSphere2.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
	  board.material = materialSphere2;

      //new Card(this.scene, new BABYLON.Vector3(0, 1, 0), new BABYLON.Vector3(0, 0, 0)).move(new BABYLON.Vector3(0, 5, 0), new BABYLON.Vector3(-1, 0, 0));

      new Hand(this, new BABYLON.Vector3(0, 5, -7), new BABYLON.Vector3(-1, 0, 0));
      //var c = new Card(this, new BABYLON.Vector3(0, 1, 0), new BABYLON.Vector3(0, 0, 0));
	}
}