'use strict';

const assert = require('assert');

const Datahub = require('@or-change/data-hub');
const models = [
	require('../src/models/Account'),
	require('../src/models/Project'),
	require('../src/models/Version'),
	require('../src/models/Flow'),  
	require('../src/models/Trace')
].reduce((all, group) => Object.assign(all, group), {});
const store = require('../example/persistence')();

const PersistenceTest = require('../src/PersistenceTest');

const Model = Datahub.create({
	id: 'test',
	models: (() => {
		const modelOptions = {};

		for (let key in models) {
			modelOptions[key] = Object.assign({}, models[key](store), {
				symbol: key
			});
		}

		return modelOptions;
	})()
}).model;

describe('Testing', () => {
	PersistenceTest(store);

	describe('Model Testing', () => {
		describe('Account Testing', () => {
			it('test', () => {
				assert.ok();
			});
		});

		describe('AccountList Testing', () => {

		});

		describe('Project Testing', () => {

		});

		describe('ProjectList Testing', () => {

		});

		describe('Version Testing', () => {

		});

		describe('VersionList Testing', () => {

		});

		describe('Member Testing', () => {

		});

		describe('MemberList Testing', () => {

		});

		describe('Flow Testing', () => {

		});

		describe('FlowList Testing', () => {

		});

		describe('Trace Testing', () => {

		});

		describe('TraceList Testing', () => {

		});
	});
});