'use strict';

const { Normalizer, Validator } = require('@or-change/duck');

module.exports = Normalizer(
	{
		validate: Validator()
	}
);