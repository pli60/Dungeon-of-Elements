class Play extends Phaser.Scene {
    constructor() {
            super("playScene");
        }

    //lerp helper function
    lerp(start, end, amt) {
            return (1 - amt) * start + amt * end
    }

    //helper clamp function
    clamp(min, max,num ){
            return num < min ? min : num > max ? max : num;
    }

    //normalize vector
    normalize(vector) {
            var len = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            return {
                x: vector.x / len,
                y: vector.y / len
            };
    }

    //calculate look at rotation
    lookAt(x, y) {
            var angle = Math.atan2(y, x);
            return angle;
    }

    //helper absolute value function
    abs(num) {
            return num < 0 ? -num : num;
    }

    //offset a point with an angle and distance
    offset(angle, distance) {
            var x = distance * Math.cos(angle);
            var y = distance * Math.sin(angle);
            return {
                x: x,
                y: y
            };
    }

    //code from example
    constrainReticle(reticle)
    {
        var distX = reticle.x-player.x;
        var distY = reticle.y-player.y;

        // Ensures reticle cannot be moved offscreen
        if (distX > 512)
            reticle.x = player.x+512;
        else if (distX < -512)
            reticle.x = player.x-512;

        if (distY > 288)
            reticle.y = player.y+288;
        else if (distY < -288)
            reticle.y = player.y-288;
    }

    // spawn a test bullet
    spawnBullet (x, y, angle) {
        let bullet = this.physics.add.sprite(centerX,centerY, 'indicator');
        this.playerBullets.add(bullet);
        bullet.setOrigin(0.5, 0.5);
        bullet.setPosition(x, y);
        bullet.setRotation(angle);
        bullet.body.velocity.x = Math.cos(angle) * (500) + player.body.velocity.x/2;
        bullet.body.velocity.y = Math.sin(angle) * (500) + player.body.velocity.y/2;
        bullet.setSize(32, 32).setDisplaySize(32, 32);
        this.time.delayedCall(1000, () => {
            bullet.destroy();
        });
    }

    preload ()
    {
        //this.load.spritesheet('player', 'assets/sprites/mage.png',
            //{ frameWidth: 64, frameHeight: 64 }
        //);

        this.load.image('player', 'assets/sprites/mage.png');
        this.load.image('background', 'assets/sprites/background.png');
        this.load.image('target', 'assets/sprites/cross.png');
        this.load.image('indicator', 'assets/sprites/ball.png');
        this.load.image('bullet', 'assets/sprites/ball.png');
        
    }

    create ()
    {

        this.physics.world.setBounds(0, 0, 1024, 576);

        this.playerBullets = this.physics.add.group()//{ classType: Bullet, runChildUpdate: true });
        //enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });


        var background = this.add.image(0, 0, 'background');
        //var background =this.add.rectangle(0, 0, 1024, 576, 0x000000).setOrigin(0, 0);
        player = this.physics.add.sprite(centerX,centerY, 'player');
        reticle = this.physics.add.sprite(centerX,centerY, 'target');
        indi = this.physics.add.sprite(centerX,centerY, 'indicator');

        background.setOrigin(0, 0)
        player.setOrigin(0.5, 0.5).setDisplaySize(64, 64).setCollideWorldBounds(true).setDrag(1500, 1500);
        reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);
        indi.setOrigin(0.5, 0.5).setSize(32, 32).setDisplaySize(32, 32).setCollideWorldBounds(false);
        
        //this.cameras.main.zoom = 1;

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.aimAngle = 0;

        //code modified from phaser example
        // Fires bullet
        this.input.on('pointerdown', function (pointer, time, lastFired) {
            if (player.active === false)
                return;

            // Get bullet from bullets group
            var bullet = this.spawnBullet(indi.x, indi.y, this.aimAngle);
            // if (bullet)
            // {
            //     //this.physics.add.collider(enemy, bullet, enemyHitCallback);
            // }
        }, this);

        // Locks pointer on mousedown
        game.canvas.addEventListener('mousedown', function () {
            game.input.mouse.requestPointerLock();
        });

        // Exit pointer lock when Q or escape (by default) is pressed.
        this.input.keyboard.on('keydown_Q', function (event) {
            if (game.input.mouse.locked)
                game.input.mouse.releasePointerLock();
        }, 0, this);

        // update reticle upon locked pointer move
        this.input.on('pointermove', function (pointer) {
            if (this.input.mouse.locked)
            {
                reticle.x += pointer.movementX;
                reticle.y += pointer.movementY;
                if(reticle.x > player.x){
                    player.setFlipX(false);
                    //player.setFlipY(false);
                }else{
                    player.setFlipX(true);
                    //player.setFlipY(true);
                }
            }
        }, this);



        player.body.setMaxVelocity(300);
        //player utility variables
        this.speedCap = 300;
        this.speedScale = 1;
        // this.speed = 0;
        // this.speedScale = 1;
        // this.speedCap = 300;
        // this.isDashing = false;
    }


    update (time, delta)
    {
        // Rotates player to face towards reticle
        this.aimAngle = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);
        //player.rotation = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);

        //update shooter indicator
        this.indiVector = this.offset(this.aimAngle, 64);
        indi.x = player.x + this.indiVector.x;
        indi.y = player.y + this.indiVector.y;

        if (keyA.isDown) {
            player.setAccelerationX(-600);

            //test
            player.setFlipX(true);

        }
        else if (keyD.isDown) {
            player.setAccelerationX(600);
            //flip
            player.setFlipX(false);
        }
         else {
            player.setAccelerationX(0);

         }

         if (keyESC.justDown) {
            if (game.input.mouse.locked){
                game.input.mouse.releasePointerLock();
            }
        }
        


        //player.setAccelerationX(this.speed);
        this.cameras.main.startFollow(player);

        
        reticle.body.velocity.x = player.body.velocity.x;
        reticle.body.velocity.y = player.body.velocity.y;
        indi.body.velocity.x = player.body.velocity.x;
        indi.body.velocity.y = player.body.velocity.y;
        this.constrainReticle(reticle);
        

    }
}