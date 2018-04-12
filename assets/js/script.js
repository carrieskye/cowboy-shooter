let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    player1: {
        name: "Player 1",
    },
    player2: {
        name: "Player 2",
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 400},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
$(document).ready(function () {
    //game = new Phaser.Game(config);
});
let game=new Phaser.Game(config);
let platform;
let player1;
let player2;
let keyboard;
let healthbarPlayer1;
let healthbarPlayer2;
let healthbarSprite;

function preload() {
    console.log("preload called");
    this.load.image('sky', 'assets/media/pvpbackground.jpg');
    this.load.image('ground', 'assets/media/ground.png');
    this.load.image('dude', 'assets/media/player.jpg');
    this.load.spritesheet('healthbar','assets/media/healthbar.png',{frameWidth:490,frameHeight:50});
    this.load.spritesheet('cowboy','assets/media/cowboy.png',{frameWidth: 500,frameHeight: 500});

}

function create() {
    console.log("create called");

    let background = this.add.sprite(400, 300, 'sky');
    background.scaleX = 1.2;
    background.scaleY = 1.25;

    platform = this.physics.add.staticGroup();
    platform.create(400, 580, 'ground').setScale(1).refreshBody();


    player1 = new Player(150,450,90,config.player1,this);
    player2 = new Player(350,450,700,config.player2,this);
    player1.setCollisionWith(platform);
    player1.setCollisionWith(player2.playerSprite);
    player2.setCollisionWith(platform);
    player2.setCollisionWith(player1.playerSprite);



    healthbarPlayer1 = this.add.text(10,10,player1.name+"\nHealth "+player1.healthBar.getHealth(),{
        color:"black",
        font: "22px Impact"
    });

    healthbarPlayer2 = this.add.text(640,10,player2.name+"\nHealth "+player2.healthBar.getHealth(),{
        color:"black",
        font: "22px Impact"
    });



    //TODO anims
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('cowboy',{start:2,end:4}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key:'pause',
        frames: [{key:'cowboy',frame:2}],
        frameRate:10,
        repeat:-1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('cowboy',{start:2,end:4}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'shoot',
        frames: [{key:'cowboy',frame:1}],
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'jump',
        frames: [{key:'cowboy',frame:5},{key:'cowboy',frame:2}],
        frameRate: 10,
        repeat: -1,
    });

    keyboard = this.input.keyboard;

}

let handlePlayer1Keys = function(e){

    if (e.which==113) {
        player1.moveLeft();

    } else if (e.which==100) {
        player1.moveRight();

    } else {
        player1.playerSprite.anims.play('pause');
        player1.playerSprite.setVelocityX(0);

    }
    if (e.which==122 && player1.playerSprite.body.touching.down) {
        player1.jump();
    }
};

let handlePlayer2Keys = function(){
    let cursors = keyboard.createCursorKeys();

    if (cursors.left.isDown) {
        player2.moveLeft();

    } else if (cursors.right.isDown) {
        player2.moveRight();

    } else {
        player2.playerSprite.setVelocityX(0);
        player2.playerSprite.anims.play('pause');

    }
    if (cursors.up.isDown && player2.playerSprite.body.touching.down) {
        player2.jump();
    }
};

function update() {
    //console.log("update called");
    handlePlayer2Keys();
    $("body").keypress(handlePlayer1Keys);


    //healthbar
    player1.healthBar.updateHealthbar();
    player2.healthBar.updateHealthbar();
    healthbarPlayer1.setText(player1.name+"\nHealth "+player1.healthBar.getHealth());
    healthbarPlayer2.setText(player2.name+"\nHealth "+player2.healthBar.getHealth());

}