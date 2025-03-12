import { useNavigate } from "react-router-dom";

import { faRotateRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useGameStore } from "services/store";

import "./Header.scss";

export default function Header() {
	const navigate = useNavigate();

	const resetGame = useGameStore((state) => state.resetGame);

	const setShowResetModal = useGameStore((state) => state.setShowResetModal);
	const setShoQuitModal = useGameStore((state) => state.setShowQuitModal);

	const tour = useGameStore((state) => state.tour);

	const handleReset = () => {
		if (tour > 0) {
			setShowResetModal(true);
		} else {
			resetGame();
		}
	};

	const handleExit = () => {
		if (tour > 0) {
			setShoQuitModal(true);
		} else {
			navigate(__BASE_URL__);
		}
	};

	return (
		<header>
			<div className="title">
				<h1>Chat</h1>
				<h2>Bouscule</h2>
			</div>

			<button id="reset" className="btn valid icon" onClick={handleReset}>
				<FontAwesomeIcon icon={faRotateRight} />
			</button>

			<button id="exit" className="btn alert icon" onClick={handleExit}>
				<FontAwesomeIcon icon={faXmark} fontSize={20} />
			</button>
		</header>
	);
}
