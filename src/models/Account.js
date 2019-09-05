'use strict';

module.exports = {
	Account(store) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					name: { type: 'string' },
					password: { type: 'string' },
					administrator: { type: 'boolean'},
					createdAt: { type: 'date'}
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
	AccountList(store) {
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