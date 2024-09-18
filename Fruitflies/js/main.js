/**
Fruitflies
by A Desert Drawing
*/
"use strict";

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: `#dedede`,
    physics: {
        default: `arcade`
    },
    scene: [Boot, Play]
};

let game = new Phaser.Game(config);
