class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture,  element = 0, type = 0, sp = false) {
        super(scene, x, y, texture);
        this.scene = scene;
        scene.add.existing(this);
        scene.enemies.add(this);
        //this.sfxFire = scene.sound.add('sfx_fire') 

        this.body.setMaxVelocity(350);

        //enemy stat
        this.health = 5;
        this.element = element;
        this.type = type;

        this.detectRange = 1280;
        this.AttackRange = 200;
        this.state = 0;
        this.takingHit = false;
        this.attackCD = 0;
        this.dead = false;

        this.speedScale = 1;
        this.speed = 1;
        this.interval = 0;
        this.stopped = false;
        this.floatmoving = false;
        this.lastAngle = null;
        this.setOrigin(0.5, 0.5).setDisplaySize(64, 64).setCollideWorldBounds(true).setDrag(600, 600);
        
        //this.setTint(Phaser.Display.Color.GetColor(50, 0, 0));
    }

    move(){
        if(this.state == 1 & this.stopped == false){
            //console.log(this.stopped)
            if(this.type == 0){
                //this.floatmoving = true;
                var targetAngle = Phaser.Math.Angle.Between(this.x,this.y, player.x,player.y);
                if(this.lastAngle == null){
                    this.lastAngle = targetAngle;
                }
                targetAngle = Phaser.Math.Angle.RotateTo(this.lastAngle, targetAngle, 2.3);
                this.lastAngle = targetAngle;
                if(this.stopped == false){
                    this.scene.physics.velocityFromRotation(targetAngle, 700, this.body.acceleration);
                }
                //this.scene.physics.velocityFromRotation(targetAngle, 800, this.body.acceleration);
        
                this.scene.time.delayedCall(300, function(){
                    this.body.acceleration.x = 0;
                    this.body.acceleration.y = 0;
                }, [], this);

                this.scene.time.delayedCall(1000, this.move, [], this);

                //this.scene.time.delayedCall(1000, this.move, [], this);
            }
            else{
                this.setDrag(30, 30)
                this.setMaxVelocity(150 * this.speedScale)
                
                this.floatmoving = true;
            }
        }else{
            //console.log('stop')
        }

        // var diff = targetAngle - this.rotation;
        // if(diff > 2.7){
        //     if(diff < 0){
        //         nextAngle = this.rotation + 1.5;
        //     }else{
        //         nextAngle = this.rotation - 1.5;
        //     }
        //     //nextAngle = this.rotation + 0.1;
        // }else{
        //     nextAngle = targetAngle;
        // }

        //nextAngle = Phaser.Math.Angle.RotateTo(this.angle, targetAngle, 0.9);

        //nextAngle = rotate towrad targetAngle by 15 degree step
    
    }
    

    hit(element = 0){
        if(this.state != 4){
            if(this.takingHit == false){
                this.floatmoving = false;
                if(this.type != 0){
                    this.scene.enemies.remove(this);
                }
                this.tweenHit = this.scene.tweens.add({
                        targets: this,
                        alpha: 0,
                        ease: 'Power2',
                        duration: 150,
                        yoyo: true,
                        loop: 0,
                    });
                this.state = 3;
                var damage = 1;
                if(element!= 0){
                    if(element % 3 + 1 == this.element){
                        damage = 3;
                    }
                }
                var targetAngle = Phaser.Math.Angle.Between(player.x,player.y,this.x,this.y);
                this.scene.physics.velocityFromRotation(targetAngle, 150 * damage, this.body.velocity);
                this.health -= damage;
                //this.stopped == true;
                if(this.health <= 0){
                    this.die();
                }else{
                    this.takingHit = true;
                    this.scene.time.delayedCall(320, function(){
                        if(this.type != 0){
                            this.scene.enemies.add(this);
                        }
                        this.takingHit = false;
                        this.state = 0;
                        //this.scene.time.delayedCall(1000, this.attack, [], this);
                        //this.state = 0
                        //this.floatmoving = true;
                    }, [], this);
                    
                }
            }
        }
    }


    attack(){
        if(this.state == 2 & this.attackCD == 0){
            console.log(this.state);
            if(this.type == 5){
                //this.floatmoving = true;
                //shoot bullet towards player
                this.state = 1;
                this.scene.time.delayedCall(1000, this.move, [], this);
            }
            else{
                
                this.body.acceleration.x = 0;
                this.body.acceleration.y = 0;
                var targetAngle;
                this.scene.time.delayedCall(970, function(){
                    this.floatmoving = false;
                    targetAngle = Phaser.Math.Angle.Between(this.x,this.y, player.x,player.y);
                    this.setMaxVelocity(400 * this.speedScale);
                    this.setDrag(600, 600);
                }, [], this);
                this.scene.time.delayedCall(1000, function(){
                    this.scene.physics.velocityFromRotation(targetAngle, 1800 * this.speed, this.body.acceleration);

                    this.scene.time.delayedCall(300/this.speedScale, function(){
                        this.body.acceleration.x = 0;
                        this.body.acceleration.y = 0;

                        if(this.state != 4){
                            this.state = 0;
                            this.scene.time.delayedCall(500, function(){
                                if(this.type != 0){
                                    this.setDrag(300, 300);
                                    this.setMaxVelocity(150 * this.speedScale)
                                }
                            }, [], this);

                            //this.scene.time.delayedCall(1000, this.move, [], this);
                        }
                    }, [], this);
                }, [], this);

                //this.scene.time.delayedCall(1000, this.move, [], this);
            }
        }else{
            this.state = 0;
            //this.scene.time.delayedCall(1000, this.move, [], this);
        }
    }

    die(){
        this.state = 4;
        this.setDrag(1000);
        this.scene.enemies.remove(this);
        this.dieTween = this.scene.tweens.add({
            targets: this,
            tint: {from:200, to:0},
            alpah: 0,
            duration: 3000,
        });
        this.tweenHit = this.scene.tweens.add({
            targets: this,
            alpha: 0,
            ease: 'Power2',
            duration: 1500,
            loop: 0,
        });

        
        this.scene.time.delayedCall(3000, function(){
            this.destroy();
        }, [], this);
    }

    update() {
        //if player is in range
        if(Phaser.Math.Distance.Between(this.x,this.y, player.x,player.y) < this.detectRange){
            if(this.x > player.x){
                this.setFlipX(false);
                //player.setFlipY(false);
            }else{
                this.setFlipX(true);
                //player.setFlipY(true);
            }
            // AI behaviour tree
            if(Phaser.Math.Distance.Between(this.x,this.y, player.x,player.y) < this.AttackRange){
                if(this.state == 1 & this.attackCD == 0){
                    this.state = 2;
                    this.attack();
                    this.attackCD = 600;
                }
            }
            
            if(this.state == 0){
                this.state = 1;
                this.move();
            }

            if(this.attackCD > 0){
                this.attackCD -= 1;
            }

            
        }
        else{
            if(this.state == 1 || this.state == 2){
                this.state = 0;
                this.velocity = (0,0);
            }
        }
        if(this.floatmoving == true & this.type!=0){
            var targetAngle = Phaser.Math.Angle.Between(this.x,this.y, indi.x,indi.y);
            //targetAngle = Phaser.Math.DegToRad(this.targetAngle);
            var targetAcc = this.scene.physics.velocityFromRotation(targetAngle, 6 * this.speedScale);
            this.body.velocity.x += targetAcc.x;
            this.body.velocity.y += targetAcc.y;
        }
    }
}

