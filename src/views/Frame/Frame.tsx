import { useEffect } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";

import ModalManager from "components/Modal/ModalManager";
import ModalProvider from "components/Modal/ModalProvider";

import Connection from "views/Connection/Connection";
import Home from "views/Home/Home";
import Landing from "views/Landing/Landing";

import { setNavigate } from "services/navigate";

import "./Frame.scss";

export default function Frame() {
	useEffect(() => {
		document.title = __APP_NAME__;
	}, []);

	return (
		<div id="frame" className="noselect">
			<Router basename={__BASE_URL__}>
				<ModalProvider>
					<ModalManager />
					<NavigatorSetter />

					<Routes>
						<Route path="/" element={<Landing />} />
						<Route path="/connection" element={<Connection />} />
						<Route path="/jeu" element={<Home />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</ModalProvider>
			</Router>
		</div>
	);
}

// A helper component to store the navigate function
const NavigatorSetter = () => {
	const navigate = useNavigate();

	useEffect(() => {
		setNavigate(navigate);
	}, [navigate]);

	return null;
};
