const {optimize: {UglifyJsPlugin}} = require('webpack');
const path = require('path');
const {argv: {env}} = require('yargs');

const {name: libraryName} = require('./package.json');

let outputFile = `${libraryName}.js`;
let plugins = [];

if (env === 'prod') {
    plugins = [
        ...plugins,
        new UglifyJsPlugin({
            minimize: true,
        }),
    ];
    outputFile = `${libraryName}.min.js`;
}

const config = {
    entry: `${__dirname}/src/index.js`,
    devtool: 'source-map',
    output: {
        path: `${__dirname}/lib`,
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
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
                options: {
                    configFile: '.eslintrc.json',
                },
            },
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
    plugins,
};

module.exports = config;
