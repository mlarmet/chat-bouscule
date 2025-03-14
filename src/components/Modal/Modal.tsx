import { faXmarkSquare as cross } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAppStore } from "services/appStore";

import { useEffect } from "react";
import "./Modal.scss";

interface ModalProps {
	modal: ModalProperties;

	children?: React.ReactNode;
}

export default function Modal({ modal, children }: ModalProps) {
	const setTimerRun = useAppStore((state) => state.setTimerRun);

	const setShowResetModal = useAppStore((state) => state.setShowResetModal);
	const setShowQuitModal = useAppStore((state) => state.setShowQuitModal);
	const setShowCreditModal = useAppStore((state) => state.setShowCreditModal);

	const hideModal = () => {
		// hide all..., simpler
		setShowQuitModal(false);
		setShowResetModal(false);
		setShowCreditModal(false);

		setTimerRun(true);
	};

	const handleCancel = () => {
		if (modal.actions?.cancel?.action) {
			modal.actions.cancel.action();
		}

		hideModal();
	};

	const confirmModal = () => {
		if (modal.actions?.confirm?.action) {
			modal.actions.confirm.action();
		}

		hideModal();
	};

	const handleOutClick = (e: React.MouseEvent) => {
		const target = e.target as HTMLElement;

		if (target) {
			if (target.classList.contains("modal-container")) {
				handleCancel();
			}
		}
	};

	// Stop timer if modal is show
	useEffect(() => {
		setTimerRun(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="modal-container" onClick={handleOutClick}>
			<div className="modal">
				<button className="cross" onClick={handleCancel}>
					<FontAwesomeIcon icon={cross} fontSize={24} />
				</button>

				<div className="modal-content">
					<h2>{modal.title}</h2>
					<p>{modal.text}</p>
				</div>

				{modal.actions && (
					<div className="actions">
						{modal.actions.cancel && (
							<button className="btn primary cancel" onClick={handleCancel}>
								{modal.actions.cancel.text}
							</button>
						)}

						{modal.actions.confirm && (
							<button className="btn primary confirm" onClick={confirmModal}>
								{modal.actions.confirm.text}
							</button>
						)}
					</div>
				)}

				{children || ""}
			</div>
		</div>
	);
}
