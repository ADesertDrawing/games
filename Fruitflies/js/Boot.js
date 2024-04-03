class Boot extends Phaser.Scene {


    constructor() {
        super({
            key: `boot`
        });
    }

    preload() {
        //Preloading the person movement images
        this.load.image(`personW`, 'assets/images/personW.png');
        this.load.image(`personNW`, 'assets/images/personNW.png');
        this.load.image(`personN`, 'assets/images/personN.png');
        this.load.image(`personNE`, 'assets/images/personNE.png');
        this.load.image(`personE`, 'assets/images/personE.png');
        this.load.image(`personSE`, 'assets/images/personSE.png');
        this.load.image(`personS`, 'assets/images/personS.png');
        this.load.image(`personSW`, 'assets/images/personSW.png');
        this.load.image(`view`, 'assets/images/view.png');

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
