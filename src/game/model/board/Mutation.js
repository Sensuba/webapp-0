class Mutation {

	constructor (effect, priority) {
		
		this.effect = effect;
		this.priority = priority;
	}

	attach (card) {

		if (!card || !card.mutations)
			return;
		this.card = card;
		this.card.mutations.push(this);
	}

	detach () {

		if (!this.card || !this.card.mutations)
			return;
		this.card.mutations = this.card.mutations.filter (m => m !== this);
		this.card = null;
	}

	apply (target) {

		return this.effect(target);
	}
}

module.exports = Mutation;