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
        this.changeDirection();
    }


    create() {
        super.create();
    }

    changeDirection() {
        console.log(this);
        // Multiply x and y by either -1, 0, or 1 to change direction (or possibly not)
        const newVX = Phaser.Utils.Array.GetRandom([-100, 0, 100]);
        const newVY = Phaser.Utils.Array.GetRandom([-100, 0, 100]);
        this.setVelocity(newVX, newVY);
        // Wait 2 seconds then do it again
        this.scene.time.addEvent({
            delay: 2000, // Wait two seconds
            callback: () => {
                this.changeDirection();
            }
        });
    }

    update() {

        // this.person.depth = this.person.y;
    }


}
