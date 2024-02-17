/**
A Beautiful Sunset
by A Desert Drawing
*/
"use strict";

let circle = {
    x: 250,
    y: 0,
    size: 200,
    vx: 0,
    vy: 1
};

function setup() {
    createCanvas(500, 500);

}

function draw() {
    background(50, 100, 200);
    circle.x = circle.x + circle.vx;
    circle.y = circle.y + circle.vy;
    noStroke();
    fill(200, 200, 50);
    ellipse(circle.x, circle.y, circle.size);
}

