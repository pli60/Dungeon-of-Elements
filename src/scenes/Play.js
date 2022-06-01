class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    //lerp helper function
    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end
    }

    //helper clamp function
    clamp(min, max, num) {
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
    constrainReticle(reticle) {
        var distX = reticle.x - player.x;
        var distY = reticle.y - player.y;

        // Ensures reticle cannot be moved offscreen
        if (distX > 512)
            reticle.x = player.x + 512;
        else if (distX < -512)
            reticle.x = player.x - 512;

        if (distY > 288)
            reticle.y = player.y + 288;
        else if (distY < -288)
            reticle.y = player.y - 288;
    }

    //spawn a test bullet
    spawnBullet (x, y, angle, element = 0, type = 0) {
        var bullet = new BulletBase(this, x, y, elementSprites[element], 500, angle, element);

        bullet.setDepth(2);


    }
    spawnLevel() {
        this.spawnEnemy(0, centerY,1,1);
        this.spawnEnemy(1024, centerY,1,2);
        this.spawnEnemy(1024, centerY-180,1,3);
        this.spawnGem(900, centerY - 180, 3);
        this.spawnGem(200, centerY - 180, 1);
        this.spawnGem(900, centerY + 180, 2);
        this.spawnGem(200, centerY + 180, 3);
    }
    spawnEnemy(x, y, element = 1, type = 1) {
        //let enemy = this.physics.add.sprite(x, y, 'player');
        if (type == 1) {
            let enemy = new Enemy(this, x, y, elements[element - 1] + enemyTypes[type - 1], element, type - 1);
            enemy.setScale(0.6,0.6);
            enemy.speed = 0.3;
            enemy.health = 3;
            enemy.AttackRange = 168;
            enemy.body.setSize(50,50);
        }
        else if (type == 2) {
            let enemy = new Enemy(this, x, y, elements[element - 1] + enemyTypes[type - 1], element, type - 1);
            enemy.setScale(0.6,0.6);
            enemy.body.setSize(50,70);
        }
        else if (type == 3) {
            let enemy = new Enemy(this, x, y, elements[element - 1] + enemyTypes[type - 1], element, type - 1);
            enemy.setScale(0.6,0.6);
            enemy.body.setSize(80,120);
            enemy.speedScale = 0.5;
            enemy.speed = 0.2;
            enemy.AttackRange = 220;
            enemy.health = 13;
        }

    }

    spawnGem(x, y, element = 0) {
        let gem = new Gem(this, x, y, element);
        //this.gemsGroup.add(gem);
    }

    enemyHit(enemy, bullet) {
        enemy.hit(bullet.element);
        //currScene.spawnEnemy(enemy.x, Phaser.Math.Between(centerY - 288, centerY + 288));
        if (bullet.name == 'bullet') {
            bullet.hit();
        }
    }

    playerHit(enemy, player) {
        player.hit(0);
        enemy.hit(player);
    }

    preload() {
        //tilemap
        this.load.spritesheet("tilemap", "assets/map/tilemap.png", {
            frameWidth: 50,
            frameHeight: 50
        });

        //this.load.tilemapTiledJSON("dungeon_map", "assets/map/dungeon.json");

        //this.load.spritesheet('player', 'assets/sprites/mage.png',
        //{ frameWidth: 64, frameHeight: 64 }
        //);

        //main asset
        this.load.spritesheet('player', 'assets/sprites/mage_all.png', { frameWidth: 100, frameHeight: 100, startFrame: 0, endFrame: 9 });
        this.load.image('background', 'assets/grass.png');
        this.load.image('target', 'assets/sprites/cross.png');
        this.load.image('indicator', 'assets/sprites/ball.png');

        //enemies
        this.load.spritesheet('fireghost', 'assets/sprites/fireghost.png', { frameWidth: 100, frameHeight: 100, startFrame: 0, endFrame: 4 });
        this.load.spritesheet('lightningghost', 'assets/sprites/lightningghost.png', { frameWidth: 100, frameHeight: 100, startFrame: 0, endFrame: 4 });
        this.load.spritesheet('waterghost', 'assets/sprites/waterghost.png', { frameWidth: 100, frameHeight: 100, startFrame: 0, endFrame: 4 });
        this.load.spritesheet('fireslime', 'assets/sprites/fireslime.png', { frameWidth: 50, frameHeight: 50, startFrame: 0, endFrame: 11 });
        this.load.spritesheet('lightningslime', 'assets/sprites/lightningslime.png', { frameWidth: 50, frameHeight: 50, startFrame: 0, endFrame: 11 });
        this.load.spritesheet('waterslime', 'assets/sprites/waterslime.png', { frameWidth: 50, frameHeight: 50, startFrame: 0, endFrame: 11 });
        this.load.spritesheet('fireskeleton', 'assets/sprites/fireskeleton.png', { frameWidth: 150, frameHeight: 200, startFrame: 0, endFrame: 4 });
        this.load.spritesheet('waterskeleton', 'assets/sprites/waterskeleton.png', { frameWidth: 150, frameHeight: 200, startFrame: 0, endFrame: 4 });
        this.load.spritesheet('lightningskeleton', 'assets/sprites/lightningskeleton.png', { frameWidth: 150, frameHeight: 200, startFrame: 0, endFrame: 4 });


        //objects
        this.load.image('bullet', 'assets/sprites/ball.png');
        this.load.image('waterGem', 'assets/sprites/WaterGem.png');
        this.load.image('fireGem', 'assets/sprites/FireGem.png');
        this.load.image('lightningGem', 'assets/sprites/LightningGem.png');

        //VFX
        this.load.image('circle', 'assets/sprites/Circle.png');
        this.load.image('ball', 'assets/sprites/Circle2.png');
        this.load.image('arrow', 'assets/sprites/arrow.png');
        this.load.image('highlight', 'assets/sprites/Ring.png');
        this.load.image('magi1', 'assets/sprites/MAGI1.png');
        this.load.image('magi2', 'assets/sprites/MAGI2.png');

        //audio
        this.load.audio('shoot', 'assets/shoot.wav');

    }

    create() {
        this.gameOver = false;
        //world size
        this.physics.world.setBounds(0, 0, 1024, 576);
        currScene = this;

        // add a tile set to the map
        // first parameter: the name we gave the tileset when we added it to Tiled
        // second parameter: the key for the tile sheet we loaded above, in preload
        // https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.Tilemap.html#addTilesetImage__anchor
        //const tileset = map.addTilesetImage("kenney_colored_packed", "1bit_tiles");
        // create a new tilemap layer
        // https://newdocs.phaser.io/docs/3.54.0/Phaser.Tilemaps.Tilemap#createLayer
        //const worldLayer = map.createLayer("worldMap", tileset, 0, 0);
        // //load map
        // map = this.add.tilemap("dungeon_map");
        // map.addTilesetImage("tilemap");
        // groundLayer = map.createLayer("dungeon", tileset, 0, 0);

        // groundLayer.setCollisionByProperty({ 
        //     collides: true 
        // });


        //add tile map
        this.add.tilemap("dungeon_map");
        //const tileset = map.addTilesetImage("tilemap");
        //const groundLayer = map.createLayer("dungeon", tileset, 0, 0);

        //animations
        this.anims.create({
            key: 'player_move',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 6,
        });
        this.anims.create({
            key: 'player_attack1',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 7 }),
            frameRate: 15,
        });
        this.anims.create({
            key: 'player_attack2',
            frames: this.anims.generateFrameNumbers('player', { start: 7, end: 9 }),
            frameRate: 15,
        });

        this.anims.create({
            key: 'a_fireghost',
            frames: this.anims.generateFrameNumbers('fireghost', { start: 0, end: 4 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'a_waterghost',
            frames: this.anims.generateFrameNumbers('waterghost', { start: 0, end: 4 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'a_lightningghost',
            frames: this.anims.generateFrameNumbers('lightningghost', { start: 0, end: 4 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'a_fireslime',
            frames: this.anims.generateFrameNumbers('fireslime', { start: 0, end: 11 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'a_waterslime',
            frames: this.anims.generateFrameNumbers('waterslime', { start: 0, end: 11 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'a_lightningslime',
            frames: this.anims.generateFrameNumbers('lightningslime', { start: 0, end: 11 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'a_fireskeleton',
            frames: this.anims.generateFrameNumbers('fireskeleton', { start: 0, end: 4 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'a_waterskeleton',
            frames: this.anims.generateFrameNumbers('waterskeleton', { start: 0, end: 4 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'a_lightningskeleton',
            frames: this.anims.generateFrameNumbers('lightningskeleton', { start: 0, end: 4 }),
            frameRate: 30,
            repeat: -1
        });

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
        //player.anims.play('player_move');
        //player.anims.add('player_attack');

        reticle = this.physics.add.sprite(centerX, centerY, 'target');
        indi = this.physics.add.sprite(centerX, centerY, 'indicator');
        // this.physics.add.collider(this.p1, groundLayer);


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
        this.physics.add.collider(this.enemies, this.playerBullets, this.enemyHit);
        this.physics.add.collider(this.enemies, player, this.playerHit);

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
        this.Text = this.add.text(game.config.width / 2, game.config.height / 5 * 3, 'long HOLD <mouse buttons> to pick gems', menuConfig).setOrigin(0.5);

    }



    update(time, delta) {
        player.update();

        this.aimAngle = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);
        // Rotates player to face towards reticle
        //player.rotation = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);
        this.indiVector = this.offset(this.aimAngle, 64);
        indi.x = player.x + this.indiVector.x;
        indi.y = player.y + this.indiVector.y;


        if (keyESC.justDown) {
            if (game.input.mouse.locked) {
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