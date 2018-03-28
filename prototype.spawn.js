/**
 * Created by Tyler on 2016-12-11.
 */
module.exports = function() {
    StructureSpawn.prototype.createWorkerCreep =
        function (energy, roleName, name) {
            let numberOfParts = Math.floor(energy / 200);
            var body = [];
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }

            return this.createCreep(body, name, {role: roleName, state: false})
        };
    StructureSpawn.prototype.createHarvester =
        function (energy, source) {
            let numberOfParts = Math.floor((energy -100) / 130);
            let body = [MOVE, CARRY];

            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
                if (i % 3 === 0) {
                    body.push(MOVE)
                }
            }

            return this.createCreep(body, 'harvester'+source.id, {role: 'harvester', state: false, source_id: source.id})
        };
};