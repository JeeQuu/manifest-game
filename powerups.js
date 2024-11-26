class PowerUpManager {
    constructor(scene) {
        this.scene = scene;
        
        // Power-up states
        this.hasMoonglassesBonus = false;
        this.isBonusActive = false;
        this.isSuperBonusActive = false;
        this.isCrystalBallActive = false;
        this.isPepeActive = false;
        this.isWhaleActive = false;
        
        // Counters and timers
        this.dollarsCollected = 0;
        
        // Configuration
        this.bonusDuration = 10000; // 10 seconds
        this.superBonusMultiplier = 50;
        this.pepeMultiplier = 50;  // Same as previous superBonusMultiplier
        
        // References to game objects
        this.laserBeam = null;
        this.laserBeamTimer = null;

        // Add depth constants
        this.DEPTHS = {
            BACKGROUND: 1,
            STARS: 2,
            MOON: 3,
            CANDLES: 4,
            POWERUPS: 5,
            METEORS: 6,
            PLAYER: 7,
            LASER: 8,
            PARTICLES: 9,
            UI: 1000
        };

        // Add a group to manage all powerups
        this.powerupGroup = scene.physics.add.group();
        
        // Set up a single collision handler for all powerups
        scene.physics.add.overlap(
            scene.player,
            this.powerupGroup,
            this.handlePowerupCollision,
            null,
            this
        );

        this.initializeTimers();

        // Define spawn configuration
        this.spawnConfig = {
            phases: {
                intro: { start: 180, end: 165 },
                early: { start: 165, end: 120 },
                mid: { start: 120, end: 60 },
                late: { start: 60, end: 20 },
                final: { start: 20, end: 0 }
            },
            powerUps: {
                moonglasses: {
                    startPhase: 'early',
                    weight: 0.7,
                    minInterval: 20000, // Minimum time between spawns
                    lastSpawnTime: 0
                },
                crystalball: {
                    startPhase: 'mid',
                    weight: 0.8,
                    minInterval: 20000,
                    lastSpawnTime: 0
                },
                pepe: {
                    startPhase: 'late',
                    weight: 0.5,
                    minInterval: 25000,
                    lastSpawnTime: 0
                },
                whale: {
                    startPhase: 'final',
                    weight: 0.4,
                    minInterval: 30000,
                    lastSpawnTime: 0
                }
            },
            spawnChance: {
                early: 0.002,  // Per frame chance
                mid: 0.003,
                late: 0.004,
                final: 0.005
            }
        };

        // Remove the old timers
        this.initializeSpawnSystem();

        // Add rugpull timing configuration
        this.rugpullConfig = {
            minDelay: 40000, // Start after 1 minute
            frequency: { min: 15000, max: 30000 }, // Random interval between spawns
            maxSpawns: 4 // Maximum number of rugpulls per game
        };
        this.rugpullCount = 0;
        
        // Start rugpull timer
        this.scene.time.delayedCall(this.rugpullConfig.minDelay, () => {
            this.scheduleNextRugpull();
        });

        // Load rugpull sound
        this.rugpullSound = this.scene.sound.add('rugpull_sound');

        // Add dollar score ramp configuration
        this.dollarScoreRamp = [
            1000,    // 1st dollar
            2000,    // 2nd dollar
            5000,    // 3rd dollar
            10000,   // 4th dollar
            20000,   // 5th dollar
            40000,   // 6th dollar
            80000,   // 7th dollar
            150000,  // 8th dollar
            300000,  // 9th dollar
            600000   // 10th dollar
        ];
        
        // Track dollars collected in current moonglasses session
        this.currentSessionDollars = 0;

        // Add scheduled whale spawns
        const whaleSchedule = [
            { time: 150, label: 'First whale' },     // At 2:30
            { time: 120, label: 'Second whale' },    // At 2:00
            { time: 90, label: 'Third whale' },      // At 1:30
            { time: 60, label: 'Fourth whale' },     // At 1:00
            { time: 30, label: 'Fifth whale' }       // At 0:30
        ];

        whaleSchedule.forEach(event => {
            scene.time.delayedCall(
                (180 - event.time) * 1000, // Convert to milliseconds from start
                () => {
                    console.log(`Scheduled whale spawn: ${event.label}`);
                    this.spawnWhale();
                }
            );
        });
    }

    initializeSpawnSystem() {
        // Clear any existing timers
        if (this.moonGlassesTimer) this.moonGlassesTimer.remove();
        if (this.crystalBallTimer) this.crystalBallTimer.remove();
        if (this.pepeTimer) this.pepeTimer.remove();
        if (this.whaleTimer) this.whaleTimer.remove();
    }

    getCurrentPhase(gameTime) {
        const phases = this.spawnConfig.phases;
        for (const [phaseName, phase] of Object.entries(phases)) {
            if (gameTime <= phase.start && gameTime > phase.end) {
                return phaseName;
            }
        }
        return 'final';
    }

    canSpawnPowerUp(powerUpKey, currentTime) {
        const powerUp = this.spawnConfig.powerUps[powerUpKey];
        const timeSinceLastSpawn = currentTime - powerUp.lastSpawnTime;
        return timeSinceLastSpawn >= powerUp.minInterval;
    }

    initializeTimers() {
        this.moonGlassesTimer = this.scene.time.addEvent({
            delay: 30000,
            callback: this.spawnMoonGlasses,
            callbackScope: this,
            loop: true
        });

        this.crystalBallTimer = this.scene.time.addEvent({
            delay: 45000,
            callback: this.spawnCrystalBall,
            callbackScope: this,
            loop: true
        });

        this.pepeTimer = this.scene.time.addEvent({
            delay: 10000,  // Spawn every 60 seconds
            callback: this.spawnPepe,
            callbackScope: this,
            loop: true
        });

        // More frequent whale spawning
        this.whaleTimer = this.scene.time.addEvent({
            delay: 20000, // Spawn every 20 seconds (reduced from 30)
            callback: this.spawnWhale,
            callbackScope: this,
            loop: true,
            startAt: 60000 // Start spawning after 1 minute (reduced from 2 minutes)
        });
    }

    // Moonglasses power-up
    spawnMoonGlasses() {
        const x = Phaser.Math.Between(50, this.scene.game.config.width - 50);
        const y = -50;
        const moonGlasses = this.powerupGroup.create(x, y, 'moonglasses')
            .setScale(0.5)
            .setDepth(this.DEPTHS.POWERUPS);
            
        moonGlasses.setVelocityY(200);
        moonGlasses.setVelocityX(Phaser.Math.Between(-50, 50));
    }

    activateMoonglasses(player) {
        if (this.hasMoonglassesBonus) return;
        
        this.hasMoonglassesBonus = true;
        this.currentSessionDollars = 0; // Reset counter for new session
        this.scene.switchPlayerSprite('planeglasses');
        
        this.spawnDollarSigns();

        this.scene.time.delayedCall(this.bonusDuration, () => {
            this.deactivateMoonglasses(player);
        });
    }

    deactivateMoonglasses(player) {
        this.hasMoonglassesBonus = false;
        this.currentSessionDollars = 0; // Reset counter when power-up ends
        this.scene.switchPlayerSprite(this.scene.originalPlayerSprite);
    }

    // Dollar signs
    spawnDollarSigns() {
        const dollarCount = 10;
        const sides = ['left', 'right'];
        
        for (let i = 0; i < dollarCount; i++) {
            this.scene.time.delayedCall(Phaser.Math.Between(0, 2000), () => {
                const side = Phaser.Utils.Array.GetRandom(sides);
                const y = Phaser.Math.Between(100, this.scene.game.config.height - 100);
                
                // Set initial position based on side
                const x = side === 'left' ? -30 : this.scene.game.config.width + 30;
                
                const dollar = this.scene.physics.add.sprite(x, y, 'dollar')
                    .setScale(0.5)
                    .setDepth(this.DEPTHS.POWERUPS);
                
                // Set velocity based on which side the dollar spawns from
                const speed = 300;
                dollar.setVelocityX(side === 'left' ? speed : -speed);
                
                // Add collision detection
                this.scene.physics.add.overlap(
                    this.scene.player, 
                    dollar, 
                    (player, dollar) => this.collectDollarSign(player, dollar), 
                    null, 
                    this
                );

                // Increment total dollar signs counter
                this.scene.totalDollarSigns++;
                
                // Add to tracking array and set cleanup timer
                if (this.scene.dollarSigns) {
                    this.scene.dollarSigns.push(dollar);
                    
                    // Clean up dollar after max duration
                    this.scene.time.delayedCall(5000, () => {
                        if (dollar && dollar.active) {
                            this.removeDollarSign(dollar);
                        }
                    });
                }
            });
        }
    }

    collectDollarSign(player, dollar) {
        if (!dollar || !dollar.active) return;

        // Play sound
        this.scene.sound.play('dollar_sound', { volume: 0.3 });

        // Update counters
        this.scene.dollarsCollected++;
        this.scene.collectedDollarSigns++;
        
        // Get score for this dollar
        const scoreIndex = Math.min(this.currentSessionDollars, this.dollarScoreRamp.length - 1);
        const score = this.dollarScoreRamp[scoreIndex];
        this.currentSessionDollars++;

        // Check if this is the 10th dollar (final one)
        const isFinalDollar = scoreIndex === this.dollarScoreRamp.length - 1;
        
        if (isFinalDollar) {
            this.createFinalDollarEffect(dollar, score);
        } else {
            this.createRegularDollarEffect(dollar, score);
        }

        // Update score
        this.scene.score += score;
        this.scene.scoreText.setText('Market Cap: $' + this.formatScore(this.scene.score));

        // Remove from tracking array and destroy
        this.removeDollarSign(dollar);
    }

    createFinalDollarEffect(dollar, score) {
        // Play special sound
        this.scene.sound.play('final_dollar_sound', { volume: 0.7 });
        
        // Camera effects
        this.scene.cameras.main.flash(1000, 255, 215, 0);  // Golden flash
        this.scene.cameras.main.shake(500, 0.01);  // Subtle shake

        // Multiple particle emitters for spectacular effect
        const colors = [0xFF0000, 0xFFD700, 0x00FF00, 0x0000FF];
        colors.forEach((color, i) => {
            let emitter = this.scene.particles.createEmitter({
                x: dollar.x,
                y: dollar.y,
                speed: { min: 200, max: 400 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.6, end: 0 },
                blendMode: 'ADD',
                lifespan: 1000,
                gravityY: 300,
                quantity: 30,
                tint: color
            });
            emitter.explode(30, dollar.x, dollar.y);
        });

        // Create spectacular score text with manual glow effect
        const formattedScore = this.formatScore(score);
        
        // Create multiple layers of text for glow effect
        const glowLayers = 4;
        const glowColor = '#FFD700';
        const glowTexts = [];
        
        // Create glow layers
        for (let i = 0; i < glowLayers; i++) {
            let glowText = this.scene.add.text(dollar.x, dollar.y, '+$' + formattedScore, {
                fontSize: '48px',
                fontFamily: 'VT323',
                fill: glowColor,
                stroke: glowColor,
                strokeThickness: 16 - (i * 4)
            }).setOrigin(0.5).setDepth(this.DEPTHS.UI - glowLayers + i).setAlpha(0.2);
            glowTexts.push(glowText);
        }

        // Main score text
        let scorePopup = this.scene.add.text(dollar.x, dollar.y, '+$' + formattedScore, {
            fontSize: '48px',
            fontFamily: 'VT323',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(this.DEPTHS.UI);
        
        // Create "10X BONUS!" text above score
        let bonusText = this.scene.add.text(dollar.x, dollar.y - 40, '10X BONUS!', {
            fontSize: '32px',
            fontFamily: 'VT323',
            fill: '#FF0000',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(this.DEPTHS.UI);

        // Animate both texts and glow layers
        const allTextElements = [...glowTexts, scorePopup, bonusText];
        this.scene.tweens.add({
            targets: allTextElements,
            scaleX: [0.5, 2, 1],
            scaleY: [0.5, 2, 1],
            duration: 1000,
            ease: 'Back.easeOut'
        });

        this.scene.tweens.add({
            targets: allTextElements,
            y: '-=150',
            alpha: { from: 1, to: 0 },
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                allTextElements.forEach(text => text.destroy());
            }
        });

        // Create expanding ring effect
        const ring = this.scene.add.circle(dollar.x, dollar.y, 10, 0xFFD700);
        ring.setStrokeStyle(4, 0xFFD700);
        ring.setDepth(this.DEPTHS.UI - 1);

        this.scene.tweens.add({
            targets: ring,
            scale: 3,
            alpha: 0,
            duration: 1000,
            ease: 'Quad.easeOut',
            onComplete: () => ring.destroy()
        });

        // Add celebratory text in center of screen with manual glow
        const celebrationGlowLayers = [];
        for (let i = 0; i < glowLayers; i++) {
            let glowLayer = this.scene.add.text(
                this.scene.game.config.width / 2,
                this.scene.game.config.height / 2,
                'MAXIMUM BONUS!',
                {
                    fontSize: '64px',
                    fontFamily: 'VT323',
                    fill: glowColor,
                    stroke: glowColor,
                    strokeThickness: 16 - (i * 4)
                }
            ).setOrigin(0.5).setDepth(this.DEPTHS.UI + i).setAlpha(0.2);
            celebrationGlowLayers.push(glowLayer);
        }

        let celebrationText = this.scene.add.text(
            this.scene.game.config.width / 2,
            this.scene.game.config.height / 2,
            'MAXIMUM BONUS!',
            {
                fontSize: '64px',
                fontFamily: 'VT323',
                fill: '#FFD700',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5).setDepth(this.DEPTHS.UI + glowLayers);

        const allCelebrationElements = [...celebrationGlowLayers, celebrationText];
        this.scene.tweens.add({
            targets: allCelebrationElements,
            scale: { from: 0.5, to: 1.5 },
            alpha: { from: 1, to: 0 },
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                allCelebrationElements.forEach(text => text.destroy());
            }
        });
    }

    createRegularDollarEffect(dollar, score) {
        // Regular particle effect
        const particleColor = this.getParticleColorForScore(score);
        let emitter = this.scene.particles.createEmitter({
            x: dollar.x,
            y: dollar.y,
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 800,
            gravityY: 300,
            quantity: 20,
            tint: particleColor
        });
        emitter.explode(20, dollar.x, dollar.y);

        // Regular score popup
        const formattedScore = this.formatScore(score);
        let scorePopup = this.scene.add.text(dollar.x, dollar.y, '+' + formattedScore, {
            fontSize: '32px',
            fontFamily: 'VT323',
            fill: this.getScoreColor(score),
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(this.DEPTHS.UI);

        // Animate score popup
        this.scene.tweens.add({
            targets: scorePopup,
            y: scorePopup.y - 100,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => scorePopup.destroy()
        });
    }

    removeDollarSign(dollar) {
        if (this.scene.dollarSigns) {
            const index = this.scene.dollarSigns.indexOf(dollar);
            if (index > -1) {
                this.scene.dollarSigns.splice(index, 1);
            }
        }
        dollar.destroy();
    }

    // Helper function to format score with commas
    formatScore(score) {
        return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Helper function to get particle color based on score
    getParticleColorForScore(score) {
        if (score >= 300000) return 0xFF0000;      // Red for highest scores
        if (score >= 80000) return 0xFFA500;       // Orange for high scores
        if (score >= 20000) return 0xFFFF00;       // Yellow for medium scores
        return 0xFFD700;                           // Gold for lower scores
    }

    // Helper function to get text color based on score
    getScoreColor(score) {
        if (score >= 300000) return '#FF0000';     // Red for highest scores
        if (score >= 80000) return '#FFA500';      // Orange for high scores
        if (score >= 20000) return '#FFFF00';      // Yellow for medium scores
        return '#FFD700';                          // Gold for lower scores
    }

    // Bonus mode
    triggerBonusMode() {
        if (this.isBonusActive) return;
        
        this.isBonusActive = true;
        this.scene.scoreMultiplier = this.superBonusMultiplier;

        if (this.scene.consecutiveGreenCandles >= 10) {
            this.triggerSuperBonusMode();
        }

        this.scene.time.delayedCall(this.bonusDuration, () => {
            this.deactivateBonusMode();
        });
    }

    deactivateBonusMode() {
        this.isBonusActive = false;
        this.scene.scoreMultiplier = 1;
        if (this.isSuperBonusActive) {
            this.endSuperBonusMode();
        }
    }

    // Super bonus mode (laser)
    triggerSuperBonusMode() {
        if (this.isSuperBonusActive) return;
        this.isSuperBonusActive = true;
        this.scene.scoreMultiplier = this.superBonusMultiplier;
    }

    endSuperBonusMode() {
        this.isSuperBonusActive = false;
        this.scene.scoreMultiplier = 1;
    }

    // Crystal ball power-up
    spawnCrystalBall() {
        const x = Phaser.Math.Between(50, this.scene.game.config.width - 50);
        const y = -50;
        const crystalBall = this.powerupGroup.create(x, y, 'crystalball')
            .setScale(0.25)  // Changed from 0.5 to 0.25
            .setDepth(this.DEPTHS.POWERUPS);
            
        crystalBall.setVelocityY(200);
        crystalBall.setVelocityX(Phaser.Math.Between(-50, 50));
        
        this.scene.physics.add.overlap(this.scene.player, crystalBall, this.collectCrystalBall, null, this);
        console.log('Crystal Ball spawned at:', x, y);
    }

    activateCrystalBall() {
        if (this.isCrystalBallActive) return;
        
        this.isCrystalBallActive = true;
        this.scene.time.delayedCall(7000, () => {
            this.deactivateCrystalBall();
        });
    }

    deactivateCrystalBall() {
        this.isCrystalBallActive = false;
    }

    updateCrystalBallEffect() {
        if (this.isCrystalBallActive) {
            this.scene.candles.getChildren().forEach(candle => {
                if (candle.texture.key.startsWith('green')) {
                    const angle = Phaser.Math.Angle.Between(candle.x, candle.y, this.scene.player.x, this.scene.player.y);
                    const velocityX = Math.cos(angle) * 100;
                    const velocityY = Math.sin(angle) * 100;
                    candle.setVelocity(velocityX, velocityY);
                }
            });
        }
    }

    // New Pepe methods
    spawnPepe() {
        console.log('Attempting to spawn Pepe');
        const x = Phaser.Math.Between(50, this.scene.game.config.width - 50);
        const y = -50;
        const pepe = this.powerupGroup.create(x, y, 'pepe')
            .setScale(0.25)  // Changed from 0.5 to 0.25
            .setDepth(this.DEPTHS.POWERUPS);
            
        pepe.setVelocityY(200);
        pepe.setVelocityX(Phaser.Math.Between(-50, 50));
        
        this.scene.physics.add.overlap(this.scene.player, pepe, this.collectPepe, null, this);
        console.log('Pepe spawned at:', x, y);
    }

    collectPepe(player, pepe) {
        console.log('Collecting Pepe');
        if (!pepe || !pepe.active) return;
        
        pepe.destroy();
        this.scene.sound.play('pepe_sound');
        this.activatePepe();
    }

    activatePepe() {
        console.log('Activating Pepe mode');
        if (this.isPepeActive) return;
        
        this.isPepeActive = true;
        this.scene.scoreMultiplier = this.pepeMultiplier;
        
        // Store original sprite name
        this.originalPlayerSprite = this.scene.player.texture.key;
        this.scene.switchPlayerSprite('planepepe');
        
        // Create laser trails array
        this.laserTrails = [];
        
        // Add VHS filter effect with green tint
        this.addVHSEffect();
        
        // Create laser beam (now green)
        this.createLaserBeam();

        // Set timer for deactivation
        this.scene.time.delayedCall(10000, () => {
            this.deactivatePepe();
        });
    }

    addVHSEffect() {
        console.log('Adding VHS effect');
        
        // Create a white rectangle texture for the overlay
        const graphicsTexture = this.scene.add.graphics();
        graphicsTexture.fillStyle(0xFFFFFF);
        graphicsTexture.fillRect(0, 0, this.scene.game.config.width, this.scene.game.config.height);
        graphicsTexture.generateTexture('vhs_overlay', this.scene.game.config.width, this.scene.game.config.height);
        graphicsTexture.destroy();

        // Create overlay using the texture
        this.vhsOverlay = this.scene.add.sprite(
            0, 0, 
            'vhs_overlay'
        ).setOrigin(0, 0)
         .setDepth(this.DEPTHS.UI - 1)
         .setAlpha(0.1);

        // Add scanlines
        this.scanlines = this.scene.add.tileSprite(
            0, 0,
            this.scene.game.config.width,
            this.scene.game.config.height,
            'scanlines'
        ).setOrigin(0, 0).setDepth(this.DEPTHS.UI - 2).setAlpha(0.1);

        // Add glitch effect timer
        this.glitchTimer = this.scene.time.addEvent({
            delay: 100,
            callback: this.updateVHSEffect,
            callbackScope: this,
            loop: true
        });
    }

    updateVHSEffect() {
        // Random glitch effect
        if (Math.random() < 0.3) {
            this.vhsOverlay.x = Math.random() * 4 - 2;
            this.scene.cameras.main.shake(50, 0.002);
            
            // Green color shifting
            const greenShift = 0x00FF00;
            this.vhsOverlay.setTint(greenShift);
        }

        // Update scanlines
        if (this.scanlines) {
            this.scanlines.tilePositionY += 4;
        }
    }

    deactivatePepe() {
        this.isPepeActive = false;
        this.scene.scoreMultiplier = 1;
        this.scene.switchPlayerSprite(this.scene.originalPlayerSprite);
        
        // Clean up laser effects
        if (this.laserBeam) {
            this.laserBeam.destroy();
        }
        if (this.glowBeam) {
            this.glowBeam.destroy();
        }
        if (this.laserBeamTimer) {
            this.laserBeamTimer.remove();
        }
        
        // Clean up VHS effects
        if (this.vhsOverlay) {
            this.vhsOverlay.destroy();
        }
        if (this.scanlines) {
            this.scanlines.destroy();
        }
        if (this.glitchTimer) {
            this.glitchTimer.remove();
        }
        
        this.laserTrails = [];
    }

    // Update method to be called in the scene's update
    update() {
        const currentTime = this.scene.time.now;
        const gameTime = this.scene.gameTime;
        const currentPhase = this.getCurrentPhase(gameTime);
        
        // Check if we should attempt to spawn a power-up
        if (Math.random() < this.spawnConfig.spawnChance[currentPhase]) {
            // Get available power-ups for current phase
            const availablePowerUps = Object.entries(this.spawnConfig.powerUps)
                .filter(([key, config]) => {
                    const phaseIndex = Object.keys(this.spawnConfig.phases).indexOf(config.startPhase);
                    const currentPhaseIndex = Object.keys(this.spawnConfig.phases).indexOf(currentPhase);
                    return currentPhaseIndex >= phaseIndex && this.canSpawnPowerUp(key, currentTime);
                });

            if (availablePowerUps.length > 0) {
                // Calculate total weight
                const totalWeight = availablePowerUps.reduce((sum, [_, config]) => sum + config.weight, 0);
                
                // Random weighted selection
                let random = Math.random() * totalWeight;
                let selectedPowerUp = availablePowerUps[0][0];
                
                for (const [key, config] of availablePowerUps) {
                    random -= config.weight;
                    if (random <= 0) {
                        selectedPowerUp = key;
                        break;
                    }
                }

                // Spawn the selected power-up
                this.spawnPowerUp(selectedPowerUp);
                this.spawnConfig.powerUps[selectedPowerUp].lastSpawnTime = currentTime;
            }
        }

        this.updateCrystalBallEffect();
        if (this.isBonusActive) {
            this.scene.player.setTint(0xFFD700);
        } else {
            this.scene.player.clearTint();
        }
        if (this.isSuperBonusActive) {
            this.scene.player.setTint(0xFF0000);
        }

        // Check if moon glasses are off-screen and destroy them
        this.scene.children.getAll('texture.key', 'moonglasses').forEach(moonGlasses => {
            if (moonGlasses.y > this.scene.game.config.height + 50) {
                moonGlasses.destroy();
            }
        });

        // Check if crystal balls are off-screen and destroy them
        this.scene.children.getAll('texture.key', 'crystalball').forEach(crystalBall => {
            if (crystalBall.y > this.scene.game.config.height + 50) {
                crystalBall.destroy();
            }
        });

        // Update Pepe tint to green
        if (this.isPepeActive) {
            this.scene.player.setTint(0x00FF00);  // Changed from red to green
        }

        // Check if pepe power-ups are off-screen
        this.scene.children.getAll('texture.key', 'pepe').forEach(pepe => {
            if (pepe.y > this.scene.game.config.height + 50) {
                pepe.destroy();
            }
        });
    }

    spawnPowerUp(powerUpKey) {
        switch(powerUpKey) {
            case 'moonglasses':
                this.spawnMoonGlasses();
                break;
            case 'crystalball':
                this.spawnCrystalBall();
                break;
            case 'pepe':
                this.spawnPepe();
                break;
            case 'whale':
                this.spawnWhale();
                break;
        }
    }

    // Helper methods
    reset() {
        this.hasMoonglassesBonus = false;
        this.isBonusActive = false;
        this.isSuperBonusActive = false;
        this.isCrystalBallActive = false;
        this.isPepeActive = false;
        this.dollarsCollected = 0;
        
        if (this.laserBeam) {
            this.laserBeam.destroy();
        }
        if (this.laserBeamTimer) {
            this.laserBeamTimer.remove();
        }
    }

    handleMoonGlassesSpawning() {
        if (this.scene.gameTime <= this.scene.gameConfig.moonGlassesStopTime) {
            if (this.moonGlassesTimer) {
                this.moonGlassesTimer.remove(false);
                this.moonGlassesTimer = null;
            }
        }
    }

    collectMoonGlasses(player, moonGlasses) {
        if (!moonGlasses || !moonGlasses.active) return;
        
        moonGlasses.destroy();
        this.scene.sound.play('moonglasses_sound');  // Make sure this sound exists
        this.activateMoonglasses(player);
    }

    collectCrystalBall(player, crystalBall) {
        if (!crystalBall || !crystalBall.active) return;
        
        crystalBall.destroy();
        this.scene.sound.play('crystalBall_sound');
        this.activateCrystalBall();

        // Enhanced cat silhouette effect
        const catBlink = this.scene.add.image(
            this.scene.game.config.width / 2,
            this.scene.game.config.height * 0.5,
            'silhouette'
        )
        .setScale(0.8)  // Increased from 0.4
        .setAlpha(0)
        .setDepth(this.DEPTHS.UI - 2)
        .setTint(0x00FF00);  // Added green tint

        // More dramatic fade in/out with scale effect
        this.scene.tweens.add({
            targets: catBlink,
            alpha: { from: 0, to: 0.6 },  // Increased from 0.3
            scale: { from: 0.6, to: 0.9 },
            duration: 800,  // Increased from 500
            yoyo: true,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                catBlink.destroy();
            }
        });
    }

    clearTimers() {
        if (this.moonGlassesTimer) {
            this.moonGlassesTimer.remove();
        }
        if (this.crystalBallTimer) {
            this.crystalBallTimer.remove();
        }
        if (this.laserBeamTimer) {
            this.laserBeamTimer.remove();
        }
        if (this.pepeTimer) {
            this.pepeTimer.remove();
        }
    }

    spawnWhale() {
        const sides = ['left', 'right'];
        const side = Phaser.Utils.Array.GetRandom(sides);
        const y = Phaser.Math.Between(100, this.scene.game.config.height - 100);
        
        // Set initial position based on side
        const x = side === 'left' ? -100 : this.scene.game.config.width + 100;
        
        const whale = this.powerupGroup.create(x, y, 'whale')
            .setScale(0.6)  // Increased scale for better visibility
            .setDepth(this.DEPTHS.POWERUPS + 1); // Increased depth to ensure visibility
        
        // Add swimming wave motion
        this.scene.tweens.add({
            targets: whale,
            y: y + 30, // Increased wave amplitude
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Slower speed for better visibility
        const speed = 120; // Reduced speed for better visibility
        whale.setVelocityX(side === 'left' ? speed : -speed);
        
        // Flip whale sprite if coming from right
        if (side === 'right') {
            whale.setFlipX(true);
        }

        // Add guaranteed spawns at specific times
        const gameTime = this.scene.gameTime;
        console.log('Whale spawned at game time:', gameTime, { x, y, side, scale: 0.6 });

        // Destroy whale if it goes off screen
        this.scene.time.delayedCall(10000, () => {
            if (whale && whale.active) {
                whale.destroy();
            }
        });
    }

    collectWhale(player, whale) {
        if (!whale || !whale.active) return;
        
        console.log('Whale collected!'); // Debug log
        
        whale.destroy();
        if (this.scene.sound.get('whale_sound')) {
            this.scene.sound.play('whale_sound', { volume: 0.5 });
        }
        
        // Random boost between 30-70%
        const boostPercentage = Phaser.Math.Between(30, 70) / 100;
        const boost = Math.floor(this.scene.score * boostPercentage);
        this.scene.updateScore(this.scene.score + boost);
        
        // Create fountain particle effect
        this.createWhaleFountain(whale.x, whale.y, boost);
    }

    createWhaleFountain(x, y, boost) {
        // Create particle emitter for the fountain
        const fountainEmitter = this.scene.particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 200, max: 400 },
            angle: { min: 250, max: 290 }, // Upward spray
            scale: { start: 0.4, end: 0 },
            blendMode: 'ADD',
            lifespan: 1500,
            quantity: 2,
            frequency: 50,
            tint: [0x87CEEB, 0xFFFFFF], // Sky blue and white
            gravityY: 300,
            emitCallback: (particle) => {
                // Add random horizontal movement
                particle.velocityX += Phaser.Math.Between(-50, 50);
            }
        });

        // Create score text that follows the particles
        let scorePopup = this.scene.add.text(x, y, '+' + boost, {
            fontSize: '32px',
            fontFamily: 'VT323',
            fill: '#87CEEB',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(this.DEPTHS.UI);

        // Animate the fountain
        this.scene.time.delayedCall(1000, () => {
            // After 1 second, start gravitating particles toward score
            fountainEmitter.setGravityY(-300);
            fountainEmitter.setSpeed({ min: 100, max: 200 });
            fountainEmitter.setAngle({ min: 0, max: 360 });
            
            // Move score text up with particles
            this.scene.tweens.add({
                targets: scorePopup,
                y: 40, // Move to top of screen where score is
                x: this.scene.game.config.width / 2,
                alpha: 0,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    scorePopup.destroy();
                    fountainEmitter.stop();
                }
            });
        });

        // Stop emitter after 2 seconds
        this.scene.time.delayedCall(2000, () => {
            fountainEmitter.stop();
        });
    }

    createLaserBeam() {
        // Create the laser beam graphics
        this.laserBeam = this.scene.add.graphics();
        this.laserBeam.setDepth(this.DEPTHS.LASER);
        this.laserBeamAngle = 0;

        // Add a glow effect
        this.glowBeam = this.scene.add.graphics();
        this.glowBeam.setDepth(this.DEPTHS.LASER - 1);

        // Start updating the laser beam
        this.laserBeamTimer = this.scene.time.addEvent({
            delay: 16,  // Update every frame
            callback: this.updateLaserBeam,
            callbackScope: this,
            loop: true
        });
    }

    updateLaserBeam() {
        if (!this.laserBeam || !this.glowBeam) return;

        // Clear previous frame
        this.laserBeam.clear();
        this.glowBeam.clear();
        
        const player = this.scene.getPlayer();
        if (!player) return;

        // Store current laser position for trail
        const radius = 500;
        const endX = player.x + Math.cos(this.laserBeamAngle) * radius;
        const endY = player.y + Math.sin(this.laserBeamAngle) * radius;
        
        // Update trails
        this.laserTrails.push({ x: endX, y: endY, alpha: 1 });
        if (this.laserTrails.length > 10) {
            this.laserTrails.shift();
        }

        // Draw trails with green color
        this.laserTrails.forEach((trail, index) => {
            const alpha = index / this.laserTrails.length;
            this.glowBeam.lineStyle(24 * alpha, 0x00FF00, 0.3 * alpha);  // Changed to green
            this.glowBeam.beginPath();
            this.glowBeam.moveTo(player.x, player.y);
            this.glowBeam.lineTo(trail.x, trail.y);
            this.glowBeam.strokePath();
        });

        // Draw main beam in green
        this.laserBeam.lineStyle(8, 0x00FF00, 1);  // Changed to green
        this.laserBeam.beginPath();
        this.laserBeam.moveTo(player.x, player.y);
        this.laserBeam.lineTo(endX, endY);
        this.laserBeam.strokePath();

        // Faster rotation
        this.laserBeamAngle += 0.15;

        this.checkLaserCollisions(endX, endY);
    }

    checkLaserCollisions(endX, endY) {
        const player = this.scene.getPlayer();
        if (!player) return;

        const line = new Phaser.Geom.Line(player.x, player.y, endX, endY);
        const scorePerHit = 10000; // 10k points per destroyed object
        
        // Check all possible game objects
        const objectsToCheck = [
            { group: this.scene.candles, type: 'candle' },
            { group: this.scene.meteors, type: 'meteor' },
            { group: this.scene.dollarSigns, type: 'dollar' },
            ...['moonglasses', 'crystalball', 'pepe'].map(key => ({
                group: this.scene.children.getAll('texture.key', key),
                type: 'powerup'
            }))
        ];

        objectsToCheck.forEach(({ group, type }) => {
            const objects = Array.isArray(group) ? group : group?.getChildren() || [];
            
            objects.forEach(obj => {
                if (obj && obj.active && Phaser.Geom.Intersects.LineToRectangle(line, obj.getBounds())) {
                    // Update tally based on object type
                    if (type === 'candle') {
                        this.scene.candlesCollected++;
                        if (obj.texture.key.includes('red')) {
                            this.scene.redCandlesCollected++;
                        } else if (obj.texture.key.includes('green')) {
                            this.scene.greenCandlesCollected++;
                        }
                    } else if (type === 'meteor') {
                        this.scene.meteorsCollected++;
                    } else if (type === 'dollar') {
                        this.scene.dollarsCollected++;
                        this.scene.collectedDollarSigns++;  // Add this line
                    }

                    // Create explosion effect (now green)
                    let emitter = this.scene.particles.createEmitter({
                        x: obj.x,
                        y: obj.y,
                        speed: { min: 100, max: 200 },
                        angle: { min: 0, max: 360 },
                        scale: { start: 0.5, end: 0 },
                        blendMode: 'ADD',
                        lifespan: 800,
                        tint: 0x00FF00  // Changed to green
                    });
                    emitter.explode(20, obj.x, obj.y);

                    // Play laser explosion sound
                    this.scene.sound.play('laser_explosion', { 
                        volume: 0.3,
                        detune: Phaser.Math.Between(-200, 200)
                    });

                    // Add score and show score popup in green
                    this.scene.score += scorePerHit;
                    this.scene.scoreText.setText('Market Cap: $' + this.scene.score);

                    // Show floating score text in green
                    let scorePopup = this.scene.add.text(obj.x, obj.y, '+10K', {
                        fontSize: '24px',
                        fontFamily: 'VT323',
                        fill: '#00FF00',  // Changed to green
                        stroke: '#000000',
                        strokeThickness: 2
                    }).setOrigin(0.5).setDepth(this.DEPTHS.UI);

                    // Animate the score popup
                    this.scene.tweens.add({
                        targets: scorePopup,
                        y: scorePopup.y - 50,
                        alpha: 0,
                        duration: 1000,
                        ease: 'Power2',
                        onComplete: () => scorePopup.destroy()
                    });

                    // Destroy the object
                    obj.destroy();
                }
            });
        });
    }

    handlePowerupCollision(player, powerup) {
        if (!powerup.active) return;
        
        switch(powerup.texture.key) {
            case 'moonglasses':
                this.collectMoonGlasses(player, powerup);
                break;
            case 'crystalball':
                this.collectCrystalBall(player, powerup);
                break;
            case 'pepe':
                this.collectPepe(player, powerup);
                break;
            case 'whale':
                this.collectWhale(player, powerup);
                break;
            case 'rugpull':
                this.collectRugpull(player, powerup);
                break;
        }
    }

    // Add new method for rugpull scheduling
    scheduleNextRugpull() {
        if (this.rugpullCount >= this.rugpullConfig.maxSpawns) return;
        
        const delay = Phaser.Math.Between(
            this.rugpullConfig.frequency.min,
            this.rugpullConfig.frequency.max
        );
        
        this.scene.time.delayedCall(delay, () => {
            this.spawnRugpull();
            this.scheduleNextRugpull();
        });
    }

    // Add new rugpull spawn method
    spawnRugpull() {
        const sides = ['left', 'right'];
        const side = Phaser.Utils.Array.GetRandom(sides);
        const y = Phaser.Math.Between(100, this.scene.game.config.height - 100);
        const x = side === 'left' ? -50 : this.scene.game.config.width + 50;
        
        const rugpull = this.powerupGroup.create(x, y, 'rugpull');
        rugpull.setVelocityX(side === 'left' ? 200 : -200);
        rugpull.setAngularVelocity(180); // Spin animation
        
        rugpull.setDepth(this.DEPTHS.POWERUPS);  // Make sure it's on the correct depth layer
        rugpull.setScale(0.5);  // Adjust scale if needed
        rugpull.setAlpha(1);    // Ensure full visibility
        
        this.rugpullCount++;
    }

    // Add rugpull collection handler
    collectRugpull(player, rugpull) {
        if (!rugpull.active) return;
        rugpull.destroy();
        
        // Play rugpull sound
        this.rugpullSound.play();
        
        // Calculate loss (30-70% of current score)
        const lossPercentage = Phaser.Math.Between(30, 70) / 100;
        const loss = Math.floor(this.scene.score * lossPercentage);
        this.scene.score = Math.max(0, this.scene.score - loss);
        this.scene.scoreText.setText('Market Cap: $' + this.scene.score);
        
        // Cat wobble animation
        this.scene.tweens.add({
            targets: player,
            angle: { from: -10, to: 10 },
            duration: 100,
            repeat: 3,
            yoyo: true,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                player.angle = 0;
            }
        });
        
        // Create negative fountain effect
        this.createRugpullEffect(rugpull.x, rugpull.y, loss);
    }

    // Add rugpull effect
    createRugpullEffect(x, y, loss) {
        const emitter = this.scene.particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 100, max: 200 },
            angle: { min: 60, max: 120 },
            scale: { start: 0.4, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            quantity: 3,
            frequency: 50,
            tint: 0xFF0000, // Red particles
            gravityY: 300
        });
        
        // Create loss popup text
        const lossText = this.scene.add.text(x, y, '-$' + loss, {
            fontSize: '24px',
            fill: '#FF0000',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Animate loss text
        this.scene.tweens.add({
            targets: lossText,
            y: y - 100,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                lossText.destroy();
                emitter.stop();
            }
        });
        
        // Stop emitter after 1 second
        this.scene.time.delayedCall(1000, () => {
            emitter.stop();
        });
    }

    stopSpawning() {
        // Clear all power-up spawn timers
        if (this.moonGlassesTimer) {
            this.moonGlassesTimer.remove();
            this.moonGlassesTimer = null;
        }
        if (this.crystalBallTimer) {
            this.crystalBallTimer.remove();
            this.crystalBallTimer = null;
        }
        if (this.pepeTimer) {
            this.pepeTimer.remove();
            this.pepeTimer = null;
        }
        if (this.whaleTimer) {
            this.whaleTimer.remove();
            this.whaleTimer = null;
        }

        // Clear any existing power-ups on screen
        this.powerupGroup.clear(true, true);

        console.log('All power-up spawning stopped');
    }
}

// Add this line at the end of powerups.js
window.PowerUpManager = PowerUpManager;
