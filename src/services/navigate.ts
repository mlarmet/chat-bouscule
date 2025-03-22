import { NavigateFunction } from "react-router-dom";

let navigate: NavigateFunction | null = null;

export const setNavigate = (nav: NavigateFunction) => {
	navigate = nav;
};

export const navigateTo = (path: string) => {
	if (navigate) {
		const adjustedPath = path === "/" ? `${__BASE_URL__}` : path;

		navigate(adjustedPath);
	} else {
		console.error("Navigate function not initialized");
	}
};
