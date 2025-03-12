import { create } from "zustand";

import Animal from "src/objects/Animal/Animal";

type PlayerData = {
	pions: Characters;
	selectedPion?: PionType;
};

type GameState = {
	turn: PlayerType;
	tour: number;
	status: GameStatus;
	timeElapsed: number;

	mapAnimal: Map<string, Animal>;

	players: {
		[key in PlayerType]: PlayerData;
	};

	setTurn: (turn: PlayerType) => void;
	addTour: () => void;
	setTimeElapsed: (time: number) => void;
	setStatus: (status: GameStatus) => void;

	setPions: (player: PlayerType, pions: Characters) => void;
	setSelectedPion: (player: PlayerType, pion?: PionType) => void;

	resetGame: () => void;
};

const defaultPlayerData: PlayerData = {
	pions: {
		minou: {
			plateau: 0,
			stock: 8,
		},
		matou: {
			plateau: 0,
			stock: 0,
		},
	},

	selectedPion: undefined,
};

// Omit functions
const defaultData: Omit<GameState, "resetGame" | "setTimeElapsed" | "setStatus" | "setTurn" | "addTour" | "setPions" | "setSelectedPion"> = {
	turn: "gris",
	tour: 0,
	timeElapsed: 0,
	status: "STOPPED",

	mapAnimal: new Map(),

	players: {
		gris: structuredClone(defaultPlayerData),
		jaune: structuredClone(defaultPlayerData),
	},
};

export const useGameStore = create<GameState>((set) => ({
	...structuredClone(defaultData),

	setTurn: (turn: PlayerType) => set({ turn: turn }),

	addTour: () =>
		set((state) => ({
			tour: state.tour + 1,
		})),

	setStatus: (status: GameStatus) => set({ status: status }),
	setTimeElapsed: (time: number) => set({ timeElapsed: time }),

	setSelectedPion: (player: PlayerType, pion?: PionType) =>
		set((state) => ({
			players: {
				...state.players,
				[player]: {
					...state.players[player],

					selectedPion: pion,
				},
			},
		})),

	setPions: (player: PlayerType, pions: Characters) =>
		set((state) => ({
			players: {
				...state.players,
				[player]: {
					...state.players[player],

					pions: pions,
				},
			},
		})),

	resetGame: () => {
		set(() => ({
			...structuredClone(defaultData),
		}));
	},
}));

export const gameStore = useGameStore;
