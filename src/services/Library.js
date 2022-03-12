import { ReactIndexedDB } from 'react-indexed-db';

var Library = (() => {

	var libName = 'sensuba-library';
	var db;
	var instantiated = false;

	var version = 3;

	var instantiate = then => {

		db = new ReactIndexedDB(libName, version);

		db.openDatabase(version, evt => {
			if (!evt.oldVersion) {
			    evt.currentTarget.result.createObjectStore('cards', { keyPath: 'idCardmodel' });
			    evt.currentTarget.result.createObjectStore('customcards', { keyPath: 'idCardmodel' });
			    evt.currentTarget.result.createObjectStore('decks', { keyPath: 'idDeck' });
			}
			if (evt.oldVersion < 2) {
			    evt.currentTarget.result.createObjectStore('collection', { keyPath: 'idCardmodel' });
			}
			if (evt.oldVersion < 3) {
			    evt.currentTarget.result.createObjectStore('cdecks', { keyPath: 'idDeck' });
			}
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

		let f = db => db.openDatabase(version, evt => {}).then(() => {
			db.clear('cards');
			data.forEach(card => db.add('cards', card));
			localStorage.setItem("library.date", currentDate());
			if (then)
				then();
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var updateCollection = (data, then) => {

		let f = db => db.openDatabase(version, evt => {}).then(() => {
			db.clear('collection');
			data.forEach(card => db.add('collection', card));
			if (then)
				then();
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var updateCustoms = (data, then) => {

		let f = db => db.openDatabase(version, evt => {}).then(() => {
			db.clear('customcards');
			data.forEach(card => db.add('customcards', card));
			if (then)
				then();
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var updateDecks = (data, then) => {

		let f = db => db.openDatabase(version, evt => {}).then(() => {
			db.clear('decks');
            let sortDecks = (a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
            data = data.sort(sortDecks);
			data.forEach(deck => db.add('decks', deck));
			if (then)
				then();
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var updateCommonDecks = (data, then) => {

		let f = db => db.openDatabase(version, evt => {}).then(() => {
			db.clear('cdecks');
			data.forEach(card => db.add('cdecks', card));
			if (then)
				then();
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var getCardList = then => {

		let f = db => db.openDatabase(version, evt => {}).then(() => {
			db.getAll('cards').then(then);
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var getCard = (no, then) => {

		if (no.idCardmodel || no.nameCard) {

			then(no);
			return;
		}

		let f = db => db.openDatabase(version, evt => {}).then(() => {
			db.getByKey('cards', no).then(then);
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var getCollection = then => {

		let f = db => db.openDatabase(version, evt => {}).then(() => {
			db.getAll('collection').then(then);
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var getCustomCardList = then => {

		let f = db => db.openDatabase(version, evt => {}).then(() => {
			db.getAll('customcards').then(then);
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var getDeckList = then => {

		let f = db => db.openDatabase(version, evt => {}).then(() => {
			db.getAll('decks').then(then);
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var getCommonDeckList = then => {

		let f = db => db.openDatabase(version, evt => {}).then(() => {
			db.getAll('cdecks').then(then);
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var clear = then => {

		let f = db => db.openDatabase(version, evt => {}).then(() => {
			localStorage.removeItem("library.date");
			db.clear('cards').then(then);
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var clearDecks = then => {

		let f = db => db.openDatabase(version, evt => {}).then(() => {
			db.clear('decks').then(then);
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var clearCustoms = then => {

		let f = db => db.openDatabase(version, evt => {}).then(() => {
			db.clear('customcards').then(then);
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var clearCollection = then => {

		let f = db => db.openDatabase(version, evt => {}).then(() => {
			db.clear('collection').then(then);
		});

		if (instantiated) f(db); else instantiate(f);
	}

	var clearAll = then => {

		clear(() => clearDecks(() => clearCustoms(() => clearCollection(then))));
	}

	return { instantiate, upToDate, update, updateCollection, updateCustoms, updateDecks, updateCommonDecks, getCard, getCollection, getCardList, getCustomCardList, getDeckList, getCommonDeckList, clear, clearCustoms, clearDecks, clearCollection, clearAll }
})();

export default Library;