class Level3Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level3Scene' });
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('mirror', 'assets/mirror.png');
        this.load.image('goal', 'assets/portal.png');
        this.load.image('block', 'assets/bloco.png');
        this.load.image('enemy', 'assets/sombra.png'); // novo inimigo
        this.load.image('vida', 'assets/vida.png'); 
        this.load.audio('somPerder', 'assets/perder.wav');
        this.load.audio('somVitoria', 'assets/vitoria.wav');
    }

    create() {
        this.SPEED = 200;
        this.playerReached = false;
        this.mirrorReached = false;

        // Personagens
        this.player = this.physics.add.sprite(150, 100, 'player').setScale(0.2);
        this.player.body.setSize(450, 400).setOffset(50, 90);

        this.mirrorPlayer = this.physics.add.sprite(650, 500, 'mirror').setScale(0.4).setFlipX(true);
        this.mirrorPlayer.body.setSize(200, 200).setOffset(155, 145);

        // Portais
        this.goal1 = this.physics.add.staticSprite(150, 550, 'goal').setScale(0.3);
        this.goal1.refreshBody();
        this.goal1.body.setSize(50, 100).setOffset(10, 10);

        this.goal2 = this.physics.add.staticSprite(650, 50, 'goal').setScale(0.3);
        this.goal2.refreshBody();
        this.goal2.body.setSize(50, 100).setOffset(10, 10);

        // Obstáculos assimétricos
        this.obstacles = this.physics.add.staticGroup();
        const createBlock = (x, y) => {
            let b = this.obstacles.create(x, y, 'block').setScale(0.5);
            b.refreshBody();
            b.body.setSize(140, 150).setOffset(3, 1);
        };

        createBlock(400, 250);
        createBlock(500, 350);
        createBlock(300, 300);
        createBlock(600, 200);
        createBlock(200, 400);

        // Inimigo (Sombra) que persegue o espelho
        this.enemy = this.physics.add.sprite(200, 100, 'enemy').setScale(0.2);
        this.enemy.body.setSize(450, 500).setOffset(5, 50);

        // Colisões com obstáculos
        this.physics.add.collider(this.player, this.obstacles, () => this.perderVida(), null, this);
        this.physics.add.collider(this.mirrorPlayer, this.obstacles, () => this.perderVida(), null, this);
        this.physics.add.collider(this.enemy, this.mirrorPlayer, () => this.perderVida(), null, this);

        // Faz com que o inimigo apenas *passe por cima* dos blocos (sem colisão)
        this.physics.add.overlap(this.enemy, this.obstacles);
        
        // Colisões com portais
        this.physics.add.overlap(this.player, this.goal1, () => {
            this.playerReached = true;
            this.checkWin();
        }, null, this);

        this.physics.add.overlap(this.mirrorPlayer, this.goal2, () => {
            this.mirrorReached = true;
            this.checkWin();
        }, null, this);

        // Colisão inimigo → mirror
        this.physics.add.collider(this.enemy, this.mirrorPlayer, this.resetLevel, null, this);


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
        this.mirrorPlayer.setVelocity(-moveX * this.SPEED, -moveY * this.SPEED);

        // A sombra persegue o espelho
        this.physics.moveToObject(this.enemy, this.mirrorPlayer, 100);
    }

    checkWin() {
        if (this.playerReached && this.mirrorReached) {
            this.somVitoria.play();
            this.physics.pause();

            const bg = this.add.rectangle(400, 300, 400, 250, 0x000000, 0.8);
            bg.setStrokeStyle(4, 0xffffff);

            this.add.text(400, 260, 'Incrível!\nEscapaste da sombra!', {
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
                this.scene.start('Level4Scene');
            });
        }
    }

    resetLevel() {
        this.player.setPosition(150, 100);
        this.mirrorPlayer.setPosition(650, 500);
        this.enemy.setPosition(400, 300);
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
