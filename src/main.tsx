// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Frame from "./views/Frame/Frame";

import "./index.scss";

createRoot(document.getElementById("root")!).render(
	// <StrictMode>
	<Frame />
	// </StrictMode>
);
