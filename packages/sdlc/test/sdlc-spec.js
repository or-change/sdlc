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

const store = require('@or-change/sdlc-store-memory')();

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

describe('Model Testing', () => {
	const store = {
		flow: null, project: null, versionList: [],
		traceList: []
	};

	before(async () => {
		store.project = await Model.Project.create({
			name: 'project-1',
			ownerId: '12',
			language: 'java',
			abstract: ''
		});

		store.flow = await Model.Flow.create({
			parentId: null,
			projectId: store.project.id,
			name: 'flow-1',
			stageList: [
				{
					name: 'stage-1',
					promoted: true,
					initializable: true,
					plugins: []
				},
				{
					name: 'stage-2',
					promoted: false,
					initializable: true,
					plugins: []
				},
				{
					name: 'stage-3',
					promoted: true,
					initializable: false,
					plugins: []
				}
			],
			evolution: [
				[true, true, false],
				[false, true, true],
				[false, false, true]
			]
		});
	});

	describe('Trace Testing', () => {
		async function createTrace({ parentId, flowId, stageId, versionId, abstract }) {
			const flow = await Model.Flow.query(flowId);
			const stage = flow.stageList[stageId];
			const trace = await Model.Trace.query(parentId);

			if (!stage.promoted && trace) {
				assert.ok(trace.versionId !== versionId, 'This stage is NOT allowed to promot version.');
			}

			if (!stage.initializable) {
				assert.ok(!trace.parentId, 'This stage is NOT allowed to initializable.');
			}

			if (trace) {
				assert.ok(flow.evolution[trace.stageId][stageId], 'This is NOT allowed to remove to this stage.');
			}

			const newTrace = await Model.Trace.create({ parentId, flowId, stageId, versionId, abstract });

			store.traceList.push(newTrace);
		}

		it('create trace init in stage-0', async () => {
			const version = await Model.Version.create({
				projectId: store.project.id,
				semver: '1.0.0',
				abstract: ''
			});

			store.versionList.push(version);

			await createTrace({
				parentId: null, flowId: store.flow.id,
				stageId: 0, versionId: version.id, abstract: ''
			});
		});

		it('promot verson in stage-0', async () => {
			await createTrace({
				parentId: store.traceList[store.traceList.length - 1].id, flowId: store.flow.id,
				stageId: 0, versionId: store.versionList[store.versionList.length - 1].id, abstract: ''
			});
		});

		it('move to next stage-1', async () => {
			await createTrace({
				parentId: null, flowId: store.flow.id,
				stageId: 1, versionId: store.versionList[store.versionList.length - 1].id, abstract: ''
			});
		});

		it('move to stage-2 and promot version', async () => {
			const version = await Model.Version.create({
				projectId: store.project.id,
				semver: '1.0.0',
				abstract: ''
			});

			store.versionList.push(version);

			const trace = await createTrace({
				parentId: store.traceList[store.traceList.length - 1].id, flowId: store.flow.id,
				stageId: 2, versionId: version.id, abstract: ''
			});

			store.traceList.push(trace);

			const traceList = await Model.TraceList.query({
				selector: 'flowId',
				args: {
					flowId: store.flow.id
				}
			});
		});
	});
});