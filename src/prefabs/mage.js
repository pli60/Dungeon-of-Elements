class mage extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, sp = false) {
        super(scene, x, y, texture);
        this.isFiring = false;
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this); 
        this.body.setDrag(800);
        this.activing = false;
        this.setDepth(2)
        //this.sfxFire = scene.sound.add('sfx_fire') 

        this.body.setMaxVelocity(300);
        //player utility variables
        this.speedCap = 300;
        this.speedScale = 1;
        scene.cameras.main.startFollow(this);
        this.cd = 0;

        this.holding = false;
        this.holdDuration = 0;
        this.charged = false;
        this.lockedGem = null;

        this.circle = this.scene.physics.add.sprite(this.x,this.y, 'circle').setVisible(false).setActive(false);
        this.arrow = this.scene.physics.add.sprite(this.x,this.y, 'arrow').setVisible(false).setActive(false).setOrigin(0.5,0.5).setScale(0.2);//.setAlpha(0.5);
        this.playerRing = this.scene.physics.add.sprite(centerX,centerY, 'highlight').setScale(0.6).setDepth(1);
        this.weapon = 0;

        this.setOrigin(0.5, 0.5).setDisplaySize(64, 64).setCollideWorldBounds(true).setDrag(1500, 1500);


        scene.input.on('pointerdown', function (pointer, time, lastFired) {
            if (player.active === false)
                return;
            if(this.cd == 0){
                if(this.holding == false){
                    this.holding = true;
                }else{
                    if(this.charged){
                        this.tween.stop();
                    }
                    this.holding = false;   
                    this.checkCharge(false);
                    this.holdDuration = 0;
                    this.charged = false;
                }
            }
        }, this);

        scene.input.on('pointerup', function (pointer, time, lastFired) {
            if (player.active === false)
                return;
            this.cd = 5;
            if(true){
                if(this.charged){
                    this.tween.stop();
                }
                //this.scene.cameras.main.zoom = 1;
                this.checkCharge(false);
                if(this.holding == true & this.activing == false){
                    //normal attack
                    if(this.charged == false){
                        
                        this.scene.sound.play('shoot');
                        if(this.weapon == 0) {
                            var bullet = scene.spawnBullet(indi.x, indi.y, scene.aimAngle,this.weapon, 1);
                        }else{
                            var bullet = scene.spawnBullet(indi.x, indi.y, scene.aimAngle,this.weapon, 0);
                            var bullet = scene.spawnBullet(indi.x, indi.y, scene.aimAngle+1,this.weapon, 0);
                            var bullet = scene.spawnBullet(indi.x, indi.y, scene.aimAngle-1,this.weapon, 0);
                        }
                    //charged attack
                    }else{
                        this.cd = 15;
                        if(this.weapon == 0){
                            //get gem
                            this.scene.gemsGroup.getChildren().forEach(this.getgem, this);
                        }else{
                            //release gem
                            this.lockedGem.release();
                            this.switchWeapon(0);
                        }
                        //this.checkCharge(false);
                        this.charged = false;
                    }
                }
                this.holding = false;
                //this.setScale(1);
                this.holdDuration = 0;
            }

        }, this);


        // Locks pointer on mousedown
        game.canvas.addEventListener('mousedown', function () {
            game.input.mouse.requestPointerLock();
        });

        // Exit pointer lock when Q or escape (by default) is pressed.
        // scene.input.keyboard.on('keydown_Q', function (event) {
        //     if (game.input.mouse.locked)
        //         game.input.mouse.releasePointerLock();
        // }, 0, scene);

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

    //switch the size of the indi
    switchSize() {
        if (this.weapon == 0) {
            indi.setScale(1);
            this.weapon = 1;
        } else {  
            indi.setScale(0.5);
            this.weapon = 0;
        }
    }


    switchWeapon(element) {
        this.weapon = element;
    }
    

    update() {
        if(this.cd > 0){
            this.cd -= 1;
        }
        if(this.holding){
            //this.setScale(1.1);
            this.holdDuration += 1;
            if(this.holdDuration > 60 & this.holdDuration < 180){
                this.circle.setVisible(true).setActive(true);
                this.circle.scale = this.scene.lerp(0,3,this.holdDuration/180);
                this.scene.cameras.main.zoom = this.scene.lerp(1,0.96,this.holdDuration/180);
            }
            if(this.holdDuration > 180 & this.charged == false & this.activing == false){
                this.charged = true;
                
                this.checkCharge(true);
            }
        }
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
            //this.switchSize();
            //this.scene.gemsGroup.getChildren().forEach(this.check, this);
        }

        if(this.circle.active == true){
            this.circle.x = this.x;
            this.circle.y = this.y;
            this.circle.body.velocity.x = this.body.velocity.x;
            this.circle.body.velocity.y = this.body.velocity.y;
        }
        if(this.playerRing.active == true){
            this.playerRing.x = this.x;
            this.playerRing.y = this.y;
            this.playerRing.setRotation(this.scene.aimAngle);
            this.playerRing.body.velocity.x = this.body.velocity.x;
            this.playerRing.body.velocity.y = this.body.velocity.y;
        }
        if(this.arrow.active == true){
            this.arrowVector = this.scene.offset(this.scene.aimAngle,128);
            this.arrow.x = this.x + this.arrowVector.x;
            this.arrow.y = this.y + this.arrowVector.y;
            this.arrow.setRotation(this.scene.aimAngle + 1.571);
            this.arrow.body.velocity.x = this.body.velocity.x;
            this.arrow.body.velocity.y = this.body.velocity.y;
        }

    }

    checkCharge(reset){
        if(!reset){
            this.tween1 = this.scene.tweens.add({
                targets: this.scene.cameras.main,
                zoom: 1,
                ease: 'Power2',
                duration: 300,
        });
            this.scene.gemsGroup.getChildren().forEach(this.uncheck, this);
            this.circle.body.velocity.x = 0;
            this.circle.body.velocity.y = 0;
            this.arrow.body.velocity.x = 0;
            this.arrow.body.velocity.y = 0;
            this.circle.setVisible(false).setActive(false);
            this.arrow.setVisible(false).setActive(false);
        }else{
            if(this.weapon == 0){
                //this.scene.cameras.main.zoom = 0.8;
                
                this.tween = this.scene.tweens.add({
                    targets: this.scene.cameras.main,
                    zoom: 0.9,
                    ease: 'Power3',
                    duration: 250,
            });

                this.scene.gemsGroup.getChildren().forEach(this.check, this);
                this.circle.setVisible(true).setActive(true);
                this.circle.scale = 4.5;
            }else{
                this.lockedGem.showCircle();
                this.arrow.setVisible(true).setActive(true);
            }
        }
    }

    check(target){
        target.check();
        //target.checking = true;
    }

    uncheck(target){
        target.uncheck();
    }

    getgem(target){
        target.pickup();
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}
