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

	return { connect, disconnect, getData, isConnected }
})();

export default User;