class Play extends Phaser.Scene {
    constructor() {
        super({
            key: `play`
        });
        this.isPlayerDead = false; //Set the player as not dead at first
        this.shunningIsHappening = false; //Set the player as not being shunned at first
        this.reduceHealthTimer = null; //A timer to control health reduction so it's not too quick
        this.frameCounter = 0; // Set up frame counter (need this to slow health reduction)
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.image = this.add.image(400, 300, 'border');
        this.image = this.add.image(85, 60, 'Age').setDepth(700).setScale(0.16);

        this.playerAnimation();
        this.viewAnimation();
        this.peopleAnimation();
        this.choosePerson();
        this.playerLife();

        //Create the healthbar
        this.healthbar = new Healthbar(this, 470, 60); //This isn't loading from pages(changed to small h in pages)

        // Create a group for grave sprites
        this.graves = this.physics.add.group();

        //Create the blink animation (not a gif), removing any that exist previously
        this.anims.remove('blinkgif');
        this.anims.create({
            key: 'blinkgif',
            frames: this.anims.generateFrameNumbers('blinkgif', { start: 0, end: 4 }),
            frameRate: 8,
            repeat: 0 //no loop
        });
        //Create the shadow for the player
        this.shadow = this.add.image(this.player.x + 38, this.player.y + 26, 'personshadow')
            .setScale(0.50)
            .setDepth(-10);
    }

    // Callback function for when the triangle (with the view) overlaps with a grave
    onViewOverlap() {
        //Shunning and screen shake only happens if player is alive (doesn't get stuuck in a shake at end)
        if (!this.isPlayerDead) {
            //SHUNNING IS HAPPENNING
            this.shunningIsHappening = true;

            // Screen shake while overlap is happening
            this.cameras.main.shake(100, 0.02);

            // Start or reset the health reduction timer if it's not running
            if (!this.reduceHealthTimer) {
                this.reduceHealthTimer = this.time.addEvent({
                    delay: 800, // Delay in ms
                    callback: () => {
                        if (this.shunningIsHappening) {
                            this.healthbar.reduceHealth();
                        }
                    },
                    callbackScope: this,
                    loop: true,
                });
            }
        }
    }


    playerLife() {
        this.timerValue = 0;

        // Create a text object to display the timer
        this.timerText = this.add.text(100, 44, `${this.timerValue}`, {
            fontSize: '40px',
            fill: '#000000',
        }).setDepth(710);

        // Set up a timer that increments the timerValue every sec
        this.timerEvent = this.time.addEvent({
            delay: 800,
            callback: this.incrementTimer,
            callbackScope: this,
            loop: true
        });
    }
    incrementTimer() {
        if (this.timerValue < 99) {
            this.timerValue += 1;
            this.timerText.setText(`${this.timerValue}`);
        } else {
            // Stop the Life timer when it reaches 99
            this.timerEvent.remove();
            this.playerDeath();
        }
    }

    //Player dies
    playerDeath() {

        // Ensure player death only happens once
        if (this.isPlayerDead || !this.player) return;

        //Set the checker to true when player is dead
        this.isPlayerDead = true;
        // Stop shunning if dead
        this.shunningIsHappening = false;

        // Freeze the player and make them face the front (surprised look)
        if (this.player.body) { // Only try to set velocity if player exists and has a body
            this.player.setVelocity(0, 0); // Stop moving
            this.player.play('down', true); // Face front
        }

        // Delay before blink
        this.time.delayedCall(1000, () => { // 1sec pause

            // Remove player, view, and graphics after the grave is displayed
            if (this.player) {
                this.player.destroy();
            }

            // Play the blink animation after the pause
            const blinkSprite = this.add.sprite(this.player.x, this.player.y, 'blinkgif')
                .setDepth(this.player.y)
                .setScale(1)
                .play('blinkgif');

            blinkSprite.on('animationcomplete', () => {
                // 1 sec pause after blink, before grave
                this.time.delayedCall(1000, () => {
                    // After blink animation finishes, remove view sprite and add the grave sprite
                    if (this.view) {
                        this.view.destroy();
                    }
                    this.add.image(this.player.x, this.player.y, 'grave')
                        .setScale(0.5)
                        .setDepth(this.player.y);
                    //add image of grave shadow to player grave
                    this.add.image(this.player.x + 32, this.player.y + 22, 'graveshadow')
                        .setScale(0.15)
                        .setDepth(-10);

                    // Remove the blink and shadow sprites after the animation completes
                    blinkSprite.destroy();
                    this.shadow.destroy();

                    // Check if the player died by timer or health bar reaching zero
                    if (this.timerValue === 99) {
                        this.player99DeathEnding();
                    } else if (this.healthbar.currentSegments === 0) {
                        this.playerOhShameEnding();
                        // Stop the timer to after death
                        if (this.timerEvent) {
                            this.timerEvent.remove();
                        }
                    }
                });
            });
        });
    }

    player99DeathEnding() {
        //Show Huh message
        this.time.delayedCall(1500, () => {
            this.add.image(315, 300, 'huh')
                .setDepth(720)
                .setScale(0.15);

            //Show Good innings message
            this.time.delayedCall(1500, () => {
                this.add.image(475, 300, 'goodinnings')
                    .setDepth(720)
                    .setScale(0.15);

                this.graphics.clear();
                this.fadeAndRestart();
            });
        });
    }

    playerOhShameEnding() {

        // Save the final timer value
        const finalTimerValue = this.timerValue;

        //Show Oh message
        this.time.delayedCall(1500, () => {
            this.add.image(335, 300, 'Oh')
                .setDepth(720)
                .setScale(0.15);

            //Show Shame message
            this.time.delayedCall(1500, () => {
                this.add.image(450, 300, 'Shame')
                    .setDepth(720)
                    .setScale(0.15);

                this.graphics.clear();
                this.fadeAndRestart();
                // });
            });
        });
    }

    fadeAndRestart() {
        // Create a white overlay that covers the entire screen
        const fader = this.add.rectangle(400, 300, 800, 600, 0xffffff);
        fader.setAlpha(0);
        fader.setDepth(1100);

        // Delay for 3 seconds, then start the fade-to-white tween
        this.time.delayedCall(3000, () => {
            this.tweens.add({
                targets: fader,
                alpha: 1, // Tween opacity from 0 to 1
                duration: 7000, // 7 secs
                onComplete: () => {
                    this.time.delayedCall(3000, () => {
                        this.restartGame(); // Reset the game once the fade is complete
                    });
                }
            });
            //Fade music if it exists
            if (window.bgMusic) {
                this.musicFadingOut = true; // Prevent edge-based adjustments
                this.tweens.add({
                    targets: window.bgMusic, // Target the global bgMusic
                    volume: 0, // Fade volume to 0
                    duration: 7000, // Match visual fade duration
                    onComplete: () => {
                        window.bgMusic.stop(); // Stop music once the fade-out is complete
                        this.musicFadingOut = false; // Reset for future use
                    }
                });
            }
        }, [], this);

        // Fade static sound if it exists
        if (window.staticSound) {
            this.tweens.add({
                targets: window.staticSound, // Target the global static sound
                volume: 0, // Fade volume to 0
                duration: 7000, // Match visual fade duration
                onComplete: () => {
                    window.staticSound.stop(); // Stop static sound once the fade-out is complete
                }
            });
        }
    }

    restartGame() {
        this.isPlayerDead = false; // Reset the player death status
        this.shunningIsHappening = false; // Reset shunning status
        this.reduceHealthTimer = null; //Reset health timer
        this.frameCounter = 0; //Reset Life counter

        // Go back to the start
        this.scene.start('title');
    }

    //the NPCs appearing randomly and wandering about
    peopleAnimation() {
        this.people = this.physics.add.group();

        for (let i = 0; i < 40; i++) {
            //passing the player and the shunning state when we create the person
            const person = new Person(this, 100, 100, this.player, () => this.shunningIsHappening);
            this.people.add(person);
            person.setup();

        }
        // Choosing a random point in the canvas and popping a person in there
        Phaser.Actions.RandomRectangle(this.people.getChildren(), this.physics.world.bounds);
    }

    viewAnimation() {
        //Adding the player view triangle

        let x = this.player.x;
        let y = this.player.y;
        this.view = this.add.sprite(x, y, `view`).setOrigin(0.52, 0).setDepth(0);

        // An isosceles triangle which follows the player sprite so we can detect overlaps
        const x1 = this.player.x - 70; // Left corner of the base
        const y1 = this.player.y + 180; // Bottom of the triangle
        const x2 = this.player.x + 70; // Right corner of the base
        const y2 = this.player.y + 180; // Bottom of the triangle
        const x3 = this.player.x; // Top point of the triangle
        const y3 = this.player.y;

        this.triangle = new Phaser.Geom.Triangle(x1, y1, x2, y2, x3, y3);

        // Make the triangle visible for debugging
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(2, 0xffff00);
        this.graphics.strokeTriangleShape(this.triangle);

    }

    playerAnimation() {
        //Creating the player animations to face the 8 directions 
        //depending on direction of travel

        this.player = this.physics.add.sprite(400, 300, 'person')
            .play('down')
            .setCollideWorldBounds(true)
            .setDrag(100)
            .setMaxVelocity(200, 200)
            .setDepth(this.y);
    }

    choosePerson() {
        //  Remove one child from the display list every...
        const timedEvent = this.time.addEvent({
            delay: Phaser.Math.Between(1800, 2500),
            callback: this.onEvent,
            callbackScope: this,
            loop: true
        });
    };

    onEvent() {
        const child = Phaser.Utils.Array.GetRandom(this.people.getChildren());
        if (child) {
            //Grab the x and y of the disappearing person
            const x = child.x;
            const y = child.y;
            //Remove the person
            this.people.remove(child, true);

            // Add the looking forward sprite
            const surprisedLook = this.physics.add.sprite(x, y, 'person')
                .setDepth(y)
                .setScale(1)
                .play('down', true);

            // Destroy the surprised look person after 1.5s
            this.time.delayedCall(1500, () => {
                surprisedLook.destroy();

                // Destroy the shadow if it exists
                if (child.shadow) {
                    child.shadow.destroy();  // Destroys the shadow of the person
                }

                // Add the blink sprite
                const blinkSprite = this.physics.add.sprite(x, y, 'blinkgif')
                    .setDepth(y)
                    .setScale(1)
                    .play(`blinkgif`);

                //Another 1.5s delay before removing the blink sprite
                this.time.delayedCall(1500, () => {
                    // Remove the blink sprite
                    blinkSprite.destroy();

                    //Add the grave sprite
                    const graveSprite = this.physics.add.sprite(x, y, `grave`)
                        .setScale(0.5)
                        .setDepth(y);
                    //Add it to the graves group
                    this.graves.add(graveSprite);
                    //add image of grave shadow
                    this.add.image(x + 32, y + 22, 'graveshadow')
                        .setScale(0.15)
                        .setDepth(-10);
                });
            });
        }
    }


    update() {

        if (this.player) {
            // Update each person
            this.people.getChildren().forEach(person => {
                person.update();
            });
        }

        // Only carry on if the player exists
        if (this.player) {

            //Make the shadow follow the player if alive
            this.shadow.setPosition(this.player.x + 38, this.player.y + 26);


            // Set the people depth to the y value     
            this.people.getChildren().forEach((sprite) => {
                sprite.setDepth(sprite.y);
            });

            // Set the player depth to the y value
            this.player.setDepth(this.player.y);

            // Make the view sprite follow the position of the player
            this.view.x = this.player.x;
            this.view.y = this.player.y + 45;

            // Define the base triangle shape
            const baseX1 = -70;
            const baseY1 = 190;
            const baseX2 = 65;
            const baseY2 = 190;
            const baseX3 = 0;
            const baseY3 = 0;

            // Calculate the rotated points for the triangle based on the view's rotation
            const angle = this.view.rotation;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            const x1 = this.view.x + (baseX1 * cos - baseY1 * sin);
            const y1 = this.view.y + (baseX1 * sin + baseY1 * cos);
            const x2 = this.view.x + (baseX2 * cos - baseY2 * sin);
            const y2 = this.view.y + (baseX2 * sin + baseY2 * cos);
            const x3 = this.view.x + (baseX3 * cos - baseY3 * sin);
            const y3 = this.view.y + (baseX3 * sin + baseY3 * cos);

            // Update the triangle's vertices
            this.triangle.setTo(x1, y1, x2, y2, x3, y3);

            // Clear and redraw the triangle for debugging
            this.graphics.clear();
            this.graphics.fillStyle(0xffff00, 0); //second number is alpha value
            this.graphics.fillTriangleShape(this.triangle);

            // Set no overlap at first
            let overlapDetected = false;

            // Check for overlap with graves
            this.graves.getChildren().forEach(grave => {
                const graveBounds = grave.getBounds();

                // Check if the triangle intersects the grave's bounding rectangle
                if (Phaser.Geom.Intersects.RectangleToTriangle(graveBounds, this.triangle)) {
                    this.onViewOverlap(this.view, grave);
                    overlapDetected = true; // Overlap found
                }
            });
            //Counting frames to reduce speed of health reduction if shunning is happening
            if (this.shunningIsHappening) {
                // Count up on the frame counter
                this.frameCounter++;

                // Reduce health every 10 frames
                if (this.frameCounter >= 8) {
                    this.healthbar.reduceHealth();
                    this.frameCounter = 0; // Reset the frame counter
                }
            } else {
                // Reset the frame counter when shunning is not happening
                this.frameCounter = 0;
            }

            if (!this.shunningIsHappening && this.reduceHealthTimer) {
                this.reduceHealthTimer.remove();
                this.reduceHealthTimer = null;
            }

            // If no overlap was detected, reset the shunning state
            if (!overlapDetected) {
                this.shunningIsHappening = false;

            }
            //Handle player movement (if they exist)
            const { left, right, up, down } = this.cursors;

            // Set player velocity only if the player still exists and has a body
            if (this.player.body) {
                this.player.setVelocity(0, 0);

                if (left.isDown) {
                    this.player.setVelocityX(-200);
                }
                else if (right.isDown) {
                    this.player.setVelocityX(200);
                }

                if (up.isDown) {
                    this.player.setVelocityY(-200);
                }
                else if (down.isDown) {
                    this.player.setVelocityY(200);
                }

                const { x, y } = this.player.body.velocity;

                // Up, down, left, right movement
                if (x < 0) {
                    this.player.play('left', true);
                    this.view.rotation = 1.5;
                }
                else if (x > 0) {
                    this.player.play('right', true);
                    this.view.rotation = -1.5;
                }
                if (y < 0) {
                    this.player.play('up', true);
                    this.view.rotation = 3.15;
                }
                else if (y > 0) {
                    this.player.play('down', true);
                    this.view.rotation = 0;
                }
                // Diagonal movement
                if (x < 0 && y > 0) {
                    this.player.play('downleft', true);
                    this.view.rotation = 0.75;
                }
                if (x > 0 && y < 0) {
                    this.player.play('upright', true);
                    this.view.rotation = -2.25;
                }
                if (x > 0 && y > 0) {
                    this.player.play('downright', true);
                    this.view.rotation = -0.75;
                }
                if (x < 0 && y < 0) {
                    this.player.play('upleft', true);
                    this.view.rotation = 2.25;
                }
            }
        }
        //Quieten the music if the player goes near the edge
        if (this.player && window.bgMusic && window.staticSound && !this.musicFadingOut) {
            const playerX = this.player.x;
            const playerY = this.player.y;

            // Calculate how far the player is from the edges
            const distanceToLeft = Math.max(0, playerX - 100); // 100 pixels from the left
            const distanceToRight = Math.max(0, 800 - 100 - playerX); // 100 pixels from the right
            const distanceToTop = Math.max(0, playerY - 75); // 75 pixels from the top
            const distanceToBottom = Math.max(0, 600 - 75 - playerY); // 75 pixels from the bottom

            // Find the minimum distance to any edge
            const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);

            // Normalize the distance for music volume (0 = fully quiet, 1 = fully clear)
            const musicVolumeFactor = Phaser.Math.Clamp(minDistance / 150, 0.05, 1);

            // Inverse of normalized distance for static volume (0 = fully loud, 1 = silent)
            const staticVolumeFactor = Phaser.Math.Clamp(1 - minDistance / 150, 0, 1);

            // Amplify static volume to make it more noticeable
            const amplifiedStaticVolume = staticVolumeFactor * 6; // Increase multiplier as needed

            // Set the volumes
            window.bgMusic.setVolume(musicVolumeFactor);
            window.staticSound.setVolume(Phaser.Math.Clamp(amplifiedStaticVolume, 0, 1)); // Ensure it stays within 0-1

        }
    }
}