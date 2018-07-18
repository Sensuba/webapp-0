import * as BABYLON from 'babylonjs';

export default class Card {

	constructor (parent, position, rotation) {

        this.parent = parent;
        this.scene = parent.scene;
		this.mount();
        this.obj.position = position;
        this.obj.rotation = rotation;
	}

	mount () {

	    var shape = [new BABYLON.Vector3(-1.5, 0, -2),
            new BABYLON.Vector3(-1.5, 0, 2),
            new BABYLON.Vector3(1.5, 0, 2),
            new BABYLON.Vector3(1.5, 0, -2)];
        var obj = BABYLON.Mesh.CreatePolygon("card", shape, this.scene);
        this.obj = obj;
        var mat = new BABYLON.StandardMaterial ("mat", this.scene);
        mat.diffuseTexture = new BABYLON.Texture("/game/back.png", this.scene);
        obj.material = mat;
        obj.parent = this.parent.obj;
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
}