type ModalProperties = {
	title: string;
	text: string;
	cancel: {
		action?: CallableFunction;
		text: string;
	};
	confirm: {
		action?: CallableFunction;
		text: string;
	};
};

type GameSettings = {
	timeShowRowInMs: number;
	flashingSelectPlayerInMs: number;

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

	modal: {
		[key: string]: ModalProperties;
	};
};

export const gameSettings: GameSettings = {
	timeShowRowInMs: 1000,
	flashingSelectPlayerInMs: 750,

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

	modal: {
		reset: {
			title: "Recommencer la partie ?",
			text: "Une partie est en cours. Voulez-vous vraiment recommencer ?",
			cancel: {
				text: "Annuler",
			},
			confirm: {
				text: "Recommencer",
			},
		},

		quit: {
			title: "Quitter la partie ?",
			text: "Une partie est en cours. Voulez-vous vraiment quitter ?",
			cancel: {
				text: "Annuler",
			},
			confirm: {
				text: "Quitter",
			},
		},
	},
};
