import { ReactIndexedDB } from 'react-indexed-db';

var Library = (() => {

	var libName = 'sensuba-library';
	var db;
	var instantiated = false;

	var instantiate = then => {

		db = new ReactIndexedDB(libName, 1);

		db.openDatabase(1, evt => {
		    evt.currentTarget.result.createObjectStore('cards', { keyPath: 'idCardmodel' });
		    evt.currentTarget.result.createObjectStore('customcards', { keyPath: 'idCardmodel' });
		    evt.currentTarget.result.createObjectStore('decks', { keyPath: 'idDeck' });
		}).then(() => {
			instantiated = true;
			then(db);
		});
	}

	var currentDate = () => {

		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0');
		var yyyy = today.getFullYear();

		return dd + '/' + mm + '/' + yyyy;
	}

	var upToDate = () => {

		var lastUpdate = localStorage.getItem("library.date");
		if (!lastUpdate)
			return false;
		return lastUpdate === currentDate();
	}

	var update = (data, then) => {

		let f = db => db.openDatabase(1, evt => {}).then(() => {
			db.clear('cards');
			data.forEach(card => db.add('cards', card));
			localStorage.setItem("library.date", currentDate());
			if (then)
				then();
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var updateCustoms = (data, then) => {

		let f = db => db.openDatabase(1, evt => {}).then(() => {
			db.clear('customcards');
			data.forEach(card => db.add('customcards', card));
			if (then)
				then();
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var updateDecks = (data, then) => {

		let f = db => db.openDatabase(1, evt => {}).then(() => {
			db.clear('decks');
            let sortDecks = (a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
            data = data.sort(sortDecks);
			data.forEach(deck => db.add('decks', deck));
			if (then)
				then();
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var getCardList = then => {

		let f = db => db.openDatabase(1, evt => {}).then(() => {
			db.getAll('cards').then(then);
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var getCard = (no, then) => {

		let f = db => db.openDatabase(1, evt => {}).then(() => {
			db.getByKey('cards', no).then(then);
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var getCustomCardList = then => {

		let f = db => db.openDatabase(1, evt => {}).then(() => {
			db.getAll('customcards').then(then);
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var getDeckList = then => {

		let f = db => db.openDatabase(1, evt => {}).then(() => {
			db.getAll('decks').then(then);
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var clear = then => {

		let f = db => db.openDatabase(1, evt => {}).then(() => {
			db.clear('cards').then(then);
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var clearDecks = then => {

		let f = db => db.openDatabase(1, evt => {}).then(() => {
			db.clear('decks').then(then);
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var clearCustoms = then => {

		let f = db => db.openDatabase(1, evt => {}).then(() => {
			db.clear('customcards').then(then);
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var clearAll = then => {

		clear(() => clearDecks(() => clearCustoms(then)));
	}

	return { instantiate, upToDate, update, updateCustoms, updateDecks, getCard, getCardList, getCustomCardList, getDeckList, clear, clearCustoms, clearDecks, clearAll }
})();

export default Library;