import { useNavigate } from "react-router-dom";

import { gameSettings } from "services/settings";
import { useGameStore } from "services/store";

import Board from "components/Display/Display";
import Header from "components/Header/Header";
import Modal from "components/Modal/Modal";
import Player from "components/Player/Player";
import Timer from "components/Timer/Timer";

import { capitalizeFirstLetter } from "utils/String";

import "./Home.scss";

export default function Home() {
	const navigate = useNavigate();

	const resetGame = useGameStore((state) => state.resetGame);

	const turn = useGameStore((state) => state.turn);
	const tour = useGameStore((state) => state.tour);

	const showResetModal = useGameStore((state) => state.showResetModal);
	const showQuitModal = useGameStore((state) => state.showQuitModal);

	const showModal = () => {
		if (showQuitModal) {
			const quitModal = gameSettings.modal["quit"];
			return (
				<Modal
					title={quitModal.title}
					text={quitModal.text}
					cancel={{
						text: quitModal.cancel.text,
					}}
					confirm={{
						action: () => navigate(__BASE_URL__),
						text: quitModal.confirm.text,
					}}
				/>
			);
		} else if (showResetModal) {
			const resetModal = gameSettings.modal["reset"];
			return (
				<Modal
					title={resetModal.title}
					text={resetModal.text}
					cancel={{
						text: resetModal.cancel.text,
					}}
					confirm={{
						action: resetGame,
						text: resetModal.confirm.text,
					}}
				/>
			);
		}
	};

	return (
		<div id="home" className="view">
			{showModal()}

			<Header />

			<div id="content">
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
					<Player player="gris" visible={turn === "gris"} /> <Player player="jaune" visible={turn === "jaune"} />
				</div>
			</div>
		</div>
	);
}
