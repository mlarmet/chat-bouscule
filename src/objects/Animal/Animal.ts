import { gameStore } from "services/gameStore";
import { gameSettings } from "services/settings";

export default class Animal {
	player: PlayerType;

	image: string;
	weight: number;

	cellSize = 0;

	x = 0;
	y = 0;

	row = 0;
	col = 0;

	speed = 2;

	isAnimated = false;

	constructor(player: PlayerType, image: string, weight: number) {
		this.player = player;
		this.image = image;
		this.weight = weight;
	}

	moveTo(newRow: number, newCol: number, drawing: () => void, endDraw: () => void): void {
		this.row = newRow;
		this.col = newCol;

		this.isAnimated = true;

		const lineWidth = gameSettings.cell.lineWidth.base;

		const animate = () => {
			// Disable draw if game was reset
			if (gameStore.getState().tour === 0) {
				return;
			}

			const targetX = this.row * this.cellSize + lineWidth * (this.row + 1);
			const targetY = this.col * this.cellSize + lineWidth * (this.col + 1);

			const dx = targetX - this.x;
			const dy = targetY - this.y;

			const isDraw = Math.abs(dx) > this.speed || Math.abs(dy) > this.speed;

			if (!isDraw || !this.isAnimated) {
				this.x = targetX;
				this.y = targetY;

				this.isAnimated = false;

				endDraw();
			} else {
				this.x += Math.sign(dx) * this.speed;
				this.y += Math.sign(dy) * this.speed;

				drawing();

				requestAnimationFrame(animate);
			}
		};

		animate();
	}

	fadeOut(dx: number, dy: number, drawing: () => void, endDraw: () => void): void {
		const canvas = document.getElementById("canvas")!;
		const gridSize = Math.min(parseInt(canvas.style.width), parseInt(canvas.style.height));

		const animate = () => {
			const xInBounds = dx === 1 ? this.x < gridSize : this.x + this.cellSize > 0;
			const yInBounds = dy === 1 ? this.y < gridSize : this.y + this.cellSize > 0;

			const continueDraw = dx === 0 ? yInBounds : dy === 0 ? xInBounds : xInBounds && yInBounds;

			if (continueDraw) {
				if (dx !== 0) {
					this.x += Math.sign(dx) * this.speed;
				}

				if (dy !== 0) {
					this.y += Math.sign(dy) * this.speed;
				}

				drawing();
				requestAnimationFrame(animate);
			} else {
				endDraw();
			}
		};
		animate();
	}
}
