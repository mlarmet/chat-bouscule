import { gameStore } from "services/store";

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

	playMinou() {
		const pions = this.getPions();

		pions.minou.stock -= 1;
		pions.minou.plateau += 1;

		this.setData(pions);
	}

	playMatou() {
		const pions = this.getPions();

		pions.matou.stock -= 1;
		pions.matou.plateau += 1;

		this.setData(pions);
	}

	returnMiou() {
		const pions = this.getPions();

		pions.minou.stock += 1;
		pions.minou.plateau -= 1;

		this.setData(pions);
	}

	returnMatou() {
		const pions = this.getPions();

		pions.matou.stock += 1;
		pions.matou.plateau -= 1;

		this.setData(pions);
	}

	transformMinouToMatou(nbMinou: number, nbMatou: number) {
		const pions = this.getPions();

		pions.minou.plateau -= nbMinou;

		pions.matou.stock += 3;

		pions.matou.plateau -= nbMatou;

		this.setData(pions);
	}
}
