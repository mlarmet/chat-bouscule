import { useEffect, useState } from "react";

import Host from "components/Host/Host";
import Join from "components/Join/Join";
import Title from "components/Title/Title";

import background from "assets/background/background-edited.jpg";

import { useConnectionStore } from "services/connectionStore";

import { useNavigate } from "react-router-dom";
import "./Connection.scss";

export default function Connection() {
	const [mode, setMode] = useState<ConnectionType>("host");

	const [message, setMessage] = useState("");

	const navigate = useNavigate();

	const host = useConnectionStore((state) => state.host);
	const isHost = useConnectionStore((state) => state.isHost);
	const connection = useConnectionStore((state) => state.connection);

	const handleClose = () => {
		navigate("/");
	};

	const changeMode = (mode: ConnectionType) => {
		setMode(mode);
	};

	useEffect(() => {
		if (!isHost) {
			setMessage(connection ? "Attente de l'hôte..." : "");
		} else {
			if (host) {
				setMessage(connection ? "Partie prête !" : "Attente de l'adversaire...");
			} else {
				setMessage("");
			}
		}
	}, [connection, host, isHost]);

	return (
		<div id="connection" className="view default">
			<img src={background} alt="background-image" id="image" className="decoration" />

			<div id="top">
				<button id="close" className="btn alert icon" onClick={handleClose}>
					<span className="material-icons-round">close</span>
				</button>

				<Title small />
			</div>

			<div id="connection-content" className="content">
				<div id="switch-tabs">
					<button className={"tab-item" + (mode === "host" ? " selected" : "")} onClick={() => changeMode("host")} disabled={!isHost && !!connection}>
						Héberger
					</button>
					<button className={"tab-item" + (mode === "join" ? " selected" : "")} onClick={() => changeMode("join")} disabled={!!host}>
						Rejoindre
					</button>
				</div>

				<div id="container">{mode === "host" ? <Host /> : <Join />}</div>

				<div id="state">
					<h2>&nbsp;{message}&nbsp;</h2>
				</div>
			</div>
		</div>
	);
}
