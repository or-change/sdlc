'use strict';

const path = require('path');
const nodemailer = require('nodemailer');
const Duck = require('@or-change/duck');
const DuckDatahub = require('@or-change/duck-datahub');
const models = require('./src/models');
const Router = require('./src/router');

const APP_ID  = 'com.orchange.sdlc.poster';
const meta = require('./package.json');

module.exports = function posterPlugin(store, options) {
	const poster = {
		entry: path.join(__dirname, './app/index.js')
	};

	Duck({
		id: APP_ID,
		name: 'poster',
		version: meta.version,
		description: meta.description,
		components: [
			DuckDatahub([
				{
					id: APP_ID,
					models
				}
			])
		],
		installed({ Datahub, injection }) {
			injection.Model = Datahub(APP_ID, store).model;
		}
	}, ({ product, Model }) => {
		poster.id = product.meta.id;
		poster.name = product.meta.name;
		poster.description = product.meta.description;
		poster.routers = {
			Principal: (router, context) => {
				const { Validator } = context;

				Router(router, Validator, Model);
			}
		};
	});
	
	poster.install = (injection) => {
		const { channel, Model } = injection;
		// const sender = {
		// 	email(transportOptions, mailOptions) {
		// 		const transporter = nodemailer.createTransport(transportOptions);

		// 		return {
		// 			send() {
		// 				return transporter.sendMail(mailOptions, (error, info) => {
		// 					if (error) {
		// 						return console.log(error);
		// 					}

		// 					return console.log(info.response);
		// 				});
		// 			}
		// 		};
		// 	}
		// };
		// const transporter = nodemailer.createTransport(transportOptions);

		Object.keys(channel.list).forEach(channelName => {
			channel.on(channelName, function (a) {
				// transporter.sendMail({
				// from: transportOptions.auth.user,
				// to: '',
				// subject: '',
				// text: ''
				// html: ''
				//}, (error, info) => {
				// if (error) {
				// 	return console.log(error);
				// }

				// console.log(info.response);
				//}) // html or text choose one
				console.log(a);
			});
		});
	};
	
	return poster;
};