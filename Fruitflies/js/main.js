/**
Fruitflies
by A Desert Drawing
*/
"use strict";

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: `#ffffff`,
    physics: {
        default: `arcade`,
        arcade: {
            gravity: { y: 0 },
            debug: false //see collision boxes if true
        }
    },
    scene: [Boot, Title, Instructions, Play]
};

let game = new Phaser.Game(config);
