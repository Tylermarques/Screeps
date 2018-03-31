var roleJanitor = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.carry.energy < creep.carryCapacity) {
            var energy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1 );
            //console.log(energy)
            if (energy.length) {
                creep.say("Ya ya I'm getting it");
                if (creep.pickup(energy[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energy[0])
                }
            }
        }

        if(creep.memory.unloading && creep.carry.energy == 0) {
            creep.memory.unloading = false;
        }
        if(!creep.memory.unloading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.unloading = true;
        }
        if(!creep.memory.unloading) {
            var target = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => (i.structureType == STRUCTURE_CONTAINER ||
                    i.structureType == STRUCTURE_STORAGE) &&
                    i.store[RESOURCE_ENERGY] > 0
            });

            if(target && creep.withdraw(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target[0]);
            }
            else {
                var target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if(target && creep.harvest(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
        else {
            let tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES);
            if (tombstone) {
                if (creep.withdraw(tombstone, ))
            }
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION)
                        && structure.energy < structure.energyCapacity;}
            });
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleMiner;