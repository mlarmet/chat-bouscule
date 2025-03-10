import { gameStore } from "src/services/gameStore";
import Animal from "../Animal/Animal";

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
		this.render = this.render.bind(this);

		this.preloadSprites();
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

		ctx.lineWidth = __LINE_WIDTH__;
		ctx.strokeStyle = "rgb(255,255,255)";

		return { canvas, ctx };
	}

	async waitFinishAnimation(): Promise<void> {
		while (this.animatedCount > 0) {
			await new Promise((resolve) => setTimeout(resolve, 50)); // Vérifie toutes les 50ms
		}
	}

	private getPosition(row: number, col: number) {
		const x = Math.round(row * this.cellSize + __LINE_WIDTH__ * (row + 1));
		const y = Math.round(col * this.cellSize + __LINE_WIDTH__ * (col + 1));

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

		const cellSize = (gridSize - __LINE_WIDTH__ * (__CELL_COUNT__ + 1)) / __CELL_COUNT__;

		this.cellSize = cellSize;

		// Draw all sprites
		for (const animal of this.getMapAnimal().values()) {
			animal.cellSize = this.cellSize;
		}
	}

	drawBoard() {
		this.offScreenCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		const fullCellSize = this.cellSize + __LINE_WIDTH__;

		let x = 0;
		let y;

		let rowCount = 0;
		let colCount;

		while (rowCount < __CELL_COUNT__) {
			y = 0;
			colCount = 0;

			while (colCount < __CELL_COUNT__) {
				this.offScreenCtx.strokeRect(x + __LINE_WIDTH__ / 2, y + __LINE_WIDTH__ / 2, fullCellSize, fullCellSize);

				y += fullCellSize;
				colCount++;
			}

			x += fullCellSize;

			rowCount++;
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

		if (img && img.complete) {
			// Image is loaded, so we can draw it
			this.offScreenCtx.drawImage(
				img,
				animal.x + __PADDING__,
				animal.y + __PADDING__,
				animal.cellSize - __PADDING__ * 2,
				animal.cellSize - __PADDING__ * 2
			);
		} else {
			// Fallback if the image is not loaded yet
			img.onload = () => {
				this.offScreenCtx.drawImage(
					img,
					animal.x + __PADDING__,
					animal.y + __PADDING__,
					animal.cellSize - __PADDING__ * 2,
					animal.cellSize - __PADDING__ * 2
				);
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
		const fullCellSize = this.cellSize + __LINE_WIDTH__;

		const { x, y } = this.getPosition(row, col);

		if (color) {
			this.offScreenCtx.strokeStyle = color;
		}
		this.offScreenCtx.strokeRect(x - __LINE_WIDTH__ / 2, y - __LINE_WIDTH__ / 2, fullCellSize, fullCellSize);
		this.offScreenCtx.strokeStyle = "rgb(255,255,255)";
	}

	moveSprite(newRow: number, newCol: number, animal: Animal) {
		animal.moveTo(
			newRow,
			newCol,
			() => {
				this.drawBoard();

				console.log("draw");
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
