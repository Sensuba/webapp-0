import Sequence from './Sequence';

export default class Pause extends Sequence {

    constructor(duration) {

        super(false);
        this.duration = duration;
    }

    start () {

        setTimeout(this.callback, this.duration);
    }
}