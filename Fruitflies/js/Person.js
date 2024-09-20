class Person extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, "people", 0);
        scene.add.existing(this)
        scene.physics.add.existing(this)

    }

    setup() {
        this.setCollideWorldBounds(true);
        // this.setPushable(true);
        // this.setBounce(0.5, 0.5);
        // this.setDrag(-10, -10);
        // this.setDepth(this.y);
        this.setVelocity(100, -100);


    }


    create() {

        super.create();

        this.changeDirection();

    }

    changeDirection() {
        // Multiple x and y by either -1, 0, or 1 to change direction (or possibly not)
        this.velocity.x *= Phaser.Utils.Array.GetRandom([-1, 0, 1]);
        this.velocity.y *= Phaser.Utils.Array.GetRandom([-1, 0, 1]);
        // Wait 2 seconds then do it again
        this.scene.time.addEvent({
            delay: Math.random() * 2000, // Wait two seconds
            callback: changeDirection,
            callbackContext: this
        });
    }

    update() {

        // this.person.depth = this.person.y;
    }


}
