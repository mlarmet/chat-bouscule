import { useGameStore } from "services/gameStore";

import "./Player.scss";

interface PlayerProps {
	player: PlayerType;
	visible: boolean;
}

export default function Player({ player, visible }: PlayerProps) {
	const { players, setSelectedPion } = useGameStore();

	const selectPion = (pion: PionType) => {
		if (players[player].pions[pion].stock === 0) {
			return;
		}

		setSelectedPion(player, pion);
	};

	const getClass = (pion: PionType) => {
		let classList = "";

		if (players[player].pions[pion].stock === 0) {
			return " disabled";
		}

		if (players[player].selectedPion === pion) {
			classList += " selected";
		}

		return classList;
	};

	return (
		<div id={player} className={"player" + (visible ? "" : " hide")}>
			<div className={"sprite-selector" + getClass("chaton")} onClick={() => selectPion("chaton")}>
				<img className="sprite" src={`assets/sprites/chaton_${player}.png`} alt="" />

				<p>{players[player].pions.chaton.stock}</p>
			</div>
			<div className={"sprite-selector" + getClass("chat")} onClick={() => selectPion("chat")}>
				<img className="sprite" src={`assets/sprites/chat_${player}.png`} alt="" />
				<p>{players[player].pions.chat.stock}</p>
			</div>
		</div>
	);
}
