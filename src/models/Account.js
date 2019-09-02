'use strict';

module.exports = {
	Account(injection) {
		return {
			schemas: {
				type: 'object'
			},
			methods: {
				
			}
		};
	},
	AccountList(injection) {
		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'Account'}
			},
			methods: {
				
			}
		};
	}
};