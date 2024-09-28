class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: `boot`
        });
    }

    preload() {
        //Load the player view/perspective triangle
        this.load.image(`view`, `assets/images/view.png`,);

        //Load the image of grave
        this.load.image('grave', 'assets/images/grave.png',);

        //Load the spritesheet for player and people
        this.load.spritesheet('person', 'assets/images/person.png', { frameWidth: 50, frameHeight: 94 });

        // //Load the spritesheets for NPCs
        this.load.spritesheet('people', 'assets/images/person.png', { frameWidth: 50, frameHeight: 94 });        //Move to the Play scene when these are loaded

        this.load.on(`complete`, () => {
            this.createAnims();
            this.scene.start(`play`);
        });

    }

    /**
     * Create all the animations *one time* in Boot
     * The player and the other people can just use the
     * same animations. 
     */
    createAnims() {
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
    }

    create() {
        //Add Loading text
        let style = {
            fontFamily: 'sans-serif',
            fontSize: `40px`,
            color: '#ffffff'
        };
        let loadingString = `Loading…`;
        this.add.text(100, 100, loadingString, style);


    }


    update() {


    }
}
