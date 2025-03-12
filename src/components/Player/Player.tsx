import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "services/gameStore";

import useSound from "use-sound";

import matouSound from "assets/audio/cat_cut.mp3";
import minouSound from "assets/audio/kitten_cut.mp3";

import "./Player.scss";

interface PlayerProps {
	player: PlayerType;
	visible: boolean;
}

export default function Player({ player: role, visible }: PlayerProps) {
	const player = useGameStore((state) => state.players[role]);

	const setSelectedPion = useGameStore((state) => state.setSelectedPion);

	const [minouClass, setMinouClass] = useState("");
	const [matouClass, setMatouClass] = useState("");

	const types: {
		[key in PionType]: CallableFunction;
	} = useMemo(
		() => ({
			minou: setMinouClass,
			matou: setMatouClass,
		}),
		[]
	);

	const [playMatouSound] = useSound([matouSound, minouSound], {
		interrupt: true,
		volume: 0.5,
	});

	const [playMinouSound] = useSound(minouSound, {
		interrupt: true,
		volume: 0.5,
	});

	const selectPion = (pion: PionType) => {
		if (player.pions[pion].stock === 0) {
			return;
		}

		setSelectedPion(role, pion);

		if (pion === "minou") {
			playMinouSound();
		} else if (pion === "matou") {
			playMatouSound();
		}
	};

	useEffect(() => {
		Object.entries(types).forEach(([pion, setClass]) => {
			const pionKey = pion as PionType;
			if (player.pions[pionKey].stock <= 0) {
				setClass(" disabled");
				return;
			}

			if (player.selectedPion === pion) {
				types[pion](" selected");
				return;
			}

			setClass("");
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player]);

	return (
		<div id={role} className={"player" + (visible ? "" : " hide")}>
			<div className={"sprite-selector" + minouClass} onClick={() => selectPion("minou")}>
				<img className="sprite" src={`assets/sprites/minou_${role}.png`} alt="" />

				<p>{player.pions.minou.stock}</p>
			</div>
			<div className={"sprite-selector" + matouClass} onClick={() => selectPion("matou")}>
				<img className="sprite" src={`assets/sprites/matou_${role}.png`} alt="" />
				<p>{player.pions.matou.stock}</p>
			</div>
		</div>
	);
}
