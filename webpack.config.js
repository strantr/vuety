module.exports = {
    entry: {
        dist: "./src/index.ts"
    },
    output: {
        path: "./dist",
        filename: "bundle.js",
        libraryTarget: "commonjs2"
    },
    externals: {
        vue: "vue"
    },
    resolve: {
        extensions: [".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader"
            }
        ]
    },
}