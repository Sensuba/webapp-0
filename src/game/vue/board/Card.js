import * as BABYLON from 'babylonjs';
import node from '../Node';

export default class Card {

	constructor (parent, noId, position, rotation) {

        this.parent = parent;
        this.scene = parent.scene;
        this.id = { type: "card", no: noId };
        this.scene.manager.addItem(this);
		this.mount();
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
        this.recto.material = mat;
        this.recto.parent = this.obj;
        this.verso = BABYLON.Mesh.CreatePolygon("verso", shape, this.scene);
        this.verso.rotation = new BABYLON.Vector3(0, 0, Math.PI);
        this.verso.material = mat;
        this.verso.parent = this.obj;
	}

    move (position, rotation, duration = 20) {

        var ease = new BABYLON.CircleEase();
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

        var animP = new BABYLON.Animation("cardmovepos", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keysP = [];
        keysP.push({ frame: 0, value: this.obj.position });
        keysP.push({ frame: duration, value: position});
        animP.setKeys(keysP);
        animP.setEasingFunction(ease);
        this.obj.animations.push(animP);

        var animR = new BABYLON.Animation("cardmoverot", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keysR = [];
        keysR.push({ frame: 0, value: this.obj.rotation });
        keysR.push({ frame: duration, value: rotation});
        animR.setKeys(keysR);
        animR.setEasingFunction(ease);
        this.obj.animations.push(animR);

        this.scene.beginAnimation(this.obj, 0, duration, true);
    }

    identify (data) {

        var mat = new BABYLON.StandardMaterial ("mat", this.scene);
        mat.diffuseTexture = new BABYLON.Texture(data.imgLink, this.scene);
        this.recto.material = mat;
    }
}