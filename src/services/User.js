import Library from './Library';

var version = 0;

var User = (() => {

	var setVersion = (v) => {

		version = v;
	}

	var connect = (save) => {

		save.version = version;
		localStorage.setItem("user.shadow", JSON.stringify(save));
		updateSession();
	}

	var disconnect = then => {

		localStorage.removeItem("user.shadow");
		localStorage.removeItem("playdeck");
		updateSession();
		Library.clearAll(then);
	}

	var updateSession = () => {

		sessionStorage.setItem("session", 1+Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER-1)));
	}

	var getSession = () => {

		return sessionStorage.getItem("session");
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

	var updateCPU = (deck) => {

		if (deck)
			localStorage.setItem("cpupartnerdeck", JSON.stringify(deck));
		else
			localStorage.removeItem("cpupartnerdeck");
	}

	var getDeck = () => {

		return localStorage.getItem("playdeck");
	}

	var getCPU = () => {

		return localStorage.getItem("cpupartnerdeck");
	}

	return { setVersion, connect, disconnect, updateSession, getSession, getData, isConnected, updateDeck, updateCPU, getDeck, getCPU, updateProfile, updateCredit }
})();

export default User;