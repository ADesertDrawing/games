/**
A Beautiful Sunset
by A Desert Drawing
*/
"use strict";

let state = `day`;

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
    //transparency: 255
}


function setup() {
    createCanvas(500, 500);
    setInterval(changeState, 5000);

}

function draw() {
    background(sky.r, sky.g, sky.b);
    if (state === `day`) {
        day();
        console.log(`day`);
    }
    else if (state === `sunset`) {
        sunset();
        console.log(`sunset`);
    }
    else if (state === `night`) {
        night();
        console.log(`night`);
    }
    else if (state === `sunrise`) {
        sunrise();
        console.log(`sunrise`);
    }
}

function day() {
    sky.r = 50, sky.g = 100, sky.b = 200;
    background(50, 100, 200);
    //  push();

    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(`Ah, you missed the sunrise`, width / 2, height / 2);
    // pop();
}

function sunset() {

    push();
    circle.x = circle.x + circle.vx;
    circle.y = circle.y + circle.vy;
    noStroke();
    fill(circle.r, circle.g, circle.b);
    ellipse(circle.x, circle.y, circle.size);
    //Turn sun from yellow to red as it falls
    circle.g = circle.g - 0.4;
    pop();

    push();
    noStroke();
    sky.r = sky.r - 0.01;
    sky.g = sky.g - 0.4;
    sky.b = sky.b - 0.4;
    pop();
}

function night() {
    push();
    background(0);

    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(`Ah, you missed the sunset`, width / 2, height / 2);
    pop();
}

function sunrise() {
    push();
    background(0);

    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(`Sunrise goes here`, width / 2, height / 2);
    pop();
}

function changeState() {
    if (state === `day`) {
        sky.r = 50, sky.g = 100, sky.b = 200;
        circle.x = 250, circle.y = -100, circle.size = 200, circle.vx = 0, circle.vy = 1, circle.r = 200, circle.g = 200, circle.b = 0;

        state = `sunset`;
    }
    else if (state === `sunset`) {
        state = `night`;
        sky.r = 0, sky.g = 0, sky.b = 0;
    }
    else if (state === `night`) {
        sky.r = 0, sky.g = 0, sky.b = 0;
        state = `sunrise`;
    }
    else if (state === `sunrise`) {
        sky.r = 50, sky.g = 100, sky.b = 200;
        state = `day`;
    }
}
