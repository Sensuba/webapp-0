import * as BABYLON from 'babylonjs';
import Card from './Card';
import node from '../Node';

export default class Deck {

	constructor (parent, noId, position, rotation) {

		this.area = parent;
		this.scene = parent.scene;
		this.id = { type: "deck", no: noId };
		this.scene.manager.addItem(this);
		this.mount();
		this.obj.position = position;
		this.obj.rotation = rotation;
	}

	mount () {

      this.obj = BABYLON.MeshBuilder.CreateBox("box", {height: 1, width: 3, depth: 4}, this.scene);
      var mat = new BABYLON.StandardMaterial ("mat", this.scene);
      mat.diffuseTexture = new BABYLON.Texture("/game/back.png", this.scene);
      this.obj.material = mat;
      this.obj.parent = this.area.obj;
	}
}