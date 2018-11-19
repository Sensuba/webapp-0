import * as BABYLON from 'babylonjs';
import node from '../Node';
import Instant from '../sequence/Instant';
import Movement from '../sequence/Movement';
import Interaction from '../../controller/interaction/Interaction';
import CardInHandInteraction from '../../controller/interaction/CardInHandInteraction';

export default class Card {

	constructor (parent, model, position, rotation) {

        this.parent = parent;
        this.location = parent;
        this.scene = parent.scene;
        this.model = model;
        this.id = model.id;
        this.interaction = new Interaction(this);
        this.scene.manager.addItem(this);
		this.mount();
        Interaction.setInteractable(this, this.recto);
        this.obj.position = position;
        this.obj.rotation = rotation;
	}

    changeParent (parent) {

        var p = this.obj.getAbsolutePosition();
        this.obj.rotation.addInPlace(this.parent.obj.rotation);
        this.parent = parent;
        this.obj.parent = parent.obj;
        this.obj.setAbsolutePosition(p);
        this.obj.rotation.subtractInPlace(this.parent.obj.rotation);
    }

	mount () {

        this.obj = node.create("card", this.parent.obj);

	    var shape = [new BABYLON.Vector3(-1.5, 0, -2),
            new BABYLON.Vector3(-1.5, 0, 2),
            new BABYLON.Vector3(1.5, 0, 2),
            new BABYLON.Vector3(1.5, 0, -2)];
        this.recto = BABYLON.Mesh.CreatePolygon("recto", shape, this.scene);
        var mat = new BABYLON.StandardMaterial ("mat", this.scene);
        mat.diffuseTexture = new BABYLON.Texture("/game/back.png", this.scene);
        this.recto.position = new BABYLON.Vector3(0, 0.01, 0);
        this.recto.material = mat;
        this.recto.parent = this.obj;
        this.verso = BABYLON.Mesh.CreatePolygon("verso", shape, this.scene);
        this.verso.rotation = new BABYLON.Vector3(0, 0, Math.PI);
        this.verso.material = mat;
        this.verso.parent = this.obj;
	}

    identify (data) {

        this.model.identify(data);
        var mat = new BABYLON.StandardMaterial ("mat", this.scene);
        mat.diffuseTexture = new BABYLON.Texture(data.imgLink, this.scene);
        this.recto.material = mat;
    }

    goto (location) {

        if (this.location)
            this.location.removeCard(this);
        this.model.goto(location.model);
        this.location = location;
        location.addCard(this);
        this.interaction = this.model.inHand ? new CardInHandInteraction(this) : new Interaction(this);
    }

    destroy () {

        if (this.location)
            this.location.removeCard(this);
        this.scene.manager.addSequence(new Instant(() => this.obj.dispose()));
    }

    move (async, position, rotation, duration = 680) {

        return new Movement(async, this, position, rotation, duration);
    }
}