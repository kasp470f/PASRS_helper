import { defineConfig } from "@rsbuild/core";
import path from "node:path";

console.log(path.resolve(__dirname, "src"));

export default defineConfig({
	plugins: [],

	output: {
		filenameHash: false,
		filename: {
			js: "[name].js",
			css: "styles/global.css",
		},
		distPath: {
			js: "",
			css: "",
		},
	},
	source: {
		define: {
			VERSION: JSON.stringify(require("./manifest.json").version),
		},
		entry: {
			main: "./src/main.ts",
			room: "./src/room.ts",
			psd_replay: "./src/psd_replay.ts",
		},
	},
	html: {
		inject: true,
	},
	tools: {
		htmlPlugin: false,
	},
});
