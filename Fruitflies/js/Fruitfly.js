class Fruitfly extends Phaser.Scene {
    constructor() {
        super({
            key: `fruitfly`
        });
    }
    create() {
        this.fruitfly = this.add.image(100, 100, 'person');
        this.fruitfly.setTint(0xdd3333);
    }


    update() {

    }
}
