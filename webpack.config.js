const path = require('path');
const {argv: {env}} = require('yargs');

const {name: libraryName} = require('./package.json');

let outputFile = `${libraryName}.js`;

if (env === 'production') {
    outputFile = `${libraryName}.min.js`;
}

const config = {
    mode: env,
    entry: `${__dirname}/src/index.js`,
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
                exclude: /(node_modules)/,
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
};

module.exports = config;
