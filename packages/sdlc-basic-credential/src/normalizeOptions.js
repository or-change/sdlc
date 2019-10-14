'use strict';

const { Normalizer, Validator } = require('@or-change/duck');
const schema = require('./OptionsSchema.json');

function DEFAULT_TRANSFORM(password) {
	return password;
}

module.exports = Normalizer({
	handler: options => {
		const finalOptions = {
			async validate(credentials, transformedPassword) {
				return credentials === transformedPassword;
			},
			transform: DEFAULT_TRANSFORM
		};

		const {
			query: _query,
			update: _update,
			validate: _validate = finalOptions.validate,
			transform: _transform = finalOptions.transform
		} = options;

		finalOptions.query = _query;
		finalOptions.update = _update;
		finalOptions.validate = _validate;
		finalOptions.transform = _transform;

		return finalOptions;
	},
	validate: Validator(schema)
});