import { useEffect } from "react";

import { useAppStore } from "services/appStore";
import { useConnectionStore } from "services/connectionStore";

import "./Modal.scss";

interface ModalProps {
	modal: ModalProperties;

	children?: React.ReactNode;
}

export default function Modal({ modal, children }: ModalProps) {
	const setTimerRun = useAppStore((state) => state.setTimerRun);
	const hideAll = useAppStore((state) => state.hideAll);

	const connection = useConnectionStore((state) => state.connection);

	const hideModal = () => {
		hideAll();

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
		// don't stop timer if online game
		if (!connection) {
			setTimerRun(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="modal-container" onClick={handleOutClick}>
			<div className="modal">
				<button className="material-symbols-rounded cross" onClick={handleCancel}>
					disabled_by_default
				</button>

				<div className="modal-content">
					<h2>{modal.title}</h2>
					<p>{modal.text}</p>
				</div>

				{modal.actions && (
					<div className="actions">
						{modal.actions.cancel && (
							<button className="btn primary valid" onClick={handleCancel}>
								{modal.actions.cancel.text}
							</button>
						)}

						{modal.actions.confirm && (
							<button className="btn primary alert" onClick={confirmModal}>
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
