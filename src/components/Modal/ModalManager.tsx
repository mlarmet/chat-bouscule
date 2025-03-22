import { useEffect, useState } from "react";

import { useAppStore } from "services/appStore";
import { gameSettings } from "services/settings";

import { useModal } from "./ModalContext";

import CodeReader from "components/Modal/CodeReader/CodeReader";
import Modal from "components/Modal/Modal";
import QrCode from "components/Modal/QrCode/QrCode";

export default function ModalManager() {
	const { modalDataAction } = useModal();

	const [modalData, setModalData] = useState<ModalProperties>();

	const [showQrCode, setShowQrCode] = useState(false);
	const [showScan, setShowScan] = useState(false);

	const modals = useAppStore((state) => state.modals);

	useEffect(() => {
		const activeModal = Object.entries(modals).find(([, isShow]) => isShow);

		if (activeModal) {
			if (activeModal[0] === "qrScan") {
				setShowScan(true);
				return;
			} else if (activeModal[0] === "qrCode") {
				setShowQrCode(true);
				return;
			}

			const [modalName] = activeModal as [ModalType, boolean];
			const data = gameSettings.modal[modalName];
			const modalActions = modalDataAction[modalName];

			if (data && data.actions && modalActions) {
				if (data.actions.cancel) data.actions.cancel.action = modalActions.cancel;
				if (data.actions.confirm) data.actions.confirm.action = modalActions.confirm;
			}

			setModalData(data);
		} else {
			setModalData(undefined);
		}

		setShowQrCode(false);
		setShowScan(false);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modals]);

	return (
		<>
			{modalData ? <Modal modal={modalData} /> : ""}
			{showQrCode ? <QrCode /> : ""}
			{showScan ? <CodeReader /> : ""}
		</>
	);
}
