class BigPlayerIntro extends Phaser.Scene {
    constructor() {
        super({
            key: `bigplayerintro`
        });
    }

    preload() {

    }

    create() {
        //Gap between each frame in the blink animation
        const blinkTime = 20;
        //Adding border and Big Player images
        this.image = this.add.image(400, 300, 'border');
        this.personBigImage = this.add.image(400, 850, 'personBig').setScale(.5);
        //Adding the frames in the blink animation and destroying them one by one

        this.time.delayedCall(1500, () => {
            this.personBigImage.destroy();
            this.blinkFrame2 = this.add.image(400, 850, 'bigBlink2').setScale(0.5);

            this.time.delayedCall(blinkTime, () => {
                this.blinkFrame2.destroy();
                this.blinkFrame3 = this.add.image(400, 850, 'bigBlink3').setScale(0.5);

                this.time.delayedCall(blinkTime, () => {
                    this.blinkFrame3.destroy();
                    this.blinkFrame4 = this.add.image(400, 850, 'bigBlink4').setScale(0.5);

                    this.time.delayedCall(blinkTime, () => {
                        this.blinkFrame4.destroy();
                        this.blinkFrame5 = this.add.image(400, 850, 'bigBlink3').setScale(0.5);

                        this.time.delayedCall(blinkTime, () => {
                            this.blinkFrame5.destroy();
                            this.blinkFrame6 = this.add.image(400, 850, 'bigBlink2').setScale(0.5);

                            this.time.delayedCall(blinkTime, () => {
                                this.blinkFrame6.destroy();
                                this.blinkFrame7 = this.add.image(400, 850, 'personBig').setScale(0.5);

                                this.time.delayedCall(2000, () => {
                                    this.blinkFrame7.destroy();
                                    this.zoomingOut();
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    zoomingOut() {

        this.zoomingImage = this.add.image(400, 850, 'personBig').setScale(0.5);

        //Tweening the size of the person down to the sprite size
        this.tweens.add({
            targets: this.zoomingImage,
            scaleX: 0.03,
            scaleY: 0.03,
            x: 400,
            y: 300,
            duration: 1000,
            ease: 'Sine'

        });
        this.time.delayedCall(1000, () => {
            this.scene.start('play');
        });
    }



    update() {

    }

}