class Person extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, dead) {
        super(scene, x, y, "people", 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.dead = false;

    }

    setup() {
        this.setCollideWorldBounds(true);
        // this.setPushable(true);
        // this.setBounce(0.5, 0.5);
        // this.setDrag(-10, -10);
        // this.setDepth(this.y);
        this.setVelocity(100, -100);

        this.changeDirection();


    }

    create() {

        super.create();

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


    /**
     * This is where the person chooses which direction to face
     * Note that in an ideal world the Player would be just another Person
     * and you could then use all this code for the player too.
     * But for now this works.
     */
    setAnimation() {

        const { x, y } = this.body.velocity;

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



    update() {



    }

}