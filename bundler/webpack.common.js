const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const fs = require('fs')

const staticDir = path.resolve(__dirname, '../static')

const plugins = [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../src/index.html'),
        minify: true
    }),
    new MiniCssExtractPlugin()
]

if (fs.existsSync(staticDir) && fs.readdirSync(staticDir).length > 0) {
    plugins.unshift(new CopyWebpackPlugin({
        patterns: [{ from: staticDir }]
    }))
}

module.exports = {
    entry: path.resolve(__dirname, '../src/script.js'),
    output: {
        hashFunction: 'xxhash64',
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, '../dist')
    },
    devtool: 'source-map',
    plugins,
    module: {
        rules: [
            { test: /\.(html)$/, use: ['html-loader'] },
            { test: /\.js$/, exclude: /node_modules/, use: ['babel-loader'] },
            { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
            { test: /\.(jpg|png|gif|svg|ico)$/, type: 'asset/resource', generator: { filename: 'assets/images/[hash][ext]' } },
            { test: /\.(ttf|eot|woff|woff2)$/, type: 'asset/resource', generator: { filename: 'assets/fonts/[hash][ext]' } },
            { test: /\.(glsl|vs|fs|vert|frag)$/, exclude: /node_modules/, use: ['raw-loader'] },
            { test: /\.(gltf|glb)$/, type: 'asset/resource', generator: { filename: 'assets/models/[hash][ext]' } }
        ]
    }
}
