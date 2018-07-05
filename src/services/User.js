var User = (() => {

	var connect = (save) => {

		sessionStorage.setItem(User.shadow, save);
	}

	var disconnect = () => {

		sessionStorage.removeItem(User.shadow);
	}

	var getData = () => {

		return sessionStorage.getItem(User.shadow);
	}

	return {
		connect: connect,
		disconnect: disconnect,
		getData: getData,
		isConnected: () => sessionStorage.getItem(User.shadow) !== null
	}
})();

export default User;