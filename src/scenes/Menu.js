class Menu extends Phaser.Scene {
    constructor(){
            super("menuScene");
    }

    preload() {
            // load audio
            //this.load.audio('select', './assets/select.mp3');

            // load menu background
            //this.load.image('menu', './assets/dinomenu.png');
    }

    create() {
            // define keys
            keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

            // add background
            //this.add.image(1280, 720, 'menu').setOrigin(1);;

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
                    fixedWidth: 0
                }
            this.Text = this.add.text(game.config.width/2, game.config.height/3 * 2, 'Press <SPACE> to start', menuConfig).setOrigin(0.5);
    }

    update() {
            if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
                    // game.settings = {
                            
                    // }
                    //this.sound.play('select');
                    this.scene.start('playScene');
            }
    }

}