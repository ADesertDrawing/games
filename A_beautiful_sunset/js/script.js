/**
A Beautiful Sunset
by A Desert Drawing
*/
"use strict";

let topR;
let topG;
let topB;

let bottomR;
let bottomG;
let bottomB;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noSmooth();

    topR = 255;
    topG = 0;
    topB = 0;

    bottomR = 0;
    bottomG = 0;
    bottomB = 255;
}

function draw() {
    background(220);

    const topColor = color(topR, topG, topB);
    const bottomColor = color(bottomR, bottomG, bottomB);

    for (let y = 0; y < height; y++) {
        const lineColor = lerpColor(topColor, bottomColor, y / height);
        stroke(lineColor);
        line(0, y, width, y);
    }
}
