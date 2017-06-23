var gamePhases = require('gamePhases');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var spawner = require('spawner');
var mapBuilder = require('mapBuilder');

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

    var a = mapBuilder.findExits('sim');
    mapBuilder.sealExits(Game.rooms['sim'], a);

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    /*var tower = Game.getObjectById('798edfbc22c51eec464c199b');
     if(tower) {
     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
     filter: (structure) => structure.hits < structure.hitsMax
     });
     if(closestDamagedStructure) {
     tower.repair(closestDamagedStructure);
     }

     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
     if(closestHostile) {
     tower.attack(closestHostile);
     }
     }*/

    spawner.checkCreeps();

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
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