const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const config = require('../config.json');
const { webpack: base } = require('../index');

module.exports = merge(base, {
	mode: 'development',
	devtool: '#inline-source-map',
	devServer: {
		host: '0.0.0.0',
		proxy: {
			'/api': `http://localhost:${config.server.port}`
		},
		port: config.devServer.port
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: path.resolve(__dirname, './index.html'),
			inject: 'head'
		})
	]
});