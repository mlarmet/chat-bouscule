import { useEffect, useRef, useState } from "react";

import { useAppStore } from "services/appStore";

import Game from "src/objects/Game/Game";

import "./Display.scss";

export default function Board() {
	const resetTrigger = useAppStore((state) => state.resetTrigger);

	const elementRef = useRef(null);
	const gameRef = useRef<Game>(null);

	const [canvasSize, setCanvasSize] = useState(0);

	const setBoardSize = () => {
		const board = document.getElementById("board");

		if (board) {
			const size = Math.min(board!.offsetWidth, board.offsetHeight);
			setCanvasSize(size);

			if (size !== 0 && gameRef.current) {
				gameRef.current.init(size);
			}
		}
	};

	const placeSprite = (e: MouseEvent) => {
		const eventX = e.offsetX;
		const eventY = e.offsetY;

		gameRef.current!.playEvent(eventX, eventY);
	};

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
