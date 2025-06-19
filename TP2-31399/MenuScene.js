class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('startBtn', 'assets/portal.png');   // Portal como botão
        this.load.image('player', 'assets/personagem.png');   // Personagem normal
        this.load.image('mirror', 'assets/espelho.png');   // Personagem espelho
    }

    create() {
        // Título do jogo
        this.add.text(400, 150, 'Espelho Mágico', {
            fontSize: '40px',
            color: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Personagens ao lado do botão
        this.add.image(300, 320, 'player').setScale(0.15);
        this.add.image(500, 320, 'mirror').setScale(0.25).setFlipX(true);

        // Botão jogar
        const startButton = this.add.image(400, 320, 'startBtn')
            .setScale(0.2)  // ← menor agora
            .setInteractive();

        // Texto do botão (abaixo)
        this.add.text(400, 370, 'Jogar', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'sans-serif'
        }).setOrigin(0.5);


        // Botão Instruções 
        const helpButton = this.add.text(400, 420, 'Instruções', {
            fontSize: '20px',
            color: '#00ffcc',
            fontFamily: 'sans-serif',
            backgroundColor: '#222',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setInteractive();

        helpButton.on('pointerdown', () => {
            this.showHelp();
        });


        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }

    showHelp() {
        const bg = this.add.rectangle(400, 300, 600, 300, 0x000000, 0.85);
        bg.setStrokeStyle(3, 0xffffff);

        const text = this.add.text(400, 250,
            'Para mover os personagens usa as setas do teclado.\n' +
            'Os personagens movem-se em sentidos opostos!\n' +
            'Evita os obstáculos e inimigos, senão perdes vidas.\n' +
            '\nObjetivo do jogo: levar as duas personagens até os portais ao mesmo tempo!',
            {
                fontSize: '20px',
                color: '#ffffff',
                fontFamily: 'sans-serif',
                align: 'center',
                wordWrap: { width: 550 }
            }).setOrigin(0.5);

        const backButton = this.add.text(400, 350, 'Voltar', {
            fontSize: '18px',
            color: '#00ffcc',
            backgroundColor: '#222',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setInteractive();

        backButton.on('pointerdown', () => {
            bg.destroy();
            text.destroy();
            backButton.destroy();
        });
    }
  

}
