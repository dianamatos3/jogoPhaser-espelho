class Level4Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level4Scene' });
    }

    preload() {
        this.load.image('player', 'assets/personagem.png');
        this.load.image('mirror', 'assets/espelho.png');
        this.load.image('goal', 'assets/portal.png');
        this.load.image('block', 'assets/bloco.png');
        this.load.image('vida', 'assets/vida.png');
        this.load.audio('somGanho', 'assets/vitoriaFinal.mp3');
        this.load.audio('somPerda', 'assets/perder.wav');
        this.load.audio('somAlavanca', 'assets/ativacao.mp3');

    }

    create() {
        this.SPEED = 200;
        this.playerReached = false;
        this.mirrorReached = false;
        this.alavanca1Ativada = false;
        this.alavanca2Ativada = false;

        // Vidas
        this.vidas = 3;
        this.lifeIcons = [];
        for (let i = 0; i < this.vidas; i++) {
            const heart = this.add.image(30 + i * 40, 30, 'vida').setScale(0.1).setScrollFactor(0);
            this.lifeIcons.push(heart);
        }

        // Jogadores
        this.player = this.physics.add.sprite(150, 100, 'player').setScale(0.2);
        this.player.body.setSize(450, 400).setOffset(50, 90);

        this.mirrorPlayer = this.physics.add.sprite(650, 100, 'mirror').setScale(0.4).setFlipX(true);
        this.mirrorPlayer.body.setSize(200, 200).setOffset(155, 145);

        // Obstáculos
        this.obstacles = this.physics.add.staticGroup();
        const createBlock = (x, y) => {
            let b = this.obstacles.create(x, y, 'block').setScale(0.5);
            b.refreshBody();
            b.body.setSize(140, 150).setOffset(3, 1);
        };
        createBlock(300, 250);
        createBlock(500, 300);
        createBlock(400, 400);

        // Alavancas simuladas
        this.alavanca1 = this.physics.add.staticSprite(150, 400, 'block').setScale(0.2);
        this.alavanca1.setTint(0xffff00);
        this.alavanca1.refreshBody();
        this.alavanca1.body.setSize(50, 50).setOffset(5, 5);

        this.alavanca2 = this.physics.add.staticSprite(650, 400, 'block').setScale(0.2);
        this.alavanca2.setTint(0xffff00);
        this.alavanca2.refreshBody();
        this.alavanca2.body.setSize(50, 50).setOffset(5, 5);

        // Portais (inicialmente escondidos e desativados)
        this.goal1 = this.physics.add.staticSprite(150, 550, 'goal').setScale(0.3).setVisible(false);
        this.goal1.body.enable = false;
        this.goal1.refreshBody();
        this.goal1.body.setSize(50, 100).setOffset(10, 10);

        this.goal2 = this.physics.add.staticSprite(650, 550, 'goal').setScale(0.3).setVisible(false);
        this.goal2.body.enable = false;
        this.goal2.refreshBody();
        this.goal2.body.setSize(50, 100).setOffset(10, 10);

        // Colisões e overlaps
        this.physics.add.collider(this.player, this.obstacles, () => this.perderVida(), null, this);
        this.physics.add.collider(this.mirrorPlayer, this.obstacles, () => this.perderVida(), null, this);

        this.physics.add.overlap(this.player, this.alavanca1, () => {
            if (!this.alavanca1Ativada) {
                this.alavanca1Ativada = true;
                this.alavanca1.setTint(0x00ff00);
                this.goal1.setVisible(true);
                this.goal1.body.enable = true;
                this.somAlavanca.play();

            }
        }, null, this);

        this.physics.add.overlap(this.mirrorPlayer, this.alavanca2, () => {
            if (!this.alavanca2Ativada) {
                this.alavanca2Ativada = true;
                this.alavanca2.setTint(0x00ff00);
                this.goal2.setVisible(true);
                this.goal2.body.enable = true;
                this.somAlavanca.play();

            }
        }, null, this);

        this.physics.add.overlap(this.player, this.goal1, () => {
            this.playerReached = true;
            this.checkWin();
        }, null, this);

        this.physics.add.overlap(this.mirrorPlayer, this.goal2, () => {
            this.mirrorReached = true;
            this.checkWin();
        }, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.somGanho = this.sound.add('somGanho');
        this.somPerda = this.sound.add('somPerda');
        this.somAlavanca = this.sound.add('somAlavanca');

    }

    update() {
        let moveX = 0;
        let moveY = 0;
        if (this.cursors.left.isDown) moveX = -1;
        else if (this.cursors.right.isDown) moveX = 1;
        if (this.cursors.up.isDown) moveY = -1;
        else if (this.cursors.down.isDown) moveY = 1;

        this.player.setVelocity(moveX * this.SPEED, moveY * this.SPEED);
        this.mirrorPlayer.setVelocity(-moveX * this.SPEED, moveY * this.SPEED);
    }

    perderVida() {
        if (this.vidas > 0) {
            this.somPerda.play();
            
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

    resetLevel() {
        this.player.setPosition(150, 100);
        this.mirrorPlayer.setPosition(650, 100);
        this.playerReached = false;
        this.mirrorReached = false;
    }

    checkWin() {
        if (this.playerReached && this.mirrorReached) {
            this.somGanho.play();
            this.physics.pause();

            const bg = this.add.rectangle(400, 300, 500, 350, 0x000000, 0.8);
            bg.setStrokeStyle(4, 0xffffff);

            this.add.text(400, 260, 'Genial!\nConseguiste ativar os\n portais!', {
                fontSize: '28px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);

            this.add.text(400, 330, 'Voltar ao Menu', {
                fontSize: '20px',
                color: '#00ffcc',
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

    derrota() {
        this.physics.pause();

        const bg = this.add.rectangle(400, 300, 500, 350, 0x000000, 0.8);
        bg.setStrokeStyle(4, 0xff0000);

        this.add.text(400, 260, 'Perdeste!Tenta novamente.', {
            fontSize: '28px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(400, 330, 'Voltar ao Menu', {
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
