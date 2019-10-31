const MAX_MANA = 20;
const MAX_GEMS = 3;

export default class ManaPool {

	constructor (area) {

		this.id = { type: "manapool", no: area.id.no };
		area.gameboard.register(this);

		this.area = area;

		this.receptacles = [];
		this.gems = 0;
		this.extramana = 0;
	}

	createReceptacle (filled = true) {

		if (this.maxMana < MAX_MANA)
			this.receptacles.push(filled);
	}

	destroyReceptacle () {

		if (this.maxMana > 0)
			this.receptacles.pop();
	}

	createGem () {

		if (this.gems < MAX_GEMS)
			this.gems++;
	}

	useGem() {

		if (this.gems > 0)
			this.gems--;
	}

	addExtraMana (value) {

		this.extramana += value;
	}

	get mana () {

		return this.receptacles.filter(r => r).length;
	}

	get usableMana () {

		return this.mana + this.gems + this.extramana;
	}

	get maxMana() {

		return this.receptacles.length;
	}

	use (value) {

		if (value <= this.usableMana) {
			let usedextramana = Math.min(value, this.extramana)
			value -= usedextramana;
			this.extramana -= usedextramana;
			for (var i = this.receptacles.length - 1; i >= 0 && value > 0; i--) {
				if (this.receptacles[i]) {
					this.receptacles[i] = false;
					value--;
				}
			}
		}
	}

	refill (nb) {

		nb = nb || MAX_MANA;
		this.receptacles = this.receptacles.map(r => r || nb-- > 0);
	}

	reload () {

		this.receptacles = this.receptacles.map(r => true);
		this.extramana = 0;
	}
}