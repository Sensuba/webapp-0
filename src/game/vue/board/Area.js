import * as BABYLON from 'babylonjs';
import Hand from './Hand';
import Deck from './Deck';

export default class Area {

	constructor (parent, noId, position, rotation) {

		this.parent = parent;
		this.scene = parent.scene;
		this.id = { type: "area", no: noId };
		this.scene.manager.addItem(this);
		this.mount();
		this.obj.position = position;
		this.obj.rotation = rotation;
	}

	mount () {

      var board = BABYLON.Mesh.CreateGround("gameboard", 30, 12, 2, this.scene);
      this.obj = board;

      var materialSphere2 = new BABYLON.StandardMaterial("texture2", this.scene);
	  materialSphere2.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
	  board.material = materialSphere2;

      //new Card(this.scene, new BABYLON.Vector3(0, 1, 0), new BABYLON.Vector3(0, 0, 0)).move(new BABYLON.Vector3(0, 5, 0), new BABYLON.Vector3(-1, 0, 0));

      this.hand = new Hand(this, this.id.no, new BABYLON.Vector3(0, 5, -7), new BABYLON.Vector3(-1, 0, 0));
      this.deck = new Deck(this, this.id.no, new BABYLON.Vector3(12, 0.5, 0), new BABYLON.Vector3(0, 0, 0));
      //var c = new Card(this, new BABYLON.Vector3(0, 1, 0), new BABYLON.Vector3(0, 0, 0));
	}
}