import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/

const baseUrl = "/chat-bouscule";

export default defineConfig({
	base: baseUrl,
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
		__BASE_URL__: JSON.stringify(baseUrl),
		__APP_NAME__: JSON.stringify("ChatBouscule"),
	},
});
