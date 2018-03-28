/**
 * Created by Tyler on 2016-12-16.
 */
var roleHealer = {
    run: function(creep) {
        var hurtCreep = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
            filter: (c) => {
                return (
                    c.hits < c.hitsMax
                )
            }
        });
        if (hurtCreep) {
            if(creep.heal(hurtCreep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(hurtCreep);
            }
        }
    }
};

module.exports = roleHealer;