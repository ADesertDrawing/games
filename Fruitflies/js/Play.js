class Play extends Phaser.Scene {
    constructor() {
        super({
            key: `play`
        });
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.image = this.add.image(400, 300, 'border');

        this.playerAnimation();
        this.viewAnimation();
        this.peopleAnimation();
        this.choosePerson();
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
        //  this.physics.add.collider(this.people, this.people);

    }

    viewAnimation() {
        //Adding the player view triangle

        let x = this.player.x;
        let y = this.player.y;
        this.view = this.physics.add.sprite(x, y, `view`).setOrigin(0.52, 0).setDepth(0);
        //this.view.depth = this.view.y - 1;
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
        //setDepth(this.player.y);
    }

    choosePerson() {
        //  Remove one child from the display list every 1s
        const timedEvent = this.time.addEvent({
            delay: Phaser.Math.Between(1000, 1000),
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

            // Add the blink sprite
            const blinkSprite = this.physics.add.sprite(x, y, 'blink').setDepth(this.y).setScale(0.5);

            this.time.delayedCall(1500, () => {
                // Remove the blink sprite
                blinkSprite.destroy();

                //Add the grave sprite
                const newSprite = this.physics.add.sprite(x, y, `grave`).setDepth(this.y).setScale(0.5);

            });
        }

    }


    update() {


        //Make the view triangle follow the position of the player
        this.view.x = this.player.x;
        this.view.y = this.player.y + 45;

        //Set the player depth to the y value
        // console.log(this.player.y);
        // console.log(this.player.depth);
        this.player.setDepth(this.player.y);

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

        const { x } = this.player.body.velocity;
        const { y } = this.player.body.velocity;

        //Up, down left right movement
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
        //Diagonal movement
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

