import * as BABYLON from 'babylonjs';

export default class Interaction {

	onMouseEnter() {}

	onMouseExit() {}

	onMouseDown() {}

	update(state) {}

	static setInteractable (interactable, mesh) {

		if (mesh === undefined)
			mesh = interactable.obj;
        mesh.actionManager = new BABYLON.ActionManager(interactable.scene);
		mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, () => interactable.interaction.onMouseDown()));
		mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, () => interactable.interaction.onMouseEnter()));
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, () => interactable.interaction.onMouseExit()));
	}
}