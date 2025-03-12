import { Link } from "react-router-dom";

import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import "@fortawesome/fontawesome-svg-core/styles.css";

import { faRotateRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useGameStore } from "services/store";

import "./Header.scss";

export default function Header() {
	const resetGame = useGameStore((state) => state.resetGame);

	const handleReset = () => resetGame();

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
