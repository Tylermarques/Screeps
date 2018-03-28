/**
 * Created by Tyler on 2016-12-13.
 */
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.room.name == creep.memory.target) {
            if (creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
                creep.say('harvesting');
            }
            if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
                creep.say('building');
            }

            if (creep.memory.building) {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN)
                    }
                });
                if (targets.length) {
                    var most_complete;
                    for (let i in targets) {
                        if (targets[i].progress > most_complete || most_complete == undefined) {
                            most_complete = targets[i]
                        }
                        //console.log(most_complete)
                        //console.log(most_complete.progress)
                    }
                    if (creep.build(most_complete) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(most_complete);
                    }
                }
            }
            else {
                var source = creep.room.find(FIND_STRUCTURES, {
                    filter: (i) => (i.structureType == STRUCTURE_CONTAINER ||
                    i.structureType == STRUCTURE_STORAGE) &&
                    i.store[RESOURCE_ENERGY] > 0
                });

                if (source && creep.withdraw(source[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source[0]);
                }
                if (source == undefined || source == "") {
                    var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                    if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            }
        } else {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByPath(exit));
        }
    }
};

module.exports = roleBuilder;
