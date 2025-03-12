import { create } from "zustand";

type AppSate = {
	timerRun: boolean;

	resetTrigger: number;

	showResetModal: boolean;
	showQuitModal: boolean;

	setTimerRun: (run: boolean) => void;

	addResetTrigger: () => void;

	setShowResetModal: (show: boolean) => void;
	setShowQuitModal: (show: boolean) => void;
};

// Omit functions
const defaultData: Omit<AppSate, "resetGame" | "addResetTrigger" | "setShowResetModal" | "setShowQuitModal" | "setTimerRun"> = {
	timerRun: false,

	resetTrigger: 0,

	showResetModal: false,
	showQuitModal: false,
};

export const useAppStore = create<AppSate>((set) => ({
	...structuredClone(defaultData),

	setTimerRun: (run: boolean) => set({ timerRun: run }),

	addResetTrigger: () => set((state) => ({ resetTrigger: state.resetTrigger + 1 })),

	setShowResetModal: (show: boolean) => set({ showResetModal: show }),
	setShowQuitModal: (show: boolean) => set({ showQuitModal: show }),
}));

export const appStore = useAppStore;
