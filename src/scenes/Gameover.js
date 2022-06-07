class Gameover extends Phaser.Scene {
        constructor() {
                super("gameoverScene");
        }

        preload() {
                // load audio
                this.load.audio('select', './assets/audio/Select.wav');
                this.load.image('bg', './assets/menuover.png');
                //this.load.image('menu', './assets/dinomenu.png');
                this.load.image('retry1', './assets/RETRY.png');
                this.load.image('retry2', './assets/RETRY2.png');
                this.load.image('menu1', './assets/MENU.png');
                this.load.image('menu2', './assets/MENU2.png');

        }

        create() {
                let menuConfig = {
                        fontFamily: 'Impact',
                        fontSize: '28px',
                        color: '#FFFFFF',
                        align: 'center',
                        padding: {
                            top: 5,
                            bottom: 5,
                        },
                        fixedWidth: 0
                    }
                this.cameras.main.fadeFrom(1000, 0, 0, 0);
                this.add.image(1024, 576, 'bg').setOrigin(1).setDisplaySize(1024, 576);
                this.Text = this.add.text(game.config.width / 2, game.config.height / 4 * 2+25, 'click Retry to continue', menuConfig).setOrigin(0.5);
                menuConfig.fontSize = '40px';
                this.Text = this.add.text(game.config.width / 2, game.config.height / 4, 'GAME OVER', menuConfig).setOrigin(0.5);
                this.button = this.add.sprite(game.config.width / 3, game.config.height / 3 * 2, 'menu1').setOrigin(0.5).setScale(2);
                this.button.setInteractive();
                this.input.on('gameobjectup', this.clicked, this);
                this.input.on('gameobjectdown', function (pointer, object) {
                        this.button.setScale(1.8);
                }, this);
                this.button.on('pointerover', function (pointer, object) {
                        this.button.setTexture('menu2');
                }, this)

                this.button.on('pointerout', function (pointer, object) {
                        this.button.setTexture('menu1');
                }, this)



                this.button1 = this.add.sprite(game.config.width * 2 / 3, game.config.height / 3 * 2, 'retry1').setOrigin(0.5).setScale(2);
                this.button1.setInteractive();
                this.button1.on('pointerup', function (pointer, object) {
                        this.time.delayedCall(100, function () {
                                let soundConfig = {
                                        volume: 0.5
                                }
                                this.sound.play('select', soundConfig);
                                this.scene.start("playScene");
                        }, [], this);
                }, this);
                this.button1.on('pointerdown', function (pointer, object) {
                        this.button1.setScale(1.8);
                }, this);
                this.button1.on('pointerover', function (pointer, object) {
                        this.button1.setTexture('retry2');
                }, this)

                this.button1.on('pointerout', function (pointer, object) {
                        this.button1.setTexture('retry1');
                }, this)
        }

        clicked(pointer, gameObject) {
                //this.sound.play('select');
                this.button.setScale(2);
                this.time.delayedCall(100, function () {
                        this.sound.play('select');
                        this.scene.start("menuScene");
                }, [], this);
        }

        update() {
        }
}