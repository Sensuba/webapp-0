import * as BABYLON from 'babylonjs';
import Card from './Card';
import node from '../Node';

export default class Deck {

	constructor (parent, noId, position, rotation) {

		this.area = parent;
		this.scene = parent.scene;
		this.count = 30;
		this.id = { type: "deck", no: noId };
		this.scene.manager.addItem(this);
		this.mount();
		this.obj.position = position;
		this.obj.rotation = rotation;
	}

	mount () {

      this.obj = BABYLON.MeshBuilder.CreateBox("box", {height: 1, width: 3, depth: 4}, this.scene);
      this.mat = new BABYLON.StandardMaterial ("mat", this.scene);
      this.mat.diffuseTexture = new BABYLON.Texture("/game/back.png", this.scene);
      this.obj.material = this.mat;
      this.obj.parent = this.area.obj;
	}

	addCard (card) {

		this.count++;
	}

	removeCard (card) {
		
		this.count--;
	}
}