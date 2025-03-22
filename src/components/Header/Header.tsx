import { useAppStore } from "services/appStore";
import { useGameStore } from "services/gameStore";

import { useModal } from "components/Modal/ModalContext";
import Title from "components/Title/Title";

import "./Header.scss";

export default function Header() {
	const { modalDataAction } = useModal();

	const tour = useGameStore((state) => state.tour);

	const setModal = useAppStore((state) => state.setModal);

	const handleReset = () => {
		if (tour > 0) {
			setModal("reset", true);
		} else {
			const action = modalDataAction["reset"]?.confirm;

			if (action) {
				action();
			}
		}
	};

	const handleExit = () => {
			setModal("quit", true);
		} else {
			const action = modalDataAction["quit"]?.confirm;

			if (action) {
				action();
			}
		}
	};

	return (
		<header>
			<Title small />

			<button id="reset" className="btn valid icon" onClick={handleReset}>
				<span className="material-icons-round">restart_alt</span>
			</button>

			<button id="exit" className="btn alert icon" onClick={handleExit}>
				<span className="material-icons-round">close</span>
			</button>
		</header>
	);
}
