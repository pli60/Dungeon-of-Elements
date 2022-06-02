class Gameover extends Phaser.Scene {
        constructor() {
                super("gameoverScene");
        }

        preload() {
                // load audio
                this.load.audio('select', './assets/audio/Select.wav');

                // load menu background
                //this.load.image('menu', './assets/dinomenu.png');
                this.load.image('retry1', './assets/RETRY.png');
                this.load.image('retry2', './assets/RETRY2.png');

        }

        create() {
                this.game.config.backgroundColor = 0xD12525;
                this.Text = this.add.text(game.config.width / 2, game.config.height / 4 * 2, 'GAME OVER', menuConfig).setOrigin(0.5);
                this.button = this.add.sprite(game.config.width / 2, game.config.height / 3 * 2, 'retry1').setOrigin(0.5).setScale(2);
                this.button.setInteractive();
                this.input.on('gameobjectup', this.clicked, this);
                this.input.on('gameobjectdown', function (pointer, object) {
                        this.button.setScale(1.8);
                }, this);
                this.button.on('pointerover', function (pointer, object) {
                        this.button.setTexture('retry2');
                }, this)

                this.button.on('pointerout', function (pointer, object) {
                        this.button.setTexture('retry1');
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
                if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
                        // game.settings = {

                        // }
                        this.sound.play('select');
                        this.scene.start('playScene');
                }
        }
}