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
    spawnBullet(x, y, angle, element = 0, type = 0) {
        var bullet = new BulletBase(this, x, y, elementSprites[element], 500, angle, element);

        bullet.setDepth(2);

    }
    // spawnLevel() {
    //     this.spawnEnemy(0, centerY,1,1);
    //     this.spawnEnemy(1024, centerY,1,2);
    //     this.spawnEnemy(1024, centerY-180,1,3);
    //     this.spawnGem(900, centerY - 180, 3);
    //     this.spawnGem(200, centerY - 180, 1);
    //     this.spawnGem(900, centerY + 180, 2);
    //     this.spawnGem(200, centerY + 180, 3);
    // }
    spawnEnemy(x, y, element = 1, type = 1) {
        //let enemy = this.physics.add.sprite(x, y, 'player');
        //randome between 1 and 3 integers
        if (type == 1) {
            let enemy = new Enemy(this, x, y, elements[element - 1] + enemyTypes[type - 1], element, type - 1);
            enemy.setScale(0.6, 0.6);
            enemy.speed = 0.3;
            enemy.health = 3;
            enemy.AttackRange = 168;
            enemy.body.setSize(50, 50);
            this.physics.add.collider(enemy, this.mainLayer);
        }
        else if (type == 2) {
            let enemy = new Enemy(this, x, y, elements[element - 1] + enemyTypes[type - 1], element, type - 1);
            enemy.setScale(0.6, 0.6);
            enemy.body.setSize(50, 70);
        }
        else if (type == 3) {
            let enemy = new Enemy(this, x, y, elements[element - 1] + enemyTypes[type - 1], element, type - 1);
            enemy.setScale(0.6, 0.6);
            enemy.body.setSize(80, 120);
            enemy.speedScale = 0.5;
            enemy.speed = 0.2;
            enemy.AttackRange = 220;
            enemy.health = 13;
            this.physics.add.collider(enemy, this.mainLayer);
        }
    }

    // spawnGemFromLoc(gemloc, element){
    //     //check if name is water, fir or light
    //     if (gemloc.name == 'water') {
    //         this.spawnGem(gemloc.x, gemloc.y, 1);
    //     }
    //     else if (gemloc.name == 'fire') {
    //         this.spawnGem(gemloc.x, gemloc.y, 2);
    //     }
    //     else if (gemLoc.name == 'light') {
    //         this.spawnGem(gemloc.x, gemloc.y, 3);
    //     }
    //     this.spawnGem(gemloc.x, gemloc.y, element);
    // }

    spawnGem(x, y, element = 0) {
        let gem = new Gem(this, x, y, element);
        //this.gemsGroup.add(gem);
    }

    enemyHit(enemy, bullet) {
        enemy.hit(bullet.element, bullet.sp);
        //currScene.spawnEnemy(enemy.x, Phaser.Math.Between(centerY - 288, centerY + 288));
        if (bullet.name == 'bullet') {
            bullet.hit();
        }
    }

    playerHit(enemy, player) {
        player.hit(0);
        enemy.hit(player);
    }

    levelSwitch(level,type){
        var index;
        var index2;
        this.gateclosed.play()
        if(type == true){
            index = 31;
            index2 = 33;
        }else{
            index = 3;
            index2 = 3;
        }
        if(level == 1){
            this.map.fill(index,70,68,2,4, true, this.mainLayer);
            this.map.fill(index,62,68,2,4, true, this.mainLayer);
            this.map.setCollision(index,type);
        }else if(level == 2){
            this.map.fill(index,152,68,2,4, true, this.mainLayer);
            this.map.fill(index,160,68,2,4, true, this.mainLayer);
            this.map.setCollision(index,type);
        }else if(level == 3){
            this.map.fill(index2,110,46,4,2, true, this.mainLayer);
            this.map.fill(index2,110,38,4,2, true, this.mainLayer);
            this.map.setCollision(index2,type);
        }else{
            this.map.fill(index2,110,98,4,1, true, this.mainLayer);
            this.map.fill(index2,110,91,4,1, true, this.mainLayer);
            this.map.setCollision(index2,type);
        }
    }

    preload() {
        //tilemap
        this.load.spritesheet("tilemap", "assets/map/tilemap.png", {
            frameWidth: 50,
            frameHeight: 50
        });

        this.load.tilemapTiledJSON("dungeon_map", "assets/map/dungeon1.json");
        //this.load.image("tilemap", "assets/map/tilemap.png",);

        //this.load.spritesheet('player', 'assets/sprites/mage.png',
        //{ frameWidth: 64, frameHeight: 64 }
        //);

        //main asset
        this.load.spritesheet('player', 'assets/sprites/mage_all.png', { frameWidth: 100, frameHeight: 100, startFrame: 0, endFrame: 9 });
        this.load.image('target', 'assets/sprites/cross.png');
        this.load.image('indicator', 'assets/sprites/ball.png');
        this.load.image('menu1', './assets/MENU.png');
        this.load.image('menu2', './assets/MENU2.png');
        this.load.image('retry1', './assets/RETRY.png');
        this.load.image('retry2', './assets/RETRY2.png');
        this.load.image('roll', './assets/sprites/elemental_wheel.png');

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
        this.load.image('heart', 'assets/sprites/Heart.png');
        this.load.image('waterGem', 'assets/sprites/WaterGem.png');
        this.load.image('fireGem', 'assets/sprites/FireGem.png');
        this.load.image('lightningGem', 'assets/sprites/LightningGem.png');
        this.load.image('UGem1', 'assets/sprites/UniqueWaterGem.png');
        this.load.image('UGem2', 'assets/sprites/UniqueFireGem.png');
        this.load.image('UGem3', 'assets/sprites/UniqueLightningGem.png');

        //VFX
        this.load.image('circle', 'assets/sprites/Circle.png');
        this.load.image('ball', 'assets/sprites/Circle2.png');
        this.load.image('arrow', 'assets/sprites/arrow.png');
        this.load.image('highlight', 'assets/sprites/Ring.png');
        this.load.image('magi1', 'assets/sprites/MAGI1.png');
        this.load.image('magi2', 'assets/sprites/MAGI2.png');
        this.load.image('lightRing', 'assets/sprites/Highlight.png');

        //audio
        this.load.audio('shoot', 'assets/audio/shoot.wav');
        this.load.audio('charge', 'assets/audio/charge.ogg');
        this.load.audio('bgm', './assets/audio/bgm.mp3');
        this.load.audio('walking', './assets/audio/walk.wav');
        this.load.audio('lose', './assets/audio/lose.wav');
        this.load.audio('win', './assets/audio/win.wav');
        this.load.audio('win2', './assets/audio/win2.wav');
        this.load.audio('ending', './assets/audio/ending.wav');
        this.load.audio('gate', './assets/audio/gate_closed.wav');
        this.load.audio('playerdeath', './assets/audio/death2.wav');
        this.load.audio('watershot', 'assets/audio/watershot.wav');
        this.load.audio('fireshot', 'assets/audio/fireshot.wav');
        this.load.audio('lightningshot', 'assets/audio/lightningshot.wav');
        this.load.audio('pickup', 'assets/audio/pickup.wav');
        this.load.audio('spshot', 'assets/audio/spShoot.wav');
        this.load.audio('hit', 'assets/audio/hit.wav');
        this.load.audio('sphit', 'assets/audio/sphit.wav');

    }

    create() {
        // play bgm
        this.cameras.main.fadeFrom(1000, 0, 0, 0);
        this.bgm = this.sound.add('bgm', {
            mute: false,
            volume: 0.3,
            rate: 1,
            loop: true
        });
        this.bgm.play();

        this.walking = this.sound.add('walking', {
            volume: 0.7,
            rate: 1,
            loop: true
        });
        this.pickupReady = this.sound.add('win2', {
            volume: 1,
            rate: 1,

        });
        this.pickupDone = this.sound.add('win', {
            volume: 1,
            rate: 1,

        });
        this.gateclosed = this.sound.add('gate', {
            volume: 1.5,
            rate: 1,

        });
        this.winSound = this.sound.add('ending', {
            volume: 1,
            rate: 1,

        });
        //world size
        this.physics.world.setBounds(0, 0, 12800, 10240);
        currScene = this;

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
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'a_waterghost',
            frames: this.anims.generateFrameNumbers('waterghost', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'a_lightningghost',
            frames: this.anims.generateFrameNumbers('lightningghost', { start: 0, end: 4 }),
            frameRate: 5,
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
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'a_waterskeleton',
            frames: this.anims.generateFrameNumbers('waterskeleton', { start: 0, end: 4 }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'a_lightningskeleton',
            frames: this.anims.generateFrameNumbers('lightningskeleton', { start: 0, end: 4 }),
            frameRate: 4,
            repeat: -1
        });


        //main logic initializer
        this.enemies = this.physics.add.group()
        this.enemies.runChildUpdate = true;
        this.enemies.active = true;

        this.playerBullets = this.physics.add.group()
        this.playerBullets.runChildUpdate = true;
        this.playerBullets.active = true;

        this.gemsGroup = this.physics.add.group()
        this.gemsGroup.runChildUpdate = true;
        this.gemsGroup.active = true;

        //map spawner
        const map = this.add.tilemap("dungeon_map");
        const tileset = map.addTilesetImage("tilemap");
        const mainLayer = map.createLayer("dungeon", tileset, 0, 0);
        this.mainLayer = mainLayer;
        mainLayer.setCollisionByProperty({
            collides: true
        });
        map.replaceByIndex(40,1)
        //generate objects from tile map

        this.gemsLoc1 = map.createFromTiles(26, 1, {
            key: "tilemap",
            frame: 25,
            origin: (0, 0)
        })

        this.gemsLoc2 = map.createFromTiles(25, 1, {
            key: "tilemap",
            frame: 24,
            origin: (0, 0)
        })
        this.gemsLoc3 = map.createFromTiles(27, 1, {
            key: "tilemap",
            frame: 26,
            origin: (0, 0)
        })
        this.gemLocGroup1 = this.add.group(this.gemsLoc1);
        this.gemLocGroup1.children.each(function (gemloc) {
            //console.log(gemloc.element)
            this.spawnGem(gemloc.x + 24, gemloc.y + 24, 2);
            gemloc.destroy();
        }, this);
        this.gemLocGroup2 = this.add.group(this.gemsLoc2);
        this.gemLocGroup2.children.each(function (gemloc) {
            this.spawnGem(gemloc.x + 24, gemloc.y + 24, 1);
            gemloc.destroy();
        }, this);
        this.gemLocGroup3 = this.add.group(this.gemsLoc3);
        this.gemLocGroup3.children.each(function (gemloc) {
            this.spawnGem(gemloc.x + 24, gemloc.y + 24, 3);
            gemloc.destroy();
        }, this);

        this.keyLoc1 = map.createFromTiles(48, 1, {
            key: "tilemap",
            frame: 37,
            origin: (0.5, 0.5),
            scale: 1.5
        })
        //this.keyLoc1[0].setScale(2);

        this.keyLoc2 = map.createFromTiles(49, 1, {
            key: "tilemap",
            frame: 37,
            origin: [0.5, 0.4],
            scale: 1.5
        })

        this.keyLoc3 = map.createFromTiles(50, 1, {
            key: "tilemap",
            frame: 37,
            origin: [0.5, 0],
            scale: 1.5
        })

        this.keyLoc0 = map.createFromTiles(51, 1, {
            key: "tilemap",
            frame: 37,
            originX: 0.5,
            originY: 0.4,
            scale: 1.5
        })
        this.keyLoc = map.createFromTiles(38, 1, {
            key: "tilemap",
            frame: 48,
        })
        this.keyGroup = this.add.group(this.keyLoc);
        this.keysGroup = this.add.group();
        this.keysGroup.runChildUpdate = true;
        this.keyGroup.children.each(function (keyloc) {
            var key;
            if(keyloc.x < 3000 & !check1){
                key = new Pickup(this, keyloc.x+24, keyloc.y+24,'UGem1', 1, this.keyLoc1[0]).setScale(0.8);
                key.active = true;
                this.keysGroup.add(key);
            }else if(keyloc.x > 8200 & !check2){
                key = new Pickup(this, keyloc.x+24, keyloc.y+24,'UGem2', 2, this.keyLoc2[0]).setScale(0.8);
                key.active = true;
                this.keysGroup.add(key);
            }else if(keyloc.y < 2500 & !check3){
                key = new Pickup(this, keyloc.x+24, keyloc.y+24,'UGem3', 3, this.keyLoc3[0]).setScale(0.8);
                key.active = true;
                this.keysGroup.add(key);
            }else if(!check0){
                key = new Pickup(this, keyloc.x+24, keyloc.y+24,'UGem2', 0, this.keyLoc0[0]).setScale(0.8);
                key.active = true;
                this.keysGroup.add(key);
            }
            //this.spawnKey(keyloc.x + 24, keyloc.y + 24, 0);
            keyloc.destroy();
        }, this);
        this.enemyLoc = map.createFromTiles(12, 2, {
            name: "enemy",
            //texture: 'magi2',
            origin: (0, 0)
        })
        this.enemyLocGroup = this.add.group(this.enemyLoc);
        this.enemyLocGroup.children.each(function (enemyloc) {
            enemyloc.destroy();
        }, this);

        this.enemyLoc1 = map.createFromTiles(42, 2, {
            name: "enemy1",
            origin: (0.5, 0.5)
        })


        this.enemyLoc2 = map.createFromTiles(43, 2, {
            name: "enemy2",
            origin: (0.5, 0.5)
        })

        this.enemyLoc3 = map.createFromTiles(44, 2, {
            name: "enemy3",
            origin: (0.5, 0.5)
        })

        this.enemySpawnLoc = map.createFromTiles(13, 2, {
            name: "enemySpawn",
            texture: 'magi2',
            origin: (0.5, 0.5)
        })


        this.enemySpawnLocGroup = this.add.group(this.enemySpawnLoc);
        this.enemySpawnLocGroup.children.each(function (enemySpawnLoc) {
            enemySpawnLoc.setTexture('magi1');
            enemySpawnLoc.setScale(0.2);
            this.spawnEnemy(enemySpawnLoc.x + 24, enemySpawnLoc.y + 24, Phaser.Math.Between(1, 3), Phaser.Math.Between(1, 3));
            enemySpawnLoc.destroy();
        }, this);

        this.map = map;
        this.enemyLocGroup1 = this.add.group(this.enemyLoc1);
        this.enemyLocGroup1.children.each(function (enemyLoc) {
            //enemyLoc.setTexture('magi2');
            //enemyLoc.setScale(0.2);
            this.spawnEnemy(enemyLoc.x + 24, enemyLoc.y, Phaser.Math.Between(1, 3), 1);
            this.spawnEnemy(enemyLoc.x, enemyLoc.y + 24, Phaser.Math.Between(1, 3), 1);
            this.spawnEnemy(enemyLoc.x + 24, enemyLoc.y + 24, Phaser.Math.Between(1, 3), 1);
            enemyLoc.destroy();
        }, this);

        this.enemyLocGroup2 = this.add.group(this.enemyLoc2);
        this.enemyLocGroup2.children.each(function (enemyLoc) {
            // enemyLoc.setTexture('magi1');
            // enemyLoc.setScale(0.2);
            this.spawnEnemy(enemyLoc.x + 24, enemyLoc.y + 24, Phaser.Math.Between(1, 3), 2);
            enemyLoc.destroy();
        }, this);

        this.enemyLocGroup3 = this.add.group(this.enemyLoc3);
        this.enemyLocGroup3.children.each(function (enemyLoc) {
            //enemyLoc.setTexture('magi2');
            //enemyLoc.setScale(0.2);
            this.spawnEnemy(enemyLoc.x + 24, enemyLoc.y + 24, Phaser.Math.Between(1, 3), 3);
            enemyLoc.destroy();
        }, this);

        this.levelSwitch(0,true);



        this.menuConfig = {
            fontFamily: 'Impact',
            fontSize: '28px',
            color: '#FFFFFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0,
        }

        //==============================
        //level logic & main game objects
        this.inLevel = true;
        this.level = 0;
        this.end = false;
        this.checkLevelAll();

        player = new mage(this, centerX, centerY, 'player');
        if(check0 == true){
            player.setPosition(5602, 3400);
        }else{
            player.setPosition(5602, 6150);
        }
        this.add.sprite(5608, 5500 + game.config.height / 4-100, 'roll').setScale(0.5, 0.5);
        this.Text = this.add.text(5608, 5500 + game.config.height / 6 * 2 + 300, '[WASD] to move, [mouse click] to shoot', this.menuConfig).setOrigin(0.5);
        this.Text = this.add.text(5608, 5500 + game.config.height / 4+80, 'HOLD [mouse] and hover over a gem to swap gems', this.menuConfig).setOrigin(0.5);
        this.Text = this.add.text(5608, 5500 + game.config.height / 4-220, 'Gems makes you more effective against countered enemies', this.menuConfig).setOrigin(0.5);
        this.Text = this.add.text(5608, 5500 + game.config.height / 6 * 2 + 230, 'INSTRUCTIONS:', this.menuConfig).setOrigin(0.5);
        this.add.text(5608, 5500 + game.config.height / 6 * 2 + 360, '[ESC] to show mouse', this.menuConfig).setOrigin(0.5);
        this.add.text(5608, 5500 + game.config.height / 4-472, ' <- Collect the key stone to unlock doors', this.menuConfig).setOrigin(0.5);
        this.add.text(5608, 5500 + game.config.height / 4-572, 'follow the key stone to seek power!', this.menuConfig).setOrigin(0.5);

        this.physics.add.collider(player, mainLayer);

        reticle = this.physics.add.sprite(centerX, centerY, 'target');
        indi = this.physics.add.sprite(centerX, centerY, 'indicator');
        reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25);
        indi.setOrigin(0.5, 0.5).setSize(32, 32).setDisplaySize(32, 32);

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


        //pause menu
        this.paused = true;
        this.aimAngle = 0;
        this.button1 = this.add.sprite(centerX+128, centerY+128, 'retry1').setOrigin(0.5).setScale(2).setDepth(2).setVisible(false).setScrollFactor(0);

        this.button = this.add.sprite(centerX-128, centerY+128, 'menu1').setOrigin(0.5).setScale(2).setDepth(2).setVisible(false).setScrollFactor(0);
        this.button.fixedToCamera = true;

        this.button.setInteractive();
        this.button.on('pointerover', function (pointer, object) {
            this.button.setTexture('menu2');
        }, this)

        this.button.on('pointerout', function (pointer, object) {
            this.button.setTexture('menu1');
            this.button.setScale(2);
        }, this)

        this.button1.setInteractive();
        this.button1.on('pointerover', function (pointer, object) {
            this.button1.setTexture('retry2');
        }, this)

        this.button1.on('pointerout', function (pointer, object) {
            this.button1.setTexture('retry1');
            this.button1.setScale(2);
        }, this)

        this.button1.on('pointerdown', function (pointer, object) {
            this.button1.setScale(1.8);
        }, this);
        this.button1.on('pointerup', function (pointer, object) {
            this.sound.play('select');
            this.cameras.main.fade(1000, 255, 255, 255);
            this.time.delayedCall(1000, function () {
                //this.sound.play('select');
                this.scene.start('playScene');
                this.bgm.stop();
            }, [], this);
        }, this);

        this.button.on('pointerup', this.clicked, this);
        this.button.setActive(false);
        this.button1.setActive(false);
        //spawn level
        //this.spawnLevel();
        this.physics.add.collider(this.enemies, this.playerBullets, this.enemyHit);
        this.playerCO = this.physics.add.collider(this.enemies, player, this.playerHit);

        this.roll = this.add.sprite(988,524, 'roll').setScale(0.3, 0.3);
        this.roll.setScrollFactor(0);

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

    gameover() {
        this.end = true;
        this.sound.play('lose');
        this.bgm.stop();
        this.physics.world.removeCollider(this.playerCO);
        if (game.input.mouse.locked) {
            game.input.mouse.releasePointerLock();
        }

        this.cameras.main.fade(1500, 0, 0, 0);
        this.time.delayedCall(1500, function () {
            //this.sound.play('select');
            this.scene.start('gameoverScene');
        }, [], this);
    }

    toMenu(){
        this.end = true;
        this.bgm.stop();
        this.cameras.main.fade(1500, 0, 0, 0);
        this.cameras.main.on('camerafadeoutcomplete', function () {
            this.scene.start('menuScene');
        }, this);
    }

    clicked(pointer, gameObject) {
        //this.sound.play('select');
        //console.log(this.clicked);
        this.button.setScale(2.1);
        this.sound.play('select');
        this.toMenu()
        // this.time.delayedCall(100, function () {
        //     //this.sound.play('select');
        //     this.scene.start('menuScene');
        // }, [], this);
    }

    checkLevelAll(){
        if(check0){
            this.levelCheck(0);
        }
        if(check1){
            this.levelCheck(1);
        }
        if(check2){
            this.levelCheck(2);
        }
        if(check3){
            this.levelCheck(3);
        }
    }

    levelCheck(level){
        if(level == 0){
            check0 = true;
            this.add.sprite(this.keyLoc0[0].x,this.keyLoc0[0].y-72, 'UGem2').setScale(0.8);
        }else if(level == 1){
            check1 = true;
            this.levelSwitch(1,true);
            this.enemies.children.each(function (enemy) {
                if(enemy.x < 3000){
                    enemy.die(true);
                }
            }, this);
            //add a sprite
            this.add.sprite(this.keyLoc1[0].x,this.keyLoc0[0].y-72, 'UGem1').setScale(0.8);

        }else if(level == 2){
            check2 = true;
            this.levelSwitch(2,true);
            this.enemies.children.each(function (enemy) {
                if(enemy.x >8200){
                    enemy.die(true);
                }
            }, this);
            //add a sprite
            this.add.sprite(this.keyLoc2[0].x,this.keyLoc2[0].y-72, 'UGem2').setScale(0.8);
        }else if(level == 3){
            check3 = true;
            this.levelSwitch(3,true);
            this.enemies.children.each(function (enemy) {
                if(enemy.y < 2500){
                    enemy.die(true);
                }
            }, this);
            //add a sprite
            this.add.sprite(this.keyLoc3[0].x,this.keyLoc3[0].y-72, 'UGem3').setScale(0.8);
        }
        if (check0 && check1 && check2 && check3) {
            this.winSound.play();
            this.cameras.main.fade(2000, 0, 0, 0);
            this.time.delayedCall(2000, function () {
                this.bgm.stop();
                this.scene.start('winScene');
            }, [], this);
        }
    }

    update(time, delta) {
        //console.log(check0);
        if (this.end != true) {
            player.update();

            this.aimAngle = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);
            // Rotates player to face towards reticle

            this.indiVector = this.offset(this.aimAngle, 64);
            indi.x = player.x + this.indiVector.x;
            indi.y = player.y + this.indiVector.y;
            if (game.input.mouse.locked == false) {
                if(this.paused == false){
                    this.paused = true;
                    this.button.setVisible(true);
                    this.button.setActive(true);
                    this.button.setInteractive(true);
                    this.button1.setVisible(true);
                    this.button1.setActive(true);
                    this.button1.setInteractive(true);
                }
                    
            }else{
                    if(this.paused == true){
                        this.button.setInteractive(false);
                        this.paused = false;
                        this.button.setVisible(false);
                        this.button.setActive(false);
                        this.button1.setInteractive(false);
                        this.button1.setVisible(false);
                        this.button1.setActive(false);
                    }
                    
            }
        } else {
            player.setMaxVelocity(0);
        }

        //pause menu

        
        //level switch, detect if player is in area
        if (player.x > 3700 && player.x < 7500 && player.y > 2500 && player.y < 4520) {
            if(this.inLevel == true){
                this.inLevel = false;
                check0 = true;
                if(this.level == 1){
                    this.levelSwitch(1,true);
                }else if(this.level == 2){
                    this.levelSwitch(2,true);
                }else if(this.level == 3){
                    this.levelSwitch(3,true);
                    
                }
                this.level = 0;
            }
        }else{
            if(this.inLevel == false & this.level == 0){
                if(player.x < 3000){
                    this.level = 1;
                    this.levelSwitch(1,true);
                }else if(player.x > 8200){
                    this.level = 2;
                    this.levelSwitch(2,true);
                }else if(player.y < 1700){
                    this.level = 3;
                    this.levelSwitch(3,true);
                }
                }
            }
        //console.log('Level: ' + this.level);

            indi.body.velocity.x = player.body.velocity.x;
            indi.body.velocity.y = player.body.velocity.y;
            reticle.body.velocity.x = player.body.velocity.x;
            reticle.body.velocity.y = player.body.velocity.y;

            //console.log(map.getTileAtWorldXY(reticle.x, reticle.y));
            this.constrainReticle(reticle);


        // if(this.zooming){
        //     this.cameras.main.zoom = this.lerp(this.currentZoom,this.zoomTarget,(this.zoomSpeed*delta)/1000);
        // }else{
        //     this.currentZoom = this.cameras.main.zoom;
        // }
    }
}