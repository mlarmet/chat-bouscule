import { useEffect, useRef, useState } from "react";

import { useAppStore } from "services/appStore";
import { useGameStore } from "services/gameStore";

import "./Timer.scss";

export default function Timer() {
	const intervalRef = useRef<number>(undefined);

	const tour = useGameStore((state) => state.tour);
	const status = useGameStore((state) => state.status);
	const timeElapsed = useGameStore((state) => state.timeElapsed);
	const setTimeElapsed = useGameStore((state) => state.setTimeElapsed);

	const timerRun = useAppStore((state) => state.timerRun);
	const resetTrigger = useAppStore((state) => state.resetTrigger);
	const setTimerRun = useAppStore((state) => state.setTimerRun);

	const timerRef = useRef(timeElapsed);
	const [timeSecs, setTimeSecs] = useState(timeElapsed);

	const formatTime = (secs: number) => {
		const hours = Math.floor(secs / 3600)
			.toString()
			.padStart(2, "0");
		const minutes = Math.floor((secs % 3600) / 60)
			.toString()
			.padStart(2, "0");
		const secsFormatted = (secs % 60).toString().padStart(2, "0");

		return `${hours}:${minutes}:${secsFormatted}`;
	};

	useEffect(() => {
		if (timerRun) {
			intervalRef.current = setInterval(() => {
				setTimeSecs((prev) => {
					const newTimer = prev + 1;
					timerRef.current = newTimer;
					return newTimer;
				});
			}, 1000);
		} else {
			clearInterval(intervalRef.current);
			intervalRef.current = undefined;
		}

		return () => clearInterval(intervalRef.current);
	}, [timerRun]);

	useEffect(() => {
		if (resetTrigger > 0) {
			setTimerRun(false);
			setTimeElapsed(0);
			// Set 0 here cause if timeElapsed not changed,
			// timeElapsed will not being trigger
			setTimeSecs(0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resetTrigger]);

	useEffect(() => {
		if (!timerRun) {
			// Start timer on first move
			if (tour > 0) {
				if (status !== "WON" && status !== "STOPPED") {
					setTimerRun(true);
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tour]);

	// Store timer on timer unmount
	useEffect(() => {
		return () => {
			setTimeElapsed(timerRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <>{formatTime(timeSecs)}</>;
}
