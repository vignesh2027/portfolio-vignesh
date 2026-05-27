const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const { DefinePlugin } = require('webpack')

module.exports = merge(commonConfiguration, {
    mode: 'development',
    devServer: {
        host: 'localhost',
        port: 8080,
        open: true,
        client: { overlay: true }
    },
    plugins: [
        new DefinePlugin({ DEVELOPMENT: JSON.stringify(true) })
    ]
})
