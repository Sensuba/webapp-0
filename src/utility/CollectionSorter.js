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
		default: break;
		}

		cards.sort((a, b) => {
			var r = func(a, b);
			if (r === 0) return nameSort(a, b);
			return r;
		})
	}

	return {

		sort
	};

})();