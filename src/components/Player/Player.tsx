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

		if (players[player].pions[pion].stock <= 0) {
			return " disabled";
		}

		if (players[player].selectedPion === pion) {
			classList += " selected";
		}

		return classList;
	};

	return (
		<div id={player} className={"player" + (visible ? "" : " hide")}>
			<div className={"sprite-selector" + getClass("minou")} onClick={() => selectPion("minou")}>
				<img className="sprite" src={`assets/sprites/minou_${player}.png`} alt="" />

				<p>{players[player].pions.minou.stock}</p>
			</div>
			<div className={"sprite-selector" + getClass("matou")} onClick={() => selectPion("matou")}>
				<img className="sprite" src={`assets/sprites/matou_${player}.png`} alt="" />
				<p>{players[player].pions.matou.stock}</p>
			</div>
		</div>
	);
}
