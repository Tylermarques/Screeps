/**
 * Created by Tyler on 2016-12-13.
 */
var roleGuard = {
    run: function (creep) {
        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if (targets[0]) {
            //console.log(creep.rangedAttack(targets[0]));
                creep.rangedAttack(targets[1]);
                creep.moveTo(targets[0]);
                return;
        } else {
            if (creep.pos.findClosestByPath(FIND_MY_SPAWNS)) {
                creep.moveTo(creep.pos.findClosestByPath(FIND_MY_SPAWNS))
            } else {
                creep.moveTo(creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES));
            }
        }
        if (creep.room.name == creep.memory.home) {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByPath(exit));
        }

    }
}

module.exports = roleGuard;