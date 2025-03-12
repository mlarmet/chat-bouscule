import { useGameStore } from "services/store";

import useSound from "use-sound";

import matouSound from "assets/audio/cat_cut.mp3";
import minouSound from "assets/audio/kitten_cut.mp3";

import "./Player.scss";

interface PlayerProps {
	player: PlayerType;
	visible: boolean;
}

export default function Player({ player, visible }: PlayerProps) {
	const players = useGameStore((state) => state.players);

	const setSelectedPion = useGameStore((state) => state.setSelectedPion);

	const [playMatou] = useSound([matouSound, minouSound], {
		interrupt: true,
		volume: 0.5,
	});

	const [playMinou] = useSound(minouSound, {
		interrupt: true,
		volume: 0.5,
	});

	const selectPion = (pion: PionType) => {
		if (players[player].pions[pion].stock === 0) {
			return;
		}

		setSelectedPion(player, pion);

		if (pion === "minou") {
			playMinou();
		} else if (pion === "matou") {
			playMatou();
		}
	};

	const getState = (pion: PionType) => {
		if (players[player].pions[pion].stock <= 0) {
			return " disabled";
		}

		if (players[player].selectedPion === pion) {
			return " selected";
		}

		return "";
	};

	return (
		<div id={player} className={"player" + (visible ? "" : " hide")}>
			<div className={"sprite-selector" + getState("minou")} onClick={() => selectPion("minou")}>
				<img className="sprite" src={`assets/sprites/minou_${player}.png`} alt="" />

				<p>{players[player].pions.minou.stock}</p>
			</div>
			<div className={"sprite-selector" + getState("matou")} onClick={() => selectPion("matou")}>
				<img className="sprite" src={`assets/sprites/matou_${player}.png`} alt="" />
				<p>{players[player].pions.matou.stock}</p>
			</div>
		</div>
	);
}
