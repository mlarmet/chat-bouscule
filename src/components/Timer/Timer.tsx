import { useEffect, useRef, useState } from "react";

import { useAppStore } from "services/appStore";
import { useGameStore } from "services/gameStore";

import "./Timer.scss";

export default function Timer() {
	const intervalRef = useRef<number>(undefined);

	const tour = useGameStore((state) => state.tour);
	const status = useGameStore((state) => state.status);

	const timerRun = useAppStore((state) => state.timerRun);
	const resetTrigger = useAppStore((state) => state.resetTrigger);
	const setTimerRun = useAppStore((state) => state.setTimerRun);

	const [timeSecs, setTimeSecs] = useState(0);

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

	const resetValue = () => {
		setTimerRun(false);
		setTimeSecs(0);
	};

	useEffect(() => {
		if (timerRun) {
			intervalRef.current = setInterval(() => {
				setTimeSecs((prev) => prev + 1);
			}, 1000);
		} else {
			clearInterval(intervalRef.current);
			intervalRef.current = undefined;
		}

		return () => clearInterval(intervalRef.current);
	}, [timerRun]);

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

	useEffect(() => {
		if (resetTrigger > 0) {
			resetValue();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resetTrigger]);

	useEffect(() => {
		// for first move
		resetValue();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <>{formatTime(timeSecs)}</>;
}
