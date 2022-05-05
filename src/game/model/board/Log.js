const MAX_HISTORY_SIZE = 25;

class Log {

	constructor (gameboard) {

		this.gameboard = gameboard;
		this.logs = [];
		this.history = [];
	}

	addEntry (entry) {

		if (entry.src && entry.src.model && (entry.src.model.idCardmodel || entry.src.model.parent))
			entry.model = entry.src.model;
		this.history.unshift(entry);
	}

	add (log) {

		this.logs.push(log);
		var entry;

		switch (log.type) {
		case "playcard": {
			let src = this.gameboard.find(log.src);
			entry = {type:"play", src};
			let other = log.data[1];
			if (other) {
				let tile = this.gameboard.find(other)
				if (tile) {
					let card = tile.card;
					if (card)
						entry.target = card;
				}
			}
			this.addEntry(entry);
			break;
		}
		case "show":
		case "triggersecret":
		case "trap": {
			let src = this.gameboard.find(log.src);
			if (log.type === "show") entry = {type:"play", src};
			else if (log.type === "triggersecret") entry = {type:"secret", text: log.data[0], src};
			else if (log.type === "trap") entry = {type: "trap", text: "Auto", src};
			let other = log.data[1];
			if (other) {
				let tile = this.gameboard.find(other)
				if (tile) {
					let card = tile.card;
					if (card)
						entry.target = card;
				}
			}
			this.addEntry(entry);
			break;
		}
		case "discardcard":
			this.addEntry({type:"discard", text: "Défausse", src:this.gameboard.find(log.src)});
			break;
		case "burncard":
			this.addEntry({type:"burn", text: "Surpioche", src:this.gameboard.find(log.data[0])});
			break;
		case "cardfaculty": {
			entry = {type: log.data[0].value ? "action" : "skill", src:this.gameboard.find(log.src)};
			entry.text = log.data[2].value;
			if (entry.type === "action" && !log.data[2].value) {
				entry.option = "manaup";
				entry.text = "Crée un réceptacle de mana."
			}
			if (entry.type === "skill" && log.data[2].value && (log.data[2].value.toLowerCase().includes("level up") || log.data[2].value.toLowerCase().includes("niveau supérieur")))
				entry.option = "levelup";
			if (log.data[1]) {
				let tile = this.gameboard.find(log.data[1])
				if (tile) {
					let card = tile.card;
					if (card)
						entry.target = card;
				}
			}
			this.addEntry(entry);
			break;
		}
		case "charattack":
			this.addEntry({type:"attack", src:this.gameboard.find(log.src), text: "Attaque", target:this.gameboard.find(log.data[0])});
			break;
		case "newturn":
			this.addEntry({type:"newturn"});
			break;
		default: break;
		}
		if (this.history.length > MAX_HISTORY_SIZE)
			this.history.pop();
	}
}

module.exports = Log;