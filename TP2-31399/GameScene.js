class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.SPEED = 200;
        this.playerReached = false;
        this.mirrorReached = false;
    }

    preload() {
        this.load.image('player', 'assets/personagem.png');     // personagem normal
        this.load.image('mirror', 'assets/espelho.png');     // personagem espelho
        this.load.image('goal', 'assets/portal.png');       // portal (goal)
        this.load.image('block', 'assets/bloco.png');       // obstáculo
        this.load.image('vida', 'assets/vida.png');         // vidas
        this.load.audio('somPerder', 'assets/perder.wav');
        this.load.audio('somVitoria', 'assets/vitoria.wav');
    }

    create() {
        this.playerReached = false;
        this.mirrorReached = false;

        // Criar personagens
        this.player = this.physics.add.sprite(150, 100, 'player').setScale(0.2);
        this.player.body.setSize(450, 400).setOffset(50, 90);
    
        this.mirrorPlayer = this.physics.add.sprite(650, 100, 'mirror').setScale(0.4).setFlipX(true);
        this.mirrorPlayer.body.setSize(200, 200).setOffset(155, 145);

        // Criar portais
        this.goal1 = this.physics.add.staticSprite(150, 500, 'goal').setScale(0.3);
        this.goal1.refreshBody();
        this.goal1.body.setSize(50, 100).setOffset(10, 10);

        this.goal2 = this.physics.add.staticSprite(650, 500, 'goal').setScale(0.3);
        this.goal2.refreshBody();
        this.goal2.body.setSize(50, 100).setOffset(10, 10);

        // Obstáculos (em cruz no centro)
        this.obstacles = this.physics.add.staticGroup();

        const createBlock = (x, y) => {
            let block = this.obstacles.create(x, y, 'block').setScale(0.5);
            block.refreshBody();
            block.body.setSize(140, 150).setOffset(3, 1);
        };

        createBlock(400, 300);
        createBlock(400, 250);
        createBlock(400, 350);


        // Colisões
        //this.physics.add.collider(this.player, this.obstacles, this.resetLevel, null, this);
        //this.physics.add.collider(this.mirrorPlayer, this.obstacles, this.resetLevel, null, this);

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

        this.player.setVelocity(moveX * this.SPEED, moveY * this.SPEED);
        this.mirrorPlayer.setVelocity(-moveX * this.SPEED, moveY * this.SPEED); // espelhado só na horizontal
    }

    checkWin() {
        if (this.playerReached && this.mirrorReached) {
            this.somVitoria.play();
            this.physics.pause();

            const bg = this.add.rectangle(400, 300, 500, 350, 0x000000, 0.8);
            bg.setStrokeStyle(4, 0xffffff);

            const msg = this.add.text(400, 260, 'Parabéns!\nPassaste o Nível 1', {
                fontSize: '30px',
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
                this.scene.start('Level2Scene');
            });
        }
    }

    resetLevel() {
        this.player.setPosition(150, 100);
        this.mirrorPlayer.setPosition(650, 100);
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