import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	base: "/",
	build: {
		chunkSizeWarningLimit: 1024,
	},

	plugins: [react()],
	resolve: {
		alias: {
			src: "/src",
			components: "/src/components",
			views: "/src/views",
			assets: "/src/assets",
			utils: "/src/utils",
			services: "/src/services",
		},
	},

	define: {
		__APP_NAME__: JSON.stringify("ChatBouscule"),

		__CELL_COUNT__: 6,
		__LINE_WIDTH__: 3,
		__PADDING__: 0,
	},
});
