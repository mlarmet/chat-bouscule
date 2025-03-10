import Animal from "./Animal";

export default class Chat extends Animal {
	constructor(player: PlayerType) {
		super(player, `assets/sprites/chat_${player}.png`, 2);
	}
}
