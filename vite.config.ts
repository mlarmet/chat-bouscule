import react from "@vitejs/plugin-react";

import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/

const baseUrl = "/chat-bouscule";

export default defineConfig({
	base: baseUrl,
	build: {
		chunkSizeWarningLimit: 1024,
	},

	server: {
		host: true,
	},

	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: false,
			workbox: {
				globPatterns: ["**/*.{js,css,html,svg,ico,png,jpg,mp3}"],
				// Cache google fonts
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
						handler: "NetworkFirst",
						options: {
							cacheName: "google-fonts-cache",
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
				],
			},
		}),
	],
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
