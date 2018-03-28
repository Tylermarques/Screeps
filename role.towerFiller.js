/**
 * Created by Tyler on 2016-12-11.
 */
var roleTruck = require('role.truck');
module.exports = {

    run: function(creep) {

        if (creep.memory.unloading && creep.carry.energy == 0) {
            creep.memory.unloading = false;
            creep.say('harvesting');
        }
        if (!creep.memory.unloading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.unloading = true;
            creep.say('unloading');
        }
        if (!creep.memory.unloading) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
            if(!source) {
                source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                        (structure.structureType == STRUCTURE_STORAGE ||
                        structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.energy > 0)
                    }
                })
            }
        }
        else {
            var tower = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) && structure.energy < (structure.energyCapacity);
                }
            });
            if (!tower) {
                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_CONTAINER
                            && structure.energy < structure.energyCapacity);
                    }
                });
            } else {
                var target = tower;
            }
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};