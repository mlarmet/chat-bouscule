import { useEffect, useState } from "react";

import { useAppStore } from "services/appStore";
import { gameSettings } from "services/settings";

import { useModal } from "./ModalContext";

import Modal from "components/Modal/Modal";

export default function ModalManager() {
	const { modalDataAction } = useModal();

	const [modalData, setModalData] = useState<ModalProperties>();

	const showResetModal = useAppStore((state) => state.showResetModal);
	const showQuitModal = useAppStore((state) => state.showQuitModal);
	const showCreditModal = useAppStore((state) => state.showCreditModal);

	useEffect(() => {
		for (const [modalName, isShow] of Object.entries({
			credit: showCreditModal,
			reset: showResetModal,
			quit: showQuitModal,
		})) {
			if (isShow) {
				const modal = modalName as ModalType;

				const data = gameSettings.modal[modal];

				const modalActions = modalDataAction[modal];

				if (data.actions && modalActions) {
					if (data.actions.cancel) {
						data.actions.cancel.action = modalActions.cancel;
					}

					if (data.actions.confirm) {
						data.actions.confirm.action = modalActions.confirm;
					}
				}

				setModalData(data);

				return;
			}
		}

		setModalData(undefined);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showResetModal, showCreditModal, showQuitModal]);

	return <>{modalData && <Modal modal={modalData} />}</>;
}
