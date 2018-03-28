var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('building');
        }
        var mostComplete;
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length != 0) {
            for (let i in targets) {
                if (mostComplete == undefined || targets[i].progress > mostComplete.progress) {
                    mostComplete = targets[i]
                }
                //console.log(most_complete)
                //console.log(most_complete.progress)
            }
        }
        if(creep.memory.building) {
                if(creep.build(mostComplete) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(mostComplete);
                    return;
                }
                return;
        }
        if (targets.length == 0) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            var energy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, 1 );
            if (energy) {
                if (creep.pickup(energy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energy)
                }
            }
            if (!energy) {
                var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => { return((s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0)}});
                if (source && creep.withdraw(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
                //console.log(source);
            }
            if (!energy) {
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                }
            }

        }
        //console.log(creep.name + " - " + creep.build(mostComplete) + " - " +mostComplete)
    }
};

module.exports = roleBuilder;