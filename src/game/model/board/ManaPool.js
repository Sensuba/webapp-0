const MAX_MANA = 20;
const MAX_GEMS = 3;

export default class ManaPool {

	constructor (area) {

		this.id = { type: "manapool", no: area.id.no };

		this.area = area;

		this.receptacles = [];
		this.gems = 0;
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

	get mana () {

		return this.receptacles.filter(r => r).length;
	}

	get usableMana () {

		return this.mana + this.gems;
	}

	get maxMana() {

		return this.receptacles.length;
	}

	use (value) {

		if (value <= this.usableMana) {
			for (var i = this.receptacles.length - 1; i >= 0 && value > 0; i--) {
				if (this.receptacles[i]) {
					this.receptacles[i] = false;
					value--;
				}
			}
			while (value-- > 0)
				this.useGem();
		}
	}

	refill (nb) {

		this.receptacles = this.receptacles.filter(r => r || !nb || nb-- > 0);
	}
}