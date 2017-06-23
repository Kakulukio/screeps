var mapBuilder = {

    buildStarPhase: function(){
        var spawnerPos = [];
        var buildings = [];

        for(var index in Game.spawns){
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

        this.registBuildis(Game.rooms[spawnerPos.roomName], buildings);

    },

    buildSimpleBase: function(){
        var spawnerPos = [];
        var buildings = [];

        for(var index in Game.spawns){
            spawnerPos = Game.spawns[index].pos;
        }

        for(var i = 0; i < 9; i++){

            var structure = STRUCTURE_WALL;
            if(i > 2 && i < 7){
                structure = STRUCTURE_RAMPART;
            }

            buildings.push({
                pos: {
                    x:spawnerPos.x-4,
                    y:spawnerPos.y-4+i
                },
                structure: structure
            });
            buildings.push({
                pos: {
                    x: spawnerPos.x+4,
                    y: spawnerPos.y-4+i
                },
                structure: structure
            });
            buildings.push({
                pos: {
                    x: spawnerPos.x-4+i,
                    y: spawnerPos.y-4
                },
                structure: structure
            });
            buildings.push({
                pos: {
                    x: spawnerPos.x-4+i,
                    y: spawnerPos.y+4
                },
                structure: structure
            });
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

        this.registBuildis(Game.rooms[spawnerPos.roomName], buildings);

    },

    registBuildis: function(room, buildings){
        _.forEach(buildings, function(building){
            room.createConstructionSite(building.pos.x, building.pos.y, building.structure);
        });
    },

    findExits: function(room){
        let positionsToCheck = [];
        for(var i = 0; i < 50; i++){
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
            if(Game.map.getTerrainAt(pos.x, pos.y, room) != "wall"){
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



        var posDuplicates = [];

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
            var placeFound = false;
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
            var lastPos;
            var vertical = true;
            var horizontal = true;
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

            var position;

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

    sealExits: function(room, gatesWithPos){
        let wallPositions = [];

        gatesWithPos.forEach(function(gates){

            gates.tiles.splice(Math.floor(gates.tiles.length / 2), 1);

            switch(gates.position){

                case 'top':
                    gates.tiles.forEach(function(tile){
                        wallPositions.push({
                            x: tile.x,
                            y: tile.y + 2
                        });
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x - 1,
                        y: gates.tiles[0].y + 2
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x - 2,
                        y: gates.tiles[0].y + 2
                    });
                    wallPositions.push({
                        x: gates.tiles[gates.tiles.length - 1].x + 1,
                        y: gates.tiles[0].y + 2
                    });
                    wallPositions.push({
                        x: gates.tiles[gates.tiles.length - 1].x + 2,
                        y: gates.tiles[0].y + 2
                    });
                    wallPositions.push({
                        x: gates.tiles[gates.tiles.length - 1].x + 2,
                        y: gates.tiles[0].y + 1
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x - 2,
                        y: gates.tiles[0].y + 1
                    });

                    break;

                case 'bottom':
                    gates.tiles.forEach(function(tile){
                        wallPositions.push({
                            x: tile.x,
                            y: tile.y - 2
                        });
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x - 1,
                        y: gates.tiles[0].y - 2
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x - 2,
                        y: gates.tiles[0].y - 2
                    });
                    wallPositions.push({
                        x: gates.tiles[gates.tiles.length - 1].x + 1,
                        y: gates.tiles[0].y - 2
                    });
                    wallPositions.push({
                        x: gates.tiles[gates.tiles.length - 1].x + 2,
                        y: gates.tiles[0].y - 2
                    });
                    wallPositions.push({
                        x: gates.tiles[gates.tiles.length - 1].x + 2,
                        y: gates.tiles[0].y - 1
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x - 2,
                        y: gates.tiles[0].y - 1
                    });
                    break;

                case 'left':
                    gates.tiles.forEach(function(tile){
                        wallPositions.push({
                            x: tile.x + 2,
                            y: tile.y
                        });
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x + 2,
                        y: gates.tiles[0].y - 2
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x + 2,
                        y: gates.tiles[0].y - 1
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x + 1,
                        y: gates.tiles[0].y - 2
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x + 2,
                        y: gates.tiles[gates.tiles.length - 1].y + 2
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x + 2,
                        y: gates.tiles[gates.tiles.length - 1].y + 1
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x + 1,
                        y: gates.tiles[gates.tiles.length - 1].y + 2
                    });

                    break;

                case 'right':
                    gates.tiles.forEach(function(tile){
                        wallPositions.push({
                            x: tile.x - 2,
                            y: tile.y
                        });
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x - 2,
                        y: gates.tiles[0].y - 2
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x - 2,
                        y: gates.tiles[0].y - 1
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x - 1,
                        y: gates.tiles[0].y - 2
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x - 2,
                        y: gates.tiles[gates.tiles.length - 1].y + 2
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x - 2,
                        y: gates.tiles[gates.tiles.length - 1].y + 1
                    });
                    wallPositions.push({
                        x: gates.tiles[0].x - 1,
                        y: gates.tiles[gates.tiles.length - 1].y + 2
                    });
                    break;
            }
        });

        wallPositions.forEach(function(wall){
            room.createConstructionSite(wall.x, wall.y, STRUCTURE_WALL);
        });
    }

}

module.exports = mapBuilder;