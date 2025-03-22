import React, { useMemo } from "react";

import { useAppStore } from "services/appStore";
import { useGameStore } from "services/gameStore";
import { navigateTo } from "services/navigate";

import { ModalContext } from "./ModalContext";

interface ModalProviderProps {
	children: React.ReactNode;
}

export default function ModalProvider({ children }: ModalProviderProps) {
	const resetGame = useGameStore((state) => state.resetGame);
	const resetApp = useAppStore((state) => state.resetApp);

	const addResetTrigger = useAppStore((state) => state.addResetTrigger);

	const modalDataAction: Partial<Record<ModalType, ModalActions>> = useMemo(
		() => ({
			quit: {
				confirm: () => {
					resetGame();
					resetApp();
					navigateTo("/");
				},
			},
			reset: {
				confirm: () => {
					resetGame();
					addResetTrigger();
				},
			},
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	return <ModalContext.Provider value={{ modalDataAction }}>{children}</ModalContext.Provider>;
}
