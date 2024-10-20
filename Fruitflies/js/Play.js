class Play extends Phaser.Scene {
    constructor() {
        super({
            key: `play`
        });
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.image = this.add.image(400, 300, 'border');
        this.image = this.add.image(90, 60, 'lifebox').setDepth(700).setScale(0.15);

        this.playerAnimation();
        this.viewAnimation();
        this.peopleAnimation();
        this.choosePerson();
        this.playerLife();


        // Create a group for grave sprites
        this.graves = this.physics.add.group();

        //Create the blink gif
        this.anims.create({
            key: 'blinkgif',
            frames: this.anims.generateFrameNumbers('blinkgif', { start: 0, end: 4 }),
            frameRate: 8,
            repeat: 0 //no loop
        });
    }

    // Callback function for when the triangle (with the view) overlaps with a grave
    onViewOverlap() {
        console.log('SHUNNING IS HAPPENING!!!');
        // Screen shake while overlap is happening
        this.cameras.main.shake(500, 0.02);
    }

    playerLife() {
        this.timerValue = 0;

        // Create a text object to display the timer
        this.timerText = this.add.text(100, 42, `${this.timerValue}`, {
            fontSize: '40px',
            fill: '#000000',
        }).setDepth(710);

        // Set up a timer that increments the timerValue every sec
        this.timerEvent = this.time.addEvent({
            delay: 550,
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
            this.player99Death();
        }
    }

    player99Death() {

        this.image = this.add.image(400, 300, 'innings').setDepth(720).setScale(0.15);
    }

    //the NPCs appearing randomly and wandering about
    peopleAnimation() {
        this.people = this.physics.add.group();

        for (let i = 0; i < 30; i++) {
            const person = new Person(this, 100, 100);
            this.people.add(person);
            person.setup();

        }
        // Choosing a random point in the canvas and popping a person in there
        Phaser.Actions.RandomRectangle(this.people.getChildren(), this.physics.world.bounds);
        // this.physics.add.collider(this.people, this.player);

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

        //  console.log("temp")

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
            delay: Phaser.Math.Between(1000, 5000),
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
                .setDepth(this.y)
                .setScale(1)
                .play('down', true);

            // Destroy the surprised look person after 1.5s
            this.time.delayedCall(1500, () => {
                surprisedLook.destroy();

                // Add the blink sprite
                const blinkSprite = this.physics.add.sprite(x, y, 'blinkgif')
                    .setDepth(this.y)
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
                });
            });
        }
    }


    update() {
        // Set the people depth to the y value     
        this.people.getChildren().forEach((sprite) => {
            sprite.setDepth(sprite.y);
            // Set the player depth to the y value
            this.player.setDepth(this.player.y);
        });
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

        // Check for overlap with graves
        this.graves.getChildren().forEach(grave => {
            const graveBounds = grave.getBounds();

            // Check if the triangle intersects the grave's bounding rectangle
            if (Phaser.Geom.Intersects.RectangleToTriangle(graveBounds, this.triangle)) {
                this.onViewOverlap(this.view, grave);
            }
        });


        const { left, right, up, down } = this.cursors;

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

