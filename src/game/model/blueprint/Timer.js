var Bloc = require('./Bloc');
var Types = require('./Types');

class Timer extends Bloc {

	constructor (src, ctx) {

		super("timer", src, ctx);
		this.f = (src, ins, props) => {
			var unsub = src.gameboard.subscribe(this.timeToEvent(ins[0].time), (t,s,d) => {
				if (ins[0].player === null || ins[0].player.isPlaying) {
					if (this.callback) {
						this.callback.execute(props);
						src.gameboard.update();
					}
					unsub();
				}
			})
		}
		this.types = [Types.timestamp];
		this.toPrepare.push("callback");
	}

	timeToEvent (time) {

		switch (time) {
		case 0: return "newturn";
		case 1: return "endturn";
		case 2: return "cleanup";
		default: return "newturn";
		}
	}
}

module.exports = Timer;