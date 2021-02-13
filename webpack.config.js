const path = require("path");
const HWP = require("html-webpack-plugin");
module.exports = {
    entry: path.join(__dirname, "/src/index.js"),
    output: {
        filename: "bundle.[hash].js"
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        },
            {
                test: /\.(sa|sc|c)ss$/,
                use: ["style-loader", "css-loader"]
            }]
    },
    plugins: []
}