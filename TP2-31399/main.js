const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#111',
    physics: {
        default: 'arcade',
        arcade: { 
            debug: true,
            gravity: { y: 0 }
        }
    },
    scene: [MenuScene, GameScene, Level2Scene, Level3Scene, Level4Scene]
};

const game = new Phaser.Game(config);
