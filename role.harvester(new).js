/**
 * Created by Tyler on 2016-12-13.
 */
var roleHarvester = {
    run: function (creep) {
        if (creep.memory.harvesting === undefined) {
            creep.memory.harvesting = true;
        }
        if (!creep.memory.source_id || creep.memory.source_id === 0) {
            creep.memory.source_id = creep.pos.findClosestByPath(FIND_SOURCES).id
        }
        if (creep.memory.harvesting &&  creep.carry.energy === creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.say('Dropping')
        }
        if (!creep.memory.harvesting && creep.carry.energy === 0) {
            creep.memory.harvesting = true;
            creep.say('Harvesting');
        }
        if (creep.memory.harvesting) {
            let source = Game.getObjectById(creep.memory.source_id);
            console.log(source.pos);
            if (creep.harvest(source) < 0) {
                creep.say('moving');
                creep.moveTo(source)
            }
            return;
        }
        if (!creep.memory.harvesting) {
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (i) => {
                    return (
                        i.structureType === STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] < i.storeCapacity
                    )
                }
            });
            if (creep.transfer(container, RESOURCE_ENERGY) === OK) {
                creep.transfer(container, RESOURCE_ENERGY)
            } else {
                creep.drop(RESOURCE_ENERGY);
            }
        }
    }
};

module.exports = roleHarvester;