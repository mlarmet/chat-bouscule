import { useAppStore } from "services/appStore";
import { connectToHost, shortIdLength, stopConnectionToHost } from "services/connectionService";
import { useConnectionStore } from "services/connectionStore";

import "./Join.scss";

export default function Join() {
	const setModal = useAppStore((state) => state.setModal);

	const connection = useConnectionStore((state) => state.connection);

	const inputPeerId = useConnectionStore((state) => state.inputPeerId);
	const setInputPeerId = useConnectionStore((state) => state.setInputPeerId);

	const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target) {
			setInputPeerId(e.target.value);
		}
	};

	const handleScanner = () => {
		setModal("qrScan", true);
	};

	const handleStart = () => {
		connectToHost();
	};

	const handleCancel = () => {
		stopConnectionToHost();
	};

	return (
		<div id="join" className="connection-box">
			<h2 className="box-title">Code de la partie Game</h2>

			<div id="inputs">
				<div id="input-row">
					<input
						type="text"
						id="peerId-input"
						name="peerId-input"
						placeholder="ex: ABCDE"
						value={inputPeerId || ""}
						maxLength={shortIdLength}
						onChange={handleCodeChange}
						onInput={handleCodeChange}
						disabled={!!connection}
					/>

					<button id="scanner" className="material-icons-round" onClick={handleScanner} disabled={!!connection}>
						qr_code_scanner
					</button>
				</div>

				{connection ? (
					<button className="btn alert" onClick={handleCancel}>
						Annuler
					</button>
				) : (
					<button className="btn valid" disabled={inputPeerId?.length !== shortIdLength} onClick={handleStart}>
						Démarrer
					</button>
				)}
			</div>
		</div>
	);
}
