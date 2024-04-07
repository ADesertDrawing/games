class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: `boot`
        });
    }

    preload() {

        //Spritesheet
        this.load.spritesheet('person', 'assets/images/person.png', { frameWidth: 50, frameHeight: 94 });

        this.load.on(`complete`, () => {
            this.scene.start(`play`);
        });

    }

    create() {
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
