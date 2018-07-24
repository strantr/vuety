const path = require("path");
module.exports = {
	mode: "production",
	entry: {
		dist: "./src/index.ts",
	},
	output: {
		path: path.resolve("./dist"),
		filename: "bundle.js",
		libraryTarget: "commonjs2",
	},
	externals: {
		vue: "vue",
	},
	resolve: {
		extensions: [".ts"],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: "ts-loader",
			},
		],
	},
};
