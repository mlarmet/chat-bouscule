import { useNavigate } from "react-router-dom";

import { faRotateRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAppStore } from "services/appStore";
import { useGameStore } from "services/gameStore";

import "./Header.scss";

export default function Header() {
	const navigate = useNavigate();

	const tour = useGameStore((state) => state.tour);
	const resetGame = useGameStore((state) => state.resetGame);

	const addResetTrigger = useAppStore((state) => state.addResetTrigger);
	const setShowResetModal = useAppStore((state) => state.setShowResetModal);
	const setShoQuitModal = useAppStore((state) => state.setShowQuitModal);

	const handleReset = () => {
		if (tour > 0) {
			setShowResetModal(true);
		} else {
			resetGame();
			addResetTrigger();
		}
	};

	const handleExit = () => {
		if (tour > 0) {
			setShoQuitModal(true);
		} else {
			navigate(__BASE_URL__);
			resetGame();
			addResetTrigger();
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
