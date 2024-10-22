class Title extends Phaser.Scene {
    constructor() {
        super({
            key: `title`
        });
    }

    preload() {

    }

    create() {
        this.image = this.add.image(400, 300, 'border');

        this.image = this.add.image(400, 250, 'fruitfliesTitle').setScale(.4);

        this.image = this.add.image(400, 470, 'fruitfliesName').setScale(.4);

        // Listen for key press or mouse click to go to instructions
        this.input.keyboard.on('keydown', () => {
            this.scene.start('instructions');
        });

        this.input.on('pointerdown', () => {
            this.scene.start('instructions');
        });
    }

    update() {

    }

}