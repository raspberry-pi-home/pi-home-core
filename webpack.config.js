/* global __dirname, require, module*/

const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env;

const pkg = require('./package.json');

const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

let libraryName = pkg.name;
let outputFile = `${libraryName}.js`;
let plugins = [];

if (env === 'build') {
    plugins.push(new UglifyJsPlugin({
        minimize: true,
    }));
    outputFile = `${libraryName}.min.js`;
}

const config = {
    entry: __dirname + '/src/index.js',
    devtool: 'source-map',
    output: {
        path: __dirname + '/lib',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
            },
            // {
            //     test: /\.js$/,
            //     loader: 'eslint-loader',
            //     exclude: /node_modules/,
            //     options: {
            //         configFile: '.eslintrc.json',
            //     },
            // },
        ],
    },
    resolve: {
        modules: [
            path.resolve('./node_modules'),
            path.resolve('./src'),
        ],
        extensions: [
            '.json',
            '.js',
        ],
    },
    plugins: plugins,
};

module.exports = config;
