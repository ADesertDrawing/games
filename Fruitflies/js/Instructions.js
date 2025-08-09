class Instructions extends Phaser.Scene {
    constructor() {
        super({
            key: `instructions`
        });
    }

    preload() {

    }

    create() {
        this.image = this.add.image(400, 300, 'instructions').setScale(0.4);
        this.image = this.add.image(400, 300, 'border');

        // Listen for key press or mouse click to go to Play
        this.input.keyboard.on('keydown', () => {
            this.scene.start('bigplayerintro');
        });

        this.input.on('pointerdown', () => {
            this.scene.start('bigplayerintro');
        });

        if (this.input.gamepad.total > 0) {
            this.pad = this.input.gamepad.gamepads[0];
            console.log('Gamepad already connected in Instructions:', this.pad.id);
        } else {
            this.input.gamepad.once('connected', (pad) => {
                console.log('Gamepad connected in Instructions:', pad.id);
                this.pad = pad;
            });
        }


    }

    update() {
        if (this.pad) {
            const threshold = 0.5;
            const axisX = this.pad.axes[0]?.getValue() || 0;
            const axisY = this.pad.axes[1]?.getValue() || 0;

            if (
                this.pad.buttons[0]?.pressed || // button press
                Math.abs(axisX) > threshold ||  // stick moved left/right
                Math.abs(axisY) > threshold     // stick moved up/down
            ) {
                this.scene.start('bigplayerintro');
            }
        }
    }
}
