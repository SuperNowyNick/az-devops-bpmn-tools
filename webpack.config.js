const path = require("path");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Webpack entry points. Mapping from resulting bundle name to the source file entry.
const entries = {};

// Loop through subfolders in the "Samples" folder and add an entry for each one
const samplesDir = path.join(__dirname, "src/");
fs.readdirSync(samplesDir).filter(dir => {
    if (fs.statSync(path.join(samplesDir, dir)).isDirectory()) {
        entries[dir] = "./" + path.relative(process.cwd(), path.join(samplesDir, dir, dir));
    }
});

module.exports = {
    devtool: "inline-source-map",
    devServer: {
        watchFiles: ["./dist/*"], // string [string] object [object]
        https: true,
        port: 3000,
    },
    entry: entries,
    output: {
        filename: "[name]/[name].js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            "azure-devops-extension-sdk": path.resolve("node_modules/azure-devops-extension-sdk")
        },
    },
    stats: {
        warnings: false
    },
    module: {
        rules: [
            {
                test: /\.bpmn$/,
                loader: "raw-loader"
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
              test: /\.css$/i,
              use: ["style-loader", "css-loader"],
            },
            {
              test: /\.scss$/,
              exclude: /\.module\.scss$/,
              use: [ 
                { loader: "style-loader" },
                { loader: "css-loader" },
                { loader: "sass-loader" },
                { loader: "azure-devops-ui/buildScripts/css-variables-loader" }
               ],
            },
            {
              test: /\.module\.scss$/,
              use: [ 
                { loader: "style-loader" },
                { loader: "css-modules-typescript-loader"},
                { loader: "css-loader", options: { modules: true } },
                { loader: "sass-loader" }
               ],
            },
            {
                test: /\.woff2?$/i,
                type: 'asset/resource',
                dependency: { not: ['url'] },
            },
            {
                test: /\.html$/,
                loader: "file-loader"
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
           patterns: [ 
               { from: "**/*.html", context: "src/" }
           ]
        })
    ]
};