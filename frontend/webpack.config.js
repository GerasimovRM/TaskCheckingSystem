const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

const deps = require("./package.json").dependencies;
module.exports = {
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000, // Check for changes every second
    },
    mode: "development",
    output: {
        publicPath: "http://localhost:3000/",
    },

    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    },

    devServer: {
        port: 3000,
        historyApiFallback: true,
    },

    module: {
        rules: [
            {
                test: /\.m?js/,
                type: "javascript/auto",
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.(css|s[ac]ss)$/i,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
            {
                test: /\.(ts|tsx|js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                        },
                    },
                ],
            },
            {
                test: /\.(ts|tsx|js|jsx)$/,
                enforce: "pre",
                use: ["source-map-loader"],
            },
        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "host",
            filename: "remoteEntry.js",
            remotes: {
                'auth': 'auth@http://localhost:3340/remoteEntry.js',
                //'notifications': 'notifications@localhost:334/remoteEntry.js',
                //'chat': 'chat@http://localhost:3341/remoteEntry.js'
            },
            exposes: {},
            shared: {
                ...deps,
                react: {
                    singleton: true,
                    requiredVersion: deps.react,
                },
                "react-dom": {
                    singleton: true,
                    requiredVersion: deps["react-dom"],
                },
            },
        }),
        new HtmlWebPackPlugin({
            template: "./public/index.html",
        }),
        new Dotenv({path: "../.env"}),
        // new webpack.DefinePlugin({
        //     'process.env': JSON.stringify(process.env)
        // }),
    ],
};
