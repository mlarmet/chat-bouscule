type PlayerType = "gris" | "jaune";
type Players = Record<PlayerType, Player>;

type Stocks = Record<PlayerType, Animal[]>;

type PionType = "minou" | "matou";

type Characters = {
	[key in PionType]: {
		plateau: number;
		stock: number;
	};
};

type GameStatus = "IDLE" | "SELECT" | "ROW" | "MOVING" | "WON" | "STOPPED";

type ModalType = "quit" | "reset" | "credit";

type ModalProperties = {
	title: string;
	text: string;

	actions?: {
		cancel?: {
			action?: CallableFunction;
			text: string;
		};
		confirm?: {
			action?: CallableFunction;
			text: string;
		};
	};
};

type ModalActions = {
	cancel?: CallableFunction;
	confirm?: CallableFunction;
};
