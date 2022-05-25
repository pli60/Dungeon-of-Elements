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
    spawnBullet (x, y, angle, element = 0, type = 0) {
        var bullet = new BulletBase(this, x, y, elementSprites[element], 500, angle, type);
        bullet.setDepth(2);
        
        
    }

    spawnEnemy(x, y) {
        let enemy = this.physics.add.sprite(x, y, 'player');
        this.enemies.add(enemy);
        enemy.setOrigin(0.5, 0.5);
        enemy.setPosition(x, y);
    }

    spawnGem(x,y,element = 0){
        let gem = new Gem(this, x, y, element);
        //this.gemsGroup.add(gem);
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
        this.load.image('waterGem', 'assets/sprites/WaterGem.png');
        this.load.image('fireGem', 'assets/sprites/FireGem.png');
        this.load.image('lightningGem', 'assets/sprites/LightningGem.png');

        this.load.image('circle', 'assets/sprites/Circle.png');
        this.load.image('arrow', 'assets/sprites/arrow.png');

        this.load.audio('shoot', 'assets/shoot.wav');
        
    }

    create ()
    {
        //world size
        this.physics.world.setBounds(0, 0, 1024, 576);
        currScene = this;



        this.enemies = this.physics.add.group()
        this.enemies.runChildUpdate = true;
        this.enemies.active = true;

        this.playerBullets = this.physics.add.group()
        this.playerBullets.runChildUpdate = true;
        this.playerBullets.active = true;

        this.gemsGroup = this.physics.add.group()
        this.gemsGroup.runChildUpdate = true;
        this.gemsGroup.active = true;
        
        //{ classType: Bullet, runChildUpdate: true });
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

        this.zoomTarget = 1;
        this.zoomSpeed = 0;
        this.zoomType = 0;
        this.currentZoom = 1;
        this.zooming = false;

        this.aimAngle = 0;

        this.spawnLevel();

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
        this.Text = this.add.text(game.config.width/2, game.config.height/5 * 3, 'long HOLD <mouse buttons> to pick gems', menuConfig).setOrigin(0.5);

    }

    spawnLevel(){
        this.spawnEnemy(0, centerY);
        this.spawnEnemy(1024, centerY);
        this.spawnGem(900, centerY-180,3);
        this.spawnGem(200, centerY-180,1);
        this.spawnGem(900, centerY+180,2);
        this.spawnGem(200, centerY+180,3);
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
        indi.body.velocity.x = player.body.velocity.x;
        indi.body.velocity.y = player.body.velocity.y;
        reticle.body.velocity.x = player.body.velocity.x;
        reticle.body.velocity.y = player.body.velocity.y;

        
        this.constrainReticle(reticle);


        
        // if(this.zooming){
        //     this.cameras.main.zoom = this.lerp(this.currentZoom,this.zoomTarget,(this.zoomSpeed*delta)/1000);
        // }else{
        //     this.currentZoom = this.cameras.main.zoom;
        // }
    }
}