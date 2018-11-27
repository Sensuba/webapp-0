var User = (() => {

	var connect = (save) => {

		localStorage.setItem("user.shadow", JSON.stringify(save));
	}

	var disconnect = () => {

		localStorage.clear();
	}

	var getData = () => {

		return JSON.parse(localStorage.getItem("user.shadow"));
	}

	var isConnected = () => {

		return localStorage.getItem("user.shadow") !== null;
	}

	return {
		connect: connect,
		disconnect: disconnect,
		getData: getData,
		isConnected: isConnected
	}
})();

export default User;