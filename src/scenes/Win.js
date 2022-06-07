class Win extends Phaser.Scene {
        constructor() {
                super("winScene");
        }

        preload() {
                // load images assets
                this.load.image('menu1', './assets/MENU.png');
                this.load.image('menu2', './assets/MENU2.png');
                this.load.image('credit', './assets/credits.png');
        }

        create() {
                if (game.input.mouse.locked) {
                        game.input.mouse.releasePointerLock();
                    }
                this.cameras.main.fadeFrom(1000, 0, 0, 0);
                this.credit = this.add.image(game.config.width / 2, game.config.height / 2, 'credit').setOrigin(0.5).setDisplaySize(1024, 576).setDepth(2);
                this.tween = this.tweens.add({
                        targets: this.credit,
                        delay: 3000,
                        y: game.config.height / 2 - 120,
                        ease: 'Power1',
                        duration: 2000
                });
                let menuConfig = {
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
                this.Text = this.add.text(game.config.width / 2, game.config.height / 3 * 2 + 100, 'YOU WIN!', menuConfig).setOrigin(0.5);
                this.button = this.add.sprite(game.config.width / 2, game.config.height / 3 * 2, 'menu1').setOrigin(0.5).setScale(2);
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