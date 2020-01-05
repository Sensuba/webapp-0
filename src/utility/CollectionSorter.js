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
			case "artefact": return 3;
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

	var filter = (cards, f) => {

		if (f.search && f.search !== "") {
			var s = f.search.toLowerCase();
			var searchFilter = card => {
				if ((card.nameCard && card.nameCard.toLowerCase().includes(s)) || (card.anime && card.anime.toLowerCase().includes(s)) || (card.description && card.description.toLowerCase().includes(s)))
			 		return true;
			 	if ((card.lv2 && searchFilter(card.lv2)) || (card.lvmax && searchFilter(card.lvmax)))
			 		return true;
			 	if (card.archetypes && card.archetypes.filter(arc => arc.toLowerCase().includes(f.search.toLowerCase())).length > 0)
			 		return true;
			 	if (card.tokens && card.tokens.some(token => searchFilter(token)))
			 		return true;
			 	return false;
			}
			cards = cards.filter(searchFilter);
		}
		if (f.edition && f.edition !== "")
			cards = cards.filter(card => card.idEdition === parseInt(f.edition, 10));
		if (f.type && f.type !== "")
			cards = cards.filter(card => card.cardType === f.type);
		if (f.rarity && f.rarity !== "")
			cards = cards.filter(card => {
				switch (f.rarity) {
				case "basic": return !card.rarity;
				case "common": return card.rarity === 1;
				case "uncommon": return card.rarity === 2;
				case "rare": return card.rarity >= 3;
				default: return false;
				}
			});
		if (f.colors && f.colors.length > 0)
			cards = cards.filter(card => f.colors.includes(card.idColor) && (!card.idColor2 || f.colors.includes(card.idColor2)));
		if (f.archetype && f.archetype !== "")
			cards = cards.filter(card => card.archetypes && card.archetypes.filter(arc => arc.toLowerCase().includes(f.archetype.toLowerCase())).length > 0);
		if (f.name && f.name !== "")
			cards = cards.filter(card => card.nameCard.toLowerCase().includes(f.name.toLowerCase()));
		if (f.description && f.description !== "")
			cards = cards.filter(card => card.description.toLowerCase().includes(f.description.toLowerCase()));
		if (f.anime && f.anime !== "")
			cards = cards.filter(card => card.anime.toLowerCase().includes(f.anime.toLowerCase()));
		if (f.flavour && f.flavour !== "")
			cards = cards.filter(card => card.flavourText.toLowerCase().includes(f.flavour.toLowerCase()));
		if (f.cost && !isNaN(f.cost) && f.costop && f.costop !== "")
			cards = cards.filter(opFilter("mana", parseInt(f.cost, 10), f.costop));
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