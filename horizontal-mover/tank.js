/*global module */
module.exports = function (map, turnOn) {
	'use strict';
	var wallAt = function (point) {
			return map.walls.find(function (wall) {
				return wall.x === point.x && wall.y === point.y;
			});
		},
		enemyAt = function (point) {
			return map.enemies.find(function (tank) {
				return tank.x === point.x && tank.y === point.y;
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
		hasTarget = function () {
			var distance, pointAtDistance;
			for (distance = 0; distance < map.weaponRange; distance++) {
				pointAtDistance = { x: tank.x + (distance + 1) * movement.x, y: tank.y + (distance + 1) * movement.y };
				if (wallAt(pointAtDistance) || enemyAt(pointAtDistance)) {
					return true;
				}
			}
			return false;
		},
		tank = map.you,
		movement = movements[tank.direction],
		nextField = { x: tank.x + movement.x, y: tank.y + movement.y };
	if (turnOn.indexOf(tank.direction) >= 0) {
		return 'turn-left';
	}
	if (outsideMap(nextField)) {
		return 'turn-left';
	}
	if (hasTarget()) {
		return 'fire';
	}
	return 'forward';
};


