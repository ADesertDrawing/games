class Play extends Phaser.Scene {
    constructor() {
        super({
            key: `play`
        });
    }

    cursors;
    player;
    people;

    create() {
        //Creating the player animations to face the 8 directions 
        //depending on direction of travel
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('person', { start: 6, end: 6 }),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('person', { start: 2, end: 2 }),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('person', { start: 4, end: 4 }),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('person', { start: 0, end: 0 }),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'downleft',
            frames: this.anims.generateFrameNumbers('person', { start: 1, end: 1 }),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'upright',
            frames: this.anims.generateFrameNumbers('person', { start: 5, end: 5 }),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'downright',
            frames: this.anims.generateFrameNumbers('person', { start: 7, end: 7 }),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'upleft',
            frames: this.anims.generateFrameNumbers('person', { start: 3, end: 3 }),
            frameRate: 12,
            repeat: -1
        });
        this.player = this.physics.add.sprite(400, 300, 'person')
            .play('down')
            .setCollideWorldBounds(true)
            .setDrag(100)
            .setMaxVelocity(200, 200)


        this.cursors = this.input.keyboard.createCursorKeys();

    }


    update() {
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
        }
        else if (x > 0) {
            this.player.play('right', true);
        }
        if (y < 0) {
            this.player.play('up', true);
        }
        else if (y > 0) {
            this.player.play('down', true);
        }
        //Diagonal movement
        if (x < 0 && y > 0) {
            this.player.play('downleft', true);
        }
        if (x > 0 && y < 0) {
            this.player.play('upright', true);
        }
        if (x > 0 && y > 0) {
            this.player.play('downright', true);
        }
        if (x < 0 && y < 0) {
            this.player.play('upleft', true);
        }

    }

}

