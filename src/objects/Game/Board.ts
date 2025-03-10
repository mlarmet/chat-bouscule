import Animal from "../Animal/Animal";

import { gameSettings } from "services/settings";
import { gameStore } from "services/store";

export default class Board {
	private canvas!: HTMLCanvasElement;
	private ctx!: CanvasRenderingContext2D;

	// Use second canvas to animate without flickering
	private offScreenCanvas!: HTMLCanvasElement;
	private offScreenCtx!: CanvasRenderingContext2D;

	private renderingID = -1;

	private imgCache: { [key: string]: HTMLImageElement } = {};

	cellSize = 0;
	animatedCount = 0;

	constructor() {
		this.preloadSprites();

		this.render = this.render.bind(this);
	}

	// Preload all images at the start
	private preloadSprites() {
		const imageSources = [
			__BASE_URL__ + "/assets/sprites/minou_gris.png",
			__BASE_URL__ + "/assets/sprites/minou_jaune.png",
			__BASE_URL__ + "/assets/sprites/matou_gris.png",
			__BASE_URL__ + "/assets/sprites/matou_jaune.png",
		];

		imageSources.forEach((src) => {
			const img = new Image();
			img.src = src;
			this.imgCache[src] = img;
		});
	}

	// Retrieve cached image
	private getImage(imageSrc: string): HTMLImageElement {
		return this.imgCache[imageSrc];
	}

	private getMapAnimal() {
		return gameStore.getState().mapAnimal;
	}

	initBoard(canvasSize: number) {
		const canvas = document.getElementById("canvas") as HTMLCanvasElement;
		const canvasData = this.initCanvas(canvas, canvasSize);

		this.canvas = canvasData.canvas;
		this.ctx = canvasData.ctx;

		const dpr = window.devicePixelRatio || 1;
		// this.ctx.scale(dpr, dpr);

		const offScreenCanvas = document.createElement("canvas");
		const offScreen = this.initCanvas(offScreenCanvas, canvasSize);

		this.offScreenCanvas = offScreen.canvas;
		this.offScreenCtx = offScreen.ctx;
		// Only scale offset, if scale ctx end with double scale
		// ctx is just a copy screen
		this.offScreenCtx.scale(dpr, dpr);

		if (this.renderingID !== -1) {
			cancelAnimationFrame(this.renderingID);
		}

		this.render();
	}

	private initCanvas(canvas: HTMLCanvasElement, canvasSize: number) {
		// Ajuster la résolution du canvas
		const dpr = window.devicePixelRatio || 1;

		// Définir la taille CSS du canvas
		canvas.style.width = `${canvasSize}px`;
		canvas.style.height = `${canvasSize}px`;

		// Définir la vraie taille du canvas (multipliée par le DPR)
		canvas.width = Math.round(canvasSize * dpr);
		canvas.height = Math.round(canvasSize * dpr);

		const ctx = canvas.getContext("2d")!;

		ctx.lineWidth = gameSettings.cell.lineWidth.base;
		ctx.strokeStyle = gameSettings.colors.line;
		ctx.lineJoin = "round";
		ctx.lineCap = "round";

		return { canvas, ctx };
	}

	async waitFinishAnimation(): Promise<void> {
		while (this.animatedCount > 0) {
			await new Promise((resolve) => setTimeout(resolve, 50)); // Vérifie toutes les 50ms
		}
	}

	private getPosition(row: number, col: number) {
		const lineWidth = gameSettings.cell.lineWidth.base;
		const padding = gameSettings.cell.padding / 2.0;

		const x = row * this.cellSize + lineWidth * (row + 1) + padding;
		const y = col * this.cellSize + lineWidth * (col + 1) + padding;

		return { x, y };
	}

	private render() {
		// Copier le canvas hors écran sur le vrai canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.drawImage(this.offScreenCanvas, 0, 0);

		this.renderingID = requestAnimationFrame(this.render);
	}

	setCellSize() {
		const gridSize = Math.min(parseInt(this.canvas.style.width), parseInt(this.canvas.style.height));

		const { count: cellCount, padding, lineWidth } = gameSettings.cell;

		const cellSize = (gridSize - lineWidth.base * (cellCount + 1) - padding) / cellCount;

		this.cellSize = cellSize;

		// Draw all sprites
		for (const animal of this.getMapAnimal().values()) {
			animal.cellSize = this.cellSize;
		}
	}

	drawBoard() {
		this.offScreenCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		const { count: cellCount, lineWidth } = gameSettings.cell;

		const fullCellSize = this.cellSize + lineWidth.base;

		for (let row = 0; row < cellCount; row++) {
			for (let col = 0; col < cellCount; col++) {
				const { x, y } = this.getPosition(row, col);
				this.offScreenCtx.strokeRect(x - lineWidth.base / 2.0, y - lineWidth.base / 2.0, fullCellSize, fullCellSize);
			}
		}

		// Draw all sprites
		for (const animal of this.getMapAnimal().values()) {
			this.drawAnimal(animal);
		}
	}

	updateAllPos() {
		for (const [key, animal] of this.getMapAnimal()) {
			if (animal.isAnimated) {
				continue;
			}

			const pos = key.split(",");

			const row = parseInt(pos[0]);
			const col = parseInt(pos[1]);

			this.setSpritePos(row, col, animal);
		}
	}

	drawAnimal(animal: Animal) {
		const img = this.getImage(animal.image);

		const padding = 0; // gameSettings.cell.padding;

		// Image cached
		if (img && img.complete) {
			this.offScreenCtx.drawImage(img, animal.x + padding, animal.y + padding, this.cellSize - padding * 2, this.cellSize - padding * 2);
		} else {
			// Fallback if the image is not loaded yet
			img.onload = () => {
				this.offScreenCtx.drawImage(img, animal.x + padding, animal.y + padding, this.cellSize - padding * 2, this.cellSize - padding * 2);
			};
		}
	}

	setSpritePos(row: number, col: number, animal: Animal) {
		const { x, y } = this.getPosition(row, col);

		animal.x = x;
		animal.y = y;
		animal.cellSize = this.cellSize;
		animal.row = row;
		animal.col = col;
	}

	cleanCell(row: number, col: number) {
		const { x, y } = this.getPosition(row, col);

		this.offScreenCtx.clearRect(x, y, this.cellSize, this.cellSize);
	}

	drawRect(row: number, col: number, color?: string) {
		const { base, action } = gameSettings.cell.lineWidth;

		const fullCellSize = this.cellSize + base;

		const { x, y } = this.getPosition(row, col);

		if (color) {
			this.offScreenCtx.strokeStyle = color;
		}

		this.offScreenCtx.lineWidth = action;
		this.offScreenCtx.strokeRect(x - base / 2.0, y - base / 2.0, fullCellSize, fullCellSize);

		this.offScreenCtx.strokeStyle = gameSettings.colors.line;
		this.offScreenCtx.lineWidth = base;
	}

	moveSprite(newRow: number, newCol: number, animal: Animal) {
		animal.moveTo(
			newRow,
			newCol,
			() => {
				this.drawBoard();
			},
			() => {
				this.animatedCount--;

				this.drawBoard();
			}
		);
	}

	outAnimation(dx: number, dy: number, row: number, col: number, animal: Animal) {
		animal.fadeOut(
			dx,
			dy,
			() => {
				this.drawBoard();
			},
			() => {
				this.animatedCount--;

				this.getMapAnimal().delete(`${row},${col}`);

				this.drawBoard();
			}
		);
	}
}
