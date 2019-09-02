'use strict';

module.exports = {
	Project(injection) {
		return {
			schemas: {
				type: 'object'
			},
			methods: {
				
			}
		};
	},
	ProjectList(injection) {
		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'Project'}
			},
			methods: {
				
			}
		};
	},
	Member(injection) {
		return {
			schemas: {
				type: 'object'
			},
			methods: {
				
			}
		};
	}
};