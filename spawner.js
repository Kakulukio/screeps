const LIGHT_WORKER_BODY = [WORK, CARRY, CARRY, MOVE, MOVE];
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

function createCreepOptions(role, room, extraMemory = {}, maxEnergy = 300){
    let options = {
        body: LIGHT_WORKER_BODY,
        name: null,
        memory: { role: role, room: room }
    };

    return options;
}

let spawner = {

    checkCreeps: function(roomName){

        let room = Game.rooms[roomName];
        let roomDetails = Memory.myRoomDetails[roomName];

        let creeps = _.filter(Game.creeps, (creep) => {
            return creep.memory.room == roomName;
        });

        _.forEach(roomDetails.creepsRoleMax, function(maxNumber, role){

            roomDetails.creepsInRole[role] = creeps.filter((creep) => {
                return creep.memory.role == role;
            }).length;
            if(roomDetails.creepsInQueue[role] == undefined){
                roomDetails.creepsInQueue[role] = 0;
            }
            if(roomDetails.creepsSpawning[role] == undefined){
                roomDetails.creepsSpawning[role] = 0;
            }

            let creepCount = roomDetails.creepsInRole[role] + roomDetails.creepsInQueue[role] + roomDetails.creepsSpawning[role];
            if(creepCount < maxNumber){
                let count = maxNumber - creepCount;
                for(let i = 0; i < count; i++){
                    roomDetails.spawnQueue.push(role);
                }
                roomDetails.creepsInQueue[role] += count;
            }
        });

        room.find(FIND_MY_SPAWNS).forEach((spawner) => {
            if(!spawner.spawning && spawner.memory.spawningRole !== undefined){
                roomDetails.creepsSpawning[spawner.memory.spawningRole]--;
                spawner.memory.spawningRole = undefined;
            }
            if(roomDetails.spawnQueue.length > 0){
                if(spawner.spawning){
                    let spawningCreep = Game.creeps[spawner.spawning.name];
                    spawner.room.visual.text(
                        '🛠️' + spawningCreep.memory.role,
                        spawner.pos.x + 1,
                        spawner.pos.y,
                        {align: 'left', opacity: 0.8}
                    );
                } else {
                    let spawnRes = this.spawn(spawner, roomDetails.spawnQueue[0]);
                    if(isNaN(parseInt(spawnRes))){
                        let spawningCreepRole = roomDetails.spawnQueue.splice(0,1);
                        spawner.memory.spawningRole = spawningCreepRole;
                        roomDetails.creepsInQueue[spawningCreepRole]--;
                        roomDetails.creepsSpawning[spawningCreepRole]++;
                    }
                }
            } else {
                return false;
            }
        });
    },

    spawn: function(building, role){
        let creepOptions = createCreepOptions(role, building.room.name);

        return building.createCreep(creepOptions.body, creepOptions.name, creepOptions.memory);
    }
}

module.exports = spawner;