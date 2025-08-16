class Instructions extends Phaser.Scene {
    constructor() {
        super({
            key: `instructions`
        });
        // Initialize the state tracker here as well.
        this.wasPushedLastFrame = false;
    }

    // Add the init() method to receive data from the previous scene
    init(data) {
        // If the 'inputUsed' data was passed, it means the player is holding the
        // joystick from the last screen. We set our initial state to 'true'
        // to prevent an immediate skip.
        if (data.inputUsed) {
            this.wasPushedLastFrame = true;
        }
    }

    preload() {

    }

    create() {

        // Resume the global animation manager
        this.anims.resumeAll();

        this.image = this.add.image(400, 300, 'instructions').setScale(0.4);
        this.image = this.add.image(400, 300, 'border');

        ////////////CAN COMMENT OUT THIS PART FOR THE KEYBOARD VERSION
        //Add joystick anim
        this.joystick = this.add.sprite(700, 500, 'joystick').play('joystick_anim');
        this.joystick.setDepth(10);
        this.joystick.setScale(0.5);
        //////////////////////////////////////////////////////

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

            // Check if any button or the stick is currently pushed
            const isPushedNow = this.pad.buttons[0]?.pressed ||
                Math.abs(axisX) > threshold ||
                Math.abs(axisY) > threshold;

            // ADVANCE CONDITION: Only if it's pushed now AND it wasn't pushed last frame.
            if (isPushedNow && !this.wasPushedLastFrame) {

                this.sound.resume();
                this.scene.start('bigplayerintro');
            }

            // IMPORTANT: Update the state for the next frame at the end of the loop.
            this.wasPushedLastFrame = isPushedNow;
        }
    }

}
