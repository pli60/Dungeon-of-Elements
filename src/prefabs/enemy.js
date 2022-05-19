class enemyBase extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, sp = false) {
        super(scene, x, y, texture);
        this.isFiring = false;
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this); 
        //this.sfxFire = scene.sound.add('sfx_fire') 

        this.body.setMaxVelocity(300);
        //player utility variables
        this.speedCap = 300;
        this.speedScale = 1;

        this.weapon = 0;

        this.setOrigin(0.5, 0.5).setDisplaySize(64, 64).setCollideWorldBounds(true).setDrag(1500, 1500);

    }


    switchSize() {

    }



    update() {
        if (keyA.isDown) {
            player.setAccelerationX(-1500);
            //player.setAccelerationY(0);

            //test
            player.setFlipX(true);

        }
        else if (keyD.isDown) {
            player.setAccelerationX(1500);
            ///player.setAccelerationY(0);

            //test
            player.setFlipX(false);
        }       
        else {
            player.setAccelerationX(0);


        }

        if (keyW.isDown) {
            player.setAccelerationY(-1500);
            //player.setAccelerationX(0);

            //test

        }
        else if (keyS.isDown) {
            player.setAccelerationY(1500);
           // player.setAccelerationX(0);

            //test

        }
        else {
            player.setAccelerationY(0);

        }
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.switchSize();
        }

    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}
