import Attack from './view/animation/Attack';
import Damage from './view/animation/Damage';
import Spell from './view/animation/Spell';
import Target from './view/animation/Target';
import Draw from './view/animation/Draw';
import Action from './view/animation/Action';
import Ability from './view/animation/Ability';
import Destroy from './view/animation/Destroy';
import Summon from './view/animation/Summon';
import Fatigue from './view/animation/Fatigue';
import Shuffle from './view/animation/Shuffle';

export default class Sequencer {

	constructor (model, dispatch) {

		this.model = model;
		this.queue = [];
		this.current = null;
		this.dispatch = dispatch;
	}

	add (n) {

		if (this.current)
			this.queue.push(n);
		else
			this.read(n);
	}

	next () {

		this.current = null;
		if (this.queue.length > 0)
			this.read(this.queue.shift());
	}

	read (n) {

		var anim = this.notifToAnim(n);
		if (anim) {
			if (anim.sync)
				this.current = anim;
			if (!anim.before)
				this.dispatch(n);
			anim.start(() => {
				if (anim.before)
					this.dispatch(n);
				this.next();
			});
		} else {
			this.dispatch(n);
			this.next();
		}
	}

	update () {

		if (!this.current.sync)
			this.next();
	}

	notifToAnim (n) {

	  switch(n.type) {
	  	case "newcard":
	  		if (this.model.started && n.data[0].type === "deck")
	  			return new Shuffle(n.src.no);
	  		break;
	  	case "draw": return new Draw();
	  	case "summon": return new Summon(n.src.no);
	    case "charattack": return new Attack(n.src.no);
	    case "damagecard": return new Damage(n.src.no);
	    case "playcard": {
	    	let card = this.model.find(n.src);
		    if (card.cardType === "spell") {
		    	if (n.data[0])
		    		new Target(n.data[0].no).start();
		    	return new Spell();
		    } else if (card.cardType === "figure") {
		    	if (n.data[1]) {
		    		new Target(n.data[1].no).start();
		    		return new Spell();
		    	}
		    }
		    break;
		}
	    case "trap": 
	  		return new Spell();
	    case "cardmove": 
	  		if (this.model.started && n.data[0].type === "deck")
	  			return new Shuffle(n.src.no);
	  		break;
		case "cardfaculty": {
			let anim = n.data[0].value ? new Action(n.src.no) : new Ability(n.src.no);
			let target = n.data[1];
			if (target) {
				new Target(target.no).start();
				anim.time = 2000;
			}
			return anim;
		}
	    case "destroycard":
	    	if (this.model.find(n.src).onBoard)
	    		return new Destroy(n.src.no);
	    	break;
	    case "fatigue":
	    	return new Fatigue(n.src.no);
	    default: return null;
	    }
	}
}