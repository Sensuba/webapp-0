export default (() => {

	var valueSort = (attr, text = false) => (a, b) => {

		var va = text ? a[attr] : (a[attr] !== undefined && a[attr] !== null ? parseInt(a[attr], 10) : null);
		var vb = text ? b[attr] : (b[attr] !== undefined && b[attr] !== null ? parseInt(b[attr], 10) : null);
		if (va !== null && vb !== null)
			return va < vb ? -1 : (va > vb ? 1 : 0);
		if (va !== null && vb === null)
			return 1;
		if (va === null && vb !== null)
			return -1;
		return 0;
	}

	var nameSort = valueSort("nameCard", true);

	var manaSort = valueSort("mana");

	var atkSort = valueSort("atk");

	var hpSort = valueSort("hp");

	var rangeSort = valueSort("range");

	var raritySort = valueSort("rarity");

	var editionSSort = valueSort("idEdition");

	var animeSort = valueSort("anime", true);

	var colorSort = (a, b) => {
		if (a.cardType === "hero" && b.cardType !== "hero")
			return -1;
		if (a.cardType !== "hero" && b.cardType === "hero")
			return 1;
		if (a.cardType === "hero" && b.cardType === "hero") {
			var a1 = parseInt(a.idColor, 10), a2 = parseInt(a.idColor2, 20), b1 = parseInt(b.idColor, 10), b2 = parseInt(b.idColor2, 10);
			if (Math.min(a1, a2) === Math.min(b1, b2))
				return Math.max(a1, a2) - Math.max(b1, b2);
			return Math.min(a1, a2) - Math.min(b1, b2);
		}
		return parseInt(a.idColor, 10) - parseInt(b.idColor, 10);
	}

	var typeSort = (a, b) => {

		var typeToPrio = type => {

			switch (type) {
			case "hero": return 0;
			case "figure": return 1;
			case "spell": return 2;
			case "secret": return 3;
			case "artifact": return 4;
			default: return 99;
			}
		}

		return typeToPrio(a.cardType) - typeToPrio(b.cardType);
	}

	var sort = (cards, sf) => {

		var func = nameSort;
		switch (sf) {
		case "type": func = typeSort; break;
		case "name": func = nameSort; break;
		case "mana": func = manaSort; break;
		case "atk": func = atkSort; break;
		case "hp": func = hpSort; break;
		case "range": func = rangeSort; break;
		case "color": func = colorSort; break;
		case "rarity": func = raritySort; break;
		case "edition": func = editionSSort; break;
		case "anime": func = animeSort; break;
		default: break;
		}

		cards.sort((a, b) => {
			var r = func(a, b);
			if (r === 0) return nameSort(a, b);
			return r;
		})
	}

	var opFilter = (attr, value, op) => {

		switch (op) {
		case "1": return card => card[attr] && parseInt(card[attr], 10) > value;
		case "2": return card => card[attr] && parseInt(card[attr], 10) >= value;
		case "3": return card => card[attr] && parseInt(card[attr], 10) === value;
		case "4": return card => !card[attr] || parseInt(card[attr], 10) !== value;
		case "5": return card => card[attr] && parseInt(card[attr], 10) <= value;
		case "6": return card => card[attr] && parseInt(card[attr], 10) < value;
		default: return card => true;
		}
	}

	var rarityFilter = rarity => card => {

		switch (rarity) {
		case "basic": return !card.rarity;
		case "common": return card.rarity === 1;
		case "uncommon": return card.rarity === 2;
		case "rare": return card.rarity >= 3;
		default: return false;
		}
	}

	var archetypeTranslation = archetype => {

      switch (archetype) {
      case "beast": return "bête";
      case "demon": return "démon";
      default: return archetype;
      }
	}

	var archetypeFilter = archetype => card => card.archetypes && card.archetypes.filter(arc => archetypeTranslation(arc).toLowerCase().includes(archetype.toLowerCase())).length > 0;

	var descriptionFilter = description => card => card.description.toLowerCase().includes(description.toLowerCase());

	var filter = (cards, f) => {

		if (f.search && f.search !== "") {
			var fullsearch = f.search.toLowerCase();
			var directsearch = f => (s, card) => {
				var splits = s.split("\"");
				if (splits.length < 3)
					return splits.every(split => f(split, card));
				for (var i = 0; i < splits.length; i++) {
					if (i%2 === 0 || i+1 >= splits.length) {
						if (!f(splits[i], card))
							return false;
					} else if (!searchFunction(splits[i], card))
						return false;
				}
				return true;
			}
			var minussearch = f => (s, card) => {
				var splits = s.split("!");
				if (splits.length === 1)
					return f(s, card);
				if (!f(splits[0], card))
					return false;
				for (var i = 1; i < splits.length; i++)
					if (f(splits[i], card))
						return false
				return true;
			}
			var orsearch = f => (s, card) => s.split("/").some(somesearch => f(somesearch, card));
			var andsearch = f => (s, card) => s.split(" ").every(somesearch => f(somesearch, card));
			var specsearch = f => (s, card) => {
				var splits = s.split(":");
				if (splits.length === 1)
					return f(s, card);
				var spec = splits[0].toLowerCase(), value = splits[1].toLowerCase();
				var specNum = (stat, value, card) => {
					if (card[stat] === undefined || !/^\d+[+-]?$/.test(value))
						return false;
					var no = parseInt(value.match(/\d+/)[0], 10), cardvalue = parseInt(card[stat], 10);
					if (value.includes("+"))
						return cardvalue >= no;
					if (value.includes("-"))
						return cardvalue <= no;
					return cardvalue === no;
				}
				switch (spec) {
				case "type": return card.cardType === value;
				case "anime": return card.anime.toLowerCase().includes(value)
				case "rarity": return rarityFilter(value)(card);
				case "archetype": return archetypeFilter(value)(card);
				case "edition": return specNum("idEdition", value, card);
				case "mana":
				case "atk":
				case "hp":
				case "range": return specNum(spec, value, card);
				case "color": {
					if (/^[nwrugb]+$/.test(value)){

						var req = [];
						var colormap = [ "n", "w", "r", "u", "g", "b" ]
						req.push(colormap[card.idColor]);
						if (card.idColor2)
							req.push(colormap[card.idColor2]);
						return req.every(letter => value.includes(letter))
					}
				 	switch(value) {
					case "neutral": return card.idColor === 0 || card.idColor2 === 0;
					case "white": return card.idColor === 1 || card.idColor2 === 1;
					case "red": return card.idColor === 2 || card.idColor2 === 2;
					case "blue": return card.idColor === 3 || card.idColor2 === 3;
					case "green": return card.idColor === 4 || card.idColor2 === 4;
					case "black": return card.idColor === 5 || card.idColor2 === 5;
					default: return false;
					}
				}
				default: return false;
				}
			}
			var searchFunction = (s, card) => {
				if ((card.nameCard && card.nameCard.toLowerCase().includes(s)) || (card.anime && card.anime.toLowerCase().includes(s)) || (card.description && card.description.toLowerCase().includes(s)))
			 		return true;
			 	if ((card.lv2 && searchFunction(s,card.lv2)) || (card.lvmax && searchFunction(s, card.lvmax)))
			 		return true;
			 	if (card.archetypes && card.archetypes.filter(arc => archetypeTranslation(arc).toLowerCase().includes(s.toLowerCase())).length > 0)
			 		return true;
			 	if (card.tokens && card.tokens.some(token => searchFunction(s, token)))
			 		return true;
			 	return false;
			}
			cards = cards.filter(card => directsearch(andsearch(minussearch(orsearch(specsearch(searchFunction)))))(fullsearch, card));
		}
		if (f.edition && f.edition !== "")
			cards = cards.filter(card => card.idEdition === parseInt(f.edition, 10));
		if (f.type && f.type !== "")
			cards = cards.filter(card => card.cardType === f.type);
		if (f.rarity && f.rarity !== "")
			cards = cards.filter(rarityFilter(f.rarity));
		if (f.colors && f.colors.length > 0)
			cards = cards.filter(card => f.colors.includes(card.idColor) && (!card.idColor2 || f.colors.includes(card.idColor2)));
		if (f.archetype && f.archetype !== "")
			cards = cards.filter(archetypeFilter(f.archetype));
		if (f.name && f.name !== "")
			cards = cards.filter(card => card.nameCard.toLowerCase().includes(f.name.toLowerCase()));
		if (f.description && f.description !== "")
			cards = cards.filter(descriptionFilter(f.description));
		if (f.anime && f.anime !== "")
			cards = cards.filter(card => card.anime.toLowerCase().includes(f.anime.toLowerCase()));
		if (f.flavour && f.flavour !== "")
			cards = cards.filter(card => card.flavourText.toLowerCase().includes(f.flavour.toLowerCase()));
		if (f.mana && !isNaN(f.mana) && f.manaop && f.manaop !== "")
			cards = cards.filter(opFilter("mana", parseInt(f.mana, 10), f.manaop));
		if (f.atk && !isNaN(f.atk) && f.atkop && f.atkop !== "")
			cards = cards.filter(opFilter("atk", parseInt(f.atk, 10), f.atkop));
		if (f.hp && !isNaN(f.hp) && f.hpop && f.hpop !== "")
			cards = cards.filter(opFilter("hp", parseInt(f.hp, 10), f.hpop));
		if (f.range && !isNaN(f.range) && f.rangeop && f.rangeop !== "")
			cards = cards.filter(opFilter("range", parseInt(f.range, 10), f.rangeop));
		if (f.orderBy)
			sort(cards, f.orderBy);
		return cards;
	}

	return {

		sort,
		filter
	};

})();