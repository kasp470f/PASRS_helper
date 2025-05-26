import { defineConfig } from "@rsbuild/core";
import { pluginReact } from '@rsbuild/plugin-react';

import path from "node:path";

console.log(path.resolve(__dirname, "src"));

export default defineConfig({
	plugins: [pluginReact()],

	output: {
		filenameHash: false,
		distPath: {
			js: "",
			css: "",
			root: "dist"
		},
	},
	source: {
		define: {
			VERSION: JSON.stringify(require("./manifest.json").version),
		},
		entry: {
			extension: "./src/extension/index.ts",
			showdown: "./src/showdown/index.ts",
			react: "./src/index.tsx",
		},
	},
	tools: {
		htmlPlugin: false,
	},
});