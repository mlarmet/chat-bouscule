type GameSettings = {
	timeShowRowInMs: number;
	totalPiece: number;

	colors: {
		line: string;
		row: string;
		pick: string;
		win: string;
	};

	cell: {
		count: number;
		padding: number;
		lineWidth: {
			base: number;
			action: number;
		};
	};
};

export const gameSettings: GameSettings = {
	timeShowRowInMs: 1000,
	totalPiece: 8,

	colors: {
		line: "#fff",
		row: "#ff3d3d",
		win: "#0cbf30",
		pick: "#ffbf2b",
	},

	cell: {
		count: 6,
		padding: 0,
		lineWidth: {
			base: 3,
			action: 5,
		},
	},
};
