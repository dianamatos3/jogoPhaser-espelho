class Level2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2Scene' });
    }

    preload() {
        this.load.image('player', 'assets/personagem.png');
        this.load.image('mirror', 'assets/espelho.png');
        this.load.image('goal', 'assets/portal.png');
        this.load.image('block', 'assets/bloco.png');
        this.load.image('vida', 'assets/vida.png');
        this.load.audio('somPerder', 'assets/perder.wav');
        this.load.audio('somVitoria', 'assets/vitoria.wav');
    }

    create() {
        this.playerReached = false;
        this.mirrorReached = false;
        this.SPEED = 200;

        // Jogador em cima
        this.player = this.physics.add.sprite(150, 100, 'player').setScale(0.2);
        this.player.body.setSize(450, 400).setOffset(50, 90);

        // Mirror em baixo
        this.mirrorPlayer = this.physics.add.sprite(650, 500, 'mirror').setScale(0.4).setFlipX(true);
        this.mirrorPlayer.body.setSize(200, 200).setOffset(155, 145);

        // Portais invertidos
        this.goal1 = this.physics.add.staticSprite(150, 500, 'goal').setScale(0.3);
        this.goal1.refreshBody();
        this.goal1.body.setSize(50, 100).setOffset(10, 10);

        this.goal2 = this.physics.add.staticSprite(650, 100, 'goal').setScale(0.3);
        this.goal2.refreshBody();
        this.goal2.body.setSize(50, 100).setOffset(10, 10);

        // Obstáculos distribuídos
        /*this.obstacles = this.physics.add.staticGroup();*/

        // Obstáculos distribuídos e assimétricos
        this.obstacles = this.physics.add.staticGroup();

        const createBlock = (x, y) => {
            let block = this.obstacles.create(x, y, 'block').setScale(0.5);
            block.refreshBody();
            block.body.setSize(140, 150).setOffset(3, 1);
        };

        // Blocos centrais
        createBlock(400, 200);
        //createBlock(400, 300);
        createBlock(400, 450);

        // Blocos laterais
        createBlock(200, 250);
        createBlock(600, 350);

        // Blocos diagonais
        createBlock(300, 100);
        createBlock(450, 550);

        // Bloco perto do portal espelhado
        createBlock(500, 50);


        // Colisões
        this.physics.add.collider(this.player, this.obstacles, () => this.perderVida(), null, this);
        this.physics.add.collider(this.mirrorPlayer, this.obstacles, () => this.perderVida(), null, this);


        this.physics.add.overlap(this.player, this.goal1, () => {
            this.playerReached = true;
            this.checkWin();
        }, null, this);

        this.physics.add.overlap(this.mirrorPlayer, this.goal2, () => {
            this.mirrorReached = true;
            this.checkWin();
        }, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();

        // Vidas 
        this.vidas = 3;
        this.lifeIcons = [];

        for (let i = 0; i < this.vidas; i++) {
            const heart = this.add.image(30 + i * 40, 30, 'vida').setScale(0.1).setScrollFactor(0);
            this.lifeIcons.push(heart);
        }

        this.somPerder = this.sound.add('somPerder');
        this.somVitoria = this.sound.add('somVitoria');


    }

    update() {
        let moveX = 0;
        let moveY = 0;

        if (this.cursors.left.isDown) moveX = -1;
        else if (this.cursors.right.isDown) moveX = 1;

        if (this.cursors.up.isDown) moveY = -1;
        else if (this.cursors.down.isDown) moveY = 1;

        // Espelhamento vertical
        this.player.setVelocity(moveX * this.SPEED, moveY * this.SPEED);
        this.mirrorPlayer.setVelocity(-moveX * this.SPEED, -moveY * this.SPEED);
    }

    checkWin() {
        if (this.playerReached && this.mirrorReached) {
            this.somVitoria.play();
            this.physics.pause();

            const bg = this.add.rectangle(400, 300, 500, 350, 0x000000, 0.8);
            bg.setStrokeStyle(4, 0xffffff);

            this.add.text(400, 260, 'Bravo!\nConcluíste o Nível 2!', {
                fontSize: '28px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);

            const button = this.add.text(400, 330, 'Continuar', {
                fontSize: '20px',
                color: '#00ffcc',
                backgroundColor: '#222',
                padding: { x: 15, y: 10 }
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('Level3Scene');
            });
        }
    }

    resetLevel() {
        this.player.setPosition(150, 100);
        this.mirrorPlayer.setPosition(650, 500);
        this.playerReached = false;
        this.mirrorReached = false;
    }

    perderVida() {
        if (this.vidas > 0) {
            this.somPerder.play();

            this.vidas--;
            const heart = this.lifeIcons.pop();
            if (heart) heart.setVisible(false);

            if (this.vidas === 0) {
                this.derrota();
            } else {
                this.resetLevel();
            }
        }
    }

    derrota() {
        this.physics.pause();

        const bg = this.add.rectangle(400, 300, 500, 350, 0x000000, 0.8);
        bg.setStrokeStyle(4, 0xff0000);

        this.add.text(400, 260, 'Perdeste!\nTenta novamente.', {
            fontSize: '28px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        const button = this.add.text(400, 330, 'Voltar ao Menu', {
            fontSize: '20px',
            color: '#ff6666',
            backgroundColor: '#222',
            padding: { x: 15, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

}
