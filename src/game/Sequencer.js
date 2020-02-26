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
import Boost from './view/animation/Boost';
import Heal from './view/animation/Heal';
import Trigger from './view/animation/Trigger';
import NewTurn from './view/animation/NewTurn';
import Psychic from './view/animation/Psychic';
import Burn from './view/animation/Burn';
import Poison from './view/animation/Poison';
import LevelUp from './view/animation/LevelUp';
import BreakShield from './view/animation/BreakShield';
import GainEffect from './view/animation/GainEffect';
import ExtraTurn from './view/animation/ExtraTurn';

export default class Sequencer {

	constructor (master, model, dispatch) {

		this.master = master;
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
	  	/*case "newcard":
	  		if (this.model.started && n.data[0].type === "deck")
	  			return new Shuffle(this.master, n.src.no);
	  		break;*/
	  	case "message": {
	  		this.master.setState({"messages": this.master.state.messages.concat([{text: n.data[0].value}])});
	  		break;
	  	}
	  	case "highlight": {
	  		this.master.manager.highlight(n.src);
	  		break;
	  	}
	  	case "draw": return new Draw(this.master);
	  	case "summon": return new Summon(this.master, n.src.no);
	    case "charattack": return new Attack(this.master, n.src.no);
	    case "levelup": return new LevelUp(this.master, n.src.no);
	    case "damagecard": {
	    	let card = this.model.find(n.src);
	    	if (!card) break;
	    	if (card.isType("artifact")) {
	    		if (this.model.find(n.data[1]) !== card)
	    			return new Damage(this.master, n.src.no, n.data[0]);
	    	}
	    	else if (card.onBoard)
	    		return new Damage(this.master, n.src.no, n.data[0]);
	    	break; }
	    case "playcard": {
	    	let card = this.model.find(n.src);
		    if (card.cardType === "spell") {
		    	if (n.data[0])
		    		new Target(this.master, n.data[0].no).start();
		    	return new Spell(this.master);
		    } else if (card.cardType === "figure") {
		    	if (n.data[1]) {
		    		new Target(this.master, n.data[1].no).start();
		    		return new Spell(this.master);
		    	}
		    }
		    break;
		}
	    case "trap": 
	  		return new Spell(this.master);
	    case "cardmove": 
	  		if (this.model.started && n.data[0].type === "deck")
	  			return new Shuffle(this.master, n.src.no);
	  		break;
		case "cardfaculty": {
			let anim = n.data[0].value ? new Action(this.master, n.src.no, n.data[1]) : new Ability(this.master, n.src.no, n.data[1]);
			let target = n.data[1];
			if (target) {
				//new Target(this.master, target.no).start();
				anim.time = 2000;
			}
			return anim;
		}
	    case "destroycard":
	    	if (this.model.find(n.src).onBoard)
	    		return new Destroy(this.master, n.src.no);
	    	break;
	    case "poisoncard":
	    case "poisontrigger":
	    	if (this.model.find(n.src).onBoard)
	    		return new Poison(this.master, n.src.no);
	    	break;
	    case "silence": return new Psychic(this.master, n.src.no);
	    case "boostcard": {
	    	let card = this.model.find(n.src);
	    	if (card && card.onBoard)
	    		return new Boost(this.master, n.src.no);
	    	break; }
	    case "healcard": {
	    	let card = this.model.find(n.src);
	    	if (!card) break;
	    	if (card.isType("artifact")) {
	    		if (this.model.find(n.data[1]) !== card)
	    			return new Heal(this.master, n.src.no, n.data[0]);
	    	}
	    	else if (card.onBoard)
	    		return new Heal(this.master, n.src.no, n.data[0]);
	    	break; }
	    case "listener": {
	    	let card = this.model.find(n.src);
	    	if (card && card.onBoard)
	    		return new Trigger(this.master, n.src.no);
	    	break; }
	    case "breakshield": return new BreakShield(this.master, n.src.no);
	    case "fatigue": return new Fatigue(this.master, n.src.no);
	    case "burncard": return new Burn(this.master, n.data[0].no);
	    case "addmut":
	    case "addeffect": {
	    	let card = this.model.find(n.src);
	    	if (card && card.onBoard)
	    		return new GainEffect(this.master, n.src.no);
	    	break; }
	    case "setstate": {
	    	if (n.data[1].value) {
		    	let card = this.model.find(n.src);
		    	if (card && card.onBoard)
		    		return new GainEffect(this.master, n.src.no);
	    	}
	    	break ; }
	    case "newturn": {
    		if (this.extraturns) {
    			this.extraturns--;
    			return new ExtraTurn(this.master);
    		}
	    	if (this.master.no === n.src.no) {
	    		return new NewTurn(this.master);
	    	}
	    	break;
	    }
	    case "extraturn":
	    	this.extraturns = (this.extraturns || 0) + 1;
	    	return null;
	    default: return null;
	    }
	}
}