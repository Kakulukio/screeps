const LIGHT_WORKER_BODY = [WORK, CARRY, MOVE];
const LIGHT_HARVESTER = {
    body: LIGHT_WORKER_BODY,
    name: null,
    memory: { role: 'harvester' }
};
const LIGHT_BUILDER = {
    body: LIGHT_WORKER_BODY,
    name: null,
    memory: { role: 'builder' }
};
const LIGHT_UPGRADER = {
    body: LIGHT_WORKER_BODY,
    name: null,
    memory: { role: 'upgrader' }
};

let spawner = {

    checkCreeps: function(){

        let harvesters = 0;
        let upgraders = 0;
        let builders = 0;

        for(let name in Game.creeps) {
            let creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                harvesters++;
            } else if(creep.memory.role == 'upgrader') {
                upgraders++;
            } else if(creep.memory.role == 'builder') {
                builders++;
            }
        }


        for(let i in Game.spawns) {
            let spawner = Game.spawns[i];
            if(spawner.spawning){
                let spawningCreep = Game.creeps[spawner.spawning.name];
                spawner.room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    spawner.pos.x + 1,
                    spawner.pos.y,
                    {align: 'left', opacity: 0.8});
            }
            if(harvesters < 2){
                //Game.spawns[i].createCreep([WORK, CARRY, MOVE], null, {role: 'harvester'});
                this.spawn(spawner, LIGHT_HARVESTER);
                harvesters++;
                continue;
            }
            if(upgraders < 1){
                //Game.spawns[i].createCreep([WORK, CARRY, MOVE], null, {role: 'upgrader'});
                this.spawn(spawner, LIGHT_UPGRADER);
                upgraders++;
                continue;
            }
            if(builders < 1){
                //Game.spawns[i].createCreep([WORK, CARRY, MOVE], null, {role: 'builder'});
                this.spawn(spawner, LIGHT_BUILDER);
                builders++;
                continue;
            }
        }
    },

    spawn: function(building, creepOptions){
        let result = building.createCreep(creepOptions.body, creepOptions.name, creepOptions.memory);
    }
}

module.exports = spawner;