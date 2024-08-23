class Person extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y)

        this.key = `person`;

        this.quantity = 10;
        this.collideWorldBounds = true;

        // this.scene.physics.world.enableBody(this);
        // this.body.setOffset(1, this.height - 4);
        // this.body.setSize(this.width - 2, 4, false);
        this.bounceX = 0.5;
        this.bounceY = 0.5;
        this.dragX = 0;
        this.dragY = 0;

        // this.velocityX = random(50, 100);
        // this.velocityY = random(50, 100);

        this.speed = 100;
        this.dead = false;

        this.x = x;
        this.y = y;

        this.setPushable(false);


    }


    create() {
        Phaser.Actions.RandomRectangle(this.people.getChildren(), this.physics.world.bounds);
    }

    update() {
    }


}
