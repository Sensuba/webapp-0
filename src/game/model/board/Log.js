const MAX_HISTORY_SIZE = 6;

class Log {

	constructor (gameboard) {

		this.gameboard = gameboard;
		this.logs = [];
		this.history = [];
	}

	add (log) {

		this.logs.push(log);

		switch (log.type) {
		case "playcard":
			this.history.push({type:"play", src:this.gameboard.find(log.src)});
			break;
		case "cardfaculty":
			this.history.push({type: log.data[0].value ? "action" : "skill", src:this.gameboard.find(log.src)});
			break;
		case "charattack":
			this.history.push({type:"attack", src:this.gameboard.find(log.src)});
			break;
		default: break;
		}
		if (this.history.length > MAX_HISTORY_SIZE)
			this.history.shift();
	}
}

module.exports = Log;