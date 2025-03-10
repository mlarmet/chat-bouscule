import Animal from "./Animal";

export default class Minou extends Animal {
	constructor(player: PlayerType) {
		super(player, `${__BASE_URL__}/assets/sprites/minou_${player}.png`, 1);
	}
}
