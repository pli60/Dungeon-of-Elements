class BulletBase extends Phaser.Physics.Arcade.Sprite {
    constructor(scene,x,y,texture,velocity,angle,type = 0, element = 0, sp = true) {
            // call Phaser Physics Sprite constructor
            super(scene, x, y, texture);
            scene.add.existing(this);
            scene.playerBullets.add(this);

            //this.body.setDrag(800);
            this.setOrigin(0.5, 0.5);
            //this.setPosition(x, y);
            this.setRotation(angle);
            this.setDepth(3);
            this.end = false;
            this.body.velocity.x = Math.cos(angle) * (velocity) + player.body.velocity.x;
            this.body.velocity.y = Math.sin(angle) * (velocity) + player.body.velocity.y;
            scene.physics.add.collider(scene.enemies, scene.playerBullets, scene.enemyHit);
            if(type == 0){
                this.setSize(32, 32).setDisplaySize(32, 32);
            }
            else{
                this.setSize(64, 64).setDisplaySize(64, 64);
            }
            scene.time.delayedCall(1500, () => {
                this.die();
             });

    }

    update() {

    }

    hit(){

    }

    die(){
            this.destroy();
    }
    
}