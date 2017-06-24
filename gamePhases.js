let gamePhases = {

    START_PHASE: 0,
    BUILD_START_PHASE: 1,
    LVL_1_PHASE: 2,
    LVL_2_BUILD_PHASE: 3,
    LVL_2_PHASE: 4

}

module.exports = gamePhases;

/*
(function(x, y, priority, structure) {
    Game.rooms['sim'].createConstructionSite(x, y, structure);

    Memory.myRoomDetails[Game.rooms['sim'].name].buildQueue.push({
        priority: priority,
        pos: {
            x: x,
            y: y
        },
        inProgress: false
    });
})(17,28,1, STRUCTURE_EXTENSION);

(function(x, y, priority, structure) {
    Game.rooms['sim'].createConstructionSite(x, y, structure);

    Memory.myRoomDetails[Game.rooms['sim'].name].buildQueue.push({
        priority: priority,
         pos: {
             x: x,
             y: y
         },
        inProgress: false
    });
})(8,22,4, STRUCTURE_EXTENSION);

*/