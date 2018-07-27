import * as BABYLON from 'babylonjs';
import Sequence from '../sequence/Sequence';

export default class Movement extends Sequence {

    constructor(async, element, position, rotation, duration) {

        super(async);
        this.element = element;
        this.position = position;
        this.rotation = rotation;
        this.duration = duration;
    }

    start () {

        var frameDuration = (this.duration * 30) / 1000;

        var ease = new BABYLON.CircleEase();
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

        var animP = new BABYLON.Animation("movementpos", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keysP = [];
        keysP.push({ frame: 0, value: this.element.obj.position });
        keysP.push({ frame: frameDuration, value: this.position});
        animP.setKeys(keysP);
        animP.setEasingFunction(ease);
        this.element.obj.animations.push(animP);

        var animR = new BABYLON.Animation("movementrot", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keysR = [];
        keysR.push({ frame: 0, value: this.element.obj.rotation });
        keysR.push({ frame: frameDuration, value: this.rotation});
        animR.setKeys(keysR);
        animR.setEasingFunction(ease);
        this.element.obj.animations.push(animR);

        this.element.scene.beginAnimation(this.element.obj, 0, frameDuration, true);

        setTimeout(this.callback, this.duration);
    }
}