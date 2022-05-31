class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture,  element = 0, type = 0, sp = false) {
        super(scene, x, y, texture);
        this.scene = scene;
        scene.add.existing(this);
        scene.enemies.add(this);
        //this.sfxFire = scene.sound.add('sfx_fire') 

        this.body.setMaxVelocity(300);

        //enemy stat
        this.health = 5;
        this.element = element;
        this.type = 0;

        this.detectRange = 1280;
        this.AttackRange = 256;
        this.state = 0;
        this.takingHit = false;

        this.speedScale = 1;
        this.speed = 1;
        this.interval = 0;
        this.stopped = false;
        this.floatmoving = true;
        this.lastAngle = null;

        this.setOrigin(0.5, 0.5).setDisplaySize(64, 64).setCollideWorldBounds(true).setDrag(600, 600);

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
                this.scene.physics.velocityFromRotation(targetAngle, 1200, this.body.acceleration);
        
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
        if(this.takingHit == false){
            this.state = 3;
            var damage = 1;
            if(element!= 0){
                if(element % 3 + 1 == this.element){
                    damage = 3;
                }
            }
            this.health -= damage;
            if(this.health <= 0){
                this.die();
            }else{
                this.takingHit = true;
                this.scene.time.delayedCall(500, function(){
                    this.takingHit = false;
                    this.state = 0;
                }, [], this);
            }
        }

    }


    attack(){
        if(this.state = 2){

            if(this.type == 2){
                //this.floatmoving = true;
                //shoot bullet towards player
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
                    this.scene.physics.velocityFromRotation(targetAngle, 1600, this.body.acceleration);
                }, [], this);
        
                this.scene.time.delayedCall(250, function(){
                    this.body.acceleration.x = 0;
                    this.body.acceleration.y = 0;
                }, [], this);
                
                //this.scene.time.delayedCall(1000, this.move, [], this);
            }
            this.state = 1;
            this.scene.time.delayedCall(1000, this.move, [], this);
        }
    }

    die(){
        this.state = 4;
        this.setDrag(1000);
        this.scene.enemies.remove(this);
        this.dieTween = this.scene.tweens.add({
            targets: this,
            tint: 0xFFFFFF,
            ease: 'Power2',
            duration: 1500,
    });
        this.scene.time.delayedCall(1500, function(){
            this.destroy();
        }, [], this);
    }

    update() {
        //if player is in range
        if(Phaser.Math.Distance.Between(this.x,this.y, player.x,player.y) < this.detectRange){
            // if(Phaser.Math.Distance.Between(this.x,this.y, player.x,player.y) < this.detectRange){
            //     if(this.state == 1 | this.state == 0){
            //         this.state = 2;
            //         this.attack();
            //     }
            // }
            if(this.state == 0){
                this.state = 1;
                this.move();
            }
        }
        // AI behaviour tree

    }
}
