/* global require, module */

var API = require('claudia-api-builder'),
	api = new API();

module.exports = api;

api.get('/info', function () {
	'use strict';
	return {
		name: 'Fury',
		owner: 'Milan'
	};
});
api.post('/command', function (request) {
	'use strict';
	var map = request.body,
	result,
	wallAt = function (point) {
		return map.walls.find(function (wall) {
			return wall.x === point.x && wall.y === point.y;
		});
	},
	movements = {
		top: { x: 0, y: -1 },
		left: { x: -1, y: 0 },
		bottom: {x: 0, y: 1},
		right: {x: 1, y: 0}
	},
	outsideMap = function (point) {
		return point.x < 0 || point.x >= map.mapWidth || point.y < 0 || point.y >= map.mapHeight;
	},
	tank = map.you,
	opponent = (map.enemies && map.enemies[0]) || {},
	movement = movements[tank.direction],
	opMovement = opponent.direction && movements[opponent.direction],
	nextField = { x: tank.x + movement.x, y: tank.y + movement.y },
	nextFieldOpponent = opMovement && { x: opponent.x + opMovement.x, y: opponent.y + opMovement.y },
	nextFieldOpponent2 = opMovement && { x: opponent.x + 2 * opMovement.x, y: opponent.y + 2 * opMovement.y },
	nextFieldOpponent3 = opMovement && { x: opponent.x + 3 * opMovement.x, y: opponent.y + 3 * opMovement.y },
	nextFieldOpponent4 = opMovement && { x: opponent.x + 4 * opMovement.x, y: opponent.y + 4 * opMovement.y },
	hasTarget = function (firingTank, targetPoint, maxDistance) {
		var distance, pointAtDistance,
			firingTankMovement = movements[firingTank.direction];
		if (!targetPoint || !targetPoint.x || !firingTank.y) {
			return false;
		}
		for (distance = 0; distance < (maxDistance || map.weaponRange); distance++) {
			pointAtDistance = { x: firingTank.x + (distance + 1) * firingTankMovement.x, y: firingTank.y + (distance + 1) * firingTankMovement.y };
			if (targetPoint.x == pointAtDistance.x && targetPoint.y == pointAtDistance.y) {
				return true;
			}
		}
		return false;
	},
	getChasingAxis = function () {
		var vertical, horizontal, vd, hd;
		if (!opponent.x) {
			return false;
		}
		vertical = (tank.y < opponent.y) ? 'top' : 'bottom';
		horizontal = (tank.x < opponent.x) ? 'left' : 'right';
		vd = Math.abs(tank.y - opponent.y);
		hd = Math.abs(tank.x - opponent.x);
		if (hd < vd) {
			return horizontal;
		} else {
			return vertical;
		}
	},
	closeToBorder = function () {
		return outsideMap({x: tank.x +  2 * movement.x, y: tank.y +  2 * movement.y});
	},
	chasingAxis = getChasingAxis();

	if (hasTarget(tank, opponent) || hasTarget(tank, nextFieldOpponent) || hasTarget(tank, nextFieldOpponent2) || hasTarget(tank, nextFieldOpponent3)  || hasTarget(tank, nextFieldOpponent4)) {
		result = 'fire';
	} else if (chasingAxis === tank.direction) {
		if (wallAt(nextField)) {
			return 'fire';
		} else if (outsideMap(nextField)) {
			result = 'turn-left';
		} else if (hasTarget(opponent, nextField, 1)) {
			result = 'pass';
		} else {
			result = 'forward';
		}
	} else if (chasingAxis || closeToBorder() || wallAt(nextField) || outsideMap(nextField)) {
		result = 'turn-left';
	} else {
		result = 'forward';
	}
	return {
		command: result
	};
});

