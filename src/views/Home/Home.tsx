import { useConnectionStore } from "services/connectionStore";
import { useGameStore } from "services/gameStore";

import Board from "components/Display/Display";
import Header from "components/Header/Header";
import Player from "components/Player/Player";
import Timer from "components/Timer/Timer";

import { capitalizeFirstLetter } from "utils/String";

import "./Home.scss";

export default function Home() {
	const turn = useGameStore((state) => state.turn);
	const tour = useGameStore((state) => state.tour);

	const isHost = useConnectionStore((state) => state.isHost);
	const peerId = useConnectionStore((state) => state.peerId);

	return (
		<div id="home" className="view default">
			<Header />

			<div id="home-content" className="content">
				<div id="infos">
					<div id="data">
						<p id="time">
							Temps : <Timer />
						</p>
						<p id="tour">Tour : {tour}</p>
					</div>

					<p id="turn">Joueur : &ensp;{capitalizeFirstLetter(turn)}</p>
				</div>

				<Board />

				<div id="players-infos">
					{/* Play solo */}
					{!peerId ? (
						<>
							<Player player="gris" visible={turn === "gris"} />
							<Player player="jaune" visible={turn === "jaune"} />
						</>
					) : (
						<Player player={isHost ? "gris" : "jaune"} visible />
					)}
				</div>
			</div>
		</div>
	);
}
