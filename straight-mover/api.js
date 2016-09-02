/* global require, module */

var API = require('claudia-api-builder'),
	api = new API(),
	tankAI = require('./tank');

module.exports = api;

api.get('/', function () {
	'use strict';
	return 'OK';
});
api.get('/h/info', function () {
	'use strict';
	return {
		name: 'Horizontal Mover',
		owner: 'Gojko'
	};
});
api.post('/h/command', function (request) {
	'use strict';
	var map = request.body;
	return {
		command: tankAI(map, ['top', 'bottom'])
	};
});

api.get('/v/info', function () {
	'use strict';
	return {
		name: 'Vertical Mover',
		owner: 'Gojko'
	};
});
api.post('/v/command', function (request) {
	'use strict';
	var map = request.body;
	return {
		command: tankAI(map, ['right', 'left'])
	};
});


api.get('/r/info', function () {
	'use strict';
	return {
		name: 'Rectangular Mover',
		owner: 'Gojko'
	};
});
api.post('/r/command', function (request) {
	'use strict';
	var map = request.body;
	return {
		command: tankAI(map, [])
	};
});
