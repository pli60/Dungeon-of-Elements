class Pickup extends Phaser.Physics.Arcade.Sprite {
    constructor(scene,x,y, number = 0, target) {
            // call Phaser Physics Sprite constructor
            super(scene, x, y, elementSprites[0]);
            scene.add.existing(this);
            scene.physics.add.existing(this); 

            this.scene = scene;
            this.number = number;
            this.body.setDrag(600);
            
            this.setOrigin(0.5, 0.5);
            this.setDepth(2);
            this.body.setMaxVelocity(500);
            this.target = target;

            this.actived = false;
            this.activing = false;

            this.ready = false;

            this.end = false;
            this.done = false;

            this.indiVector = null;

            //delay 3 seconds then call move()
            //this.scene.time.delayedCall(1000, this.move, [], this);
            //this.move();




    }


    update() {
        //this.position.x += 1;
        if(this.active){
            if(this.activing == true & this.actived == false){
                var targetAngle = Phaser.Math.Angle.Between(this.x,this.y, player.x,player.y - 48);
                //targetAngle = Phaser.Math.DegToRad(this.targetAngle);
                var targetAcc = this.scene.physics.velocityFromRotation(targetAngle, 80);
                this.body.velocity.x += targetAcc.x;
                this.body.velocity.y += targetAcc.y;
                //check if the gem is close enough
                if(Phaser.Math.Distance.Between(this.x,this.y, player.x,player.y - 48) < 32){
                    this.actived = true;
                    this.activing = false;
                    this.scene.inLevel = true;
                    if(this.number != 0){
                        this.scene.levelSwitch(this.number,false);
                        this.scene.levelSwitch((this.number)%3+1,true);
                        this.scene.levelSwitch((this.number+1)%3+1,true);
                    }
                }
            }else{
                if(Phaser.Math.Distance.Between(this.x,this.y, player.x,player.y) < 256){
                    this.activing = true;
                }
            }
            if(this.actived == true & this.end == false){

                if(this.scene.level != 0){
                    this.indiVector = this.scene.offset(Phaser.Math.DegToRad(-this.angle), 48);
                }else{
                    this.aimAngle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
                    //console.log(this.aimAngle);
                    this.indiVector = this.scene.offset(this.aimAngle, 52);
                }
                this.x = player.x + this.indiVector.x;
                this.y = player.y + this.indiVector.y;
                this.body.velocity.x = player.body.velocity.x;
                this.body.velocity.y = player.body.velocity.y;
                this.angle += 1;
                //if close enough to target
                if(Phaser.Math.Distance.Between(this.x,this.y, this.target.x,this.target.y) < 200){
                    this.end = true;
                }
            }else if(this.end == true){
                var targetAngle = Phaser.Math.Angle.Between(this.x,this.y, this.target.x,this.target.y - 48);
                //targetAngle = Phaser.Math.DegToRad(this.targetAngle);
                var targetAcc = this.scene.physics.velocityFromRotation(targetAngle, 40);
                this.body.velocity.x += targetAcc.x;
                this.body.velocity.y += targetAcc.y;
                if(Phaser.Math.Distance.Between(this.x,this.y, this.target.x,this.target.y-48) < 32){
                    this.body.velocity.x =0;
                    this.body.velocity.y =0;
                    this.x = this.target.x;
                    this.y = this.target.y-48;
                    if(this.number != 0){
                        this.scene.levelSwitch((this.number)%3+1,false);
                        this.scene.levelSwitch((this.number+1)%3+1,false);
                    }
                    this.actived = false;
                    this.end = false;
                    this.active = false;

                }
            }
        }
    }


    release(){
        //this.body.velocity.x = 100;
    }

    die(){
            this.active = false;
    }
}