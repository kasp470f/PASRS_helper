import { defineConfig } from "@rsbuild/core";
import path from "node:path";

console.log(path.resolve(__dirname, "src"));

export default defineConfig({
	plugins: [],

	output: {
		filenameHash: false,
		filename: {
			js: "[name].js",
		},
		distPath: {
			js: "",
		},
	},
	source: {
		define: {
			VERSION: JSON.stringify(require("./manifest.json").version),
		},
		entry: {
			main: "./src/main.ts",
			room: "./src/room.ts",
			auto_replay: "./src/auto_replay.ts",
			psd_replay: "./src/psd_replay.ts",
		},
	},
	tools: {
		htmlPlugin: false,
	},
});
