import { faRotateRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAppStore } from "services/appStore";
import { useGameStore } from "services/gameStore";

import { useModal } from "components/Modal/ModalContext";

import "./Header.scss";

export default function Header() {
	const { modalDataAction } = useModal();

	const tour = useGameStore((state) => state.tour);

	const setShowResetModal = useAppStore((state) => state.setShowResetModal);
	const setShoQuitModal = useAppStore((state) => state.setShowQuitModal);

	const handleReset = () => {
		if (tour > 0) {
			setShowResetModal(true);
		} else {
			const action = modalDataAction["reset"]?.confirm;

			if (action) {
				action();
			}
		}
	};

	const handleExit = () => {
		if (tour > 0) {
			setShoQuitModal(true);
		} else {
			const action = modalDataAction["quit"]?.confirm;

			if (action) {
				action();
			}
		}
	};

	return (
		<header>
			<div className="title">
				<h1>Chat</h1>
				<h2>Bouscule</h2>
			</div>

			<button id="reset" className="btn valid icon" onClick={handleReset}>
				<FontAwesomeIcon icon={faRotateRight} />
			</button>

			<button id="exit" className="btn alert icon" onClick={handleExit}>
				<FontAwesomeIcon icon={faXmark} fontSize={20} />
			</button>
		</header>
	);
}
