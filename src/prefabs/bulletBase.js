class BulletBase extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, sp = true) {
            // call Phaser Physics Sprite constructor
            super(scene, 0, -100, 'bullet');
            this.randNum = Math.floor(Math.random() * 8 + 1);
            this.anglestart =85 + this.randNum * 5;
            this.angletest = Phaser.Math.Between(this.anglestart, this.anglestart - 40);
            this.angletest = Phaser.Math.DegToRad(this.angletest);
            //set the x position to 
            this.x = this.randNum * 90 - 45;
            //this.x = 45;
            // set up physics sprite Phaser.Math.Between(-600, 0)
            scene.add.existing(this);               // add to existing scene, displayList, updateList
            scene.physics.add.existing(this); // add to physics system
            this.sp = sp;
            this.over = false;
            this.scene = scene;      // scene reference
            this.velocity = velocity;

            this.rotspeed = Phaser.Math.Between(-1, 1);


            scene.physics.velocityFromRotation(this.angletest, velocity, this.body.velocity)
            //this.body.velocity = {x: 0, y: velocity};
            this.setImmovable();
            this.tint = Math.random() * 0xFFFFFF;   // randomize tint
            this.newObstacle = true;                 // custom property to control barrier spawning
            this.body.setSize(this.width - 5, this.height -5);

    }

    update() {
            // add new log when previous log hits centerY
            // if (this.newObstacle && this.y < centerY) {
            //         this.newObstacle = false;
            //         this.scene.addObstacle(this.parent, this.velocity);
            // }
            
            this.angle += this.rotspeed;
            //stop moving if gameover
            //this.body.velocity.y = 0;
            if(this.over == true){
                    this.body.velocity.y = this.scene.lerp(this.velocity, 0, this.scene.progress/3000);
                    // if(this.body.velocity.y > 0){
                    //         this.body.velocity.y -= 5;
                    // }else{
                    //         this.body.velocity.y = 0;
                    // }
            }
            // destroy log if it reaches the bottom of the screen
            if (this.y > this.height + this.scene.game.config.height) {
                    this.destroy();
            }
    }

    stop(){

            //this.body.velocity.y = 0;
            this.over = true;

    }
}