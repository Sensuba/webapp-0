import Attack from './view/animation/Attack';
import Damage from './view/animation/Damage';
import Spell from './view/animation/Spell';
import Target from './view/animation/Target';
//import Destroy from './view/animation/Destroy';

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
	    case "charattack": return new Attack(n.src.no);
	    case "damagecard": return new Damage(n.src.no);
	    case "playcard": 
	    	let card = this.model.find(n.src);
		    if (card.cardType === "spell" && n.data[0])
		    	return new Target(n.data[0].no);
		    break;
	    case "cardmove": 
		    if (n.data[0].type === "court")
		    	return new Spell();
		    break;
	    //case "destroycard": return new Destroy(n.src.no);
	    default: return null;
	    }
	}
}