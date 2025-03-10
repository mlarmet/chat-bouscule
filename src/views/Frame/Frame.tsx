import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Home from "views/Home/Home";
import Landing from "views/Landing/Landing";

import "./Frame.scss";

export default function Frame() {
	return (
		<div id="frame" className="noselect">
			<Router>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="jeu" element={<Home />}></Route>
				</Routes>
			</Router>
		</div>
	);
}
