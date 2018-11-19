import * as BABYLON from 'babylonjs';

export default (() => {

	var create = (name, parent, position, rotation) => {

		var obj = BABYLON.Mesh.CreateGround(name, 0, 0, 0, this.scene);
	    obj.isVisible = false;
	    if (parent)
	    	obj.parent = parent;
	    if (position)
	    	obj.position = position;
		if (rotation)
	    	obj.rotation = rotation;
	    return obj
	}

	return {

		create
	}
})();