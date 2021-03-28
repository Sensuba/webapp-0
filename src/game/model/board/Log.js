const MAX_HISTORY_SIZE = 25;

class Log {

	constructor (gameboard) {

		this.gameboard = gameboard;
		this.logs = [];
		this.history = [];
	}

	add (log) {

		this.logs.push(log);
		var entry;

		switch (log.type) {
		case "playcard": {
			let src = this.gameboard.find(log.src);
			entry = {type:"play", src};
			let other = src.isType("entity") ? log.data[1] : log.data[0];
			if (other) {
				let tile = this.gameboard.find(other)
				if (tile) {
					let card = tile.card;
					if (card)
						entry.target = card;
				}
			}
			this.history.unshift(entry);
			break;
		}
		case "triggersecret":
		case "trap": {
			let src = this.gameboard.find(log.src);
			entry = {type:"trap", src};
			let other = log.data[0];
			if (other) {
				let tile = this.gameboard.find(other)
				if (tile) {
					let card = tile.card;
					if (card)
						entry.target = card;
				}
			}
			this.history.unshift(entry);
			break;
		}
		case "discardcard":
			this.history.unshift({type:"discard", src:this.gameboard.find(log.src)});
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
			this.history.unshift(entry);
			break;
		}
		case "charattack":
			this.history.unshift({type:"attack", src:this.gameboard.find(log.src), target:this.gameboard.find(log.data[0])});
			break;
		case "endturn":
			this.history.unshift({type:"endturn"});
			break;
		default: break;
		}
		if (this.history.length > MAX_HISTORY_SIZE)
			this.history.pop();
	}
}

module.exports = Log;