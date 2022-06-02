class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('select', './assets/audio/Select.wav');

        // load menu background
        //this.load.image('menu', './assets/dinomenu.png');
        this.load.image('play1', './assets/PLAY.png');
        this.load.image('play2', './assets/PLAY2.png');

    }

    create() {
        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // add background
        //this.add.image(1280, 720, 'menu').setOrigin(1);

        // text
        let menuConfig = {
            fontFamily: 'Impact',
            fontSize: '28px',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0,
        }
        this.Text = this.add.text(game.config.width / 2, game.config.height / 3 * 2, '[Click here to start]', menuConfig).setOrigin(0.5);
        this.button = this.add.sprite(game.config.width / 2, game.config.height / 3 * 2, 'play1').setOrigin(0.5).setScale(2);
        this.button.setInteractive();
        this.Text = this.add.text(game.config.width / 2, game.config.height / 4.5 * 2, '[WASD] to move, [LEFT click] to shoot', menuConfig).setOrigin(0.5);
        this.Text = this.add.text(game.config.width / 2, game.config.height / 4 * 2, 'Hold [LEFT click] to swap gem, [ESC] to show mouse cursor', menuConfig).setOrigin(0.5);
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
    }


    clicked(pointer, gameObject) {
        //this.sound.play('select');
        this.button.setScale(2);
        this.time.delayedCall(100, function () {
            this.sound.play('select');
            this.scene.start("playScene");
        }, [], this);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            // game.settings = {

            // }
            this.sound.play('select');
            this.scene.start('playScene');
        }
    }
}