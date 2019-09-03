'use strict';

module.exports = {
	Account(injection) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					name: { type: 'string' },
					password: { type: 'string' },
					administrator: { type: 'boolean'}
				},
				allowNull: []
			},
			methods: {
				async create() {

				},
				async update() {

				},
				async query() {

				},
				async delete() {

				}
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
				async query() {

				}
			}
		};
	}
};