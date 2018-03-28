/**
 * Created by Tyler on 2016-12-02.
 */
var roleBuilder = require('role.builder');

var roleTruck = {

    run:function(creep) {
        if(creep.memory.retreiving && creep.carry.energy == creep.carryCapacity) {
            creep.memory.retreiving = false;
        }
        if(!creep.memory.retreiving && creep.carry.energy == 0) {
            creep.memory.retreiving = true;
            creep.say('Collecting dropped resource');
        }
        if(creep.memory.retreiving) {
            var tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES)
            if (tombstone !== null) {
                if (creep.pickup(tombstone) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tombstone)
                }
            }
            var energy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, 1 );
            if (energy !== null) {
                if (creep.pickup(energy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energy)
                    
                }
            }
            if(!energy) {
                energy = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (i) => {
                        return(i.structureType == STRUCTURE_CONTAINER && (i.store[RESOURCE_ENERGY] > 0))
                    }
                });

                if (creep.withdraw(energy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energy);
                }
            }

        }
        if (!creep.memory.retreiving) {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity
                    )
                }
            });
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target)
            }
            if (!target) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity
                        )
                    }
                });
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }

            }
            if (!target) {
                roleBuilder.run(creep);
            }

        }
    }
};

module.exports = roleTruck;