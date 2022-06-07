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
                        debug: false
                }
        },
        scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
        //scene: [ Menu, Play ],
        scene: [ Menu, Play, Gameover, Win ],
        backgroundColor: 0x000000
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
let bullets = null;
let time = 0;
let currScene = null;
let check0 = false;
let check1 = false;
let check2 = false;
let check3 = false;
let elementSprites = ['bullet','waterGem','fireGem','lightningGem']
let elements = ['water','fire','lightning'];
let enemyTypes = ['slime','ghost','skeleton'];
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
// reserve keys
let keySPACE, keyW, keyA, keyS, keyD, keyFIRE, keyESC;
var cursors;

// Credit :

// Pengfei Li - Artist/Programmer

// Ziyi Yu - Artist/Programmer

// Sean Lee - Artist/Audio designer

