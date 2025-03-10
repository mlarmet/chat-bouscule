import { gameStore } from "services/gameStore";

export default class Player {
	role: PlayerType;

	constructor(role: PlayerType) {
		this.role = role;
	}

	private setData(pions: Characters) {
		gameStore.getState().setPions(this.role, pions);
	}

	getPions() {
		return gameStore.getState().players[this.role].pions;
	}

	getSelectedPion() {
		return gameStore.getState().players[this.role].selectedPion;
	}

	playChat() {
		const pions = this.getPions();

		pions.chat.stock -= 1;
		pions.chat.plateau += 1;

		this.setData(pions);
	}

	playChaton() {
		const pions = this.getPions();

		pions.chaton.stock -= 1;
		pions.chaton.plateau += 1;

		this.setData(pions);
	}

	returnChaton() {
		const pions = this.getPions();

		pions.chaton.stock += 1;
		pions.chaton.plateau -= 1;

		this.setData(pions);
	}

	returnChat() {
		const pions = this.getPions();

		pions.chat.stock += 1;
		pions.chat.plateau -= 1;

		this.setData(pions);
	}

	transformChatonsToChats(nbChatons: number, nbChats: number) {
		const pions = this.getPions();

		pions.chaton.plateau -= nbChatons;

		pions.chat.stock += 3;

		pions.chat.plateau -= nbChats;

		this.setData(pions);
	}
}
