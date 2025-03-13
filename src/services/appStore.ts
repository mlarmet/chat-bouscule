import { create } from "zustand";

type AppSate = {
	timerRun: boolean;

	resetTrigger: number;

	showResetModal: boolean;
	showQuitModal: boolean;
	showCreditModal: boolean;

	setTimerRun: (run: boolean) => void;

	addResetTrigger: () => void;

	setShowResetModal: (show: boolean) => void;
	setShowQuitModal: (show: boolean) => void;
	setShowCreditModal: (show: boolean) => void;
};

export const useAppStore = create<AppSate>((set) => ({
	timerRun: false,

	resetTrigger: 0,

	showResetModal: false,
	showQuitModal: false,
	showCreditModal: false,

	setTimerRun: (run: boolean) => set({ timerRun: run }),

	addResetTrigger: () => set((state) => ({ resetTrigger: state.resetTrigger + 1 })),

	setShowResetModal: (show: boolean) => set({ showResetModal: show }),
	setShowQuitModal: (show: boolean) => set({ showQuitModal: show }),
	setShowCreditModal: (show: boolean) => set({ showCreditModal: show }),
}));

export const appStore = useAppStore;
