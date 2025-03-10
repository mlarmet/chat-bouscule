import Animal from "../Animal/Animal";
import Matou from "../Animal/Matou";
import Minou from "../Animal/Minou";

import { gameStore } from "src/services/gameStore";
import Player from "../Player/Player";
import Board from "./Board";

const config = {
	timeShowRowInMs: 1000,
	totalPiece: 8,
	gris: {
		color: {
			// TODO : update color with lighter ones
			row: "rgb(255, 119, 0)",
			pick: "rgb(255,255,0)",
			win: "rgb(0,255,0)",
		},
	},

	jaune: {
		color: {
			row: "rgb(255, 119, 0)",
			pick: "rgb(255,255,0)",
			win: "rgb(0,255,0)",
		},
	},
};

export default class Game {
	private players: Players;

	private status: GameStatus = "STOPPED";

	private checkedPositions: Set<string> = new Set();

	private rowPlayer: PlayerType | null = null;
	private rowCells: [number, number][] = [];

	board: Board;

	constructor() {
		console.log("new Game");

		this.board = new Board();

		this.setStatus("IDLE");

		this.players = {
			gris: new Player("gris"),
			jaune: new Player("jaune"),
		};
	}

	private setStatus(newStatus: GameStatus) {
		if (this.status === newStatus) {
			return;
		}

		console.log(`Status changé: ${newStatus}`);
		this.status = newStatus;
	}

	init(canvasSize: number): void {
		console.log("Init board");

		this.board.initBoard(canvasSize);

		// One resize, update sprites with new x,y and new cellSize
		this.board.setCellSize();
		this.board.updateAllPos();

		this.board.drawBoard();

		switch (this.status) {
			case "SELECT":
				this.showSelectPion();
				break;
			case "ROW":
				this.showRow();
				break;
			case "MOVING":
				// Disable animation when resize
				for (const animal of gameStore.getState().mapAnimal.values()) {
					animal.isAnimated = false;
				}
				break;
			case "WON":
				if (this.rowPlayer === null) {
					this.showAllPionsWin();
				} else {
					this.showRowWin();
				}
				break;
			default:
				this.setStatus("IDLE");
		}
	}

	getPlayersData() {
		return {
			gris: this.players["gris"].getData(),
			jaune: this.players["jaune"].getData(),
		};
	}

	private isValid(row: number, col: number) {
		return row >= 0 && row < __CELL_COUNT__ && col >= 0 && col < __CELL_COUNT__;
	}

	private getMapAnimal() {
		return gameStore.getState().mapAnimal;
	}

	private getTurn() {
		return gameStore.getState().turn;
	}

	private moveOthersSprites(row: number, col: number) {
		// const current = this.mapAnimal.get(`${row},${col}`);
		const current = this.getMapAnimal().get(`${row},${col}`);

		if (!current) {
			return;
		}

		// Directions du cercle autour du pion
		const directions = [
			[-1, -1],
			[-1, 0],
			[-1, 1],
			[0, -1],
			[0, 1],
			[1, -1],
			[1, 0],
			[1, 1],
		];

		// Tenter de pousser les pions autour
		for (const [dx, dy] of directions) {
			const x = row + dx;
			const y = col + dy;

			// if (this.isValid(x, y) && this.mapAnimal.get(`${x},${y}`)) {
			if (this.isValid(x, y) && this.getMapAnimal().get(`${x},${y}`)) {
				// Vérifier si on peut pousser
				// const animal: Animal = this.mapAnimal.get(`${x},${y}`)!;
				const animal: Animal = this.getMapAnimal().get(`${x},${y}`)!;

				// Move only minou to minou, matou to all
				if (current.weight < animal.weight) {
					continue;
				}

				const nextX = x + dx;
				const nextY = y + dy;

				// Pion out of board
				if (!this.isValid(nextX, nextY)) {
					const player: Player = this.players[animal.player];

					if (animal instanceof Matou) {
						player.returnMatou();
					} else {
						player.returnMiou();
					}

					this.board.animatedCount++;
					this.board.outAnimation(dx, dy, x, y, animal);

					// this.board.cleanCell(x, y);
				} else {
					// Can't push, two pions stack
					if (this.getMapAnimal().get(`${nextX},${nextY}`)) {
						continue;
					}

					this.getMapAnimal().set(`${nextX},${nextY}`, animal);

					this.getMapAnimal().delete(`${x},${y}`);

					this.board.moveSprite(nextX, nextY, animal);

					this.board.animatedCount++;
				}
			}
		}

		if (this.board.animatedCount > 0) {
			this.setStatus("MOVING");
		}
	}

	private isRow(): boolean {
		this.checkedPositions.clear();

		for (const key of this.getMapAnimal().keys()) {
			const pos = key.split(",");

			const row = parseInt(pos[0]);
			const col = parseInt(pos[1]);

			const p1Positions = this.checkThreeInRow(row, col, "jaune");

			if (p1Positions !== null) {
				this.rowCells = p1Positions;
				this.rowPlayer = "jaune";

				return true;
			}

			const p2Positions = this.checkThreeInRow(row, col, "gris");

			if (p2Positions !== null) {
				this.rowCells = p2Positions;
				this.rowPlayer = "gris";

				return true;
			}
		}

		return false;
	}

	// Vérifier si trois pions alignés autour de (row, col)
	private checkThreeInRow(row: number, col: number, player: PlayerType): [number, number][] | null {
		const directions = [
			[0, 1], // → Horizontal
			[1, 0], // ↓ Vertical
			[1, -1], // ↘ Diagonale
			[1, 1], // ↙ Diagonale
		];

		// Clé unique pour éviter les doublons
		const key = `${row},${col}`;
		if (this.checkedPositions.has(key)) return null; // Déjà vérifié

		const startAnimal = this.getMapAnimal().get(`${row},${col}`);
		if (startAnimal == null) {
			return null;
		}

		for (const [dx, dy] of directions) {
			let count = 1; // On compte la case de départ
			const positions: [number, number][] = [[row, col]];

			// Vérification dans les deux directions
			for (const sign of [-1, 1]) {
				// -1 = arrière, 1 = avant
				let x = row + dx * sign;
				let y = col + dy * sign;

				while (this.isValid(x, y)) {
					const posKey = `${x},${y}`;
					// Évite les doublons
					if (this.checkedPositions.has(posKey)) {
						break;
					}

					const animal = this.getMapAnimal().get(posKey);
					if (!animal) {
						break;
					}

					const samePlayer = animal.player === startAnimal.player && animal.player === player;
					if (!samePlayer) {
						break;
					}

					positions.push([x, y]);
					count++;

					if (count >= 3) {
						// Marquer toutes les positions comme vérifiées
						positions.forEach(([px, py]) => this.checkedPositions.add(`${px},${py}`));
						return positions; // On retourne les positions des 3 pions alignés
					}

					x += dx * sign;
					y += dy * sign;
				}
			}
		}

		return null; // Aucun alignement trouvé
	}

	private getPos(eventX: number, eventY: number) {
		const fullCellSize = this.board.cellSize + __LINE_WIDTH__;

		// Get row and col from click position
		const row = eventX < fullCellSize ? 0 : Math.floor(eventX / fullCellSize);
		const col = eventY < fullCellSize ? 0 : Math.floor(eventY / fullCellSize);

		return { row, col };
	}

	private toggleTurn(): void {
		const turn = this.getTurn() === "gris" ? "jaune" : "gris";
		gameStore.getState().setTurn(turn);
	}

	private async showSelectPion() {
		this.setStatus("SELECT");

		const player: Player = this.players[this.getTurn()];

		for (const animal of this.getMapAnimal().values()) {
			if (animal instanceof Matou || animal.player !== player.role) {
				continue;
			}

			this.board.drawRect(animal.row, animal.col, config[player.role].color.pick);
		}
	}

	private async showRow(): Promise<void> {
		this.setStatus("ROW");

		for (const [row, col] of this.rowCells) {
			this.board.drawRect(row, col, config[this.rowPlayer!].color.row);
		}

		return new Promise((resolve) => {
			setTimeout(() => {
				const player: Player = this.players[this.rowPlayer!];

				let nbMinou = 0;
				let nbMatou = 0;

				for (const [x, y] of this.rowCells) {
					const animal = this.getMapAnimal().get(`${x},${y}`)!;

					if (animal instanceof Minou) {
						nbMinou++;
					} else {
						nbMatou++;
					}

					this.getMapAnimal().delete(`${x},${y}`);
				}

				player.transformMinouToMatou(nbMinou, nbMatou);

				this.rowPlayer = null;
				this.rowCells = [];

				this.board.drawBoard();

				resolve();
			}, config.timeShowRowInMs);
		});
	}

	private isRowWin(): boolean {
		return this.rowCells.every(([row, col]) => {
			const animal = this.getMapAnimal().get(`${row},${col}`)!;

			return animal instanceof Matou;
		});
	}

	private showRowWin() {
		this.setStatus("WON");

		for (const [row, col] of this.rowCells) {
			this.board.drawRect(row, col, config[this.rowPlayer!].color.win);
		}
	}

	private selectPions(row: number, col: number) {
		const player: Player = this.players[this.getTurn()];

		// Cell already played
		const animal = this.getMapAnimal().get(`${row},${col}`);

		if (!animal || animal.player !== player.role) {
			return;
		}

		this.getMapAnimal().delete(`${row},${col}`);

		this.board.drawBoard();

		player.returnMatou();

		// Let new play
		this.setStatus("IDLE");
	}

	private isAllPionsWin(): boolean {
		const player: Player = this.players[this.getTurn()];
		const { minou, matou } = player.getPions();

		return matou.plateau === config.totalPiece && matou.stock === 0 && minou.stock === 0 && minou.plateau === 0;
	}

	private showAllPionsWin() {
		this.setStatus("WON");

		const player: Player = this.players[this.getTurn()];

		for (const animal of this.getMapAnimal().values()) {
			if (animal.player !== player.role) {
				continue;
			}

			this.board.drawRect(animal.row, animal.col, config[player.role].color.win);
		}
	}

	async play(eventX: number, eventY: number) {
		const { row, col } = this.getPos(eventX, eventY);

		// Let player click on pion
		if (this.status === "SELECT") {
			this.selectPions(row, col);
			return;
		}

		// Not ready to play for any reasons
		if (this.status !== "IDLE") {
			return;
		}

		// Cell already played, do nothing
		if (this.getMapAnimal().get(`${row},${col}`)) {
			return;
		}

		const player: Player = this.players[this.getTurn()];

		let animal: Animal;

		if (player.getSelectedPion() === "matou") {
			player.playMatou();
			animal = new Matou(this.getTurn());
		} else {
			player.playMinou();
			animal = new Minou(this.getTurn());
		}

		this.getMapAnimal().set(`${row},${col}`, animal);

		this.board.setSpritePos(row, col, animal);

		this.board.drawBoard();

		this.moveOthersSprites(row, col);

		// Wait animation end
		await this.board.waitFinishAnimation();

		if (this.isRow()) {
			if (this.isRowWin()) {
				this.showRowWin();
				return;
			}

			await this.showRow();
		} else if (this.isAllPionsWin()) {
			this.showAllPionsWin();
			return;
		}

		this.toggleTurn();

		const nextPlayerStock: Characters = (this.players[this.getTurn()] as Player).getPions();

		// Last cause update status befor new click
		if (nextPlayerStock.minou.stock + nextPlayerStock.matou.stock === 0) {
			this.showSelectPion();
			return;
		}

		// End of play
		this.setStatus("IDLE");

		gameStore.getState().addTour();
	}
}
