/**
A Beautiful Sunset
by A Desert Drawing
*/
"use strict";

let circle = {
    x: 250,
    y: -100,
    size: 200,
    vx: 0,
    vy: 1,
    r: 255,
    g: 255,
    b: 0
};

function setup() {
    createCanvas(500, 500);

}

function draw() {
    background(50, 100, 200);
    circle.x = circle.x + circle.vx;
    circle.y = circle.y + circle.vy;
    noStroke();
    fill(circle.r, circle.g, circle.b);
    ellipse(circle.x, circle.y, circle.size);
    //Turn sun from yellow to red as it falls
    circle.g = circle.g - 0.3;

}


