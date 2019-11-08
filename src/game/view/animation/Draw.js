import Animation from './Animation';

export default class Draw extends Animation {

	constructor (master) {

		super(master, 200);
		this.loadAudio("card");
	}
}