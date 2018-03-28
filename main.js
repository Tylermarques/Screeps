// TODO: Change container checker to check if FULL not if energy amount = capacity amount
//       Could have other stuff in it
// TODO: Long distance harvester, change to check ticks left, and time to get there and back for their source
var roleHarvester = require('role.harvester(new)');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var building = require('building');
var tower = require('tower');
var roleTowerFiller = require('role.towerFiller');
var roleLongDistanceHarvester = require('role.distanceHarvester');
var roleClaimer = require('role.claimer');
var roleSpawnBuilder = require('role.spawnBuilder');
var roleGuard = require('role.Guard');
var roleTruck = require('role.truck');
var roleRepairer = require('role.repairer');
var roleHealer = require('role.healer');
var roleMiner = require('role.miner');


module.exports.loop = function () {
    for (spawn in Game.spawns) {
        if (Game.spawns.length == 1) {
            spawn = Game.spawns.Spawn1
        }
        building.run(Game.spawns[spawn]);

        var towers = Game.spawns[spawn].room.find(FIND_STRUCTURES, {
            filter: {
                structureType: STRUCTURE_TOWER,
                my: true
            }
        });
        towers.forEach(tower.run);
    }
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];

            if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if (creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
            if (creep.memory.role == 'towerFiller') {
                roleTowerFiller.run(creep);
            }
            if (creep.memory.role == 'longDistanceHarvester') {
                roleLongDistanceHarvester.run(creep);
            }
            if (creep.memory.role == 'claimer') {
                roleClaimer.run(creep);
            }
            if (creep.memory.role == 'spawnBuilder') {
                roleSpawnBuilder.run(creep);
            }
            if (creep.memory.role == 'guard') {
                roleGuard.run(creep);
            }
            if (creep.memory.role == 'truck') {
                roleTruck.run(creep);
            }
            if (creep.memory.role == 'repairer') {
                roleRepairer.run(creep);
            }
            if (creep.memory.role == 'healer') {
                roleHealer.run(creep);
            }
            if (creep.memory.role == 'miner') {
                roleMiner.run(creep);
            }
        }
}