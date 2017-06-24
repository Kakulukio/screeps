let roleHarvester = require('role.harvester');

let roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {

                let structures = creep.room.find(FIND_STRUCTURES);
                let walls = structures.filter(function(item){
                    return (item.structureType == STRUCTURE_WALL && item.hits < 5000);
                });

                let myStructures = creep.room.find(FIND_MY_STRUCTURES);

                myStructures = _.union(myStructures, walls);

                let structuresToRepair = myStructures.filter(function(item){
                    if(item.hits !== undefined && item.hits < item.hitsMax){
                        return true;
                    }
                    return false;
                });

                if(structuresToRepair.length) {
                    if(creep.repair(structuresToRepair[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structuresToRepair[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    roleHarvester.run(creep);
                }
            }
        } else {
            let sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;