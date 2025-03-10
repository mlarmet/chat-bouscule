import Animal from "./Animal";

export default class Matou extends Animal {
	constructor(player: PlayerType) {
		super(player, `${__BASE_URL__}/assets/sprites/matou_${player}.png`, 2);
	}
}
