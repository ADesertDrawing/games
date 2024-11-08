class Person extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, player, shunningCheck) {
        super(scene, x, y, "people", 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.player = player;
        this.shunningCheck = shunningCheck;
    }

    setup() {
        this.setCollideWorldBounds(true);
        this.setVelocity(100, -100);
        this.changeDirection();
        this.makeShadow();
    }

    create() {

    }
    makeShadow() {
        //Create the shadows for the people
        if (!this.shadow) { //only create a shadow if it doesn't already exist
            this.shadow = this.scene.add.image(this.x + 38, this.y + 26, 'personshadow')
                .setScale(0.50)
                .setDepth(-10);
        }
    }



    changeDirection() {
        //    console.log(this);
        // Multiply x and y by either -1, 0, or 1 to change direction (or possibly not)
        const newVX = Phaser.Utils.Array.GetRandom([-100, 0, 100]);
        const newVY = Phaser.Utils.Array.GetRandom([-100, 0, 100]);

        this.setVelocity(newVX, newVY);

        this.setAnimation();

        // Wait a random amount of time then do it again
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(10, 1000), // Random delay between changing direction
            callback: () => {
                this.changeDirection();
            }
        });
    }


    //Which direction the NPCs are facing depending on direction of travel
    setAnimation() {

        const { x, y } = this.body.velocity;

        //Check if shunning is happening
        if (!this.shunningCheck()) {

            //Normal facing animations if shunning not happening
            //Up, down left right movement
            if (x < 0) {
                this.play('left', true);
            }
            else if (x > 0) {
                this.play('right', true);
            }
            if (y < 0) {
                this.play('up', true);

            }
            else if (y > 0) {
                this.play('down', true);
            }
            //Diagonal movement
            if (x < 0 && y > 0) {
                this.play('downleft', true);
            }
            if (x > 0 && y < 0) {
                this.play('upright', true);
            }
            if (x > 0 && y > 0) {
                this.play('downright', true);
            }
            if (x < 0 && y < 0) {
                this.play('upleft', true);
            }
        }
        else {
            console.log('SHUNNING IS HAPPENING!!!');
            this.shunningAnimation();
        }
    }

    // NPCs face away from player if Shunning is Happening
    shunningAnimation() {
        //Set up the person and player positions

        const personX = this.x;
        const personY = this.y;
        const playerX = this.player.x;
        const playerY = this.player.y;

        //Everyone stops moving whilst shunning is happening
        this.setVelocity(0, 0);

        if (personX < playerX && personY < playerY) {
            this.play(`upleft`, true);
        }
        else if (personX > playerX && personY < playerY) {
            this.play(`upright`, true);
        }
        else if (personX > playerX && personY > playerY) {
            this.play(`downright`, true);
        }
        else if (personX < playerX && personY > playerY) {
            this.play(`downleft`, true);
        }
        else if (personX < playerX) {
            this.play(`left`, true);
        }
        else if (personX > playerX) {
            this.play(`right`, true);
        }
        else if (personY < playerY) {
            this.play(`up`, true);
        }
        else if (personY > playerY) {
            this.play(`down`, true);
        }
    }

    destroy() {
        if (this.shadow) {
            this.shadow.destroy();
            this.shadow = null;
        }
        super.destroy(); // Call the parent destroy method
    }

    update() {

        this.setAnimation();

        //Check shadow exists then make the shadow follow the person
        if (this.shadow) {
            this.shadow.setPosition(this.x + 38, this.y + 26);
        }
    }

}