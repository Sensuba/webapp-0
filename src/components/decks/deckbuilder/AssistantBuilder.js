import synergies from './synergies.json';

const deckTypes = {
	agro: {
		mana: { "0": 0.1, "1": 0.35, "2": 0.35, "3": 0.2, "4": 0, "5": 0, "6": 0 },
		roles: { "tempo": 0.45, "dealer": 0.25, "value": 0, "control": 0, "sustain": 0, "burst": 0.25, "ramp": 0, "buff": 0.05, "invest": 0 }
	},
	control: {
		mana: { "0": 0, "1": 0.1, "2": 0.15, "3": 0.25, "4": 0.2, "5": 0.15, "6": 0.15 },
		roles: { "tempo": 0, "dealer": 0.15, "value": 0.1, "control": 0.5, "sustain": 0.2, "burst": 0, "ramp": 0, "buff": 0, "invest": 0.05 }
	},
	burst: {
		mana: { "0": 0.15, "1": 0.25, "2": 0.3, "3": 0.2, "4": 0.05, "5": 0.05, "6": 0 },
		roles: { "tempo": 0, "dealer": 0.15, "value": 0.2, "control": 0.15, "sustain": 0, "burst": 0.5, "ramp": 0, "buff": 0, "invest": 0 }
	},
	midrange: {
		mana: { "0": 0, "1": 0.25, "2": 0.3, "3": 0.25, "4": 0.15, "5": 0.05, "6": 0 },
		roles: { "tempo": 0.45, "dealer": 0.2, "value": 0.15, "control": 0.1, "sustain": 0, "burst": 0.1, "ramp": 0, "buff": 0.15, "invest": 0 }
	},
	combo: {
		mana: { "0": 0.2, "1": 0.3, "2": 0.25, "3": 0.15, "4": 0.1, "5": 0, "6": 0 },
		roles: { "tempo": 0, "dealer": 0.05, "value": 0.45, "control": 0.2, "sustain": 0, "burst": 0.1, "ramp": 0.1, "buff": 0, "invest": 0.1 }
	}
}

export default class AssistantBuilder {

	constructor (cardlist) {

		this.cardlist = cardlist;
	}

	build () {

		var heroes = this.cardlist.filter(card => card.cardType === "hero");
		var hero = heroes[Math.floor(Math.random() * heroes.length)].idCardmodel;
		var deck = { hero, cards: {} };
		while (Object.keys(deck.cards).reduce((acc, k) => acc + deck.cards[k], 0) < 30) {
			var suggestions = this.suggest({cards:this.cardlist}, deck, 3);
			var pick = suggestions[Math.floor(Math.random() * suggestions.length)];
			deck.cards[pick.idCardmodel] = Math.min(deck.cards[pick.idCardmodel] ? deck.cards[pick.idCardmodel] + 1 : 1, 2);
		}
		return deck;
	}

	suggest (possibilities, deck, count) {

		var empty = Object.keys(deck.cards).length === 0;
		var params = this.getDeckParams(deck);
		var target = this.deckTypeTarget(params);
		var missing = empty ? target : this.missingPoints(params, target);
		var options = this.getOptions(deck);
		var totalTypes = Object.keys(params.type).reduce((a, b) => a + params.type[b], 0);

		var hero = this.cardlist.find(c => c.idCardmodel === deck.hero);
		var suggestions = [];
		for (var i = 0; i < count; i++)
			suggestions.push({ id: 101, value: 0 });
		possibilities.cards.forEach(card => {
			var id = card.idCardmodel;
			if (card.cardType === "hero")
				return;
			if (card.idColor > 0 && card.idColor !== hero.idColor && card.idColor !== hero.idColor2)
				return;
			if (deck.cards[id] && deck.cards[id] >= 2)
				return;

			var syn = Object.assign({}, synergies[id]);
			if (!syn || !syn.options)
				return;
			syn.options = syn.options.map(s => s.type);
			//if (card.mana !== undefined && card.mana !== null) 
				//if (!syn.options.includes("play") && (card.mana === 0 || card.mana === "0" || card.mana === 1 || card.mana === "1"))
				//	syn.options.push("play");
			if (card.cardType === "figure") {
				//if (!syn.options.includes("board"))
				//	syn.options.push("board");
				//if (!syn.options.includes("range") && card.range > 1)
				//	syn.options.push("range");
				if (!syn.options.includes("big") && card.mana >= 5)
					syn.options.push("big");
				//if (card.archetypes)
				//	card.archetypes.forEach(arc => { if (!syn.options.includes(arc)) syn.options.push(arc); });
			} //else if (!syn.options.includes("spell") && card.cardType === "spell")
				//syn.options.push("spell");
			else if (!syn.options.includes("secret") && card.cardType === "secret")
				syn.options.push("secret");
			else if (!syn.options.includes("artifact") && card.cardType === "artifact")
				syn.options.push("artifact");

			var mana = card.mana, roles = syn.roles, basis = syn.basis;
			var manavalue = missing.mana[mana];
			var rolevalue = 0;
			roles.forEach(role => rolevalue += missing.roles[role] / roles.length);
			var basisvalue = 0;
			basis.forEach(b => basisvalue += params.type[b] / totalTypes);
			var optionsvalue = syn.options.reduce((a, b) => a + this.computeOptionValue(id, b, options, deck), 0);
			var rewardvalue = syn.reward.reduce((a, b) => a + this.computeRewardValue(b, options) * (syn.reward.length > 1 ? 3/5 : 1), 0);
			var colorvalue = card.idColor > 0 ? 1 : 0;
			if (card.cardType === "figure") {
				if (card.range > 1) {
			 		optionsvalue += Math.max(-0.12, ((0.15 - 0.005 * options.damage - 0.005 * options.destroy - 0.015 * options.range - 0.015 * options.flying) * Object.keys(deck.cards).reduce((a, k) => a + deck.cards[k], 0)/25));
				}
			 	if (card.archetypes && card.archetypes.length > 0)
			 		optionsvalue -= 0.02;
			}
			let modrv = Math.pow(rewardvalue, 0.8), modov = Math.pow(optionsvalue, 0.8);
			var value = ((manavalue + rolevalue + manavalue * rolevalue + (isNaN(modrv) ? rewardvalue : modrv)) * 0.8 + (isNaN(modov) ? optionsvalue : modov)) * (1 + basisvalue*2) * (1 + colorvalue * 0.1);
			for (var i = 0; i < count; i++)
				if (value <= suggestions[i].value)
					value -= (synergies[suggestions[i].id].roles.filter(el => roles.indexOf(el) !== -1).length / roles.length / synergies[suggestions[i].id].roles.length) * 0.5;
			if (value > suggestions[count-1].value) {
				suggestions[count-1] = { id, value }
				suggestions.sort((a, b) => b.value - a.value);
			}
		});

		return suggestions.map(s => this.cardlist.find(c => c.idCardmodel === s.id))
	}

	getDeckParams (deck) {

		var deckManas = [0, 0, 0, 0, 0, 0, 0]
		var deckRoles = { "tempo": 0, "dealer": 0, "value": 0, "control": 0, "sustain": 0, "burst": 0, "ramp": 0, "buff": 0, "invest": 0 }
		var deckTypes = { "agro": 0, "midrange": 0, "control": 0, "burst": 0, "combo": 0 }

		var addCard = (id, count) => {
			var card = this.cardlist.find(c => c.idCardmodel === id);
			if (card && card.mana !== undefined) {
				var i = Math.min(parseInt(card.mana, 10), 6);
				deckManas[i] += count;
			}
			if (card) {
				var syn = synergies[card.idCardmodel];
				if (syn) {
					syn.roles.forEach(role => deckRoles[role] += count/syn.roles.length);
					syn.basis.forEach(type => deckTypes[type] += count/syn.basis.length);
				}
			}
		}

		Object.keys(deck.cards).forEach(k => addCard(parseInt(k, 10), deck.cards[k]));
		addCard(deck.hero, 1);
		var totalManas = deckManas.reduce((a, b) => a + b, 0);
		var totalRoles = Object.keys(deckRoles).reduce((a, b) => a + deckRoles[b], 0);
		var totalTypes = Object.keys(deckTypes).reduce((a, b) => a + deckTypes[b], 0);
		
		var params = {
			type: { "agro": deckTypes.agro/totalTypes, "midrange": deckTypes.midrange/totalTypes, "control": deckTypes.control/totalTypes, "burst": deckTypes.burst/totalTypes, "combo": deckTypes.combo/totalTypes },
			mana: { "0": deckManas[0]/totalManas, "1": deckManas[1]/totalManas, "2": deckManas[2]/totalManas, "3": deckManas[3]/totalManas, "4": deckManas[4]/totalManas, "5": deckManas[5]/totalManas, "6": deckManas[6]/totalManas },
			roles: { "tempo": deckRoles.tempo/totalRoles, "dealer": deckRoles.dealer/totalRoles, "value": deckRoles.value/totalRoles, "control": deckRoles.control/totalRoles, "sustain": deckRoles.sustain/totalRoles, "burst": deckRoles.burst/totalRoles, "ramp": deckRoles.ramp/totalRoles, "buff": deckRoles.buff/totalRoles, "invest": deckRoles.invest/totalRoles }
		}

		return params;
	}

	deckTypeTarget (params) {

		var target = {
			mana: { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 },
			roles: { "tempo": 0, "dealer": 0, "value": 0, "control": 0, "sustain": 0, "burst": 0, "ramp": 0, "buff": 0, "invest": 0 }
		}
		/*var types = {};
		Object.keys(deckTypes).forEach(k => types[k] = 0);
		
		Object.keys(types).forEach(type => {

			Object.keys(deckTypes[type]).forEach(fact => {
				Object.keys(deckTypes[type][fact]).forEach(e => types[type] += Math.abs(deckTypes[type][fact][e] - params[fact][e]));
			})
			types[type] = Math.pow(1+types[type], 8);
			Object.keys(deckTypes[type]).forEach(fact => {
				Object.keys(deckTypes[type][fact]).forEach(e => target[fact][e] += deckTypes[type][fact][e] / types[type]);
			})

		});
		Object.keys(target).forEach(fact => {
			var total = Object.keys(target[fact]).reduce((a, b) => a + target[fact][b], 0);
			Object.keys(target[fact]).forEach(e => target[fact][e] *= total);
		});*/

		var types = Object.assign({}, params.type);
		Object.keys(types).forEach(type => {
			["mana", "roles"].forEach(fact => Object.keys(deckTypes[type][fact]).forEach(e => target[fact][e] += deckTypes[type][fact][e] * types[type]))
		});
		Object.keys(target).forEach(fact => {
			var total = Object.keys(target[fact]).reduce((a, b) => a + target[fact][b], 0);
			Object.keys(target[fact]).forEach(e => target[fact][e] *= total);
		});

		return target;
	}

	missingPoints (params, target) {

		var missing = {
			mana: { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 },
			roles: { "tempo": 0, "dealer": 0, "value": 0, "control": 0, "sustain": 0, "burst": 0, "ramp": 0, "buff": 0, "invest": 0 }
		}
		Object.keys(missing).forEach(fact => {
			Object.keys(missing[fact]).forEach(e => missing[fact][e] = Math.max(0, target[fact][e] * 1.2 - params[fact][e]));
		});

		return missing;
	}

	addCardToOptions (options, cross, id, count) {

		var card = this.cardlist.find(c => c.idCardmodel === id);
		if (!card) return;
		if (card.mana !== undefined && card.mana !== null) {
			if (card.mana === 0 || card.mana === "0")
				options.play += count;
			if (card.mana === 1 || card.mana === "1")
				options.play += count / 3;
		}
		if (card.cardType === "figure") {
			options.board += Math.max(2/(card.mana + 1), 1) * count;
			if (card.range > 1)
				options.range += count;
			if (card.mana >= 4)
				options.big += count;
			if (card.archetypes)
				card.archetypes.forEach(arc => options[arc] += count);
		} else if (card.cardType === "spell") {
			options.spell += Math.max(2/(card.mana + 1), 1) * count;
		} else if (card.cardType === "secret") {
			options.secret += count;
		} else if (card.cardType === "artifact") {
			options.artifact += count;
		}

		var syn = synergies[id];
		if (!syn)
			return;
		syn.options.forEach(opt => {
			if (opt.value === "X")
				cross.push({ for: opt.type, using: syn.reward[0], count });
			else
				options[opt.type] += opt.value * count;
		});
	}

	crossOptions (options, cross) {

		cross.forEach(op => {
			switch (op.using) {
			case "board": options[op.for] += options.board / 8 * op.count; break;
			case "spell": options[op.for] += options.spell / 6.5 * op.count; break;
			case "secret": options[op.for] += options.secret / 4 * op.count; break;
			case "play": options[op.for] += (1 + options.play / 8 + options.gem / 4 + options.mana / 4) * (1 + options.draw / 6 + options.generate / 10) * op.count; break;
			case "freeze": options[op.for] += options.freeze / 4 * op.count; break;
			case "poison": options[op.for] += options.poison / 4 * op.count; break;
			case "discard": options[op.for] += options.discard / 4 * op.count; break;
			case "heal": options[op.for] += options.heal / 4 * op.count; break;
			case "shield": options[op.for] += options.shield / 4 * op.count; break;
			case "attack": options[op.for] += (2 + options.attack / 4) * op.count; break;
			case "motion": options[op.for] += options.motion / 3 * op.count; break;
			case "cover": options[op.for] += (3 + options.cover / 3) * op.count; break;
			case "push": options[op.for] += (1 + options.push / 3) * op.count; break;
			case "selfdamage": options[op.for] += (1 + options.selfdamage / 4) * op.count; break;
			case "selffreeze": options[op.for] += (options.selffreeze / 3 + options.freeze / 6) * op.count; break;
			case "flying":
			case "initiative":
			case "exaltation":
			case "lolita":
			case "dragon":
			case "beast":
			case "cyber":
			case "demon":
			case "magical girl": options[op.for] += options[op.using] / 3 * op.count; break;
			default: break;
			}
		})
	}

	getOptions (deck) {

		var options = { board: 0, draw: 0, gem: 0, mana: 0, receptacle: 0, initiative: 0, fury: 0, exaltation: 0, boost: 0,
			heal: 0, silence: 0, damage: 0, selfdamage: 0, destroy: 0, selfdestroy: 0, freeze: 0, flying: 0, lastwill: 0,
			generate: 0, shield: 0, push: 0, play: 0, lowatk: 0, lowhp: 0, range: 0, bounce: 0, overload: 0, spell: 0,
			cover: 0, artifact: 0, big: 0, frenzy: 0, beast: 0, cyber: 0, dragon: 0, lolita: 0, demon: 0, "magical girl": 0,
			enemydraw: 0, highhp: 0, conceal: 0, motion: 0, "selfpoison": 0, "selffreeze": 0, "discard": 0, "steal": 0,
			poison: 0, specific: 0, secret: 0, attack: 0, disruption: 0, highatk: 0, delay: 0, handbuff: 0
		}
		var cross = [];

		Object.keys(deck.cards).forEach(k => this.addCardToOptions(options, cross, parseInt(k, 10), deck.cards[k]));
		this.addCardToOptions(options, cross, deck.hero, 1);

		this.crossOptions(options, cross);

		return options;
	}

	computeRewardValue (type, options) {

		var totalOptions = Object.keys(options).reduce((a, b) => a + options[b], 0);

		var noptions = {}
		Object.keys(options).forEach(k => noptions[k] = options[k] * Math.log2(1+options[k]/totalOptions*110));

		switch (type) {
		case "boost": return (noptions.boost - 20) / 150 + (noptions.handbuff - 8)/100;
		case "board": return (noptions.board - 60) / 180;
		case "play": return (1 + (noptions.play-40)/120 + (noptions.gem-2)/40 + (noptions.mana-2)/40) * (1 + (noptions.draw-15)/100 + (noptions.generate-10)/180) - 1;
		case "freeze": return (noptions.freeze - 40) / 100;
		case "selfpoison": return (noptions.selfpoison - 5) / 20 + (noptions.poison - 20) / 80;
		case "selffreeze": return (noptions.selffreeze - 5) / 20 + (noptions.freeze - 20) / 80;
		case "shield": return (noptions.shield - 40) / 100;
		case "poison": return (noptions.poison - 40) / 100;
		case "motion": return (noptions.motion - 30) / 80;
		case "conceal": return (noptions.conceal - 35) / 60;
		case "discard": return (noptions.discard - 40) / 100;
		case "draw": return (noptions.draw  - 25) / 120;
		case "enemydraw": return (noptions.enemydraw  - 15) / 60;
		case "hand": return (noptions.draw  - 25) / 100 + (noptions.generate  - 25) / 100;
		case "damage": return (noptions.damage + noptions.selfdamage  - 55) / 100;
		case "selfdamage": return (noptions.selfdamage - 20) / 40 + (noptions.board - 50) / 220 + (noptions.attack - 8)/160 - (noptions.initiative / 20);
		case "destroy": return (noptions.destroy - 40) / 100;
		case "selfdestroy": return (noptions.selfdestroy - 6)/25 + (noptions.board - 60) / 250 + (noptions.attack - 8)/160 - (noptions.initiative / 20);
		case "spell": return (noptions.spell - 50) / 120;
		case "nospell": return (noptions.board - 60) / 140 - Math.max(0, noptions.spell / 35);
		case "big": return (noptions.big - 10) / 80 - Math.max(0, (noptions.board - 10) / 120);
		case "bounce": return noptions.bounce < 0 ? noptions.bounce : Math.pow((noptions.bounce - 6)/60, 0.6);
		case "overload": return (noptions.overload - 20) / 150;
		case "lowatk": return (noptions.lowatk - 4)/60;
		case "lowhp": return (noptions.lowhp - 4)/60 + (noptions.damage - 40)/250;
		case "highhp": return (noptions.highhp - 4)/60;
		case "highatk": return (noptions.highatk - 4)/50 + (noptions.boost - 10) / 250;
		case "cover": return (noptions.cover - 4)/50 + (noptions.board - 60)/250;
		case "frenzy": return (noptions.frenzy - 10)/100;
		case "artifact": return (noptions.artifact - 10)/40;
		case "secret": return (noptions.secret - 10)/40;
		case "silence": return (noptions.silence - 10)/40;
		case "lastwill": return (noptions.lastwill - 10)/40;
		case "heal": return (noptions.heal - 35)/120;
		case "push": return (noptions.push - 12)/60;
		case "gem": return (noptions.gem - 10)/40;
		case "handbuff": return (noptions.handbuff - 10)/40;
		case "steal": return (noptions.steal - 10)/40;
		case "disruption": return (noptions.disruption - 8)/40;
		case "delay": return (noptions.delay  - 4) / 40;
		case "attack": return (noptions.attack - 20)/60 + (noptions.board - 60)/400 + (noptions.fury / 160);
		case "ramp": return (noptions.receptacle - 10) / 40;
		case "initiative":  return (noptions[type] - 20) / 140;
		case "flying":
		case "exaltation":  return (noptions[type] - 20) / 80;
		case "dragon":
		case "lolita":
		case "beast":
		case "cyber":
		case "demon":
		case "magical girl": return (noptions[type] < 0 ? noptions[type] : Math.pow(noptions[type], 1.5) - 90) / 60;
		default: return 0;
		}
	}

	computeOptionValue (id, type, options, deck) {

		var rewardcount = Object.keys(deck.cards).reduce((acc, id) => acc + (synergies[id] && synergies[id].reward.includes(type) ? deck.cards[id] : 0), 0);
		if (synergies[deck.hero] && synergies[deck.hero].reward.includes(type))
			rewardcount++;

		var before = this.computeRewardValue(type, options) * rewardcount;

		var noptions = Object.assign({}, options);
		var cross = [];
		this.addCardToOptions(noptions, cross, id, 1);
		this.crossOptions(noptions, cross);

		var after = this.computeRewardValue(type, noptions) * rewardcount;

		var gain = after - before;
		if (isNaN(gain))
			gain = 0;

		switch (type) {
		case "silence": return (gain + 0.02 - 0.02 * options.silence) * deck.cards/25;
		case "flying":
		case "range": return Math.max(-0.12, (gain + 0.15 - 0.005 * options.damage - 0.005 * options.destroy - 0.015 * options.range - 0.015 * options.flying) * Object.keys(deck.cards).reduce((a, k) => a + deck.cards[k], 0)/25);
		case "enemydraw": return gain - 0.06 + 0.015 * options.enemydraw;
		case "delay":
		case "generate":
		case "draw": return gain - 0.002 * options[type];
		case "shield":
		case "heal": return gain - 0.004 * options[type];
		case "disruption":
		case "cover":
		case "gem":
		case "push":
		case "poison": return gain - 0.02 - 0.004 * options[type];
		case "artifact": return gain - 0.002 - 0.08 * (noptions[type] < 0 ? noptions[type] : Math.pow(options[type], 1.15));
		case "secret": return gain - 0.02 - 0.08 * (noptions[type] < 0 ? noptions[type] : Math.pow(options[type], 1.25));
		case "conceal":
		case "freeze":
		case "steal":
		case "lowatk":
		case "lowhp":
		case "highatk":
		case "highhp": return gain - 0.04 - 0.004 * options[type];
		case "play": return gain - 0.04 - 0.002 * options[type];
		case "motion":
		case "boost":
		case "handbuff":
		case "discard":
		case "attack":
		case "spell":
		case "overload": return gain - 0.06 - 0.004 * options[type];
		case "specific": return gain - 0.08;
		case "bounce": return gain - 0.08 - 0.01 * options[type];
		case "selffreeze": 
		case "selfpoison": 
		case "selfdamage": 
		case "selfdestroy": return gain - 0.08 - 0.004 * options[type];
		case "board": return gain - 0.1 - 0.004 * options[type];
		default: return gain;
		}
	}
}