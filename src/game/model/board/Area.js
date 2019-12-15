import Deck from "./Deck";
//import Card from "./Card";
import Field from "./Field";
import Hand from "./Hand";
import Court from "./Court";
import Cemetery from "./Cemetery";
import Discard from "./Discard";
import Capsule from "./Capsule";
import Choosebox from "./Choosebox";
import ManaPool from "./ManaPool";
import Aspect from './Aspect';

export default class Area {

	constructor (noId, gameboard) {

		this.id = { type: "area", no: noId };
		gameboard.register(this);

		this.gameboard = gameboard;
		this.deck = new Deck(this);
		this.field = new Field(this);
		this.hand = new Hand(this);
		this.manapool = new ManaPool(this);
		this.court = new Court(this);
		this.cemetery = new Cemetery(this);
		this.discard = new Discard(this);
		this.capsule = new Capsule(this);
		this.choosebox = new Choosebox(this);
	}

	get opposite () {

		return this.gameboard.areas[1 - this.id.no];
	}

	draw () {

		this.gameboard.update();
	}

	get isPlaying () {

		return this.gameboard.currentArea === this;
	}

	newTurn () {

		if (this.extraTurns)
			this.extraTurns--;
		this.manapool.reload();
		this.field.entities.forEach(e => e.refresh());
		this.gameboard.update();
	}

	endTurn () {

		if (this.isPlaying)
			this.gameboard.newTurn();
	}

	extraTurn () {

		this.extraTurns = (this.extraTurns || 0) + 1;
		this.gameboard.notify("extraturn", this);
	}

	addAspect (effect, targets, end) {

		var aspect = new Aspect(this, effect, [this.hand, this.court], targets);
		var unsub1, unsub2;
		unsub1 = end.subscribe((t,s,d) => {
			aspect.deactivate();
			unsub1();
				unsub2();
		})
		unsub2 = this.gameboard.subscribe("playcard", (t,s,d) => {
			if (aspect.targets(this.gameboard.find(s))) {
				aspect.deactivate();
				unsub1();
				unsub2();
			}
		});
		this.gameboard.update();
	}
}