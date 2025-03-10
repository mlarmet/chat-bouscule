import { useEffect, useRef, useState } from "react";

import { useGameStore } from "src/services/gameStore";
import "./Timer.scss";

export default function Timer() {
	const [seconds, setSeconds] = useState(0);

	const intervalRef = useRef<number | undefined>(undefined);

	const { tour, timerRun, setTimerRun } = useGameStore();

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
				setSeconds((prev) => prev + 1);
			}, 1000);
		} else {
			clearInterval(intervalRef.current);
			intervalRef.current = undefined;
		}

		return () => clearInterval(intervalRef.current);
	}, [timerRun]);

	useEffect(() => {
		if (tour === 0) {
			setSeconds(0);
			setTimerRun(false);
		} else {
			setTimerRun(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tour]);

	return <>{formatTime(seconds)}</>;
}
