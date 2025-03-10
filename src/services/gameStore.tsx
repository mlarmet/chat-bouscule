import { create } from "zustand";

import Animal from "src/objects/Animal/Animal";

type PlayerData = {
	pions: Characters;
	selectedPion: PionType;
};

type GameState = {
	turn: PlayerType;
	tour: number;
	timerRun: boolean;

	mapAnimal: Map<string, Animal>;

	players: {
		[key in PlayerType]: PlayerData;
	};

	resetGame: () => void;

	setTurn: (turn: PlayerType) => void;
	addTour: () => void;
	setTimerRun: (run: boolean) => void;

	setPions: (player: PlayerType, pions: Characters) => void;
	setSelectedPion: (player: PlayerType, pion: PionType) => void;
};

// Omit functions
const defaultData: Omit<GameState, "resetGame" | "setTurn" | "setTimerRun" | "addTour" | "setPions" | "setSelectedPion"> = {
	turn: "gris",
	tour: 0,
	timerRun: false,

	mapAnimal: new Map(),

	players: {
		gris: {
			pions: {
				chaton: {
					plateau: 0,
					stock: 8,
				},
				chat: {
					plateau: 0,
					stock: 0,
				},
			},

			selectedPion: "chaton",
		},

		jaune: {
			pions: {
				chaton: {
					plateau: 0,
					stock: 8,
				},
				chat: {
					plateau: 0,
					stock: 0,
				},
			},

			selectedPion: "chaton",
		},
	},
};

export const useGameStore = create<GameState>((set) => ({
	...structuredClone(defaultData),

	resetGame: () => set(structuredClone(defaultData)),

	setTurn: (turn: PlayerType) => set({ turn: turn }),
	setTimerRun: (run: boolean) => set({ timerRun: run }),

	addTour: () =>
		set((state) => ({
			...state,
			tour: state.tour + 1,
		})),

	setSelectedPion: (player: PlayerType, pion: PionType) =>
		set((state) => ({
			...state,
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
			...state,
			players: {
				...state.players,
				[player]: {
					...state.players[player],

					pions: pions,
				},
			},
		})),
}));

export const gameStore = useGameStore;
