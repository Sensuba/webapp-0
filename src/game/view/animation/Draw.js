import Animation from './Animation';

export default class Draw extends Animation {

	constructor () {

		super(300);
		this.loadAudio("card");
	}
}