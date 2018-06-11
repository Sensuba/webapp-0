var User = (() => {

	var connect = (name, t) => {

		sessionStorage.setItem(User.username, name);
		sessionStorage.setItem(User.token, t);
	}

	var disconnect = () => {

		sessionStorage.removeItem(User.username);
		sessionStorage.removeItem(User.token);
	}

	var getData = () => {

		return {
			username: sessionStorage.getItem(User.username),
			token: sessionStorage.getItem(User.token)
		}
	}

	return {
		connect: connect,
		disconnect: disconnect,
		getData: getData,
		isConnected: () => sessionStorage.getItem(User.token) !== null
	}
})();

export default User;