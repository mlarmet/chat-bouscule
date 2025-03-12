import { gameStore } from "services/gameStore";

export default class Player {
	role: PlayerType;

	constructor(role: PlayerType) {
		this.role = role;
	}

	private setData(pions: Characters) {
		gameStore.getState().setPions(this.role, pions);

		this.updateSelectedPion();
	}

	updateSelectedPion() {
		const gameState = gameStore.getState();
		const pions = gameState.players[this.role].pions;

		const isMinou = pions.minou.stock > 0;
		const isMatou = pions.matou.stock > 0;

		// No pion : remove selected one
		if (!isMinou && !isMatou) {
			gameState.setSelectedPion(this.role, undefined);
		} else if (!isMinou && isMatou) {
			// Only one option : set it selected
			gameState.setSelectedPion(this.role, "matou");
		} else if (isMinou && !isMatou) {
			// Only one option : set it selected
			gameState.setSelectedPion(this.role, "minou");
		} else {
			// Let has selected before
		}
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
