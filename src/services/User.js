var User = (() => {

	var connect = (save) => {

		sessionStorage.setItem("user.shadow", JSON.stringify(save));
	}

	var disconnect = () => {

		sessionStorage.clear();
	}

	var getData = () => {

		return JSON.parse(sessionStorage.getItem("user.shadow"));
	}

	return {
		connect: connect,
		disconnect: disconnect,
		getData: getData,
		isConnected: () => sessionStorage.getItem("user.shadow") !== null
	}
})();

export default User;