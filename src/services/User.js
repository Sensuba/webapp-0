import Library from './Library';

var User = (() => {

	var connect = (save) => {

		localStorage.setItem("user.shadow", JSON.stringify(save));
	}

	var disconnect = then => {

		localStorage.removeItem("user.shadow");
		localStorage.removeItem("playdeck");
		Library.clearAll(then);
	}

	var updateProfile = profile => {

		var data = getData();
		Object.assign(data, profile);
		localStorage.setItem("user.shadow", JSON.stringify(data));
	}

	var updateCredit = (value) => {

		updateProfile({credit: value});
	}

	var getData = () => {

		return JSON.parse(localStorage.getItem("user.shadow"));
	}

	var isConnected = () => {

		return localStorage.getItem("user.shadow") !== null;
	}

	var updateDeck = (deck) => {

		if (deck)
			localStorage.setItem("playdeck", JSON.stringify(deck));
		else
			localStorage.removeItem("playdeck");
	}

	var getDeck = () => {

		return localStorage.getItem("playdeck");
	}

	return { connect, disconnect, getData, isConnected, updateDeck, getDeck, updateProfile, updateCredit }
})();

export default User;