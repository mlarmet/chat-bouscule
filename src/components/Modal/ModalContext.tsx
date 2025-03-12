import { createContext, useContext } from "react";

type ModalContextType = {
	modalDataAction: Partial<Record<ModalType, ModalActions>>;
};

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
	const context = useContext(ModalContext);

	if (!context) {
		throw new Error("useModal must be used within a ModalProvider");
	}

	return context;
};
