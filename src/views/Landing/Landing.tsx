import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useAppStore } from "services/appStore";

import background from "assets/background/background-edited.jpg";

import "./Landing.scss";

export default function Landing() {
	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();

		alert("Le mode en ligne arrivera dans une deuxième version !");
	};

	const setShowResetModal = useAppStore((state) => state.setShowResetModal);
	const setShowQuitModal = useAppStore((state) => state.setShowQuitModal);

	useEffect(() => {
		// Prevent show modal on backup and return to play
		setShowResetModal(false);
		setShowQuitModal(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div id="landing" className="view">
			<img src={background} alt="background-image" id="image" className="decoration" />
			<img src={__BASE_URL__ + "/assets/sprites/minou_gris.png"} alt="sprite-1" id="sprite1" className="decoration" />
			<img src={__BASE_URL__ + "/assets/sprites/minou_jaune.png"} alt="sprite-2" id="sprite2" className="decoration" />

			<div className="title">
				<h1>Chat</h1>
				<h2>Bouscule</h2>
			</div>

			<div id="play">
				{/* TODO : multi-joueurs */}
				<Link to="/jeu" className="btn primary rounded" onClick={handleClick}>
					Jouer
				</Link>
				<Link to="/jeu" className="btn secondary">
					Jouer en local
				</Link>
			</div>
		</div>
	);
}
