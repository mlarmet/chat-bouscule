import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useAppStore } from "services/appStore";

import Title from "components/Title/Title";

import background from "assets/background/background-edited.jpg";

import "./Landing.scss";

export default function Landing() {
	const setShowResetModal = useAppStore((state) => state.setShowResetModal);
	const setShowQuitModal = useAppStore((state) => state.setShowQuitModal);
	const setShowCreditModal = useAppStore((state) => state.setShowCreditModal);

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();

		alert("Le mode en ligne arrivera dans une deuxième version !");
	};

	const handleCopyRightClick = () => {
		setShowCreditModal(true);
	};

	useEffect(() => {
		// Prevent show modal on backup and return to play
		setShowResetModal(false);
		setShowQuitModal(false);
		setShowCreditModal(false);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div id="landing" className="view">
			<button id="credits" className="btn icon" onClick={handleCopyRightClick}>
				<span className="material-icons-round">question_mark</span>
			</button>

			<img src={background} alt="background-image" id="image" className="decoration" />
			<img src={__BASE_URL__ + "/assets/sprites/minou_gris.png"} alt="sprite-1" id="sprite1" className="decoration" />
			<img src={__BASE_URL__ + "/assets/sprites/minou_jaune.png"} alt="sprite-2" id="sprite2" className="decoration" />

			<Title landing />

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
