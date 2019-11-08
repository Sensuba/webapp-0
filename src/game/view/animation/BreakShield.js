import Animation from './Animation';

export default class BreakShield extends Animation {

	constructor (master, card) {

		super(master, 0);
		this.card = card;
		this.loadAudio("shatter");
	}
}