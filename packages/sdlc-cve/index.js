'use strict';

const path = require('path');
const meta = require('./package.json');
const Duck = require('@or-change/duck');
const DuckDatahub = require('@or-change/duck-datahub');
const models = require('./src/models');

const APP_ID  = 'com.orchange.sdlc.cve';

module.exports = function SDLCCve(store = {}) {
	const cve = {
		id: APP_ID,
		ame: meta.name,
		version: meta.version,
		description: meta.description,
		entry: path.join(__dirname, './app/index.js')
	};

	Duck({
		id: APP_ID,
		name: 'cve',
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
	}, ({ Model }) => {
	});

	return cve;
};