import * as BABYLON from 'babylonjs';
import Interaction from './Interaction';

export default class CardInHandInteraction extends Interaction {

	constructor (card) {

		super();
		this.card = card;
	}

	onMouseEnter() {

		this.card.recto.scaling = new BABYLON.Vector3(1.3, 1.3, 1.3);
	}

	onMouseExit() {

		this.card.recto.scaling = new BABYLON.Vector3(1, 1, 1);
	}

	onMouseDown() {

		this.card.scene.manager.select(this.card.model);
	}

	update(state) {}
}