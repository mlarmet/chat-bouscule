import { QRCodeSVG } from "qrcode.react";

import { useAppStore } from "src/services/appStore";
import { useConnectionStore } from "src/services/connectionStore";

import "./QrCode.scss";

export default function QrCode() {
	const setModal = useAppStore((state) => state.setModal);

	const peerId = useConnectionStore((state) => state.peerId);

	const hideModal = () => {
		setModal("qrCode", false);
	};

	const handleCancel = () => {
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

	return (
		<div id="qr-code-container" className="modal-container" onClick={handleOutClick}>
			<div className="modal only-exit">
				<button className="material-icons-round cross" onClick={handleCancel}>
					disabled_by_default
				</button>

				<QRCodeSVG value={peerId || ""} />
			</div>
		</div>
	);
}
