class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: `boot`
        });
    }

    preload() {

        //Load the background music
        this.load.audio(`bgMusic`, `assets/sounds/Spencer_Adams_No_Use_Crying_1922.mp3`,);

        //Load the static noise
        this.load.audio(`static`, `assets/sounds/static3.mp3`,);

        //Load the player view/perspective triangle
        this.load.image(`view`, `assets/images/view.png`,);

        //Load the image of grave
        this.load.image('grave', 'assets/images/grave.png',);

        //Load the image of grave shadow
        this.load.image(`graveshadow`, `assets/images/graveshadow.png`,)

        //Load the person shadow
        this.load.image(`personshadow`, `assets/images/personshadow.png`)

        //Load the image of border
        this.load.image('border', 'assets/images/border.png',);

        //Load the image of instructions
        this.load.image('instructions', 'assets/images/instructions.png',);

        //Load the image of life box
        this.load.image('lifebox', 'assets/images/lifebox.png',);

        //Load the image of Age box
        this.load.image('Age', 'assets/images/Age.png',);

        //Load the image of Fruitflies text
        this.load.image('fruitfliesTitle', 'assets/images/fruitfliesTitle.png',);

        //Load the image of A desert Drawing for title
        this.load.image('fruitfliesName', 'assets/images/fruitfliesName.png',);

        //Load the image of a big player for the intro
        this.load.image('personBig', 'assets/images/personBig.png',);

        //Load the 2nd blink image of a big player for the intro
        this.load.image('bigBlink2', 'assets/images/bigBlink2.png',);

        //Load the 3rd blink image of a big player for the intro
        this.load.image('bigBlink3', 'assets/images/bigBlink3.png',);

        //Load the 4th blink image of a big player for the intro
        this.load.image('bigBlink4', 'assets/images/bigBlink4.png',);

        //Load the image of Oh text
        this.load.image('Oh', 'assets/images/Oh.png',);

        //Load the image of Shame text
        this.load.image('Shame', 'assets/images/Shame.png',);

        //Load the image of You Made It To text
        this.load.image('YouMadeItTo', 'assets/images/YouMadeItTo.png',);

        //Load the image of Good Innings text
        this.load.image('innings', 'assets/images/innings.png',);

        //Load the image of empty health bar
        this.load.image('healthbar', 'assets/images/healthbar.png',);

        //Load the image of health segment
        this.load.image('healthSegment', 'assets/images/healthSegment.png',);

        //Load the spritesheet for player and people
        this.load.spritesheet('blinkgif', 'assets/images/blinksheet_100px.png', { frameWidth: 50, frameHeight: 94 });

        //Load the spritesheet for player and people
        this.load.spritesheet('person', 'assets/images/person.png', { frameWidth: 50, frameHeight: 94 });

        // //Load the spritesheets for NPCs
        this.load.spritesheet('people', 'assets/images/person.png', { frameWidth: 50, frameHeight: 94 });

        //Move to the Play scene when these are loaded
        this.load.on(`complete`, () => {
            this.createAnims();
            this.scene.start(`title`); //Load title page once booted
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
