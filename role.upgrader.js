var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            var energy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, 1);
            if (energy) {
                if (creep.pickup(energy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energy)
                }
            }
            if (!energy) {
                source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => {
                        return (
                            (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE)
                            && s.store[RESOURCE_ENERGY] / s.storeCapacity > 0.25
                        )
                    }
                });
                if (source && creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
                if (!source) {
                    source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                    if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            }
        }
    }
};

module.exports = roleUpgrader;