class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('select', './assets/audio/Select.wav');

        // load menu background
        this.load.image('background', './assets/menubg.png');

        //this.load.image('menu', './assets/dinomenu.png');
        this.load.image('play1', './assets/PLAY.png');
        this.load.image('play2', './assets/PLAY2.png');
        this.load.image('target', 'assets/sprites/cross.png');

    }

    create() {
        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // add background
        this.add.image(1024, 576, 'background').setOrigin(1);

        // text
        let menuConfig = {
            fontFamily: 'Impact',
            fontSize: '17px',
            color: '#FFFFFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0,
        }

        reticle = this.physics.add.sprite(centerX, centerY, 'target');

        // this.Text = this.add.text(game.config.width / 2, game.config.height / 2 * 2, '[Click here to start]', menuConfig).setOrigin(0.5);
        this.button = this.add.sprite(game.config.width / 2, game.config.height / 5 * 4, 'play1').setOrigin(0.5).setScale(2);
        this.button.setInteractive();
        // this.Text = this.add.text(game.config.width / 2, game.config.height / 3.3 * 2, '[WASD] to move, [LEFT click] to shoot', menuConfig).setOrigin(0.5);
        // this.Text = this.add.text(game.config.width / 2, game.config.height / 3 * 2, 'Long hold [LEFT click] to swap gem, [ESC] to show mouse cursor', menuConfig).setOrigin(0.5);
        this.Text = this.add.text(game.config.width / 2, game.config.height / 3 * 2, 'Pengfei Li, Sean Lee, Ziyi Yu', menuConfig).setOrigin(0.5);

        menuConfig.fontSize = '21px';

        this.Text = this.add.text(game.config.width / 2, game.config.height / 2 * 1.2, 'Game By', menuConfig).setOrigin(0.5);

        this.input.on('gameobjectup', this.clicked, this);
        this.input.on('gameobjectdown', function (pointer, object) {
            this.button.setScale(1.8);
        }, this);
        this.button.on('pointerover', function (pointer, object) {
            this.button.setTexture('play2');
        }, this)

        this.button.on('pointerout', function (pointer, object) {
            this.button.setTexture('play1');
        }, this)
        check0 = false;
        check1 = false;
        check2 = false;
        check3 = false;
    }


    clicked(pointer, gameObject) {
        //this.sound.play('select');
        this.button.setInteractive(false);
        this.button.setScale(2);
        this.cameras.main.fade(1000, 0, 0, 0);
        let soundConfig = {
            volume: 0.5
        }
        this.sound.play('select', soundConfig);
        this.cameras.main.on('camerafadeoutcomplete', function () {
            //this.sound.play('select',soundConfig);
            this.scene.start("playScene");
        }, this);
    }

    update() {
        reticle.x = this.input.x;
        reticle.y = this.input.y;

        if (Phaser.Input.Keyboard.JustDown(keySPACE) | Phaser.Input.Keyboard.JustDown(this.keyEnter)) {
            // game.settings = {

            // }
            this.sound.play('select');
            this.scene.start('playScene');
        }
    }
}