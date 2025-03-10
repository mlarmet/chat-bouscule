import { useEffect, useRef, useState } from "react";

import "./Display.scss";

import Game from "src/objects/Game/Game";
import { useGameStore } from "src/services/gameStore";

export default function Board() {
	const { tour } = useGameStore();

	const elementRef = useRef(null);
	const gameRef = useRef<Game>(null);

	const [canvasSize, setCanvasSize] = useState(0);

	const setBoardSize = () => {
		const board = document.getElementById("board");

		if (board) {
			setCanvasSize(Math.min(board!.offsetWidth, board.offsetHeight));
		}
	};

	const placeSprite = (e: MouseEvent) => {
		const eventX = e.offsetX;
		const eventY = e.offsetY;

		gameRef.current!.play(eventX, eventY);
	};

	const updateGame = (reset = false) => {
		if (reset || !gameRef.current) {
			gameRef.current = new Game();
		}

		if (canvasSize === 0) {
			return;
		}

		gameRef.current.init(canvasSize);
	};

	useEffect(() => {
		updateGame();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [canvasSize]);

	useEffect(() => {
		if (tour === 0) {
			updateGame(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tour]);

	// Resize grid with observer on parent size
	// Add event listener to canvas
	useEffect(() => {
		let resizeObserver: ResizeObserver | null = null;

		if (elementRef.current) {
			resizeObserver = new ResizeObserver(() => setBoardSize());

			resizeObserver.observe(elementRef.current);
		}

		const canvas = document.getElementById("canvas");

		if (canvas) {
			canvas.addEventListener("click", placeSprite);
		}

		return () => {
			if (resizeObserver) {
				resizeObserver.disconnect();
			}

			gameRef.current = null;

			const canvas = document.getElementById("canvas");

			if (canvas) {
				canvas.removeEventListener("click", placeSprite);
			}
		};
	}, []);

	return (
		<div id="board" ref={elementRef}>
			<canvas id="canvas"></canvas>
		</div>
	);
}
