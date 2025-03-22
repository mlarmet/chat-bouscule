import { create } from "zustand";

type AppSate = {
	timerRun: boolean;

	resetTrigger: number;

	modals: Record<ModalType, boolean>;

	setModal: (modal: ModalType, show: boolean) => void;
	hideAll: () => void;

	setTimerRun: (run: boolean) => void;

	resetApp: () => void;
	addResetTrigger: () => void;
};

const defaultModalData = {
	reset: false,
	quit: false,
	credit: false,
	qrCode: false,
	qrScan: false,
	qrCodeError: false,
	errorCamera: false,
	errorCode: false,
	lostConnection: false,
};

export const useAppStore = create<AppSate>((set) => ({
	modals: structuredClone(defaultModalData),

	setModal: (modal: ModalType, show: boolean) =>
		set((state) => ({
			modals: { ...state.modals, [modal]: show },
		})),

	hideAll: () =>
		set(() => ({
			modals: structuredClone(defaultModalData),
		})),

	timerRun: false,
	setTimerRun: (run: boolean) => set({ timerRun: run }),

	resetTrigger: 0,

	resetApp: () => set(() => ({ resetTrigger: 0, timerRun: false })),

	addResetTrigger: () => set((state) => ({ resetTrigger: state.resetTrigger + 1 })),
}));

export const appStore = useAppStore;
