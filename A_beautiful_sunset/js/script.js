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
    r: 200,
    g: 200,
    b: 0
};

let sky = {
    x: 0,
    y: 0,
    width: 500,
    height: 500,
    r: 50,
    g: 100,
    b: 200,
    transparency: 255
}

function setup() {
    createCanvas(500, 500);

}

function draw() {
    background(sky.r, sky.g, sky.b);

    sunset();


}


function sunset() {
    push();
    circle.x = circle.x + circle.vx;
    circle.y = circle.y + circle.vy;
    noStroke();
    fill(circle.r, circle.g, circle.b);
    ellipse(circle.x, circle.y, circle.size);
    //Turn sun from yellow to red as it falls
    circle.g = circle.g - 0.3;
    pop();

    push();
    noStroke();

    // fill(sky.r, sky.g, sky.b, sky.transparency);
    // rect(sky.x, sky.y, sky.width, sky.height);
    // sky.transparency = sky.transparency - 1;
    sky.r = sky.r - 0.02;
    sky.g = sky.g - 0.3;
    sky.b = sky.b - 0.3;
    pop();
}

