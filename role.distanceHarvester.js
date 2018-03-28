/**
 * Created by Tyler on 2016-12-11.
 */

var roleTruck = require('role.truck');

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            var energy = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1 );
            if (energy.length) {
                if (creep.pickup(energy[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energy[0]);
                    return;
                }
            }
        }
        if(creep.memory.unloading && creep.carry.energy == 0) {
            creep.memory.unloading = false;
            creep.say('harvesting');
        }
        if(!creep.memory.unloading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.unloading = true;
            creep.say('unloading');
        }
        if(!creep.memory.unloading) {
            if (creep.room.name == creep.memory.home) {
                let exit = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByPath(exit));
            } else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
        else {
            if (creep.room.name == creep.memory.target) {
                creep.moveTo(Game.spawns.Spawn1);
            } else {

                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                        return (((structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity) ||
                        (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER)&& structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
                        }
                });
            }
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            if (target == undefined) {
                if (creep.room.name == creep.memory.home) {
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);

                    }
                } else {
                    creep.moveTo(Game.spawns.Spawn1)
                }
            }
        }
    }
};
