class BigPlayerIntro extends Phaser.Scene {
    constructor() {
        super({
            key: `bigplayerintro`
        });
    }

    preload() {

    }

    create() {

        this.image = this.add.image(400, 300, 'border');
        this.image = this.add.image(400, 850, 'personBig').setScale(.5);
        // Listen for key press or mouse click to go to Play
        this.input.keyboard.on('keydown', () => {
            this.scene.start('play');
        });

        this.input.on('pointerdown', () => {
            this.scene.start('play');
        });
    }





    update() {

    }

}