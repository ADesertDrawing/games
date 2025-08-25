class Title extends Phaser.Scene {
    constructor() {
        super({
            key: `title`
        });
        // This will track the input state from the previous frame
        this.wasPushedLastFrame = false;
    }

    preload() {

    }

    create() {

        // Resume the global animation manager
        this.anims.resumeAll();

        this.image = this.add.image(400, 300, 'border');
        this.image = this.add.image(400, 250, 'fruitfliesTitle').setScale(.2);
        this.image = this.add.image(400, 470, 'fruitfliesName').setScale(.2);

        ////////////CAN COMMENT OUT THIS PART FOR THE KEYBOARD VERSION
        //  Add joystick anim
        this.button = this.add.sprite(700, 500, 'button').play('button_anim');
        this.button.setDepth(10);
        this.button.setScale(0.5);
        /////////////////////////////////////////

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
        if (this.pad) {
            const threshold = 0.5;
            const axisX = this.pad.axes[0]?.getValue() || 0;
            const axisY = this.pad.axes[1]?.getValue() || 0;

            // Check if any button or the stick is currently pushed
            const isPushedNow = this.pad.buttons[0]?.pressed ||
                Math.abs(axisX) > threshold ||
                Math.abs(axisY) > threshold;

            // ADVANCE CONDITION: Only if it's pushed now AND it wasn't pushed last frame.
            if (isPushedNow && !this.wasPushedLastFrame) {

                this.sound.unlock();
                // Pass data to the next scene to tell it the input was just used.
                this.scene.start('instructions', { inputUsed: true });
            }

            // IMPORTANT: Update the state for the next frame at the end of the loop.
            this.wasPushedLastFrame = isPushedNow;
        }
    }
}



