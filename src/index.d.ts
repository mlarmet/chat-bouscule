type PlayerType = "gris" | "jaune";
type Players = Record<PlayerType, Player>;

type Stocks = Record<PlayerType, Animal[]>;

type PionType = "chat" | "chaton";

type Characters = {
	[key in PionType]: {
		plateau: number;
		stock: number;
	};
};

type GameStatus = "IDLE" | "SELECT" | "ROW" | "MOVING" | "WON" | "STOPPED";
