import Animal from "./Animal";

export default class Chaton extends Animal {
	constructor(player: PlayerType) {
		super(player, `assets/sprites/chaton_${player}.png`, 1);
	}
}
