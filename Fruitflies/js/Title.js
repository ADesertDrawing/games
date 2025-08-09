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

        this.image = this.add.image(400, 250, 'fruitfliesTitle').setScale(.2);

        this.image = this.add.image(400, 470, 'fruitfliesName').setScale(.2);

        // Listen for key press or mouse click to go to instructions
        this.input.keyboard.on('keydown', () => {
            this.scene.start('instructions');
        });

        this.input.on('pointerdown', () => {
            this.scene.start('instructions');
        });

        if (this.input.gamepad.total > 0) {
            this.pad = this.input.gamepad.gamepads[0];
            console.log('Gamepad already connected in Title:', this.pad.id);
        } else {
            this.input.gamepad.once('connected', (pad) => {
                console.log('Gamepad connected in Title:', pad.id);
                this.pad = pad;
            });
        }
    }

    update() {

        // Check if any directional button is pressed
        if (this.pad) {
            const threshold = 0.5;
            const axisX = this.pad.axes[0]?.getValue() || 0;
            const axisY = this.pad.axes[1]?.getValue() || 0;

            if (
                this.pad.buttons[0]?.pressed || // button press
                Math.abs(axisX) > threshold || // stick moved left/right
                Math.abs(axisY) > threshold    // stick moved up/down
            ) {
                this.scene.start('instructions');
            }

        }
    }
}


