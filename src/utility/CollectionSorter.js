export default (() => {

	var valueSort = attr => (a, b) => {

		if (a[attr] && b[attr])
			return a[attr] < b[attr] ? -1 : (a[attr] > b[attr] ? 1 : 0);
		if (a[attr] && !b[attr])
			return 1;
		if (!a[attr] && b[attr])
			return -1;
		return 0;
	}

	var nameSort = valueSort("nameCard");

	var manaSort = valueSort("mana");

	var atkSort = valueSort("atk");

	var hpSort = valueSort("hp");

	var rangeSort = valueSort("range");

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
		case "mana": func = manaSort; break;
		case "atk": func = atkSort; break;
		case "hp": func = hpSort; break;
		case "range": func = rangeSort; break;
		default: break;
		}

		cards.sort((a, b) => {
			var r = func(a, b);
			if (r === 0) return nameSort(a, b);
			return r;
		})
	}

	var filter = (cards, f) => {

		if (f.search && f.search !== "")
			cards = cards.filter(card => card.nameCard.toLowerCase().includes(f.search.toLowerCase()) || card.anime.toLowerCase().includes(f.search.toLowerCase()) || card.description.toLowerCase().includes(f.search.toLowerCase()));
		if (f.edition && f.edition !== "")
			cards = cards.filter(card => card.idEdition === parseInt(f.edition, 10));
		if (f.type && f.type !== "")
			cards = cards.filter(card => card.cardType === f.type);
		if (f.colors && f.colors.length > 0)
			cards = cards.filter(card => f.colors.includes(card.idColor) && (!card.idColor2 || f.colors.includes(card.idColor2)));
		if (f.archetype && f.archetype !== "")
			cards = cards.filter(card => card.archetypes && card.archetypes.filter(arc => arc.toLowerCase().includes(f.archetype.toLowerCase())).length > 0);
		if (f.orderBy)
			sort(cards, f.orderBy);
		return cards;
	}

	return {

		sort,
		filter
	};

})();