/**
 * Created by Tyler on 2016-12-13.
 */
var roleClaimer = {

    run: function (creep) {

        if (creep.room.name == creep.memory.home) {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByPath(exit));
        } else {
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller)
            }
        }
    }
}

module.exports = roleClaimer;


