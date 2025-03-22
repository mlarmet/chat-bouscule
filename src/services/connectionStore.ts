import Peer, { DataConnection } from "peerjs";
import { create } from "zustand";

interface ConnectionState {
	// To fill from scanner
	inputPeerId: string | null;

	peerId: string | null;
	connection: DataConnection | null;

	host: Peer | null;
	isHost: boolean;

	setInputPeerId: (id: string | null) => void;

	setPeerId: (id: string | null) => void;
	setConnection: (conn: DataConnection | null) => void;

	setHost: (host: Peer | null) => void;
	setIsHost: (isHost: boolean) => void;

	resetConnection: () => void;
}

const defaultConnectionData = {
	inputPeerId: null,
	peerId: null,
	connection: null,

	host: null,
	isHost: false,
};

export const useConnectionStore = create<ConnectionState>((set) => ({
	...structuredClone(defaultConnectionData),

	setInputPeerId: (id) => set({ inputPeerId: id }),

	setPeerId: (id) => set({ peerId: id }),
	setConnection: (conn) => set({ connection: conn }),

	setHost: (host: Peer | null) => set({ host }),
	setIsHost: (isHost) => set({ isHost }),

	resetConnection: () =>
		set(() => ({
			...structuredClone(defaultConnectionData),
		})),
}));

export const connectionStore = useConnectionStore;
