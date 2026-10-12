//import Chain from './vue/sequence/Chain';
import WaitingState from './controller/state/WaitingState';
import PlayingState from './controller/state/PlayingState';
import ChooseboxState from './controller/state/ChooseboxState';

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

	control (playing, state) {

		this.model = state.model;
		playing = playing && this.model.started && !this.model.gamestate;
		this.playing = playing;
		if (playing && state.model.currentArea.choosebox.opened) {
			this.controller = new ChooseboxState(this, state.model.currentArea.choosebox);
			return;
		}
		if (this.controller === this.states.waiting || this.controller instanceof ChooseboxState) {
			if (playing)
				this.controller = new PlayingState(this);
			else this.controller = this.states.waiting;
		} else {
			if (!playing)
				this.controller = this.states.waiting;
		}
	}

	select (target) {

		this.control(this.playing, {model: this.model});
		this.controller.select(target);
	}

	unselect () {

		if (this.isPlaying && !(this.controller instanceof PlayingState) && !(this.controller instanceof ChooseboxState))
			this.controller = new PlayingState(this);
		this.update({faculties: undefined});
	}

	highlight (target) {

		this.controller.highlight = target;
	}

	endTurn () {

		if(this.isPlaying && !this.model.currentArea.choosebox.opened)
			this.command({ type: "endturn" });
	}

	get isPlaying () {

		return !!this.playing && !!this.model.currentArea && !this.model.gamestate;
	}
}
