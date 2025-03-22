import Animal from "../Animal/Animal";
import Matou from "../Animal/Matou";
import Minou from "../Animal/Minou";

import Player from "../Player/Player";
import Board from "./Board";

import { appStore } from "services/appStore";
import { gameStore } from "services/gameStore";
import { gameSettings } from "services/settings";
import { navigateTo } from "services/navigate";

export default class Game {
	private players: Players = {
		gris: new Player("gris"),
		jaune: new Player("jaune"),
	};

	private checkedPositions: Set<string> = new Set();

	private rowPlayer?: PlayerType;
	private rowCells: [number, number][] = [];

	board = new Board();

	constructor() {
		console.log("new Game");
	}

	async init(canvasSize: number): Promise<void> {
		console.log("Init board");

		this.board.initBoard(canvasSize);

		// One resize, update sprites with new x,y and new cellSize
		this.board.setCellSize();
		this.board.updateAllPos();

		this.board.drawBoard();

		this.players.gris.updateSelectedPion();
		this.players.jaune.updateSelectedPion();

		switch (this.getStatus()) {
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
				this.checkIsRowOrWin();
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
		const cellCount = gameSettings.cell.count;

		return row >= 0 && row < cellCount && col >= 0 && col < cellCount;
	}

	private getMapAnimal() {
		return gameStore.getState().mapAnimal;
	}

	private getStatus() {
		return gameStore.getState().status;
	}

	private setStatus(status: GameStatus) {
		gameStore.getState().setStatus(status);
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

					const isSamePlayer = animal.player === startAnimal.player && animal.player === player;
					if (!isSamePlayer) {
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
		const fullCellSize = this.board.cellSize + gameSettings.cell.lineWidth.base;

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

		const color = gameSettings.colors.pick;

		for (const animal of this.getMapAnimal().values()) {
			if (animal.player === player.role) {
				this.board.drawRect(animal.row, animal.col, color);
			}
		}
	}

	private async showRow(): Promise<void> {
		this.setStatus("ROW");

		const color = gameSettings.colors.row;

		for (const [row, col] of this.rowCells) {
			this.board.drawRect(row, col, color);
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

				this.rowPlayer = undefined;
				this.rowCells = [];

				this.board.drawBoard();

				resolve();
			}, gameSettings.timeShowRowInMs);
		});
	}

	// Return true if programm need to exit
	private async checkIsRowOrWin() {
		if (this.isRow()) {
			if (this.isRowWin()) {
				this.showRowWin();
				return true;
			}

			await this.showRow();
		} else if (this.isAllPionsWin()) {
			this.showAllPionsWin();
			return true;
		}

		return false;
	}

	private isRowWin(): boolean {
		return this.rowCells.every(([row, col]) => {
			const animal = this.getMapAnimal().get(`${row},${col}`)!;

			return animal instanceof Matou;
		});
	}

	private showRowWin() {
		appStore.getState().setTimerRun(false);

		this.setStatus("WON");

		const color = gameSettings.colors.win;

		for (const [row, col] of this.rowCells) {
			this.board.drawRect(row, col, color);
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

		return matou.plateau === gameSettings.totalPiece && matou.stock === 0 && minou.stock === 0 && minou.plateau === 0;
	}

	private showAllPionsWin() {
		appStore.getState().setTimerRun(false);

		this.setStatus("WON");

		const player: Player = this.players[this.getTurn()].role;

		const color = gameSettings.colors.win;

		for (const animal of this.getMapAnimal().values()) {
			if (animal.player !== player.role) {
				continue;
			}

			this.board.drawRect(animal.row, animal.col, color);
		}
	}

	async play(eventX: number, eventY: number) {
		const { row, col } = this.getPos(eventX, eventY);

		const status = this.getStatus();

		// Let player click on pion
		if (status === "SELECT") {
			this.selectPions(row, col);
			return;
		}

		// Not ready to play for any reasons
		if (status !== "IDLE") {
			return;
		}

		// Cell already played, do nothing
		if (this.getMapAnimal().get(`${row},${col}`)) {
			return;
		}

		const player: Player = this.players[this.getTurn()];

		let animal: Animal;

		const selectedPion = player.getSelectedPion();

		if (selectedPion === "matou") {
			player.playMatou();
			animal = new Matou(this.getTurn());
		} else if (selectedPion === "minou") {
			player.playMinou();
			animal = new Minou(this.getTurn());
		} else {
			const selectors = document.querySelectorAll(`#${player.role} .sprite-selector`);

			for (const selector of selectors) {
				if (!selector.classList.contains("flashing")) {
					selector.classList.add("flashing");

					setTimeout(() => {
						selector.classList.remove("flashing");
					}, gameSettings.flashingSelectPlayerInMs);
				}
			}

			return;
		}

		this.getMapAnimal().set(`${row},${col}`, animal);

		this.board.setSpritePos(row, col, animal);

		this.board.drawBoard();

		this.moveOthersSprites(row, col);

		// Wait animation end
		await this.board.waitFinishAnimation();

		const exit = await this.checkIsRowOrWin();
		if (exit) {
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
