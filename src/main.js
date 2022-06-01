let config = {
        type: Phaser.AUTO,
        render: {
                pixelArt: true
            },
        width: 1024,
        height: 576,
        physics:{
                default: 'arcade',
                arcade:{
                        gravity:{x: 0, y: 0},
                        debug: true
                }
        },
        //scene: [ Menu, Play ],
        scene: [ Menu, Play ],
        backgroundColor: 0xFF4F4F
}

let game = new Phaser.Game(config);

// define global variables
let centerX = game.config.width/2;
let centerY = game.config.height/2;
let w = game.config.width;
let h = game.config.height;
let player = null;
let indi = null;
let reticle = null;
//let moveKeys= null;
let bullets = null;
let time = 0;
let currScene = null;
let elementSprites = ['bullet','waterGem','fireGem','lightningGem']
// reserve keys
let keySPACE, keyW, keyA, keyS, keyD, keyFIRE, keyESC;
var cursors;


