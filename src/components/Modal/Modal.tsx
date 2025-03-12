import { faXmarkSquare as cross } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useGameStore } from "services/store";

import { useEffect } from "react";
import "./Modal.scss";

interface ModalProps {
	title: string;
	text: string;
	cancel: {
		text: string;
		action?: CallableFunction;
	};
	confirm: {
		text: string;
		action?: CallableFunction;
	};
}

export default function Modal({ title, text, cancel, confirm }: ModalProps) {
	const setShowResetModal = useGameStore((state) => state.setShowResetModal);
	const setShowQuitModal = useGameStore((state) => state.setShowQuitModal);

	const setTimerRun = useGameStore((state) => state.setTimerRun);

	const hideModal = () => {
		// hide all..., simpler
		setShowQuitModal(false);
		setShowResetModal(false);

		setTimerRun(true);
	};

	const handleCancel = () => {
		if (cancel && cancel.action) {
			cancel.action();
		}

		hideModal();
	};

	const confirmModal = () => {
		if (confirm && confirm.action) {
			confirm.action();
		}

		hideModal();
	};

	useEffect(() => {
		setTimerRun(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="modal-container">
			<div className="modal">
				<button className="cross" onClick={handleCancel}>
					<FontAwesomeIcon icon={cross} fontSize={24} />
				</button>

				<div className="content">
					<h2>{title}</h2>
					<p>{text}</p>
				</div>

				<div className="actions">
					<button className="btn primary cancel" onClick={handleCancel}>
						{cancel?.text}
					</button>
					<button className="btn primary confirm" onClick={confirmModal}>
						{confirm?.text}
					</button>
				</div>
			</div>
		</div>
	);
}
