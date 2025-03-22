import { useEffect, useRef } from "react";

import { Html5Qrcode } from "html5-qrcode";

import { useAppStore } from "services/appStore";
import { useConnectionStore } from "services/connectionStore";

import "./CodeReader.scss";

export default function CodeReader() {
	const scannerRef = useRef<Html5Qrcode | null>(null);

	const setModal = useAppStore((state) => state.setModal);

	const setInputPeerId = useConnectionStore((state) => state.setInputPeerId);

	const hideModal = () => {
		setModal("qrScan", false);
	};

	const handleOutClick = (e: React.MouseEvent) => {
		const target = e.target as HTMLElement;

		if (target) {
			if (target.classList.contains("modal-container")) {
				hideModal();
			}
		}
	};

	const handleResize = async () => {
		if (scannerRef.current && scannerRef.current.isScanning) {
			await stopScanner();
			startScanner();
		}
	};

	const stopScanner = async () => {
		if (scannerRef.current && scannerRef.current.isScanning) {
			await scannerRef.current.stop();
			scannerRef.current.clear();

			scannerRef.current = null;
		}
	};

	const startScanner = async () => {
		if (!scannerRef.current) {
			scannerRef.current = new Html5Qrcode("qr-reader");

			try {
				await scannerRef.current.start(
					{ facingMode: "environment" },
					{
						fps: 10,
						aspectRatio: 0.56,
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-expect-error
						qrbox: () => {
							const parent = document.querySelector("#code-reader #qr-reader") as HTMLElement;

							const width = parent.offsetWidth - 20 * 2;

							if (width < 50) {
								return {};
							}

							return { width, height: width };
						},
					},

					(decodedText) => {
						const regex = /^[A-Za-z0-9]{6}$/;

						if (regex.test(decodedText)) {
							setInputPeerId(decodedText);
						} else {
							setModal("qrCodeError", true);
						}

						stopScanner();
						hideModal();
					},
					() => {}
				);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				console.error("Erreur lors du démarrage du scanner:", err);

				if (err.includes("NotAllowedError")) {
					hideModal();

					setModal("errorCamera", true);
					// setTimeout(() => {
					// 	alert("Erreur de droits d'accès à l'appreil photo !");
					// }, 100);
				}
			}
		}
	};

	useEffect(() => {
		startScanner();

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			stopScanner();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div id="code-reader" className="modal-container" onClick={handleOutClick}>
			<div className="modal only-exit">
				<button className="material-icons-round cross" onClick={hideModal}>
					disabled_by_default
				</button>

				<div id="qr-reader"></div>
			</div>
		</div>
	);
}
