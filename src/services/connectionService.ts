import Peer, { DataConnection } from "peerjs";

import { appStore } from "./appStore";
import { connectionStore } from "./connectionStore";
import { gameStore } from "./gameStore";
import { navigateTo } from "./navigate";

let clientPeer: Peer | null = null;

export const eventKeySeparator = "=";

export const shortIdLength = 6;

const generateShortId = () => Date.now().toString(36).slice(-shortIdLength);

const getInputPeerId = () => {
	return connectionStore.getState().inputPeerId;
};

const setPeerId = (id: string | null) => {
	connectionStore.getState().setPeerId(id);
};

const getConnection = () => {
	return connectionStore.getState().connection;
};

const setConnection = (conn: DataConnection | null) => {
	connectionStore.getState().setConnection(conn);
};

const resetConnection = () => {
	// prevent fire the one who close the conenction to get event

	const conn = getConnection();

	if (conn) {
		conn.off("close");
		conn.off("error");
	}

	if (clientPeer) {
		clientPeer.off("error");
		clientPeer.off("disconnected");

		clientPeer.destroy();

		clientPeer = null;
	}

	const host = connectionStore.getState().host;

	if (host) {
		host.off("error");
		host.off("disconnected");

		host.destroy();
	}

	appStore.getState().resetApp();
	gameStore.getState().resetGame();
	connectionStore.getState().resetConnection();
};

const getHost = () => {
	return connectionStore.getState().host;
};

const setHost = (host: Peer | null) => {
	connectionStore.getState().setHost(host);
};

const openClientPeer = async () => {
	// Promise qui sera résolue lorsque le client est prêt
	return new Promise((resolve, reject) => {
		clientPeer = new Peer();

		clientPeer.on("open", (id) => {
			console.log("Client prêt avec peerId :", id);
			resolve(id);
		});

		clientPeer.on("error", (err) => {
			console.error("Erreur client PeerJS:", err);

			appStore.getState().setModal("errorCode", true);

			stopConnectionToHost();

			reject(err);
		});
	});
};

export const connectToHost = async () => {
	try {
		// Évite les connexions multiples
		if (getConnection()) {
			return;
		}

		const inputPeerId = getInputPeerId();

		if (!inputPeerId) {
			return;
		}

		if (!clientPeer) {
			await openClientPeer();
		}

		const conn = clientPeer!.connect(inputPeerId);

		conn.on("data", (connData) => {
			const receiveData = (connData as string).split(eventKeySeparator);

			const event = receiveData[0] as DataType;

			if (event === "init") {
				navigateTo("/jeu");
			}
		});

		conn.on("close", () => {
			console.log("close conn join");
			setConnection(null);
		});

		conn.on("error", () => {
			console.log("error conn join");

			setConnection(null);
		});

		setConnection(conn);

		connectionStore.getState().isHost = false;

		setPeerId(inputPeerId);
	} catch (error) {
		console.error("Erreur de connexion au serveur:", error);
		return;
	}
};

export const stopConnectionToHost = (reset = false) => {
	if (!reset) {
		const conn = getConnection();

		if (conn) {
			conn.close();
		}

		setConnection(null);
	} else {
		resetConnection();
	}
};

export const startHost = () => {
	if (!getHost()) {
		connectionStore.getState().isHost = true;

		const hostPeer: Peer = new Peer(generateShortId());

		hostPeer.on("open", (id) => {
			setPeerId(id);
		});

		hostPeer.on("connection", (conn) => {
			setConnection(conn);

			conn.on("close", () => {
				console.log("close conn joiner from host");
				setConnection(null);
			});

			conn.on("error", () => {
				console.log("error conn joiner from host");
				setConnection(null);
			});
		});

		hostPeer.on("disconnected", () => {
			console.error("Host disconnected");
			// Essayer de se reconnecter
			hostPeer.reconnect();
		});

		hostPeer.on("error", (err) => {
			console.error("Erreur PeerJS :", err);
			stopHost();

			appStore.getState().setModal("errorHost", true);
		});

		setHost(hostPeer);
	}
};

export const stopHost = () => {
	resetConnection();
};

export const sendData = (event: DataType, data: unknown) => {
	const conn = getConnection();

	if (conn) {
		conn.send(`${event}${eventKeySeparator}${JSON.stringify(data)}`);
	}
};
