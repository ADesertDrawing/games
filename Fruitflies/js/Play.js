class Play extends Phaser.Scene {
    constructor() {
        super({
            key: `play`
        });
        this.isPlayerDead = false; //Set the player as not dead at first
        this.shunningIsHappening = false; //Set the player as not being shunned at first
        this.reduceHealthTimer = null; //A timer to control health reduction so it's not too quick
        this.frameCounter = 0; // Set up frame counter (need this to slow health reduction)

        //Cache for distance calculations
        this.distanceCache = {
            lastPlayerX: 0,
            lastPlayerY: 0,
            cachedDistances: {},
            cacheValidFrames: 0
        };
    }

    create() {

        this.game.loop.targetFps = 30;  //slower frame rate instead of default 60 to optimise

        this.cursors = this.input.keyboard.createCursorKeys();

        this.image = this.add.image(400, 300, 'border');
        this.image = this.add.image(85, 60, 'Age').setDepth(1000).setScale(0.16);

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

        // Initialize edgeFader
        this.edgeFader = this.add.rectangle(400, 300, 800, 600, 0xffffff);
        this.edgeFader.setAlpha(0); // Start fully transparent
        this.edgeFader.setDepth(900); // Ensure proper layering
    }

    // Callback function for when the triangle (with the view) overlaps with a grave
    onViewOverlap() {
        //Shunning and screen shake only happens if player is alive (doesn't get stuck in a shake at end)
        if (!this.isPlayerDead) {
            //SHUNNING IS HAPPENNING
            this.shunningIsHappening = true;

            // Screen shake while overlap is happening
            this.cameras.main.shake(50, 0.02);

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

        // Create a group to hold the number sprites
        this.timerDisplay = this.add.group();

        // Create the initial display
        this.updateTimerDisplay();

        // Set up the timer
        this.timerEvent = this.time.addEvent({
            delay: 800,
            callback: this.incrementTimer,
            callbackScope: this,
            loop: true
        });
    }

    updateTimerDisplay() {
        // Clear existing number sprites
        this.timerDisplay.clear(true, true);

        // Convert timer value to string and pad with zero if needed
        const timerString = this.timerValue.toString().padStart(2, '0');

        // Create sprites for each digit
        for (let i = 0; i < timerString.length; i++) {
            const digit = parseInt(timerString[i]);
            const numberSprite = this.add.sprite(
                112 + (i * 25), // X position 
                61,             // Y position
                'numbers',      // Spritesheet key
                digit           // Frame number (0-9)
            );

            numberSprite.setDepth(1001);
            numberSprite.setScale(1); // Adjust scale as needed
            numberSprite.setTint(0x000000); // Make them black

            // Add to the group
            this.timerDisplay.add(numberSprite);
        }
    }

    incrementTimer() {
        if (this.timerValue < 99) {
            this.timerValue += 1;
            this.updateTimerDisplay(); // Update the sprite display
        } else {
            this.timerEvent.remove();
            this.playerDeath();
        }
    }

    //Player dies
    playerDeath() {

        // Ensure player death only happens once
        if (this.isPlayerDead || !this.player) return;


        // Stop the timer immediately so it doesn't trigger another death
        if (this.timerEvent) {
            this.timerEvent.remove();
        }

        //Set the checker to true when player is dead
        this.isPlayerDead = true;
        // Stop shunning if dead
        this.shunningIsHappening = false;

        // Freeze the player and make them face the front (surprised look)
        if (this.player.body) { // Only try to set velocity if player exists and has a body
            this.player.setVelocity(0, 0); // Stop moving
            this.player.play('down', true); // Face front
        }

        // Store player position BEFORE destroying
        const playerX = this.player.x;
        const playerY = this.player.y;

        // Delay before blink
        this.time.delayedCall(1000, () => { // 1sec pause

            // Play the blink animation after the pause
            const blinkSprite = this.add.sprite(playerX, playerY, 'blinkgif')
                .setDepth(playerY)
                .setScale(1)
                .play('blinkgif');

            blinkSprite.on('animationcomplete', () => {
                // 1 sec pause after blink, before grave

                this.time.delayedCall(1000, () => {

                    // Remove player, view, and graphics after the grave is displayed
                    if (this.player) {
                        this.player.destroy();
                        this.player = null;
                    }

                    // After blink animation finishes, remove view sprite and add the grave sprite
                    if (this.view) {
                        this.view.destroy();
                        this.view = null;
                    }
                    this.add.image(playerX, playerY, 'grave')
                        .setScale(0.5)
                        .setDepth(playerY);

                    //add image of grave shadow to player grave
                    this.add.image(playerX + 32, playerY + 22, 'graveshadow')
                        .setScale(0.15)
                        .setDepth(-10);

                    // Remove the blink and shadow sprites after the animation completes
                    blinkSprite.destroy();

                    if (this.shadow) {
                        this.shadow.destroy();
                        this.shadow = null;
                    }

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
                .setDepth(1000)
                .setScale(0.15);

            //Show Good innings message
            this.time.delayedCall(1500, () => {
                this.add.image(475, 300, 'goodinnings')
                    .setDepth(1000)
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
                .setDepth(1000)
                .setScale(0.15);

            //Show Shame message
            this.time.delayedCall(1500, () => {
                this.add.image(450, 300, 'Shame')
                    .setDepth(1000)
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
        // Reset all boolean flags
        this.isPlayerDead = false;
        this.shunningIsHappening = false;
        this.musicFadingOut = false;

        // Reset counters
        this.frameCounter = 0;
        this.timerValue = 0;

        // Clean up all timers
        if (this.timerEvent) {
            this.timerEvent.remove();
            this.timerEvent = null;
        }

        if (this.reduceHealthTimer) {
            this.reduceHealthTimer.remove();
            this.reduceHealthTimer = null;
        }

        // Clean up text objects
        if (this.timerText) {
            this.timerText.destroy();
            this.timerText = null;
        }
        // Clean up timer display
        if (this.timerDisplay) {
            this.timerDisplay.clear(true, true);
            this.timerDisplay.destroy();
            this.timerDisplay = null;
        }

        // Clean up player and related objects
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }

        if (this.view) {
            this.view.destroy();
            this.view = null;
        }

        if (this.shadow) {
            this.shadow.destroy();
            this.shadow = null;
        }

        // Clean up graphics
        if (this.graphics) {
            this.graphics.clear();
            this.graphics.destroy();
            this.graphics = null;
        }

        // Clean up people group
        if (this.people) {
            this.people.clear(true, true); // Remove and destroy all children
            this.people.destroy();
            this.people = null;
        }

        // Clean up death timers
        if (this.deathTimers) {
            this.deathTimers.forEach(timer => {
                if (timer) timer.remove();
            });
            this.deathTimers = [];
        }

        // Clean up graves group
        if (this.graves) {
            this.graves.clear(true, true); // Remove and destroy all children
            this.graves.destroy();
            this.graves = null;
        }

        // Clean up healthbar
        if (this.healthbar) {
            this.healthbar.destroy();
            this.healthbar = null;
        }

        // Clean up edge fader
        if (this.edgeFader) {
            this.edgeFader.destroy();
            this.edgeFader = null;
        }

        // Stop all tweens
        this.tweens.killAll();

        // Stop all timers
        this.time.removeAllEvents();

        // Stop all animations
        this.anims.pauseAll();

        // Reset music volumes if they exist
        if (window.bgMusic) {
            window.bgMusic.setVolume(1);
        }
        if (window.staticSound) {
            window.staticSound.setVolume(0);
        }

        // Add a small delay before starting the title scene to ensure cleanup is complete
        this.time.delayedCall(100, () => {
            this.scene.start('title');
        });
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
            .setDrag(30)
            .setMaxVelocity(200, 200)
            .setDepth(this.y);
    }

    choosePerson() {
        //  Remove one child from the display list every...
        const timedEvent = this.time.addEvent({
            delay: Phaser.Math.Between(1000, 1500),
            callback: this.onEvent,
            callbackScope: this,
            loop: true
        });
    };

    onEvent() {
        const child = Phaser.Utils.Array.GetRandom(this.people.getChildren());
        if (child && child.isDying) {
            return; // Skip if already dying
        }
        if (child) {
            //Grab the x and y of the disappearing person
            const x = child.x;
            const y = child.y;

            // Check if there's enough space around this position for a new grave
            const minDistance = 70; // Minimum distance between graves 
            let tooClose = false;

            if (this.graves) {
                // Only recalculate if we haven't done it recently for this position
                const posKey = `${Math.floor(x / 10)}_${Math.floor(y / 10)}`;

                if (!this.distanceCache.cachedDistances[posKey]) {
                    this.graves.getChildren().forEach(grave => {
                        const distance = Phaser.Math.Distance.Between(x, y, grave.x, grave.y);
                        if (distance < minDistance) {
                            tooClose = true;
                        }
                    });

                    // Cache the result for 60 frames
                    this.distanceCache.cachedDistances[posKey] = { tooClose, frame: this.frameCounter };
                } else {
                    // Use cached result if it's recent
                    const cached = this.distanceCache.cachedDistances[posKey];
                    if (this.frameCounter - cached.frame < 60) {
                        tooClose = cached.tooClose;
                    } else {
                        // Recalculate if cache is stale
                        delete this.distanceCache.cachedDistances[posKey];
                        this.graves.getChildren().forEach(grave => {
                            const distance = Phaser.Math.Distance.Between(x, y, grave.x, grave.y);
                            if (distance < minDistance) {
                                tooClose = true;
                            }
                        });
                        this.distanceCache.cachedDistances[posKey] = { tooClose, frame: this.frameCounter };
                    }
                }
            }

            if (tooClose) {
                return;
            }

            //stop them moving
            child.setVelocity(0, 0);

            // Hide them but keep their shadow visible during the entire death sequence
            child.setVisible(false);
            child.isDying = true; // Mark as dying

            // Store reference to the shadow so we can control it independently
            const personShadow = child.shadow;

            // Cancel the person's direction timer to prevent errors
            if (child.directionTimer) {
                child.directionTimer.remove(false);
                child.directionTimer = null;
            }

            // Add the looking forward sprite
            const surprisedLook = this.physics.add.sprite(x, y, 'person')
                .setDepth(y)
                .setScale(1)
                .play('down', true);

            // Destroy the surprised look person after 1.5s
            this.time.delayedCall(1500, () => {
                surprisedLook.destroy();

                // Add the blink sprite
                const blinkSprite = this.physics.add.sprite(x, y, 'blinkgif')
                    .setDepth(y)
                    .setScale(1)
                    .play(`blinkgif`);

                //Another 1.5s delay before removing the blink sprite
                if (!this.deathTimers) this.deathTimers = [];

                const deathTimer = this.time.delayedCall(1500, () => {
                    // Remove the blink sprite
                    blinkSprite.destroy();

                    //Remove the person (shadow will be destroyed here)
                    child.destroy();

                    //NOW remove the shadow (after the person is destroyed)
                    if (personShadow) {
                        personShadow.destroy();
                    }

                    //Add the grave sprite
                    const graveSprite = this.physics.add.sprite(x, y, `grave`)
                        .setScale(0.5)
                        .setDepth(y);

                    //Add it to the graves group
                    if (this.graves) { // Add safety check
                        this.graves.add(graveSprite);
                    }

                    //add image of grave shadow
                    this.add.image(x + 32, y + 22, 'graveshadow')
                        .setScale(0.15)
                        .setDepth(-10);
                });

                this.deathTimers.push(deathTimer);
            });
        }
    }


    update() {
        let playerX = 0;
        let playerY = 0;

        if (this.player) {
            playerX = this.player.x;
            playerY = this.player.y;
        }

        // OPTIMIZED: Only update people every 3 frames and in batches
        if (this.player && this.people) {
            const children = this.people.getChildren();
            const frameOffset = this.frameCounter % 3;
            const batchSize = Math.ceil(children.length / 3);

            // Update only 1/3 of NPCs each frame
            const startIndex = frameOffset * batchSize;
            const endIndex = Math.min(startIndex + batchSize, children.length);

            for (let i = startIndex; i < endIndex; i++) {
                if (children[i]) {
                    children[i].update();
                }
            }
        }

        // OPTIMIZED: Only update depths every 5 frames
        if (this.people && this.frameCounter % 5 === 0) {
            this.people.getChildren().forEach((sprite) => {
                if (sprite && sprite.active) {
                    sprite.setDepth(sprite.y);
                }
            });
        }

        // Only continue if player exists
        if (this.player) {
            // Make the shadow follow the player if alive
            if (this.shadow) {
                this.shadow.setPosition(playerX + 38, playerY + 26);
            }

            // Set the player depth to the y value (only every 5 frames)
            if (this.frameCounter % 5 === 0) {
                this.player.setDepth(playerY);
            }

            // Make the view sprite follow the position of the player
            if (this.view) {
                this.view.x = playerX;
                this.view.y = playerY + 45;
            }

            // OPTIMIZED: Only update triangle graphics every 3 frames
            if (this.view && this.triangle && this.graphics && this.frameCounter % 3 === 0) {
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

                // Clear and redraw the triangle for debugging (less frequently)
                this.graphics.clear();
                this.graphics.fillStyle(0xffff00, 0);
                this.graphics.fillTriangleShape(this.triangle);
            }

            // Collision detection still runs every frame for responsiveness
            let overlapDetected = false;
            if (this.graves && this.triangle) {
                this.graves.getChildren().forEach(grave => {
                    const graveBounds = grave.getBounds();
                    if (Phaser.Geom.Intersects.RectangleToTriangle(graveBounds, this.triangle)) {
                        this.onViewOverlap(this.view, grave);
                        overlapDetected = true;
                    }
                });
            }

            if (!overlapDetected) {
                this.shunningIsHappening = false;
            }


            //Counting frames to reduce speed of health reduction if shunning is happening
            if (this.shunningIsHappening) {
                // Count up on the frame counter
                this.frameCounter++;

                // Reduce health every 10 frames
                if (this.frameCounter >= 8 && this.healthbar) {
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

            //Handle player movement (if they exist AND are not dead)
            if (this.cursors && !this.isPlayerDead) {
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
                        if (this.view) this.view.rotation = 1.5;
                    }
                    else if (x > 0) {
                        this.player.play('right', true);
                        if (this.view) this.view.rotation = -1.5;
                    }
                    if (y < 0) {
                        this.player.play('up', true);
                        if (this.view) this.view.rotation = 3.15;
                    }
                    else if (y > 0) {
                        this.player.play('down', true);
                        if (this.view) this.view.rotation = 0;
                    }
                    // Diagonal movement
                    if (x < 0 && y > 0) {
                        this.player.play('downleft', true);
                        if (this.view) this.view.rotation = 0.75;
                    }
                    if (x > 0 && y < 0) {
                        this.player.play('upright', true);
                        if (this.view) this.view.rotation = -2.25;
                    }
                    if (x > 0 && y > 0) {
                        this.player.play('downright', true);
                        if (this.view) this.view.rotation = -0.75;
                    }
                    if (x < 0 && y < 0) {
                        this.player.play('upleft', true);
                        if (this.view) this.view.rotation = 2.25;
                    }
                }
            }
        }
        // Create a white rectangle overlay to fade if you go to the edge if it doesn't exist
        if (!this.edgeFader) {
            this.edgeFader = this.add.rectangle(400, 300, 800, 600, 0xffffff);
            this.edgeFader.setAlpha(0); // Start fully transparent
            this.edgeFader.setDepth(900); // Set depth above player/NPCs but below messages/Age/Healthbar
        }

        // Add audio update counter
        if (!this.audioUpdateCounter) this.audioUpdateCounter = 0;
        this.audioUpdateCounter++;

        // Only update audio every 10 frames instead of every frame
        if (this.audioUpdateCounter % 10 === 0) {
            //Quieten the music if the player goes near the edge
            if (this.player && window.bgMusic && window.staticSound && !this.musicFadingOut) {
                // Calculate how far the player is from the edges
                const distanceToLeft = Math.max(0, playerX - 100);
                const distanceToRight = Math.max(0, 800 - 100 - playerX);
                const distanceToTop = Math.max(0, playerY - 75);
                const distanceToBottom = Math.max(0, 600 - 75 - playerY);

                // Find the minimum distance to any edge
                const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);

                // Normalize the distance for music volume
                const musicVolumeFactor = Phaser.Math.Clamp(minDistance / 150, 0.05, 1);

                // Inverse of normalized distance for static volume
                const staticVolumeFactor = Phaser.Math.Clamp(1 - minDistance / 150, 0, 1);

                // Amplify static volume
                const amplifiedStaticVolume = staticVolumeFactor * 6;

                // Set the volumes
                window.bgMusic.setVolume(musicVolumeFactor);
                window.staticSound.setVolume(Phaser.Math.Clamp(amplifiedStaticVolume, 0, 1));

                //Normalize the fading effect
                const visualAlphaFactor = Phaser.Math.Clamp(1 - minDistance / 150, 0, 0.9);

                // Set visual fade opacity
                if (this.edgeFader) {
                    this.edgeFader.setAlpha(visualAlphaFactor);
                }
            }
        }
    }
}