class Play extends Phaser.Scene {
    constructor() {
        super({
            key: `play`
        });
    }
    view;
    cursors;
    player;
    people;


    create() {

        this.playerAnimation();

        this.viewAnimation();

    }

    viewAnimation() {
        //Adding the player view triangle
        let x = this.player.x;
        let y = this.player.y;
        this.view = this.physics.add.sprite(x, y, `view`).setOrigin(0.52, 0);
    }

    playerAnimation() {
        //Creating the player animations to face the 8 directions 
        //depending on direction of travel
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('person', { start: 6, end: 6 }),
            frameRate: 12,
            repeat: -1,

        });
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('person', { start: 2, end: 2 }),
            frameRate: 12,
            repeat: -1,

        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('person', { start: 4, end: 4 }),
            frameRate: 12,
            repeat: -1,

        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('person', { start: 0, end: 0 }),
            frameRate: 12,
            repeat: -1,

        });
        this.anims.create({
            key: 'downleft',
            frames: this.anims.generateFrameNumbers('person', { start: 1, end: 1 }),
            frameRate: 12,
            repeat: -1,

        });
        this.anims.create({
            key: 'upright',
            frames: this.anims.generateFrameNumbers('person', { start: 5, end: 5 }),
            frameRate: 12,
            repeat: -1,

        });
        this.anims.create({
            key: 'downright',
            frames: this.anims.generateFrameNumbers('person', { start: 7, end: 7 }),
            frameRate: 12,
            repeat: -1,

        });
        this.anims.create({
            key: 'upleft',
            frames: this.anims.generateFrameNumbers('person', { start: 3, end: 3 }),
            frameRate: 12,
            repeat: -1,

        });
        this.player = this.physics.add.sprite(400, 300, 'person')
            .play('down')
            .setCollideWorldBounds(true)
            .setDrag(100)
            .setMaxVelocity(200, 200)


        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {

        //Make the view triangle follow the position of the player
        this.view.x = this.player.x;
        this.view.y = this.player.y + 45;



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
            this.view.rotation = 1.5;
        }
        else if (x > 0) {
            this.player.play('right', true);
            this.view.rotation = -1.5;
        }
        if (y < 0) {
            this.player.play('up', true);
            this.view.rotation = 3.15;

        }
        else if (y > 0) {
            this.player.play('down', true);
            this.view.rotation = 0;
        }
        //Diagonal movement
        if (x < 0 && y > 0) {
            this.player.play('downleft', true);
            this.view.rotation = 0.75;
        }
        if (x > 0 && y < 0) {
            this.player.play('upright', true);
            this.view.rotation = -2.25;
        }
        if (x > 0 && y > 0) {
            this.player.play('downright', true);
            this.view.rotation = -0.75;
        }
        if (x < 0 && y < 0) {
            this.player.play('upleft', true);
            this.view.rotation = 2.25;
        }

    }

}

