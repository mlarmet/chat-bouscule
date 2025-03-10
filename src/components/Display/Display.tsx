import { useEffect, useRef, useState } from "react";

import { useGameStore } from "services/store";

import Game from "src/objects/Game/Game";

import "./Display.scss";

export default function Board() {
	const resetTrigger = useGameStore((state) => state.resetTrigger);

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

	useEffect(() => {
		if (canvasSize !== 0) {
			if (gameRef.current) {
				gameRef.current.init(canvasSize);
			}
		}
	}, [canvasSize]);

	useEffect(() => {
		if (resetTrigger > 0) {
			gameRef.current = new Game();

			if (canvasSize !== 0) {
				gameRef.current.init(canvasSize);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resetTrigger]);

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

		gameRef.current = new Game();

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
