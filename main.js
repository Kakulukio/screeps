let gamePhases = require('gamePhases');
let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let spawner = require('spawner');
let mapBuilder = require('mapBuilder');

module.exports.loop = function () {

    /*switch(Memory.gamePhase){
     case gamePhases.START_PHASE:
     if(Object.keys(Game.creeps).length >= 4){
     Memory.gamePhase = gamePhases.BUILD_START_PHASE;
     }
     break;

     case gamePhases.BUILD_START_PHASE:
     mapBuilder.buildStarPhase();
     Memory.gamePhase = gamePhases.LVL_1_PHASE;
     break;

     case gamePhases.LVL_1_PHASE:
     if(Game.creeps[Object.keys(Game.creeps)[0]].room.controller.level == 2){
     Memory.gamePhase = gamePhases.LVL_2_BUILD_PHASE;
     }
     break;

     case gamePhases.LVL_2_BUILD_PHASE:
     mapBuilder.buildSimpleBase();
     break;

     case gamePhases.LVL_2_PHASE:

     break;

     default:

     Memory.gamePhase = gamePhases.START_PHASE;
     break;
     }*/

    let a = mapBuilder.findExits('sim');
    mapBuilder.sealExits(Game.rooms['sim'], a);

    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    /*let tower = Game.getObjectById('798edfbc22c51eec464c199b');
     if(tower) {
     let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
     filter: (structure) => structure.hits < structure.hitsMax
     });
     if(closestDamagedStructure) {
     tower.repair(closestDamagedStructure);
     }

     let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
     if(closestHostile) {
     tower.attack(closestHostile);
     }
     }*/

    spawner.checkCreeps();

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