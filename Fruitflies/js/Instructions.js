class Instructions extends Phaser.Scene {
    constructor() {
        super({
            key: `instructions`
        });
    }

    preload() {

    }

    create() {
        this.image = this.add.image(400, 300, 'instructions').setScale(0.2);
        this.image = this.add.image(400, 300, 'border');

        // Listen for key press or mouse click to go to Play
        this.input.keyboard.on('keydown', () => {
            this.scene.start('bigplayerintro');
        });

        this.input.on('pointerdown', () => {
            this.scene.start('bigplayerintro');
        });


    }

    update() {

    }

}