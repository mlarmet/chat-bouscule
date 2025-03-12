import { useEffect } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Home from "views/Home/Home";
import Landing from "views/Landing/Landing";

import "./Frame.scss";

export default function Frame() {
	useEffect(() => {
		document.title = __APP_NAME__;
	}, []);

	return (
		<div id="frame" className="noselect">
			<Router basename={__BASE_URL__}>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="jeu" element={<Home />}></Route>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</Router>
		</div>
	);
}
