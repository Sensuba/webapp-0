import Library from './Library';

var User = (() => {

	var connect = (save) => {

		localStorage.setItem("user.shadow", JSON.stringify(save));
	}

	var disconnect = () => {

		localStorage.removeItem("user.shadow");
		Library.clearCustoms();
		Library.clearDecks();
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

	return { connect, disconnect, getData, isConnected, updateDeck, getDeck }
})();

export default User;