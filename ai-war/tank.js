var API = require('claudia-api-builder'),
	api = new API();

	module.exports = api;

	api.get('/info', function () {
		'use strict';
		return {
			name: 'AI-WAR',
			owner: 'AI-WARRIORS'
		};
	});
	api.post('/command', function (request) {
		'use strict';
		console.log('');
		var map = request.body;
		return {
			command: decide(map)
		};
	});



var decide = function (map) {
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
		meAt = function (point) {
			return tank.x === point.x && tank.y === point.y;
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
		hasTarget = function (maxDistance) {
			var distance, pointAtDistance;
			maxDistance = maxDistance || map.weaponRange;
			for (distance = 0; distance < maxDistance; distance++) {
				pointAtDistance = { x: tank.x + (distance + 1) * movement.x, y: tank.y + (distance + 1) * movement.y };
				if (wallAt(pointAtDistance) || enemyAt(pointAtDistance)) {
					return true;
				}
			}
			return false;
		},
		enemyLocked = function (maxDistance) {
			var distance, pointAtDistance;
			maxDistance = maxDistance || map.visibility;
			for (distance = 0; distance < maxDistance; distance++) {
				pointAtDistance = { x: tank.x + (distance + 1) * movement.x, y: tank.y + (distance + 1) * movement.y };
				if (enemyAt(pointAtDistance)) {
					return true;
				}
			}
			return false;
		},
		lockedByEnemy = function (maxDistance) {
			var distance, pointAtDistance;
			maxDistance = maxDistance || map.weaponRange;
			for (distance = 0; distance < maxDistance; distance++) {
				pointAtDistance = { x: enemy.x + (distance + 1) * enemyMovement.x, y: enemy.y + (distance + 1) * enemyMovement.y };
				if (meAt(pointAtDistance)) {
					return true;
				}
			}
			return false;
		},
		tank = map.you,
		enemy = map.enemies[0],
		centerOfMap  = {x: parseInt(map.mapWidth/2), y: parseInt(map.mapHeight/2)},
		movement = movements[tank.direction],
		enemyMovement = movements[enemy.direction],
		nextField = { x: tank.x + movement.x, y: tank.y + movement.y },
		inWhichDirectionIsPoint = function(point) {
			var result = [];
			if (tank.x < point.x) {
				result.push('right');
			}
			if (tank.x > point.x) {
				result.push('left');
			}
			if (tank.y < point.y) {
				result.push('bottom');
			}
			if (tank.y > point.y) {
				result.push('top');
			}
			return result;
		},
		amIWellOriented = function(point) {
			var directionOfPoint = inWhichDirectionIsPoint(point);
			if (directionOfPoint.indexOf('right') != -1 && tank.direction == 'right') {
				return true;
			}
			if (directionOfPoint.indexOf('left') != -1 && tank.direction == 'left') {
				return true;
			}
			if (directionOfPoint.indexOf('bottom') != -1 && tank.direction == 'bottom') {
				return true;
			}
			if (directionOfPoint.indexOf('top') != -1 && tank.direction == 'top') {
				return true;
			}
			return false;
		},
		orientTo = function(point) {
			if (amIWellOriented(point)) {
				return null;
			}
			var directionOfPoint = inWhichDirectionIsPoint(point);
			if ((tank.direction == 'top' && directionOfPoint.indexOf('right') != -1) ||
				(tank.direction == 'right' && directionOfPoint.indexOf('bottom') != -1) ||
				(tank.direction == 'bottom' && directionOfPoint.indexOf('left') != -1) ||
				(tank.direction == 'left' && directionOfPoint.indexOf('top') != -1)) {
				return action('turn-right');
			}
			return action('turn-left');
		},
		moveTo = function(point) {
			if (tank.x == point.x && tank.y == point.y) {
				return action('fire');
			}
			if (!amIWellOriented(point)) {
				var orientResult = orientTo(point);
				if (orientResult) return orientResult;
			}
			return action('forward');
		},
		sameLine = function() {
			if (enemy.x == tank.x || enemy.y == tank.y) {
				return true;
			}
			return false;
		},
		runFromLineOfFire = function() {
			return action('forward');
		},
		turnTowardsEnemy = function() {
			return orientTo(enemy);
		},
		turnedAwayFromEnemy = function() {
			return !amIWellOriented(enemy);
		},
		xDistanceFromEnemy = function() {
			return Math.abs(tank.x - enemy.x);	
		},
		yDistanceFromEnemy = function() {
			return Math.abs(tank.y - enemy.y);	
		},
        nonCombatTurn = function(){
			if (hasTarget(1)) {
				console.log('TIME TO DIG')
				return action('fire');
			}
			console.log('ONE SMALL STEP FOR BOT')
			return moveTo(centerOfMap);
        },
        combatTurn = function(){
        	if(sameLine())
        	{
        		console.log('ENEMY IN LINE')
        		if(enemyLocked())
        		{
        			console.log('ENEMY LOCKED')
					return action('fire');
        		}
        		else
        		{//enemy not locked
        			if(lockedByEnemy())
        			{
        				console.log('LOCKED BY ENEMY, RETREATING')
        				return runFromLineOfFire();
        			}
        			else
        			{//nobody locked anyone
        				console.log('TURNING TOWARDS ENEMY')
        				return turnTowardsEnemy();
        				//TODO
        				//Consider running away if we are turned opposite side from him
        			}
        		}
        	}
        	else
        	{//not same line
        		console.log('ENEMY NOT IN LINE')
        		if(turnedAwayFromEnemy())
        		{
    				console.log('TURNING TOWARDS ENEMY')
        			return turnTowardsEnemy();
        		}
        		else
        		{//turned towards enemy
        			if(xDistanceFromEnemy()>1 && yDistanceFromEnemy()>1)
        			{
        				console.log('MOVING IN TO ENGAGE')
						if (hasTarget(1)) {
							console.log('TIME TO DIG')
							return action('fire');
						}
						return action('forward');
        			}
        			else
        			{
						if (closeToCenter()) {
							console.log('STALEMATE, FIRE AT WILL')
							if(xDistanceFromEnemy()==1 && yDistanceFromEnemy()==1)
							{
								//TODO
								return action('fire');
							}
							else if(xDistanceFromEnemy()==1)
							{
								//TODO
								return action('fire');
							}
							else
							{
								//TODOa
								// var random = Math.random() < 0.1;
								// if (random) {
								// 	// return nonCombatTurn();
								// }
								return action('fire');
							}
						} else {
							console.log('IGNORING ENEMY')
							return nonCombatTurn();
						}
        			}
        		}
        	}

        },
		enemyAtSight = function() {
			if (typeof enemy.direction != 'undefined') {
				return true;
			}
			return false;
		},
		closeToCenter = function() {
			var range = map.weaponRange + 1;
			return Math.abs(tank.x - centerOfMap.x) < range && Math.abs(tank.y - centerOfMap.y) < range;
		},
		action = function(cmd) {
			console.log(cmd)
			return cmd;
		}







	if (map.suddenDeath <= 10) {
		console.log('SUDDEN DEATH!')
								var random = Math.random() < 0.5;
								if (!closeToCenter() || random) {
									console.log('PANIC!')
									return nonCombatTurn();
								}
	}

    if (enemyAtSight()/* && closeToCenter()*/) {
    	console.log('ENEMY IN SIGHT!')
    	return combatTurn();

    }

    console.log('CHILL OUT')
	return nonCombatTurn();
};


