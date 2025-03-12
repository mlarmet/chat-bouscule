import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import "@fortawesome/fontawesome-svg-core/styles.css";

import Frame from "./views/Frame/Frame";

import "./index.scss";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Frame />
	</StrictMode>
);
