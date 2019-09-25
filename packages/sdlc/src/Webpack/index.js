'use strict';

const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const BABEL_OPTIONS = {
	presets: [
		[
			'@babel/env',
			{
				targets: {
					ie: '9'
				}
			},
		],
	],
	plugins: [
		'@babel/transform-runtime'
	],
	sourceType: 'unambiguous'
};

const POSTCSS_OPTIONS = {
	loader: 'postcss-loader',
	options: {
		plugins: {
			autoprefixer: {
				cascade: false
			}
		}
	}
};

module.exports = function ({ Plugin }, options) {
	return {
		entry: {
			bundle: [
				'@babel/polyfill/dist/polyfill.min.js'
			].concat(Plugin.entrys).concat([
				path.resolve(__dirname, '../../app/Native'),
				path.resolve(__dirname, '../../app/index.js')
			])
		},
		output: {
			filename: '[name].js',
			path: path.resolve('output'),
			publicPath: '/'
		},
		target: 'web',
		resolve: {
			extensions: ['.js', '.vue'],
			alias: {
				'sdlc-product-factory': options.app.extend ?
					options.app.extend : path.join(__dirname, 'modules/DefaultFactory.js'),
				'sdlc': path.join(__dirname, './modules/SDLC')
			}
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					options: {
						loaders: {
							scss: 'style-loader!css-loader!sass-loader'
						}
					}
				},
				{
					test: /\.js$/,
					exclude(file) {
						return /node_module/.test(file) && !/@or-change/.test(file);
					},
					use: {
						loader: 'babel-loader',
						options: BABEL_OPTIONS
					}
				},
				{
					test: /\.(png|jpg|svg|gif|jpeg)$/,
					loader: 'url-loader',
					options: {
						limit: 10000,
						outputPath: 'images/'
					}
				},
				{
					test: /\.(eot|woff|woff2|svg|ttf)$/,
					loader: 'file-loader'
				},
				{
					test: /\.scss$/,
					use: [
						'vue-style-loader',
						'css-loader',
						POSTCSS_OPTIONS,
						'sass-loader'
					]
				},
				{
					test: /\.css$/,
					use: [
						'vue-style-loader',
						'css-loader',
						POSTCSS_OPTIONS
					]
				},
				{
					test: /\.yaml$/,
					loader: 'json-loader!yaml-loader',
				}
			]
		},
		plugins: [
			new VueLoaderPlugin()
		],
		optimization: {
			splitChunks: {
				name: true,
				cacheGroups: {
					commons: {
						test: /node_modules/,
						name: 'vendors',
						chunks: 'all'
					}
				},
			}
		},
		node: false
	};
};