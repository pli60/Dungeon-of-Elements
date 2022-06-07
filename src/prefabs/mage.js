class mage extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, sp = false) {
        super(scene, x, y, texture);
        this.isFiring = false;
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this); 
        this.body.setDrag(800);
        this.activing = false;
        this.setDepth(2);
        //this.sfxFire = scene.sound.add('sfx_fire') 
        this.attacking = false;
        this.walking = false;
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

        this.takingHit = false;

        this.health = 5;
        this.scene.walking.play();
        this.circle = this.scene.physics.add.sprite(this.x,this.y, 'circle').setVisible(false).setActive(false);
        this.arrow = this.scene.physics.add.sprite(this.x,this.y, 'arrow').setVisible(false).setActive(false).setOrigin(0.5,0.5).setScale(0.2);//.setAlpha(0.5);
        this.playerRing = this.scene.physics.add.sprite(centerX,centerY, 'highlight').setScale(0.6).setDepth(1);
        this.weapon = 0;

        this.body.setSize(72,72);
        //this.body.setSize(72,72);
        this.setOrigin(0.5, 0.5).setDisplaySize(64, 64).setCollideWorldBounds(true).setDrag(1500, 1500);
        let soundConfig = {
            volume: 0.4
        }

        this.particles = this.scene.add.particles('pt');

        this.emitter1 = this.particles.createEmitter({
            x: {min: 0, max: 100},
            y: {min:0, max: 100},
            speed: {min: 200, max: 220},
            lifespan: {min: 150, max: 200},

            frequency: 12,
            alpha: {start: 1, end: 0},
            scale: {min: 0.1, max: 0.2, end: 0},
            tint: 0xFFFFFF,
            on: false
        });
        this.emitter = this.particles.createEmitter({
            x: {min: 0, max: 100},
            y: {min:0, max: 100},
            speed: {min: 200, max: 220},
            lifespan: {min: 150, max: 200},

            frequency: 12,
            alpha: {start: 1, end: 0},
            scale: {min: 0.1, max: 0.2, end: 0},
            tint: 0xFFFFFF,
            on: false
        });
        scene.input.on('pointerdown', function (pointer, time, lastFired) {
            if (player.active === false)
                return;
            game.input.mouse.requestPointerLock();
            if(this.cd == 0){
                if(this.holding == false){
                    this.holding = true;
                    player.anims.play('player_attack1');
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
            game.input.mouse.requestPointerLock();
            if (player.active === false)
                return;
                //print player position to console log
                // console.log('x:'+ reticle.x + '   y:' + reticle.y);
                //console.log(scene.map.getTileAtWorldXY(reticle.x, reticle.y));
                //this.scene.levelSwitch(1,false);
                if(this.charged){
                    this.tween.stop();
                }
                
                //this.scene.cameras.main.zoom = 1;
                this.checkCharge(false);
                if(this.holding == true & this.activing == false){
                    this.cd = 15;
                    //normal attack
                    this.attacking = true;
                    //delay 250
                    this.scene.time.delayedCall(200, function(){
                        this.attacking = false;
                    }, [], this);
                    player.anims.play('player_attack2');
                    if(this.charged == false){
                        this.scene.shake(150,50,0.1);
                        //this.scene.sound.play('shoot');
                        if(this.weapon == 0) {
                            this.scene.sound.play('shoot',soundConfig);
                            var bullet = scene.spawnBullet(player.x, player.y, scene.aimAngle,this.weapon, 1);
                            var emitange = Phaser.Math.RadToDeg(scene.aimAngle);
                        }else{
                            this.scene.sound.play(elements[this.weapon-1]+'shot',soundConfig);
                            var bullet = scene.spawnBullet(player.x, player.y, scene.aimAngle,this.weapon, 0);
                            //var bullet = scene.spawnBullet(indi.x, indi.y, scene.aimAngle+1,this.weapon, 0);
                            //var bullet = scene.spawnBullet(indi.x, indi.y, scene.aimAngle-1,this.weapon, 0);
                        }
                        this.emitter.emitParticleAt(indi.x, indi.y, 5)
                        //particle emitter

                
                        
                    //charged attack
                    }else{
                        this.cd = 30;
                        if(this.weapon == 0){
                            //get gem
                            
                            this.scene.gemsGroup.getChildren().forEach(this.getgem, this);

                            this.emitter = this.particles.createEmitter({
                                x: {min: 0, max: 100},
                                y: {min:0, max: 100},
                                speed: {min: 100, max: 110},
                                lifespan: {min: 400, max: 450},
                                frequency: 12,
                                alpha: {start: 1, end: 0},
                                scale: {min: 0.1, max: 0.2, end: 0},
                                tint: colorcode[this.weapon-1],
                                on: false
                            });

                            this.emitter3 = this.particles.createEmitter({
                                speed: {min: 300, max: 310},
                                lifespan: {min: 800, max: 820},
                                frequency: 20,
                                alpha: {start: 1, end: 0},
                                scale: {min: 0.2, max: 0.25, end: 0},
                                tint: colorcode[this.weapon-1],
                                on: false
                            });

                            this.emitter3.emitParticleAt(this.x, this.y, 40);
                        }else{
                            this.emitter4 = this.particles.createEmitter({
                                x: {min: 0, max: 100},
                                y: {min:0, max: 100},
                                speed: {min: 300, max: 320},
                                lifespan: {min: 600, max: 800},
                                frequency: 30,
                                alpha: {start: 1, end: 0},
                                scale: {min: 0.3, max: 0.5, end: 0},
                                tint: colorcode[this.weapon-1],
                                on: false
                            });
                            this.emitter4.emitParticleAt(indi.x, indi.y, 8)
                            this.emitter.remove();
                            this.emitter = this.emitter1;
                            //release gem
                            this.scene.sound.play('spshot');
                            this.lockedGem.release();
                            this.switchWeapon(0);
                        }
                        this.scene.shake()
                        //this.checkCharge(false);
                        this.charged = false;
                    }
                }
                this.holding = false;
                //this.setScale(1);
                this.holdDuration = 0;
            

        }, this);


        // Locks pointer on mousedown
        this.locker = game.canvas.addEventListener('mousedown', function () {
            if(gamestate){
                game.input.mouse.requestPointerLock();
            }
            //game.input.mouse.requestPointerLock();
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

    hit(enemy){
        if(this.takingHit == false){
            this.tweenHit = this.scene.tweens.add({
                    targets: this,
                    alpha: 0,
                    ease: 'Power2',
                    duration: 100,
                    yoyo: true,
                    loop: 1,
                });
            var targetAngle = Phaser.Math.Angle.Between(enemy.x,enemy.y,this.x,this.y);
            this.health -= 1;
            //this.stopped == true;
            if(this.health <= 0){
                this.die();
            }else{
                this.takingHit = true;
                this.scene.physics.velocityFromRotation(targetAngle, 800, this.body.velocity);
                this.scene.time.delayedCall(400, function(){
                    this.takingHit = false;
                }, [], this);
                
            }
        }
    }

    switchWeapon(element) {
        this.weapon = element;
    }
    
    die(){
        // player.setActive(false);
        //stop playing walking
        //this.scene.cameras.main.flash(200, 50, 0, 0);
        this.scene.cameras.main.flash(200, 50, 0, 0);
        this.scene.walking.stop();
        this.circle.setVisible(false).setActive(false);
        this.arrow.setVisible(false).setActive(false);
        this.scene.sound.play('playerdeath');
        gamestate = false;
        this.scene.gameover();
    }

    update() {
        if(this.cd > 0){
            this.cd -= 1;
        }
        if(this.holding){
            //this.setScale(1.1);
            this.holdDuration += 1;
            this.setMaxVelocity(200);
            if(this.holdDuration > 45 & this.holdDuration < 150){
                this.circle.setVisible(true).setActive(true);
                this.circle.scale = this.scene.lerp(0,3,this.holdDuration/150);
                this.scene.cameras.main.zoom = this.scene.lerp(1,0.96,this.holdDuration/150);
            }
            if(this.holdDuration > 150 & this.charged == false & this.activing == false){
                this.charged = true;
                // let soundConfig = {
                //     volume: 0.5
                // }
                this.scene.sound.play('charge');
                this.checkCharge(true);
            }
        }else{
            this.setMaxVelocity(300);
        }

        if (keyA.isDown) {
            player.setAccelerationX(-1200);
            if(this.holding == false & this.attacking == false){
                player.anims.play('player_move',true);
                if(this.walking == false){
                    this.scene.walking.play();
                    this.walking = true;
                }
                

            }
            player.setFlipX(true);
        }
        else if (keyD.isDown) {
            player.setAccelerationX(1200);
            if(this.holding == false & this.attacking == false){
                player.anims.play('player_move',true);
                if(this.walking == false){
                    this.scene.walking.play();
                    this.walking = true;
                }

            }
            player.setFlipX(false);
        }       
        else {
            player.setAccelerationX(0);
            //this.scene.walking.stop();
        }

        if (keyW.isDown) {
            player.setAccelerationY(-1200);
            if(this.holding == false & this.attacking == false){
                player.anims.play('player_move',true);
                if(this.walking == false){
                    this.scene.walking.play();
                    this.walking = true;
                }

            }
        }
        else if (keyS.isDown) {
            player.setAccelerationY(1200);
            if(this.holding == false & this.attacking == false){
                player.anims.play('player_move',true);
                if(this.walking == false){
                    this.scene.walking.play();
                    this.walking = true;
                }
            }
        }
        else {
            player.setAccelerationY(0);
            
            //this.scene.walking.stop();

        }
        // if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
        //     //this.switchSize();
        //     //this.scene.gemsGroup.getChildren().forEach(this.check, this);
        // }
        if(player.body.velocity.x == 0 & player.body.velocity.y == 0){
            this.walking =false;
            this.scene.walking.stop();
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
            // this.playerRing.setRotation(this.scene.aimAngle);
            this.playerRing.body.velocity.x = this.body.velocity.x;
            this.playerRing.body.velocity.y = this.body.velocity.y;
            this.playerRing.angle -=0.3;
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
