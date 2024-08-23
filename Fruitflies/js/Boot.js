class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: `boot`
        });
    }

    preload() {
        //Load the player view/perspective triangle
        this.load.image(`view`, `assets/images/view.png`,);

        //Load the spritesheet for player
        this.load.spritesheet('person', 'assets/images/person.png', { frameWidth: 50, frameHeight: 94 });

        //Load the spritesheets for NPCs
        this.load.spritesheet('people', 'assets/images/person.png', { frameWidth: 50, frameHeight: 94 });

        //Move to the Play scene when these are loaded
        this.load.on(`complete`, () => {
            this.scene.start(`play`);
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
