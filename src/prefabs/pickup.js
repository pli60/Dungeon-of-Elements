class Pickup extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, number = 0, target) {
        // call Phaser Physics Sprite constructor
        super(scene, x, y, texture);
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
        this.playerRing = this.scene.add.sprite(this.x, this.y, 'lightRing').setScale(1).setDepth(2).setVisible(true);
        this.playerRing.alpha = 0.2;
        //tween
        this.tween = this.scene.tweens.add({
            targets: this.playerRing,
            alpha: { from: 0.2, to: 0.3 },
            scale: { from: 1, to: 0.99 },
            ease: 'Linear',
            duration: 500,
            repeat: -1,
            yoyo: true
        });
        this.arrow = this.scene.physics.add.sprite(this.x, this.y, 'arrow').setVisible(false).setActive(false).setOrigin(0.5, 0.5).setScale(0.2);//setAlpha(0.7);
        this.arrow.alpha = 0.7;
        //delay 3 seconds then call move()
        //this.scene.time.delayedCall(1000, this.move, [], this);
        //this.move();




    }


    update() {
        //this.position.x += 1;
        if (this.active) {
            if (this.activing == true & this.actived == false) {
                var targetAngle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y - 48);
                //targetAngle = Phaser.Math.DegToRad(this.targetAngle);
                var targetAcc = this.scene.physics.velocityFromRotation(targetAngle, 80);
                this.body.velocity.x += targetAcc.x;
                this.body.velocity.y += targetAcc.y;
                //check if the gem is close enough
                if (Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y - 48) < 32) {
                    this.actived = true;
                    this.activing = false;
                    this.scene.inLevel = true;
                    //this.scene.pickupReady.play()
                    if (this.number != 0) {
                        this.scene.levelSwitch(this.number, false);
                        this.scene.levelSwitch((this.number) % 3 + 1, true);
                        this.scene.levelSwitch((this.number + 1) % 3 + 1, true);
                    } else {
                        this.scene.levelSwitch(1, true);
                        this.scene.levelSwitch(2, true);
                        this.scene.levelSwitch(3, true);
                        this.scene.levelSwitch(0, false);
                    }
                }
            } else {
                this.playerRing.angle -= 0.2;
                if (Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) < 216 & this.actived == false & this.end == false) {
                    this.activing = true;
                    this.scene.pickupReady.play()
                    this.playerRing.setVisible(false);
                }
            }
            if (this.actived == true & this.end == false) {

                if (this.scene.level != 0) {
                    this.indiVector = this.scene.offset(Phaser.Math.DegToRad(-this.angle), 48);
                } else {
                    this.aimAngle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
                    //console.log(this.aimAngle);
                    if (this.arrow.active == false) {
                        this.arrow.setActive(true).setVisible(true);
                    }
                    this.indiVector = this.scene.offset(this.aimAngle, 52);

                    this.arrowVector = this.scene.offset(this.aimAngle, 72);
                    this.arrow.x = this.x + this.arrowVector.x;
                    this.arrow.y = this.y + this.arrowVector.y;
                    this.arrow.setRotation(this.aimAngle + 1.571);
                    this.arrow.body.velocity.x = this.body.velocity.x;
                    this.arrow.body.velocity.y = this.body.velocity.y;
                }
                this.x = player.x + this.indiVector.x;
                this.y = player.y + this.indiVector.y;
                this.body.velocity.x = player.body.velocity.x;
                this.body.velocity.y = player.body.velocity.y;
                this.angle += 1;
                //if close enough to target
                if (Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y) < 200) {
                    this.end = true;

                    this.arrow.setActive(false).setVisible(false);
                }
            } else if (this.end == true) {
                var targetAngle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y - 48);
                //targetAngle = Phaser.Math.DegToRad(this.targetAngle);
                var targetAcc = this.scene.physics.velocityFromRotation(targetAngle, 40);
                this.body.velocity.x += targetAcc.x;
                this.body.velocity.y += targetAcc.y;
                if (Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y - 48) < 32) {
                    this.angle = 0;
                    this.body.velocity.x = 0;
                    this.body.velocity.y = 0;
                    this.x = this.target.x;
                    this.y = this.target.y - 72;
                    if (this.number != 0) {
                        this.scene.levelSwitch((this.number) % 3 + 1, false);
                        this.scene.levelSwitch((this.number + 1) % 3 + 1, false);
                    } else {
                        this.scene.levelSwitch(1, false);
                        this.scene.levelSwitch(2, false);
                        this.scene.levelSwitch(3, false);
                    }
                    this.scene.levelCheck(this.number);
                    this.scene.pickupDone.play()
                    this.destroy();
                    this.actived = false;
                    this.end = false;
                    this.active = false;

                }
            }
        } else {
            this.playerRing.angle -= 0.5;
        }
    }


    release() {
        //this.body.velocity.x = 100;
    }

    die() {
        this.active = false;
    }
}