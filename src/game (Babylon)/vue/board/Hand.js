import * as BABYLON from 'babylonjs';
import Card from './Card';
import node from '../Node';
import Pause from '../sequence/Pause';
import Instant from '../sequence/Instant';

export default class Hand {

	constructor (parent, position, rotation) {

		this.area = parent;
		this.scene = parent.scene;
		this.model = parent.model.hand;
		this.id = this.model.id;
		this.cards = [];
		this.scene.manager.addItem(this);
		this.mount();
		this.obj.position = position;
		this.obj.rotation = rotation;
	}

	mount () {

      this.obj = node.create("hand", this.area.obj);

      /*new Card(this, new BABYLON.Vector3(-5, 0, 0), new BABYLON.Vector3(0, 0, 0));
      new Card(this, new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 0));
      new Card(this, new BABYLON.Vector3(5, 0, 0), new BABYLON.Vector3(0, 0, 0));*/
	}

	addCard (card) {

		this.cards.push(card);
		this.scene.manager.addSequence(new Instant(() => card.changeParent(this)));
		this.replaceCards();
		this.scene.manager.addSequence(new Pause(700));
	}

	removeCard (card) {

		this.cards = this.cards.filter(c => c.id !== card.id);
		this.replaceCards();
	}

	replaceCards () {

		var mid = (this.cards.length-1)/2;
		this.cards.forEach((c, i) => this.scene.manager.addSequence(c.move(true, new BABYLON.Vector3((i-mid)*4, 0, 0), new BABYLON.Vector3(0, 0, 0))));
	}
}