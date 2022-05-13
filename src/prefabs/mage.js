class mage extends Phaser.Physics.Arcade.Sprite {
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
        scene.cameras.main.startFollow(this);

        this.setOrigin(0.5, 0.5).setDisplaySize(64, 64).setCollideWorldBounds(true).setDrag(1500, 1500);

        scene.input.on('pointerdown', function (pointer, time, lastFired) {
            if (player.active === false)
                return;
            var bullet = scene.spawnBullet(indi.x, indi.y, scene.aimAngle);
            //scene.physics.add.sprite(x,y, 'indicator');
            // if (bullet)
            // {
            //     //this.physics.add.collider(enemy, bullet, enemyHitCallback);
            // }
        }, scene);

        // Locks pointer on mousedown
        game.canvas.addEventListener('mousedown', function () {
            game.input.mouse.requestPointerLock();
        });

        // Exit pointer lock when Q or escape (by default) is pressed.
        scene.input.keyboard.on('keydown_Q', function (event) {
            if (game.input.mouse.locked)
                game.input.mouse.releasePointerLock();
        }, 0, scene);

        // update reticle upon locked pointer move
        scene.input.on('pointermove', function (pointer) {
            if (this.input.mouse.locked)
            {
                reticle.x += pointer.movementX;
                reticle.y += pointer.movementY;
                if(reticle.x > player.x){
                    player.setFlipX(false);
                    //player.setFlipY(false);
                }else{
                    player.setFlipX(true);
                    //player.setFlipY(true);
                }
            }
        }, scene);
    }

    update() {
        if (keyA.isDown) {
            player.setAccelerationX(-600);

            //test
            player.setFlipX(true);

        }
        else if (keyD.isDown) {
            player.setAccelerationX(600);

            //test
            player.setFlipX(false);
        }
         else {
            player.setAccelerationX(0);

         }

    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}
