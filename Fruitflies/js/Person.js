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

        //  0 = left
        //  1 = right
        //  2 = up
        //  3 = down
        let direction = 3;
        let distance = Phaser.Math.Between(4, 8);

        //  Create a movement timer - every 100ms we'll move the 'snake'

        this.time.addEvent({
            delay: 100, loop: true, callback: () => {

                let x = this.person.x;
                let y = this.person.y;

                if (direction === 0) {
                    x = Phaser.Math.Wrap(x - 32, 0, 800);
                }
                else if (direction === 1) {
                    x = Phaser.Math.Wrap(x + 32, 0, 800);
                }
                else if (direction === 2) {
                    y = Phaser.Math.Wrap(y - 32, 0, 576);
                }
                else if (direction === 3) {
                    y = Phaser.Math.Wrap(y + 32, 0, 576);
                }

                Phaser.Actions.ShiftPosition(this.person, x, y);
                distance--;

                if (distance === 0) {
                    if (direction <= 1) {
                        direction = Phaser.Math.Between(2, 3);
                    }
                    else {
                        direction = Phaser.Math.Between(0, 1);
                    }

                    distance = Phaser.Math.Between(4, 12);
                }
            }

        });
    }

    update() {

        this.setVelocity(this.randomXVelocity, this.randomYVelocity);
        this.person.depth = this.person.y + 1;
    }


}
