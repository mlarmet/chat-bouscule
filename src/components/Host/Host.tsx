import { QRCodeSVG } from "qrcode.react";

import { useAppStore } from "services/appStore";
import { useConnectionStore } from "services/connectionStore";

import { sendData, startHost, stopHost } from "services/connectionService";

import { useNavigate } from "react-router-dom";
import "./Host.scss";

export default function Host() {
	const navigate = useNavigate();

	const setModal = useAppStore((state) => state.setModal);

	const peerId = useConnectionStore((state) => state.peerId);
	const connection = useConnectionStore((state) => state.connection);

	const handleShowQrCode = () => {
		setModal("qrCode", true);
	};

	const handleGenCode = () => {
		startHost();
	};
	const handleCancel = () => {
		stopHost();
	};

	const handleStart = () => {
		sendData("init", "");
		navigate("/jeu");
	};

	return (
		<div id="host" className="connection-box">
			{peerId === null ? (
				<>
					<h2 className="box-title">Création de la partie</h2>
					<button id="gen-code" className="btn primary rounded" onClick={handleGenCode}>
						Générer un code
					</button>
				</>
			) : (
				<>
					<h2 className="box-title">Code de la partie :</h2>

					<div id="code">
						<div id="left">
							<p id="peerId">{peerId}</p>
						</div>

						<div id="flashcode" onClick={handleShowQrCode}>
							<QRCodeSVG value={peerId} />

							<p id="zoom-text">Cliquez pour agrandir</p>
						</div>
					</div>

					{!connection ? (
						<button className="btn alert" onClick={handleCancel}>
							Annuler
						</button>
					) : (
						<button className="btn valid" onClick={handleStart}>
							Démarrer
						</button>
					)}
				</>
			)}
		</div>
	);
}
