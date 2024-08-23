class Person extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, "people", 0);
        scene.add.existing(this)
        scene.physics.add.existing(this)
    }

    setup() {
        this.setCollideWorldBounds(true);
        this.setPushable(false);
        this.setBounce(0.5, 0.5);
        this.setDrag(-10, -10);
        this.setVelocity(100, 100);
    }


    create() {
        super.create();

    }

    update() {

    }


}
