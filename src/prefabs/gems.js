class gem extends Phaser.Physics.Arcade.Sprite {
    constructor(scene,x,y,type = 0, element = 0, sp = true) {
            // call Phaser Physics Sprite constructor
            super(scene, x, y, texture);
            scene.add.existing(this);
            //scene.playerBullets.add(this);

            this.setOrigin(0.5, 0.5);
            //this.setPosition(x, y);
            //this.setRotation(angle);
            this.setDepth(2);
            this.active = false;
            this.cooldown = 0;

            this.end = false;
            this.body.velocity.x = Math.cos(angle) * (velocity) + player.body.velocity.x;
            this.body.velocity.y = Math.sin(angle) * (velocity) + player.body.velocity.y;
            if(type == 0){
                this.setSize(32, 32).setDisplaySize(32, 32);
            }
            else{
                this.setSize(64, 64).setDisplaySize(64, 64);
            }

    }

    update() {

    }

    hit(){

    }

    die(){
            this.destroy();
    }
    
}