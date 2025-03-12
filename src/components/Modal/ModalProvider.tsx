import React, { useMemo } from "react";

import { useNavigate } from "react-router-dom";
import { useAppStore } from "src/services/appStore";
import { useGameStore } from "src/services/gameStore";
import { ModalContext } from "./ModalContext";

interface ModalProviderProps {
	children: React.ReactNode;
}

export default function ModalProvider({ children }: ModalProviderProps) {
	const navigate = useNavigate();

	const resetGame = useGameStore((state) => state.resetGame);
	const addResetTrigger = useAppStore((state) => state.addResetTrigger);

	const modalDataAction: Partial<Record<ModalType, ModalActions>> = useMemo(
		() => ({
			quit: {
				confirm: () => {
					resetGame();
					addResetTrigger();
					navigate("/");
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
