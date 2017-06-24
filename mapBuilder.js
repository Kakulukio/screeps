let mapBuilder = {

    registBuildings: function(room, buildings){
        _.forEach(buildings, function(building){
            room.createConstructionSite(building.pos.x, building.pos.y, building.structure);
            Memory.buildQueue.push({

            });
        });
    },

    buildStarPhase: function(){
        let spawnerPos = [];
        let buildings = [];

        for(let index in Game.spawns){
            spawnerPos = Game.spawns[index].pos;
        }

        /*buildings.push({
         pos: {
         x: spawnerPos.x-1,
         y: spawnerPos.y
         },
         structure: STRUCTURE_CONTAINER
         });
         buildings.push({
         pos: {
         x: spawnerPos.x+1,
         y: spawnerPos.y
         },
         structure: STRUCTURE_CONTAINER
         });*/
        buildings.push({
            pos: {
                x: spawnerPos.x-1,
                y: spawnerPos.y+1
            },
            structure: STRUCTURE_CONTAINER
        });
        buildings.push({
            pos: {
                x: spawnerPos.x,
                y: spawnerPos.y+1
            },
            structure: STRUCTURE_CONTAINER
        });
        buildings.push({
            pos: {
                x: spawnerPos.x+1,
                y: spawnerPos.y+1
            },
            structure: STRUCTURE_CONTAINER
        });

        this.registBuildings(Game.rooms[spawnerPos.roomName], buildings);

    },

    buildSimpleBase: function(){
        let spawnerPos = [];
        let buildings = [];

        for(let index in Game.spawns){
            spawnerPos = Game.spawns[index].pos;
        }

        buildings.push({
            pos: {
                x: spawnerPos.x-1,
                y: spawnerPos.y-1
            },
            structure: STRUCTURE_EXTENSION
        });
        buildings.push({
            pos: {
                x: spawnerPos.x,
                y: spawnerPos.y-1
            },
            structure: STRUCTURE_EXTENSION
        });
        buildings.push({
            pos: {
                x: spawnerPos.x+1,
                y: spawnerPos.y-1
            },
            structure: STRUCTURE_EXTENSION
        });
        buildings.push({
            pos: {
                x: spawnerPos.x+1,
                y: spawnerPos.y
            },
            structure: STRUCTURE_EXTENSION
        });
        buildings.push({
            pos: {
                x: spawnerPos.x-1,
                y: spawnerPos.y
            },
            structure: STRUCTURE_EXTENSION
        });

        this.registBuildings(Game.rooms[spawnerPos.roomName], buildings);

    },

    findExits: function(roomName){
        let positionsToCheck = [];
        for(let i = 0; i < 50; i++){
            positionsToCheck.push({
                x: i,
                y: 0
            });
            positionsToCheck.push({
                x: i,
                y: 49
            });
            positionsToCheck.push({
                x: 0,
                y: i
            });
            positionsToCheck.push({
                x: 49,
                y: i
            });
        }

        let gatePositions = [];

        positionsToCheck.forEach(function(pos){
            if(Game.map.getTerrainAt(pos.x, pos.y, roomName) != "wall"){
                gatePositions.push({
                    x: pos.x,
                    y: pos.y
                });
            }
        });

        gatePositions.push({
            x: 47,
            y: 0
        });
        gatePositions.push({
            x: 48,
            y: 0
        });
        gatePositions.push({
            x: 49,
            y: 0
        });
        gatePositions.push({
            x: 49,
            y: 1
        });
        gatePositions.push({
            x: 49,
            y: 2
        });

        let posDuplicates = [];

        gatePositions.sort(function(pos1, pos2){
            if(pos1.x < pos2.x){
                return -1;
            } else if(pos1.x > pos2.x){
                return 1;
            } else {
                if(pos1.y < pos2.y){
                    return -1;
                } else if(pos1.y > pos2.y){
                    return 1;
                } else {
                    posDuplicates.push(pos2);
                    return 0;
                }
            }
        });

        _.pull(gatePositions, posDuplicates);

        let gates = [];

        gatePositions.forEach(function(item){
            if(gates.length == 0){
                gates.push([item]);
                return;
            }
            let placeFound = false;
            gates.forEach(function(gate){
                gate.forEach(tile => {
                    if((tile.x == item.x && (tile.y+1 == item.y || tile.y-1 == item.y))  || (tile.y == item.y && (tile.x+1 == item.x || tile.x-1 == item.x))){
                    gate.push(item);
                    placeFound = true;
                    return false;
                }
            });
                if(placeFound){
                    return false;
                }
            });
            if(!placeFound){
                gates.push([item]);
            }
        });

        let gatesWithPos = [];

        gates.forEach(function(gate){
            let lastPos;
            let vertical = true;
            let horizontal = true;
            gate.forEach(function(pos){
                if(lastPos == undefined){
                    lastPos = pos;
                } else {
                    if(lastPos.x != pos.x){
                        horizontal = false;
                    }
                    if(lastPos.y != pos.y){
                        vertical = false;
                    }
                    return false;
                }
            });

            let position;

            if(horizontal){
                if(gate[0].x == 0){
                    position = 'left';
                } else {
                    position = 'right';
                }
            } else if(vertical){
                if(gate[0].y == 0){
                    position = 'top';
                } else {
                    position = 'bottom';
                }
            } else {
                position = 'corner';
            }

            gatesWithPos.push({
                position: position,
                tiles: gate
            });
        });

        return gatesWithPos;
    },

    sealExits: function(room){
        let gatesWithPos = this.findExits(room.name);

        let buildingPositions = [];

        gatesWithPos.forEach(function(gates){

            let ramp = gates.tiles.splice(Math.floor(gates.tiles.length / 2), 1);

            switch(gates.position){

                case 'top':
                    buildingPositions.push({
                        pos: {
                            x: ramp[0].x,
                            y: ramp[0].y + 2
                        },
                        structure: STRUCTURE_RAMPART
                    });
                    gates.tiles.forEach(function(tile){
                        buildingPositions.push({
                            pos: {
                                x: tile.x,
                                y: tile.y + 2
                            },
                            structure: STRUCTURE_WALL
                        });
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x - 1,
                            y: gates.tiles[0].y + 2
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x - 2,
                            y: gates.tiles[0].y + 2
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[gates.tiles.length - 1].x + 1,
                            y: gates.tiles[0].y + 2
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[gates.tiles.length - 1].x + 2,
                            y: gates.tiles[0].y + 2
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[gates.tiles.length - 1].x + 2,
                            y: gates.tiles[0].y + 1
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x - 2,
                            y: gates.tiles[0].y + 1
                        },
                        structure: STRUCTURE_WALL
                    });

                    break;

                case 'bottom':
                    buildingPositions.push({
                        pos: {
                            x: ramp[0].x,
                            y: ramp[0].y - 2
                        },
                        structure: STRUCTURE_RAMPART
                    });
                    gates.tiles.forEach(function(tile){
                        buildingPositions.push({
                            pos: {
                                x: tile.x,
                                y: tile.y - 2
                            },
                            structure: STRUCTURE_WALL
                        });
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x - 1,
                            y: gates.tiles[0].y - 2
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x - 2,
                            y: gates.tiles[0].y - 2
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[gates.tiles.length - 1].x + 1,
                            y: gates.tiles[0].y - 2
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[gates.tiles.length - 1].x + 2,
                            y: gates.tiles[0].y - 2
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[gates.tiles.length - 1].x + 2,
                            y: gates.tiles[0].y - 1
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x - 2,
                            y: gates.tiles[0].y - 1
                        },
                        structure: STRUCTURE_WALL
                    });

                    break;

                case 'left':
                    buildingPositions.push({
                        pos: {
                            x: ramp[0].x + 2,
                            y: ramp[0].y
                        },
                        structure: STRUCTURE_RAMPART
                    });
                    gates.tiles.forEach(function(tile){
                        buildingPositions.push({
                            pos: {
                                x: tile.x + 2,
                                y: tile.y
                            },
                            structure: STRUCTURE_WALL
                        });
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x + 2,
                            y: gates.tiles[0].y - 2
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x + 2,
                            y: gates.tiles[0].y - 1
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x + 1,
                            y: gates.tiles[0].y - 2
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x + 2,
                            y: gates.tiles[gates.tiles.length - 1].y + 2
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x + 2,
                            y: gates.tiles[gates.tiles.length - 1].y + 1
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x + 1,
                            y: gates.tiles[gates.tiles.length - 1].y + 2
                        },
                        structure: STRUCTURE_WALL
                    });

                    break;

                case 'right':
                    buildingPositions.push({
                        pos: {
                            x: ramp[0].x - 2,
                            y: ramp[0].y
                        },
                        structure: STRUCTURE_RAMPART
                    });
                    gates.tiles.forEach(function(tile){
                        buildingPositions.push({
                            pos: {
                                x: tile.x - 2,
                                y: tile.y
                            },
                            structure: STRUCTURE_WALL
                        });
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x - 2,
                            y: gates.tiles[0].y - 2
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x - 2,
                            y: gates.tiles[0].y - 1
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x - 1,
                            y: gates.tiles[0].y - 2
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x - 2,
                            y: gates.tiles[gates.tiles.length - 1].y + 2
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x - 2,
                            y: gates.tiles[gates.tiles.length - 1].y + 1
                        },
                        structure: STRUCTURE_WALL
                    });
                    buildingPositions.push({
                        pos: {
                            x: gates.tiles[0].x - 1,
                            y: gates.tiles[gates.tiles.length - 1].y + 2
                        },
                        structure: STRUCTURE_WALL
                    });
                    break;
            }
        });

        this.registBuildings(room, buildingPositions);
    }

}

module.exports = mapBuilder;