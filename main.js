let gamePhases = require('gamePhases');
let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let spawner = require('spawner');
let mapBuilder = require('mapBuilder');

module.exports.loop = function () {

    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    if(Memory.myRooms === undefined){
        let spawn = Game.spawns[Object.keys(Game.spawns)[0]];
        Memory.myRooms = [spawn.room.name];
        Memory.myRoomDetails = {};
        Memory.myRoomDetails[spawn.room.name] = {
            roomPhase: gamePhases.START_PHASE,
            defcon: 5,
            creepsInRole: {},
            creepsInQueue: {},
            creepsSpawning: {},
            creepsRoleMax: {
                harvester: 3,
                upgrader: 1,
                builder: 1
            },
            spawnQueue: [],
            buildQueue: []
        };
    }

    Memory.myRooms.forEach(function(roomName){
       let roomDetails = Memory.myRoomDetails[roomName];
        spawner.checkCreeps(roomName);

        /*switch(roomDetails.roomPhase){
            case gamePhases.START_PHASE:
                if(Object.keys(Game.creeps).length >= 4){
                    roomDetails.roomPhase = gamePhases.BUILD_START_PHASE;
                }
                break;

            case gamePhases.BUILD_START_PHASE:
                mapBuilder.buildStarPhase();
                roomDetails.roomPhase = gamePhases.LVL_1_PHASE;
                break;

            case gamePhases.LVL_1_PHASE:
                if(Game.creeps[Object.keys(Game.creeps)[0]].room.controller.level == 2){
                    roomDetails.roomPhase = gamePhases.LVL_2_BUILD_PHASE;
                }
                break;

            case gamePhases.LVL_2_BUILD_PHASE:
                mapBuilder.buildSimpleBase();
                mapBuilder.sealExits(Game.rooms[roomName]);
                break;

            case gamePhases.LVL_2_PHASE:

                break;
        }*/

        Memory.myRoomDetails[roomName] = roomDetails;
    });

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}