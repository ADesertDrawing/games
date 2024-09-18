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
        // let velocities = [0, 25, 50, 75, 100, 125, 150, 175, 200];


    }


    create() {
        super.create();

        // let randomXVelocity = random(velocities);
        // let randomYVelocity = random(velocities);

    }

    update() {

        this.setVelocity(this.randomXVelocity, this.randomYVelocity);

        this.person.depth = this.person.y;
    }


}
