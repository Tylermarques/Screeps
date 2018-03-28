module.exports = {
    run: function(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        if(closestHostile) {
            tower.attack(closestHostile);
            return;
        }

        var walls = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => {
                return (
                    s.structureType == STRUCTURE_WALL && s.hits <= 10000
                )
            }
        });
        if (walls) {
            tower.repair(walls)
        }
    }
};