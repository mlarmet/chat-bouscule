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

			{/* TODO : confirm exit */}
			<Link to="/" id="exit" className="btn primary square">
				<FontAwesomeIcon icon={faXmark} />
			</Link>
			{/* TODO : confirm reset */}
			<div id="reset" className="btn primary square" onClick={handleReset}>
				<FontAwesomeIcon icon={faRotateRight} />
			</div>
		</header>
	);
}
