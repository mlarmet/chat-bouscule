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

	modal: Record<ModalType, ModalProperties | undefined>;
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
			actions: {
				cancel: {
					text: "Annuler",
				},
				confirm: {
					text: "Recommencer",
				},
			},
		},

		quit: {
			title: "Quitter la partie ?",
			text: "Une partie est en cours. Voulez-vous vraiment quitter ?",
			actions: {
				cancel: {
					text: "Annuler",
				},
				confirm: {
					text: "Quitter",
				},
			},
		},

		credit: {
			title: "Crédits",
			text: __APP_NAME__ + " s'inspire du jeu de société \"Boop\", mais n'utilise aucune ressource officielle du jeu.",
		},

		qrCodeError: {
			title: "Erreur",
			text: "QrCode invalide !\n\nIl doit contenir 6 caractères (chiffres ou lettres).",
		},

		errorCode: {
			title: "Erreur",
			text: "Erreur avec la connexion. Veuillez vérifier le code et réessayer.",
		},

		errorCamera: {
			title: "Erreur",
			text: "Impossible d'accéder à la caméra. Veuillez réessayer.",
		},

		errorHost: {
			title: "Erreur",
			text: "Impossible de créer la partie. Veuillez réessayer.",
		},

		lostConnection: {
			title: "Erreur",
			text: "L'adversaire a quitté la partie !",
		},

		qrCode: undefined,
		qrScan: undefined,
	},
};
