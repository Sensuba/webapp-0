import * as BABYLON from 'babylonjs';
import Tile from './Tile';
import node from '../Node';
import Pause from '../sequence/Pause';
import Instant from '../sequence/Instant';

export default class Court {

	constructor (parent, position, rotation) {

		this.parent = parent;
		this.scene = parent.scene;
		this.id =  { type: "court", no: parent.id.no };
		this.scene.manager.addItem(this);
		this.mount();
		this.obj.position = position;
		this.obj.rotation = rotation;
	}

	mount () {

        this.obj = node.create("court", this.parent.obj);
	}

	addCard (card) {

		this.scene.manager.addSequence(new Instant(() => card.changeParent(this)));
		this.scene.manager.addSequence(card.move(false, new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 0)));
	}
	
	removeCard (card) {

	}
}