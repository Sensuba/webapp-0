import Sequence from './Sequence';

export default class Instant extends Sequence {

    constructor(event) {

        super(true);
        this.event = event;
    }

    start () {

        this.event();
    }
}