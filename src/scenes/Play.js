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

    //spawn a test bullet
    spawnBullet (x, y, angle, type = 0) {
        let bullet = this.physics.add.sprite(x,y, 'indicator');
        this.playerBullets.add(bullet);
        //play shoot sound
        this.sound.play('shoot');
        bullet.setOrigin(0.5, 0.5);
        bullet.setPosition(x, y);
        bullet.setRotation(angle);
        bullet.setDepth(2);
        bullet.body.velocity.x = Math.cos(angle) * (500) + player.body.velocity.x;
        bullet.body.velocity.y = Math.sin(angle) * (500) + player.body.velocity.y;
        if(type == 0){
            bullet.setSize(32, 32).setDisplaySize(32, 32);
        }
        else{
            bullet.setSize(64, 64).setDisplaySize(64, 64);
        }
        this.time.delayedCall(1000, () => {
            bullet.destroy();
         });
    }

    spawnEnemy(x, y) {
        let enemy = this.physics.add.sprite(x, y, 'player');
        this.enemies.add(enemy);
        enemy.setOrigin(0.5, 0.5);
        enemy.setPosition(x, y);
    }

    enemyHit(enemy, bullet) {
        enemy.destroy();
        currScene.spawnEnemy(enemy.x, Phaser.Math.Between(centerY - 288, centerY + 288));
        bullet.destroy();
    }

    preload ()
    {
        //this.load.spritesheet('player', 'assets/sprites/mage.png',
            //{ frameWidth: 64, frameHeight: 64 }
        //);

        this.load.image('player', 'assets/sprites/mage.png');
        this.load.image('background', 'assets/grass.png');
        this.load.image('target', 'assets/sprites/cross.png');
        this.load.image('indicator', 'assets/sprites/ball.png');
        this.load.image('bullet', 'assets/sprites/ball.png');
        this.load.audio('shoot', 'assets/shoot.wav');
        
    }

    create ()
    {
        //world size
        this.physics.world.setBounds(0, 0, 1024, 576);
        currScene = this;



        this.enemies = this.physics.add.group()
        this.playerBullets = this.physics.add.group()//{ classType: Bullet, runChildUpdate: true });
        //enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

        var background = this.add.image(0, 0, 'background');
        //var background =this.add.rectangle(0, 0, 1024, 576, 0x000000).setOrigin(0, 0);
        player = new mage(this, centerX, centerY, 'player');
        reticle = this.physics.add.sprite(centerX,centerY, 'target');
        indi = this.physics.add.sprite(centerX,centerY, 'indicator');

        background.setOrigin(0, 0)
        //player.setOrigin(0.5, 0.5).setDisplaySize(64, 64).setCollideWorldBounds(true).setDrag(1500, 1500);
        reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);
        indi.setOrigin(0.5, 0.5).setSize(32, 32).setDisplaySize(32, 32).setCollideWorldBounds(false);
        
        //this.cameras.main.zoom = 1;

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.aimAngle = 0;

        this.spawnEnemy(0, centerY);
        this.spawnEnemy(1024, centerY);

        let menuConfig = {
            fontFamily: 'Impact',
            fontSize: '28px',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.Text = this.add.text(game.config.width/2, game.config.height/5 * 3, 'Press <SPACE> to switch weapon', menuConfig).setOrigin(0.5);
        //this.physics.add.collider(this.enemies, this.playerBullets, this.enemyHit);

        //code modified from phaser example
        // Fires bullet
        // this.input.on('pointerdown', function (pointer, time, lastFired) {
        //     if (player.active === false)
        //         return;
        //     var bullet = this.spawnBullet(indi.x, indi.y, this.aimAngle);
        //     // if (bullet)
        //     // {
        //     //     //this.physics.add.collider(enemy, bullet, enemyHitCallback);
        //     // }
        // }, this);

        // // Locks pointer on mousedown
        // game.canvas.addEventListener('mousedown', function () {
        //     game.input.mouse.requestPointerLock();
        // });

        // // Exit pointer lock when Q or escape (by default) is pressed.
        // this.input.keyboard.on('keydown_Q', function (event) {
        //     if (game.input.mouse.locked)
        //         game.input.mouse.releasePointerLock();
        // }, 0, this);

        // // update reticle upon locked pointer move
        // this.input.on('pointermove', function (pointer) {
        //     if (this.input.mouse.locked)
        //     {
        //         reticle.x += pointer.movementX;
        //         reticle.y += pointer.movementY;
        //         if(reticle.x > player.x){
        //             player.setFlipX(false);
        //             //player.setFlipY(false);
        //         }else{
        //             player.setFlipX(true);
        //             //player.setFlipY(true);
        //         }
        //     }
        // }, this);




        // this.speed = 0;
        // this.speedScale = 1;
        // this.speedCap = 300;
        // this.isDashing = false;
    }


    update (time, delta)
    {
        player.update();

        this.aimAngle = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);
        // Rotates player to face towards reticle
        //player.rotation = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);
        this.indiVector = this.offset(this.aimAngle, 64);
        indi.x = player.x + this.indiVector.x;
        indi.y = player.y + this.indiVector.y;


         if (keyESC.justDown) {
            if (game.input.mouse.locked){
                game.input.mouse.releasePointerLock();
            }
        }
        //this.physics.add.collider(this.enemies, this.playerBullets, this.enemyHit);
        
        //player.setAccelerationX(this.speed);

        //this.physics.world.collide(this.enemies, this.playerBullets, this.DinoCollision, null, this);
        
        reticle.body.velocity.x = player.body.velocity.x;
        reticle.body.velocity.y = player.body.velocity.y;
        indi.body.velocity.x = player.body.velocity.x;
        indi.body.velocity.y = player.body.velocity.y;
        this.constrainReticle(reticle);
        

    }
}