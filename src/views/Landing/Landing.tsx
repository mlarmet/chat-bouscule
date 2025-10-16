import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useAppStore } from "services/appStore";
import { connectionStore } from "services/connectionStore";

import Title from "components/Title/Title";

import "./Landing.scss";

export default function Landing() {
	const setModal = useAppStore((state) => state.setModal);

	const handleCopyRightClick = () => {
		setModal("credit", true);
	};

	useEffect(() => {
		// Prevent show modal on backup and return to play
		// keep lost connection modal open if it is
		setModal("reset", false);
		setModal("quit", false);
		setModal("credit", false);
		setModal("errorCamera", false);
		setModal("errorCode", false);
		setModal("errorHost", false);
		setModal("qrScan", false);
		setModal("qrCodeError", false);
		setModal("qrCode", false);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div id="landing" className="view">
			<button id="credits" className="btn icon" onClick={handleCopyRightClick}>
				<span className="material-symbols-rounded">question_mark</span>
			</button>

			<img src={__BASE_URL__ + "/assets/background/background-edited.jpg"} alt="background-image" id="image" className="decoration" />
			<img src={__BASE_URL__ + "/assets/sprites/minou_gris.png"} alt="sprite-1" id="sprite1" className="decoration" />
			<img src={__BASE_URL__ + "/assets/sprites/minou_jaune.png"} alt="sprite-2" id="sprite2" className="decoration" />

			<Title landing />

			<div id="play">
				<Link to="/connection" className="btn primary rounded">
					Jouer
				</Link>
				<Link to="/jeu" className="btn secondary" onClick={() => connectionStore.getState().setPeerId(null)}>
					Jouer en local
				</Link>
			</div>
		</div>
	);
}
