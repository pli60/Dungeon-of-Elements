class Gem extends Phaser.Physics.Arcade.Sprite {
    constructor(scene,x,y, element = 0, sp = true) {
            // call Phaser Physics Sprite constructor
            super(scene, x, y, elementSprites[element]);
            scene.add.existing(this);
            //scene.physics.add.existing(this); 
            scene.gemsGroup.add(this);

            //this.body.velocity.x = 10000;
            this.body.setDrag(1200);
            this.body.setAllowDrag(true);
            this.body.setBounce(1);
            //this.body.setDamping(true);
            this.body.setCollideWorldBounds(true);
            this. circle = this.scene.physics.add.sprite(this.x,this.y, 'circle').setVisible(false).setActive(false);
            
            

            this.setOrigin(0.5, 0.5);
            //this.setPosition(x, y);
            //this.setRotation(angle);
            this.setDepth(2);

            this.element = element;
            this.actived = false;
            this.cooldown = 0;
            this.end = false;
            this.checking = false;
            this.ready = false;


    }

    update() {
        //this.position.x += 1;
        if(this.actived == true){
            this.x = indi.x;
            this.y = indi.y;
            this.body.velocity.x = indi.body.velocity.x;
            this.body.velocity.y = indi.body.velocity.y;
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
            this.actived = true;
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
        this.body.velocity.x = Math.cos(this.scene.aimAngle) * (1500);
        this.body.velocity.y = Math.sin(this.scene.aimAngle) * (1500);
        //this.body.velocity.x = 100;
    }

    die(){
            this.destroy();
    }
    
}