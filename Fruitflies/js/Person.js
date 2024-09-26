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

        this.changeAnimation();
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


        // Wait a random amount of time then do it again
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(10, 1000), // Random delay between changing direction
            callback: () => {
                this.changeDirection();
            }
        });
    }


    changeAnimation() {
        // Define sprite frame for each direction
        this.anims.create({
            key: 'right',
            frames: [{ key: `person`, frame: 6 }],
            frameRate: 12,
            repeat: -1,

        });
        this.anims.create({
            key: 'left',
            frames: [{ key: `person`, frame: 2 }],
            frameRate: 12,
            repeat: -1,

        });
        this.anims.create({
            key: 'up',
            frames: [{ key: `person`, frame: 4 }],
            frameRate: 12,
            repeat: -1,

        });
        this.anims.create({
            key: 'down',
            frames: [{ key: `person`, frame: 0 }],
            frameRate: 12,
            repeat: -1,

        });
        this.anims.create({
            key: 'downleft',
            frames: [{ key: `person`, frame: 1 }],
            frameRate: 12,
            repeat: -1,

        });
        this.anims.create({
            key: 'upright',
            frames: [{ key: `person`, frame: 5 }],
            frameRate: 12,
            repeat: -1,

        });
        this.anims.create({
            key: 'downright',
            frames: [{ key: `person`, frame: 7 }],
            frameRate: 12,
            repeat: -1,

        });
        this.anims.create({
            key: 'upleft',
            frames: [{ key: `person`, frame: 3 }],
            frameRate: 12,
            repeat: -1,

        });
    }




    update() {

        //   this.person.depth = this.person.y;

        if (newVY < 0) {
            if (newVX < 0) {
                this.sprite.anims.play('upleft', true);
            }
            else if (newVX > 0) {
                this.sprite.anims.play(`upright`, true);
            }
            else {
                this.sprite.anims.play(`up`, true);
            }
        }
        else if (newVY > 0) {
            if (newVX < 0) {
                this.sprite.anims.play('downleft', true);
            } else if (newVX > 0) {
                this.sprite.anims.play('downright', true);
            } else {
                this.sprite.anims.play('down', true);
            }
        }
        else {
            if (newVX < 0) {
                this.sprite.anims.play('left', true);
            }
            else if (newVX > 0) {
                this.sprite.anims.play('right', true);
            }
        }


        // this.person.depth = this.person.y;


    }

}