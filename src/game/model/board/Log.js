const MAX_HISTORY_SIZE = 25;

class Log {

	constructor (gameboard) {

		this.gameboard = gameboard;
		this.logs = [];
		this.history = [];
	}

	add (log) {

		this.logs.push(log);var a = this.history.length;
		var entry;

		switch (log.type) {
		case "playcard":
			this.history.unshift({type:"play", src:this.gameboard.find(log.src)});
			break;
		case "trap":
			this.history.unshift({type:"trap", src:this.gameboard.find(log.src)});
			break;
		case "discardcard":
			this.history.unshift({type:"discard", src:this.gameboard.find(log.src)});
			break;
		case "cardfaculty":
			entry = {type: log.data[0].value ? "action" : "skill", src:this.gameboard.find(log.src)};
			if (entry.type === "action" && !log.data[2].value)
				entry.option = "manaup";
			if (entry.type === "skill" && log.data[2].value && (log.data[2].value.toLowerCase().includes("level up") || log.data[2].value.toLowerCase().includes("niveau supérieur")))
				entry.option = "levelup";
			this.history.unshift(entry);
			break;
		case "charattack":
			this.history.unshift({type:"attack", src:this.gameboard.find(log.src)});
			break;
		case "endturn":
			this.history.unshift({type:"endturn"});
			break;
		default: break;
		}
		if (this.history.length > a)
			console.log(log);
		if (this.history.length > MAX_HISTORY_SIZE)
			this.history.pop();
	}
}

module.exports = Log;