class Gem extends Phaser.Physics.Arcade.Sprite {
    constructor(scene,x,y, element = 0, sp = true) {
            // call Phaser Physics Sprite constructor
            super(scene, x, y, elementSprites[element]);
            scene.add.existing(this);
            //scene.physics.add.existing(this); 
            scene.gemsGroup.add(this);

            //this.body.velocity.x = 10000;
            this.body.setDrag(600);
            this.body.setAllowDrag(true);
            this.body.setBounce(1);
            //this.body.setDamping(true);
            this.body.setCollideWorldBounds(true);
            this.circle = this.scene.physics.add.sprite(this.x,this.y, 'circle').setVisible(false).setActive(false);
            this.magi = this.scene.physics.add.sprite(this.x,this.y, 'ball').setVisible(false).setActive(false).setScale(0.2);
            this.magi.sp = true;
            this.magi.element = this.element;
            

            this.setOrigin(0.5, 0.5);
            //this.setPosition(x, y);
            //this.setRotation(angle);
            this.setDepth(2);
            this.body.setMaxVelocity(800);

            this.element = element;
            this.actived = false;
            this.activing = false;
            this.cooldown = 0;
            this.end = false;
            this.checking = false;
            this.ready = false;
            this.lastAngle = null;

            //delay 3 seconds then call move()
            //this.scene.time.delayedCall(1000, this.move, [], this);
            //this.move();




    }

    move(){
        var targetAngle = Phaser.Math.Angle.Between(this.x,this.y, player.x,player.y);
        if(this.lastAngle == null){
            this.lastAngle = targetAngle;
        }
        targetAngle = Phaser.Math.Angle.RotateTo(this.lastAngle, targetAngle, 2.3);
        this.lastAngle = targetAngle;
        this.scene.physics.velocityFromRotation(targetAngle, 1200, this.body.acceleration);

        this.scene.time.delayedCall(300, function(){
            this.body.acceleration.x = 0;
            this.body.acceleration.y = 0;
        }, [], this);

        this.scene.time.delayedCall(1000, this.move, [], this);

    }

    update() {
        //this.position.x += 1;
        if(this.activing == true & this.actived == false){
            var targetAngle = Phaser.Math.Angle.Between(this.x,this.y, indi.x,indi.y);
            //targetAngle = Phaser.Math.DegToRad(this.targetAngle);
            var targetAcc = this.scene.physics.velocityFromRotation(targetAngle, 80);
            this.body.velocity.x += targetAcc.x;
            this.body.velocity.y += targetAcc.y;
            //check if the gem is close enough to the indi
            if(Phaser.Math.Distance.Between(this.x,this.y, indi.x,indi.y) < 32){
                this.actived = true;
                this.activing = false;
                player.activing = false;
            }
        }
        if(this.actived == true){
            this.x = indi.x;
            this.y = indi.y;
            this.body.velocity.x = indi.body.velocity.x;
            this.body.velocity.y = indi.body.velocity.y;
            this.angle += 1;
        }else{
            //this.body.setDrag(800);
            if(this.cooldown > 0){
                this.cooldown -= 1;
            }
            if(this.velocity > 0){
                this.velocity -= 1;
            }else if(this.velocity < 0){
                this.velocity = 0;
            }
            if(this.checking){
                this.showCircle();
                this.angle -= 1;
                if(Phaser.Math.Distance.BetweenPoints(this, player) < 300){
                    var dist = Phaser.Math.Distance.BetweenPoints(this, reticle);
                    if(dist < 64){
                        this.circle.setScale(0.8);
                        this.ready = true;
                        if(player.lockedGem == null){
                            player.lockedGem = this;
                        }else if(player.lockedGem != this){
                            if(dist < Phaser.Math.Distance.BetweenPoints(player.lockedGem, reticle)){
                                player.lockedGem = this;
                            }
                        }else{
                            this.circle.setScale(1.2);
                        }
                    }else{
                        if(this.ready == true){
                            this.ready = false;
                            if(player.lockedGem == this){
                                player.lockedGem == null;
                            }
                        }
                    }
                    if(this.ready == false){
                        this.circle.setScale(0.8);
                    }
                }else{
                    this.circle.setScale(0.5);
                }
            }
        }
        if(this.circle.active == true){
            this.circle.x = this.x;
            this.circle.y = this.y;
            this.circle.body.velocity.x = this.body.velocity.x;
            this.circle.body.velocity.y = this.body.velocity.y;
        }
        if(this.magi.active == true){
            this.magi.x = this.x;
            this.magi.y = this.y;
            this.magi.body.velocity.x = this.body.velocity.x;
            this.magi.body.velocity.y = this.body.velocity.y;
        }
        
    }

    check(){
        if(this.actived == false){
            this.checking = true;
            //this.setScale(2);
        }
    }

    uncheck(){
            this.checking = false;
            this.circle.setScale(0.5);
            this.showCircle(false);
    }
    pickup(){
        if(player.lockedGem == this){
            this.activing = true;
            player.activing = true;
            this.showCircle(false);
            player.switchWeapon(this.element);
        }
        
    }

    showCircle(show = true){
        this.circle.body.velocity.x = 0;
        this.circle.body.velocity.y = 0;
        this.circle.setVisible(show).setActive(show);
    }

    release(){
        this.actived = false;
        player.lockedGem = null;
        this.cooldown=300;
        this.showCircle(false);
        //this.scene.physics.add.collider(this.scene.enemies, this, this.scene.enemyHit);
        this.body.velocity.x = Math.cos(this.scene.aimAngle) * (1500);
        this.body.velocity.y = Math.sin(this.scene.aimAngle) * (1500);
        this.magi.active = true;
        this.magi.visible = true;
        this.magi.setScale(0.2);
        this.scene.playerBullets.add(this.magi);
        //this.scene.playerBullets.add(this.magi);
        //this.scene.playerBullets.add(this);
        //delay call 3000
        this.scene.time.delayedCall(1000, function(){
            //tween magi size
            
            var killMagi = this.scene.tweens.add({
                targets: this.magi,
                scale: 0.01,
                ease: 'Linear',
                duration: 300,
                // onComplete: function(target = this.magi) {
                //     target.active = false;
                //     target.visible = false;
                // }
            });
        

        }, [], this);
        //delay 260
        this.scene.time.delayedCall(1300, function(){
            this.scene.playerBullets.remove(this.magi);
            this.magi.visible = false;
            this.magi.body.velocity.x = 0;
            this.magi.body.velocity.y = 0;
            this.magi.active = false;
            
            //this.magi.setScale(0.2);
        }, [], this);
        //this.body.velocity.x = 100;
    }

    die(){
            this.destroy();
    }

    hit(){
        //this.destroy();
    }
    
}