class Healthbar {
    constructor(scene, x, y) {
        this.scene = scene;
        this.healthBar = this.scene.add.image(470, 60, 'healthbar').setDepth(1000).setScale(0.15);
        //Making the segments
        this.maxSegments = 30;
        //Making an array to put them in
        this.segments = [];
        //Track number of segments and set to max at start
        this.currentSegments = this.maxSegments;

        this.createHealthSegments();
    }

    createHealthSegments() {
        const startX = 183; //Starting x position
        const y = 60; //Y position for segments
        const segmentWidth = 19.5; //Width of segment

        //Create segments and position them
        for (let i = 0; i < this.maxSegments; i++) {
            const segment = this.scene.add.image(startX + i * segmentWidth, y, `healthSegment`)
                .setOrigin(0, 0.5)
                .setScale(0.1)
                .setDepth(1001);
            this.segments.push(segment);
        }
    }

    reduceHealth() {
        //Check if there are any segments left to hide
        if (this.currentSegments > 0) {
            const segmentToHide = this.segments[this.currentSegments - 1];
            segmentToHide.setVisible(false);
            this.currentSegments--;
        }
    }

    restoreHealth() {
        //Segments all back again
        this.segments.forEach(segment => segment.setVisible(true));
        this.currentSegments = this.maxSegments;
    }


    create() {



    }

    update() {

    }

}