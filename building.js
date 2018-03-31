require('prototype.spawn')();

// TODO: Prioritize spawning, ie, miner, truck, and harvester first
function getRandomFreePos(startPos, distance) {
    var x, y;
    do {
        x = startPos.x + Math.floor(Math.random() * (distance * 2 + 1)) - distance;
        y = startPos.y + Math.floor(Math.random() * (distance * 2 + 1)) - distance;
    }
    while ((x + y) % 2 != (startPos.x + startPos.y) % 2 || Game.map.getTerrainAt(x, y, startPos.roomName) == 'wall');
    return new RoomPosition(x, y, startPos.roomName);
}

function build(spawn, structureType) {
    var structures = spawn.room.find(FIND_STRUCTURES, {filter: {structureType, my: true}});
    for (var i = 0; i < CONTROLLER_STRUCTURES[structureType][spawn.room.controller.level] - structures.length; i++) {
        getRandomFreePos(spawn.pos, 5).createConstructionSite(structureType);
    }
}

function calcBodyCost(body) {
    return _.reduce(body, (sum, part) => sum + BODYPART_COST[part], 0);
}


exports.run = function (spawn) {

    //build(spawn, STRUCTURE_EXTENSION);
    build(spawn, STRUCTURE_TOWER);

    var roomBelow = "" + (spawn.room.name).split("")[0] + (spawn.room.name).split("")[1] + (spawn.room.name).split("")[2] + ((spawn.room.name).split("")[3] - 1);
    var roomAbove = "" + (spawn.room.name).split("")[0] + (spawn.room.name).split("")[1] + (spawn.room.name).split("")[2] + (Number((spawn.room.name).split("")[3]) + 1);
    var workerBody = [MOVE, WORK, CARRY], bodyIteration = [MOVE, WORK, CARRY];
    while (spawn.canCreateCreep(workerBody.concat(bodyIteration)) == OK) {
        workerBody = workerBody.concat(bodyIteration);
    }


    var harvesterBody = [MOVE, CARRY, WORK], bodyIteration2 = [WORK];
    while (spawn.canCreateCreep(harvesterBody.concat(bodyIteration2)) == OK) {
        harvesterBody = harvesterBody.concat(bodyIteration2);
        if (harvesterBody.length % 3 == 0) {
            harvesterBody = harvesterBody.concat([MOVE])
        }
    }

    // TODO: Do math on what the best proportions for the body are
    var longDistanceBody = [WORK, WORK, WORK, MOVE, MOVE, MOVE], longDistanceBodyIter = [MOVE, CARRY];
    while (spawn.canCreateCreep(longDistanceBody.concat(longDistanceBodyIter)) == OK) {
        longDistanceBody = longDistanceBody.concat(longDistanceBodyIter);
    }


    //console.log(spawn.canCreateCreep(harvesterBody));

    var truckBody = [MOVE, CARRY, WORK, WORK], bodyIteration3 = [MOVE, CARRY];
    while (spawn.canCreateCreep(truckBody.concat(bodyIteration3)) == OK) {
        truckBody = truckBody.concat(bodyIteration3);
    }

    var repairBody = [WORK, WORK], repairBodyIter = [MOVE, CARRY];
    while (spawn.canCreateCreep(repairBody.concat(repairBodyIter)) == OK) {
        repairBody = repairBody.concat(repairBodyIter);
    }

    var guardBody = [ATTACK, ATTACK, ATTACK, MOVE], guardBodyIt = [MOVE, TOUGH];
    while (spawn.canCreateCreep(guardBody.concat(guardBodyIt)) == OK) {
        guardBody = guardBody.concat(guardBodyIt);
    }
    var healerBody = [MOVE, MOVE, HEAL, HEAL];


    var maxHarvesters = 2;
    var maxUpgraders = 2;
    var maxBuilders = 4;
    var maxLDHarvesters = 4;
    var maxJanitors = 1;
    var maxTrucks = maxHarvesters + 1;
    var maxRepairers = 2

    let creepsInRoom = spawn.room.find(FIND_MY_CREEPS);
    var numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role == 'harvester');
    var numberOfTrucks = _.sum(creepsInRoom, (c) => c.memory.role == 'truck');
    var numberOfUpgraders = _.sum(creepsInRoom, (c) => c.memory.role == 'upgrader');
    var numberOfLDHarvesters = _.sum(creepsInRoom, (c) => c.memory.role == 'longDistanceHarvester');
    var numberOfJanitors = _.sum(creepsInRoom, (c) => c.memory.role == 'janitor');
    var numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role == 'builder');
    var numberOfRepairers = _.sum(creepsInRoom, (c) => c.memory.role == 'repairer');

    if (numberOfHarvesters !== 0 && numberOfTrucks === 0) {
        spawn.createCreep(truckBody, spawn.name + 't1', {role: 'truck'});
        return;
    }

    if (spawn.room.energyAvailable / spawn.room.energyCapacityAvailable > 0.50) {
        // Put in order of importance to colony survival
        if (spawn.pos.findClosestByRange(FIND_HOSTILE_CREEPS) != null) {

            spawn.createCreep(guardBody, spawn.name + 'Guard1', {
                role: 'guard',
                home: spawn.room.name,
                target: spawn.room.name,
            });
        } else if (numberOfHarvesters < maxHarvesters) {
            spawn.createCreep(harvesterBody, spawn.name + 'h1', {role: 'harvester'});
            spawn.createCreep(harvesterBody, spawn.name + 'h2', {role: 'harvester'});
        } else if (numberOfTrucks < maxTrucks) {
            spawn.createCreep(truckBody, spawn.name + 't1', {role: 'truck'});
            spawn.createCreep(truckBody, spawn.name + 't2', {role: 'truck'});
            spawn.createCreep(truckBody, spawn.name + 't3', {role: 'truck'});
            spawn.createCreep(truckBody, spawn.name + 't4', {role: 'truck'});
        } else if (numberOfUpgraders < maxUpgraders) {
            spawn.createCreep(workerBody, spawn.name + 'u1', {role: 'upgrader'});
            spawn.createCreep(workerBody, spawn.name + 'u2', {role: 'upgrader'});
            spawn.createCreep(workerBody, spawn.name + 'u3', {role: 'upgrader'});
            spawn.createCreep(workerBody, spawn.name + 'u4', {role: 'upgrader'});
            spawn.createCreep(workerBody, spawn.name + 'u5', {role: 'upgrader'});
        } else if (numberOfRepairers < maxRepairers) {
            spawn.createCreep(repairBody, spawn.name + 'r1', {role: 'repairer'});
            spawn.createCreep(repairBody, spawn.name + 'r2', {role: 'repairer'});
        } else if (numberOfLDHarvesters < maxLDHarvesters && spawn.room.energyAvailable / spawn.room.energyCapacityAvailable > 0.95) {

                spawn.createCreep(longDistanceBody, spawn.name + 'ld1', {
                    role: 'longDistanceHarvester',
                    home: spawn.room.name,
                    target: roomAbove,
                    sourceId: ''
                });
                spawn.createCreep(longDistanceBody, spawn.name + 'ld2', {
                    role: 'longDistanceHarvester',
                    home: spawn.room.name,
                    target: roomAbove,
                    sourceId: ''
                });
        } else if (spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
            spawn.createCreep(workerBody, spawn.name + 'b1', {role: 'builder'});
            spawn.createCreep(workerBody, spawn.name + 'b2', {role: 'builder'});
            spawn.createCreep(workerBody, spawn.name + 'b3', {role: 'builder'});
        }
        if (spawn.room.find(FIND_MY_CREEPS, {
                filter: (c) => {
                    return (c.hits / c.hitsMax < 1.0)
                }
            }).length > 0) {
            spawn.createCreep(healerBody, spawn.name + 'healer1', {role: 'healer'});

        }
    }
};