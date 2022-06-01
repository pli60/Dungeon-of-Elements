class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture,  element = 0, type = 0, sp = false) {
        super(scene, x, y, texture);
        this.scene = scene;
        scene.add.existing(this);
        scene.enemies.add(this);
        //this.sfxFire = scene.sound.add('sfx_fire') 

        this.body.setMaxVelocity(400);

        //enemy stat
        this.health = 5;
        this.element = element;
        this.type = 0;

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
        this.floatmoving = true;
        this.lastAngle = null;

        this.setOrigin(0.5, 0.5).setDisplaySize(64, 64).setCollideWorldBounds(true).setDrag(600, 600);
        
        //this.setTint(Phaser.Display.Color.GetColor(50, 0, 0));
    }

    move(){
        if(this.state == 1){
            if(this.type == 1){
                this.floatmoving = true;
            }
            else{
                this.floatmoving = true;
                var targetAngle = Phaser.Math.Angle.Between(this.x,this.y, player.x,player.y);
                if(this.lastAngle == null){
                    this.lastAngle = targetAngle;
                }
                targetAngle = Phaser.Math.Angle.RotateTo(this.lastAngle, targetAngle, 2.3);
                this.lastAngle = targetAngle;
                this.scene.physics.velocityFromRotation(targetAngle, 800, this.body.acceleration);
        
                this.scene.time.delayedCall(300, function(){
                    this.body.acceleration.x = 0;
                    this.body.acceleration.y = 0;
                }, [], this);
        
                this.scene.time.delayedCall(1000, this.move, [], this);
            }
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
                // this.scene.time.delayedCall(150, function(){
                //     this.body.acceleration.x = 0;
                //     this.body.acceleration.y = 0;
                // }, [], this);
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
                if(this.health <= 0){
                    this.die();
                }else{
                    this.takingHit = true;
                    this.scene.time.delayedCall(300, function(){
                        this.takingHit = false;
                        this.state = 0;
                    }, [], this);
                }
            }
        }

    }


    attack(){
        if(this.state == 2 & this.attackCD == 0){
            console.log(this.state);
            if(this.type == 2){
                //this.floatmoving = true;
                //shoot bullet towards player
                this.state = 1;
                this.scene.time.delayedCall(1000, this.move, [], this);
            }
            else{
                this.body.acceleration.x = 0;
                this.body.acceleration.y = 0;
                this.floatmoving = false;
                var targetAngle;
                this.scene.time.delayedCall(960, function(){
                    targetAngle = Phaser.Math.Angle.Between(this.x,this.y, player.x,player.y);
                }, [], this);
                this.scene.time.delayedCall(1000, function(){
                    this.scene.physics.velocityFromRotation(targetAngle, 2000, this.body.acceleration);
                    this.scene.time.delayedCall(300, function(){
                        this.body.acceleration.x = 0;
                        this.body.acceleration.y = 0;
                        if(this.state != 4){
                            this.state = 1;
                            this.scene.time.delayedCall(1500, this.move, [], this);
                        }
                    }, [], this);
                }, [], this);

                //this.scene.time.delayedCall(1000, this.move, [], this);
            }
        }else{
            this.state = 0;
            this.scene.time.delayedCall(1000, this.move, [], this);
        }
    }

    die(){
        this.state = 4;
        this.setDrag(1000);
        this.scene.enemies.remove(this);
        this.dieTween = this.scene.tweens.add({
            targets: this,
            tint: {from:255, to:0},
            alpah: 0,
            duration: 3000,
        });
        // this.scene.tweens.addCounter({
        //     targets: this.tint,
        //     from: 200,
        //     to: 0,
        //     duration: 5000,
        //     // onUpdate: function (tween)
        //     // {
        //     //     const value = Math.floor(tween.getValue());

        //     //     this.setTint(Phaser.Display.Color.GetColor(value, value, value));
        //     // }
        // });
        
        this.scene.time.delayedCall(3000, function(){
            this.destroy();
        }, [], this);
    }

    update() {
        //if player is in range
        if(Phaser.Math.Distance.Between(this.x,this.y, player.x,player.y) < this.detectRange){
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
            }
        }
    }
}

