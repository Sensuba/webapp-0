//import Chain from './vue/sequence/Chain';
import WaitingState from './controller/state/WaitingState';
import PlayingState from './controller/state/PlayingState';

export default class Manager {

	constructor (model, command, update) {

		this.model = model;
		this.command = command;
		this.update = () => {};
		//this.items = {};
		//this.sequencer = new Chain();
		this.states = { waiting: new WaitingState(this) };
		this.controller = this.states.waiting;
		this.update = update;
	}/*

	addItem (item) {

		var id = item.id;
		this.items[id.type] = this.items[id.type] || {};
		this.items[id.type][id.no] = item;
	}

	find (id) {

		return this.items[id.type][id.no];
	}*/

	/*addSequence (seq) {

		this.sequencer.add(seq);
	}*/

	control (playing) {

		this.controller = playing ? new PlayingState(this) : this.states.waiting;
	}

	select (target) {

		this.controller.select(target);
	}

	unselect () {

		this.control(this.isPlaying);
		this.update();
	}

	endTurn () {

		if(this.isPlaying)
			this.command({ type: "endturn" });
	}

	get isPlaying () {

		return !(this.controller === this.states.waiting);
	}
}