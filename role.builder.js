let roleHarvester = require('role.harvester');

let roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep, room) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            let target = this.selectBuilding(creep, room);
            if(target !== null) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
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
    },

    selectBuilding: function(creep, room){
        if(creep.memory.workingOn !== undefined){
           let buildingPos = creep.memory.workingOn.pos;
           let constructionSite = room.lookAt(buildingPos.x, buildingPos.y).filter((item) => {
               return item.type == LOOK_CONSTRUCTION_SITES;
           });
           if(constructionSite.length < 1){
               let queueIndex = Memory.myRoomDetails[room.name].buildQueue.findIndex(item => {
                   return item.pos == buildingPos;
               });
               Memory.myRoomDetails[room.name].buildQueue.splice(queueIndex, 1);
               creep.memory.workingOn = undefined;
           } else {
                return constructionSite[0][LOOK_CONSTRUCTION_SITES];
           }
        }

        if(Memory.myRoomDetails[room.name].buildQueue.length == 0){
            return null;
        }
        let building = Memory.myRoomDetails[room.name].buildQueue.sort((building1, building2) => {
            if(building1.inProgress){
                return -1;
            }
            if(building2.inProgress){
                return 1;
            }
            if(building1.priority > building2.priority){
                return -1;
            } else if(building1.priority < building2.priority){
                return 1;
            } else {
                return 0;
            }
        })[0];
        let constructionSite = room.lookAt(building.pos.x, building.pos.y).filter((item) => {
            return item.type == LOOK_CONSTRUCTION_SITES;
        });
        if(constructionSite.length > 0){
            creep.memory.workingOn = {
                pos: building.pos
            };
            building.inProgress = true;
            return constructionSite[0][LOOK_CONSTRUCTION_SITES];
        } else {
            Memory.myRoomDetails[room.name].buildQueue.splice(0, 1);
            this.selectBuilding(creep, room);
        }
    }
};

module.exports = roleBuilder;