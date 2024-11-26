// Initialize Telegram Web App (with fallback)
const tg = window.Telegram?.WebApp || {
    viewportHeight: 744,
    ready: () => {},
    expand: () => {}
};

// Game constants and configurations
const GAME_CONFIG = {
    type: Phaser.AUTO,
    width: 390,
    height: tg.viewportHeight || 744,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [StartScene, MainGame], // Use class references instead of strings
    dom: {
        createContainer: true
    }
};

const DEPTHS = {
    BACKGROUND: 1,
    STARS: 2,
    MOON: 3,
    CANDLES: 4,
    POWERUPS: 5,
    METEORS: 6,
    PLAYER: 7,
    LASER: 8,
    DOLLARS: 9,
    PARTICLES: 10,
    UI: 1000
};

const GAME_SETTINGS = {
    DURATION: 180,            // 3 minutes in seconds
    SPAWN_STOP_TIME: 7,      // Changed from 20 to 7 seconds
    RED_CANDLE_DELAY: 10,     // Seconds before red candles appear
    METEOR_START_TIME: 100,   // When meteors start appearing
    MOON_START_TIME: 20,      // When moon appears
    BACKGROUND_SPEED: 1,
    WHALE_START_TIME: 120,    // Appears at 2 minutes (changed from later timing)
    FINAL_EPIC_START: 7,     // New setting for when epic ending begins
    SPIN_START_TIME: 6,      // When cat starts spinning
    FINAL_IMPACT_TIME: 1,    // When cat hits the moon
};

// Assets Constants
const ASSETS = {
    images: {
        logo: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729893119/manifest_tan2_sywd7p.png',
        silhouette: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1724441964/Motiv_klvaxf.png',
        background: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1730155499/STARS2.png',
        pepe: 'https://res.cloudinary.com/dakoxedxt/image/upload/c_scale,h_212,w_212/v1728736483/pepe_xyab37.png',
        whale: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729510453/manifest_gfx/whale_cr2exw.png',
        rugpull: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729510455/manifest_gfx/rugpull_hesbgp.png',
        player: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729030217/plane_xxohue.png',
        planeglasses: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729030217/planeglasses_vl0umv.png',
        greenShort: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729510459/manifest_gfx/green_short_mbabga.png',
        greenMid: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729510456/manifest_gfx/green_mid_vgqebi.png',
        greenTall: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729510459/manifest_gfx/green_tall_tzkmng.png',
        redShort: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729510463/manifest_gfx/red_short_ewfbrz.png',
        redMid: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729510461/manifest_gfx/red_mid_hkc2ug.png',
        redTall: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729510464/manifest_gfx/red_tall_cmnd9r.png',
        particle: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729694664/particle_iaw5tj.png',
        meteor: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729510448/manifest_gfx/meteor_hwqcpd.png',
        moonglasses: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729510451/manifest_gfx/moonglasses_brxcmp.png',
        dollar: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729510442/manifest_gfx/dollar_saopsw.png',
        moon: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729510451/manifest_gfx/moon_q5nahl.png',
        crystalball: 'https://res.cloudinary.com/dakoxedxt/image/upload/c_scale,w_256/v1728930035/crystalballe.png',
        dollar_icon: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729510442/manifest_gfx/dollar_saopsw.png',
        planepepe: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1729030217/planepepe_rwearr.png',
        x1: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1731489260/X_cdqipt.png',
        x2: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1731489260/X2_mxzksl.png',
        x3: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1731489260/X3_y7z7lt.png',
        x4: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1731489259/X4_efc8xu.png',
        x5: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1731489259/X5_e9ea61.png',
        x6: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1731489259/X6_afpnfx.png',
        x7: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1731489259/X7_i48473.png',
        x8: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1731489259/X8_smgi61.png',
        x9: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1731489259/X9_gjpyr2.png',
        x10: 'https://res.cloudinary.com/dakoxedxt/image/upload/v1731489259/X10_wfrabs.png'
        // Add any other images here
    },
    audio: {
        tally: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1729946809/ALT_PLOCK_l28ue0.wav',
        pepe_sound: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1728907674/pepe_fi58nm.mp3',
        whale_sound: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1728913134/whale_flfzyb.mp3',
        rugpull_sound: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1728907678/rugged.mp3',
        laser_explosion: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1729973984/SHOOTBIG_fak81w.wav',
        moonglasses_sound: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1728917143/sunglasses_aw3asa.mp3',
        dollar_sound: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1728913133/dollar_rocxix.mp3',
        green1: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1730833360/green1_s5xlbm.mp3',
        green2: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1730833359/green2_kwmwgo.mp3',
        green3: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1730833360/green3_n0q38n.mp3',
        green4: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1730833361/green5_jad7gt.mp3',
        green5: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1730833361/green6_xnskdb.mp3',
        green6: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1730833362/green7_tobp7t.mp3',
        green7: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1730833362/green8_xir7tf.mp3',
        green8: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1730833362/green9_qorcv6.mp3',
        red1: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1730833365/red1_aory7m.mp3',
        red2: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1730833365/red2_ga95ij.mp3',
        red3: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1730833365/red3_u3ezym.mp3',
        red4: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1730833366/red4_c0gqbm.mp3',
        red5: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1730833367/red5_wvqioz.mp3',
        red6: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1730833367/red6_oo9ijf.mp3',
        red7: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1730833368/red7_k9srq3.mp3',
        red8: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1730833368/red8_s8hjtk.mp3',
        backgroundMusic: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1730833367/neon_dreams_1_xi1ydj.mp3',
        meteorSound: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1728913134/meteor_f0hear.mp3',
        crystalBall_sound: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1728913134/crystalbewith_uvfp0b.mp3',
        final_dollar_sound: 'https://res.cloudinary.com/dakoxedxt/video/upload/v1728906769/U_MADE_ITOUTCAST_SFX_bu5jav.wav'
        // Add any other audio here
    }
};

// Add after your constants (GAME_CONFIG, DEPTHS, ASSETS) but before scene definitions
class GameChart {
    constructor(scene) {
        this.scene = scene;
        this.container = scene.add.container(0, 0);
        this.container.setDepth(DEPTHS.BACKGROUND + 0.5);
        
        // Increase virtual width to show more of the graph (increased from 1x to 3x)
        this.virtualWidth = scene.game.config.width * 3;
        this.height = scene.game.config.height * 0.8;
        this.viewportWidth = scene.game.config.width;
        
        // Reduce scroll speed to make the graph move slower
        this.scrollSpeed = 0.8;
        
        this.points = [];
        this.maxPoints = 50;  // Reduce number of visible points for smoother appearance
        this.minValue = 0;
        this.maxValue = 100;
        
        // Add smoothing factor for more dynamic movement
        this.smoothingFactor = 0.3;  // Add smoothing factor for curves
        this.elasticityFactor = 0.35; // Slightly increased for more responsive movement
        
        this.velocities = [];
        
        this.lineGraphics = scene.add.graphics();
        this.glowGraphics = scene.add.graphics();
        this.container.add([this.glowGraphics, this.lineGraphics]);
        
        this.container.setPosition(0, scene.game.config.height * 0.15); // Start at 15% from top
        
        scene.events.on('update', this.update, this);
        scene.events.once('shutdown', this.destroy, this);
        
        this.lastValue = null;
        this.minValueChange = 0.0001;
        
        // Add new properties for better scaling
        this.scaleAdjustmentSpeed = 0.1;  // How quickly the scale adjusts
        this.minScaleRange = 5000;        // Increased minimum range for better visibility
        this.targetMaxValue = this.maxValue;
        this.targetMinValue = this.minValue;
        
        // Add new property to store all historical points
        this.historicalPoints = [];
        this.maxHistoricalPoints = 100; // Adjust this for smoother/longer chart
        
        // Add property to store significant events (optional)
        this.events = [];
        
        // Adjust update interval
        this.updateInterval = 10000; // Reduced to 10 seconds for more frequent updates
        this.lastUpdateTime = Date.now();
        this.pendingValue = null;
        
        // Reduce smoothing window
        this.smoothingWindow = 2; // Reduced from 3 for less averaging
    }

    getYPosition(value) {
        const normalizedValue = (value - this.minValue) / (this.maxValue - this.minValue);
        return this.height - (normalizedValue * this.height);
    }

    addDataPoint(value) {
        // Add debug logging
        console.log('Adding data point:', value);

        // Ensure value changes are meaningful
        const minChange = this.minValueChange || 0.0001;
        if (this.lastValue !== null && Math.abs(value - this.lastValue) < minChange) {
            return; // Skip if change is too small
        }
        this.lastValue = value;

        // Add some organic movement
        const randomVariation = 1 + (Math.random() * 0.1 - 0.05); // ±5% random variation
        value *= randomVariation;

        // Add intermediate points for smoother transitions
        if (this.points.length > 0) {
            const lastPoint = this.points[this.points.length - 1];
            const steps = 3; // Number of intermediate points
            for (let i = 1; i <= steps; i++) {
                const progress = i / (steps + 1);
                const intermediateValue = lastPoint.currentY + (value - lastPoint.currentY) * progress;
                // Add slight random variation to intermediate points
                const smoothRandomFactor = 1 + (Math.random() * 0.02 - 0.01); // ±1% variation
                this.points.push({
                    x: this.virtualWidth - ((steps - i + 1) * (this.scrollSpeed * 5)),
                    targetY: intermediateValue * smoothRandomFactor,
                    currentY: intermediateValue * smoothRandomFactor
                });
                this.velocities.push(0);
            }
        }

        // Add the actual point
        const point = {
            x: this.virtualWidth,
            targetY: value,
            currentY: this.points.length > 0 ? this.points[this.points.length - 1].currentY : value
        };
        
        this.points.push(point);
        this.velocities.push(0);
        
        // Trim points if needed
        while (this.points.length > this.maxPoints) {
            this.points.shift();
            this.velocities.shift();
        }

        // Update scale dynamically
        this.targetMaxValue = Math.max(value * 1.1, this.targetMaxValue);
        this.targetMinValue = Math.min(value * 0.9, this.targetMinValue);
    }

    drawLine() {
        this.lineGraphics.clear();
        this.glowGraphics.clear();
        
        if (this.points.length < 2) return;
        
        // Single, subtle glow layer
        this.glowGraphics.lineStyle(8, 0x4169E1, 0.05);  // Very faint blue glow
        this.drawCurve(this.glowGraphics);
        
        // Main line - thin and semi-transparent
        this.lineGraphics.lineStyle(1, 0x00FFFF, 0.2);   // Cyan with 20% opacity
        this.drawCurve(this.lineGraphics);
    }

    drawCurve(graphics) {
        if (this.points.length < 2) return;
        
        // Start the path
        graphics.beginPath();
        
        // Move to first point
        const firstPoint = this.points[0];
        graphics.moveTo(firstPoint.x, this.getYPosition(firstPoint.currentY));
        
        // Draw lines to each subsequent point
        for (let i = 1; i < this.points.length; i++) {
            const current = this.points[i];
            graphics.lineTo(
                current.x,
                this.getYPosition(current.currentY)
            );
        }
        
        graphics.strokePath();
    }

    update() {
        // Smooth scale adjustment
        this.maxValue += (this.targetMaxValue - this.maxValue) * this.scaleAdjustmentSpeed;
        this.minValue += (this.targetMinValue - this.minValue) * this.scaleAdjustmentSpeed;
        
        // Scroll points
        this.points.forEach(point => {
            point.x -= this.scrollSpeed;
        });
        
        // Update point positions with enhanced elastic movement
        this.points.forEach((point, index) => {
            const targetY = point.targetY;
            const dy = targetY - point.currentY;
            
            this.velocities[index] += dy * this.elasticityFactor;
            this.velocities[index] *= (1 - this.smoothingFactor);
            point.currentY += this.velocities[index];
        });
        
        this.drawLine();
    }

    destroy() {
        this.scene.events.off('update', this.update, this);
        this.container.destroy();
    }

    // Update the sharing chart generation
    generateSharingChart(width = 800, height = 400) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        if (this.historicalPoints.length < 2) return canvas;

        // Calculate min/max for proper scaling
        const values = this.historicalPoints.map(p => p.value);
        const minValue = Math.min(...values) * 0.9;
        const maxValue = Math.max(...values) * 1.1;
        const valueRange = maxValue - minValue;

        // Draw the line with multiple passes for glow effect
        const drawLine = (lineWidth, color, alpha) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.globalAlpha = alpha;

            this.historicalPoints.forEach((point, index) => {
                const x = (index / (this.historicalPoints.length - 1)) * width;
                const normalizedValue = (point.value - minValue) / valueRange;
                const y = height - (normalizedValue * height);

                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
        };

        // Full opacity for share image
        drawLine(20, 'rgba(0, 255, 255, 0.1)');
        drawLine(12, 'rgba(0, 255, 255, 0.2)');
        drawLine(6, 'rgba(0, 255, 255, 0.3)');
        drawLine(3, 'rgba(0, 255, 255, 1.0)');

        return canvas;
    }
}

class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
        this.planes = [];
        this.planeTypes = ['player', 'planeglasses', 'planepepe'];
        this.DEPTHS = {
            BACKGROUND: 1,
            STARS: 2,
            PLANES: 5,
            PARTICLES: 6,
            UI: 1000
        };
    }

    preload() {
        try {
            // Create a loading bar
            let loadingBar = this.add.graphics({
                fillStyle: {
                    color: 0xffffff
                }
            });

            // Add error handling for load events
            this.load.on('loaderror', (file) => {
                console.error('Error loading file:', file.src);
            });

            this.load.on('progress', (percent) => {
                loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
            });

            this.load.on('complete', () => {
                loadingBar.destroy();
            });

            // Load assets with error handling
            Object.entries(ASSETS.images).forEach(([key, value]) => {
                try {
                    this.load.image(key, value);
                } catch (error) {
                    console.error(`Error loading image ${key}:`, error);
                }
            });

            Object.entries(ASSETS.audio).forEach(([key, value]) => {
                try {
                    this.load.audio(key, value);
                } catch (error) {
                    console.error(`Error loading audio ${key}:`, error);
                }
            });

        } catch (error) {
            console.error('Error in preload:', error);
        }

        // Add any other preload code here (e.g., scanlines)
        // Create scanlines texture programmatically
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0xffffff);
        for (let y = 0; y < 100; y += 2) {
            graphics.moveTo(0, y);
            graphics.lineTo(100, y);
        }
        graphics.generateTexture('scanlines', 100, 100);
        graphics.destroy();

        this.backgroundMusic = null;

    }
    

    create() {
        // Stop any existing background music
        if (this.game.backgroundMusic) {
            this.game.backgroundMusic.stop();
        }

        // Create new background music instance
        this.game.backgroundMusic = this.sound.add('backgroundMusic', {
            loop: true,
            volume: 0.5
        });
        this.game.backgroundMusic.play();

        // Add scrolling background (single instance)
        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background')
            .setOrigin(0, 0)
            .setAlpha(0.3)
            .setDepth(this.DEPTHS.BACKGROUND);

        // Add black overlay
        this.add.rectangle(0, 0, config.width, config.height, 0x000000, 0.5)
            .setOrigin(0)
            .setDepth(this.DEPTHS.BACKGROUND + 1);

        // Create star field with adjusted values
        this.createStarField();

        // Create multiple shadow layers with different effects
        const shadowLayers = 5; // Increased number of layers
        const baseDelay = 100; // Delay between shadow movements
        const shadowSprites = [];

        // Create shadow layers first (they should be behind the main logo)
        for (let i = 0; i < shadowLayers; i++) {
            const shadowSprite = this.add.image(
                this.cameras.main.width / 2,
                -100,
                'logo'
            )
            .setOrigin(0.5)
            .setScale(0.15 + (i * 0.008)) // Slightly increasing scale for each layer
            .setDepth(this.DEPTHS.UI - 1 - i) // Each layer gets progressively further back
            .setTint(0xFF69B4)
            .setAlpha(0.15 - (i * 0.02)); // Decreasing alpha for each layer
            
            shadowSprites.push(shadowSprite);
            
            // Add independent floating animation to each shadow
            this.tweens.add({
                targets: shadowSprite,
                x: '+=8',
                y: '+=8',
                duration: 2000 + (i * 200), // Slightly different duration for each layer
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: i * baseDelay // Stagger the movement
            });
            
            // Add subtle rotation
            this.tweens.add({
                targets: shadowSprite,
                angle: 2,
                duration: 3000 + (i * 300),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: i * baseDelay
            });
            
            // Add scale pulsing
            this.tweens.add({
                targets: shadowSprite,
                scaleX: '+=0.01',
                scaleY: '+=0.01',
                duration: 1500 + (i * 150),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: i * baseDelay / 2
            });
        }

        // Create the main logo on top
        const logo = this.add.image(
            this.cameras.main.width / 2,
            -100,
            'logo'
        )
        .setOrigin(0.5)
        .setScale(0.15)
        .setDepth(this.DEPTHS.UI)
        .setTint(0xFF69B4);

        // Add a subtle glow effect that pulses
        const glowGraphics = this.add.graphics()
            .setDepth(this.DEPTHS.UI - shadowLayers - 1);

        this.tweens.add({
            targets: logo,
            y: this.cameras.main.height * 0.15,
            scale: 0.15,
            duration: 1500,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                // Main logo floating animation
                this.tweens.add({
                    targets: logo,
                    y: '+=10',
                    duration: 2000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                
                // Add subtle rotation to main logo
                this.tweens.add({
                    targets: logo,
                    angle: 1,
                    duration: 2500,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });

        // Add glow pulse effect
        this.time.addEvent({
            delay: 16,
            callback: () => {
                glowGraphics.clear();
                
                // Pulse the glow size and alpha
                const time = this.time.now;
                const glowSize = 20 + Math.sin(time / 500) * 5;
                const glowAlpha = 0.3 + Math.sin(time / 500) * 0.1;
                
                glowGraphics.lineStyle(glowSize, 0xFF69B4, glowAlpha);
                glowGraphics.strokeCircle(
                    logo.x,
                    logo.y,
                    logo.displayWidth * 0.6
                );
            },
            loop: true
        });

        // Add the initial animation for all elements
        this.tweens.add({
            targets: [...shadowSprites, logo],
            y: this.cameras.main.height * 0.15,
            duration: 1500,
            ease: 'Bounce.easeOut',
            delay: (target, i) => i * baseDelay
        });

        // Add UI elements with proper depth
        const silhouette = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height * 0.8,
            'silhouette'
        )
        .setScale(0.8)
        .setTint(0x808080)
        .setAlpha(0.4)
        .setDepth(this.DEPTHS.UI);

        // Add floating animation
        this.tweens.add({
            targets: silhouette,
            y: '+=20',
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add scale pulsing
        this.tweens.add({
            targets: silhouette,
            scaleX: '+=0.08',
            scaleY: '+=0.08',
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Show high scores
        this.showHighScores();

        // Add start game text
        const text = this.add.text(
            config.width / 2,
            config.height * 0.9,
            'TOUCH ME',
            {
                fontFamily: 'VT323',
                fontSize: '64px',
                fill: '#00FF00',
                stroke: '#000000',
                strokeThickness: 2,
                align: 'center'
            }
        ).setOrigin(0.5)
         .setDepth(this.DEPTHS.UI)
         .setInteractive();

        text.on('pointerdown', () => {
            // Simple scene transition
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => {
                this.scene.start('MainGame');
            });
        });

        // Initialize plane spawning
        this.spawnPlanes();
        
        // Start plane spawning timer
        this.time.addEvent({
            delay: 3000,
            callback: this.spawnPlanes,
            callbackScope: this,
            loop: true
        });

        // Add this after the logo creation code in create()

        // Create the cat silhouette with cool effects
        
    }

    createStarField() {
        this.starsParticles = this.add.particles('particle');
        
        // Common emitter config with increased lifespan and adjusted y range
        const emitterConfig = {
            x: { min: 0, max: this.game.config.width },
            y: { min: -50, max: this.game.config.height },
            lifespan: 4000,
            frequency: 50,
            blendMode: 'ADD',
            gravityY: 0,
            emitting: true
        };

        // Background stars (increased visibility)
        this.starsBack = this.starsParticles.createEmitter({
            ...emitterConfig,
            scale: { start: 0.08, end: 0 },     // Increased from 0.05
            speedY: { min: 400, max: 800 },
            alpha: { start: 0.7, end: 0 },      // Increased from 0.5
            tint: 0xFFFFFF,
            quantity: 2,
            frequency: 20
        });

        // Middle layer stars
        this.starsMid = this.starsParticles.createEmitter({
            ...emitterConfig,
            scale: { start: 0.06, end: 0 },     // Increased from 0.04
            speedY: { min: 300, max: 600 },
            alpha: { start: 0.8, end: 0 },      // Increased from 0.6
            tint: 0x00FFFF,
            quantity: 1,
            frequency: 40
        });

        // Foreground stars (largest, slowest)
        this.starsFront = this.starsParticles.createEmitter({
            ...emitterConfig,
            scale: { start: 0.09, end: 0 },     // Increased from 0.06
            speedY: { min: 200, max: 400 },
            alpha: { start: 0.9, end: 0 },      // Increased from 0.7
            tint: 0xFFFF00,
            quantity: 1,
            frequency: 60
        });

        // Initial population
        const initialStars = 50;  // Increased from 30
        for (let i = 0; i < initialStars; i++) {
            this.starsBack.emitParticle();
            this.starsMid.emitParticle();
            this.starsFront.emitParticle();
        }
    }

    update() {
        // Scroll background
        if (this.background) {
            this.background.tilePositionY += 0.5;
        }

        // Update planes with safety checks
        if (this.planes) {
            this.planes.forEach(plane => {
                if (!plane || !plane.active) return; // Skip if plane is destroyed

                const velocity = plane.getData('velocity');
                if (!velocity) return; // Skip if no velocity data

                plane.x += velocity.x * (1/60);
                plane.y += velocity.y * (1/60);

                // Update trail emitter if it exists
                if (plane.trailEmitter && plane.active) {
                    plane.trailEmitter.setPosition(plane.x, plane.y);
                }
            });
        }
    }

    // Helper methods
    isInView(plane) {
        const padding = 100;
        return plane.x > -padding && 
               plane.x < config.width + padding && 
               plane.y > -padding && 
               plane.y < config.height + padding;
    }

    getRandomSpawnPoint() {
        const side = Phaser.Math.Between(0, 3); // 0: top, 1: right, 2: bottom, 3: left
        const padding = 50;
        
        switch(side) {
            case 0: return { x: Phaser.Math.Between(0, config.width), y: -padding };
            case 1: return { x: config.width + padding, y: Phaser.Math.Between(0, config.height) };
            case 2: return { x: Phaser.Math.Between(0, config.width), y: config.height + padding };
            case 3: return { x: -padding, y: Phaser.Math.Between(0, config.height) };
        }
    }

    getVelocityFromSpawnPoint(point) {
        const centerX = config.width / 2;
        const centerY = config.height / 2;
        const angle = Math.atan2(centerY - point.y, centerX - point.x);
        const speed = 200;
        return {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
    }

    getTrailColor(planeType) {
        switch(planeType) {
            case 'planepepe': return 0x00FF00;    // Green
            case 'planeglasses': return 0xFFD700;  // Gold
            default: return 0xFFFFFF;              // White
        }
    }

    showHighScores() {
        // Title for high scores
        this.add.text(
            config.width / 2,
            config.height * 0.3,
            'HIGH SCORES',
            {
                fontFamily: 'VT323',
                fontSize: '32px',
                fill: '#00FF00',
                stroke: '#000000',
                strokeThickness: 2,
                align: 'center'
            }
        ).setOrigin(0.5).setDepth(this.DEPTHS.UI);

        // Fetch and display scores from Firebase
        if (window.database) {
            window.database.ref('scores')
                .orderByChild('score')
                .limitToLast(15)  // Get top 15 scores
                .once('value')
                .then((snapshot) => {
                    const scores = [];
                    snapshot.forEach((childSnapshot) => {
                        scores.push({
                            name: childSnapshot.val().name,
                            score: childSnapshot.val().score
                        });
                    });

                    // Sort scores in descending order
                    scores.sort((a, b) => b.score - a.score);

                    // Calculate text size and spacing based on screen height
                    const startY = config.height * 0.35;
                    const spacing = Math.min(25, (config.height * 0.5) / 15); // Adjust spacing to fit
                    const fontSize = Math.min(20, spacing * 0.8); // Adjust font size to fit

                    // Display scores
                    scores.forEach((score, index) => {
                        const yPos = startY + (index * spacing);
                        this.add.text(
                            config.width / 2,
                            yPos,
                            `${index + 1}. ${score.name}: $${score.score.toLocaleString()}`,
                            {
                                fontFamily: 'VT323',
                                fontSize: `${fontSize}px`,
                                fill: index < 3 ? '#FFD700' : '#FFFFFF', // Gold for top 3
                                stroke: '#000000',
                                strokeThickness: 2,
                                align: 'center'
                            }
                        ).setOrigin(0.5).setDepth(this.DEPTHS.UI);
                    });
                })
                .catch((error) => {
                    console.error('Error fetching high scores:', error);
                    this.showErrorMessage();
                });
        } else {
            this.showErrorMessage();
        }
    }

    showErrorMessage() {
        this.add.text(
            config.width / 2,
            config.height * 0.4,
            'Unable to load scores',
            {
                fontFamily: 'VT323',
                fontSize: '24px',
                fill: '#FF0000',
                stroke: '#000000',
                strokeThickness: 2,
                align: 'center'
            }
        ).setOrigin(0.5).setDepth(this.DEPTHS.UI);
    }

    spawnPlanes() {
        // Clean up off-screen planes
        this.planes = this.planes.filter(plane => {
            if (!this.isInView(plane)) {
                if (plane.trailEmitter) {
                    plane.particleManager.destroy();  // Destroy the particle manager
                }
                plane.destroy();
                return false;
            }
            return true;
        });

        // Only spawn new planes if we have less than 3
        if (this.planes.length >= 3) return;

        // Spawn 1-2 new planes
        const numPlanesToSpawn = Phaser.Math.Between(1, 2);
        
        for (let i = 0; i < numPlanesToSpawn; i++) {
            const spawnPoint = this.getRandomSpawnPoint();
            const planeType = Phaser.Utils.Array.GetRandom(this.planeTypes);
            
            const plane = this.add.sprite(spawnPoint.x, spawnPoint.y, planeType)
                .setScale(0.1)
                .setDepth(this.DEPTHS.PLANES);

            // Set velocity and rotation
            const velocity = this.getVelocityFromSpawnPoint(spawnPoint);
            plane.setData('velocity', velocity);
            plane.rotation = Math.atan2(velocity.y, velocity.x);

            // Create trail emitter
            const trailColor = this.getTrailColor(planeType);
            const particleManager = this.add.particles('particle')
                .setDepth(this.DEPTHS.PARTICLES - 1);

            plane.trailEmitter = particleManager.createEmitter({
                follow: plane,
                scale: { start: 0.2, end: 0 },
                alpha: { start: 0.5, end: 0 },
                speed: 0,
                lifespan: 1000,
                quantity: 2,
                frequency: 50,
                blendMode: 'ADD',
                tint: trailColor
            });

            // Store both the manager and emitter for cleanup
            plane.particleManager = particleManager;

            this.planes.push(plane);
        }
    }

    // Add scene cleanup
    shutdown() {
        // Clean up planes
        if (this.planes) {
            this.planes.forEach(plane => {
                if (plane.particleManager) {
                    plane.particleManager.destroy();
                }
                plane.destroy();
            });
            this.planes = [];
        }

        // Clean up particle systems
        if (this.starsParticles) {
            this.starsParticles.destroy();
        }
    }
}

class MainGame extends Phaser.Scene {
    constructor() {
        super({ key: 'MainGame' });
        this.scoreHistory = []; // Array of {timestamp, score} objects
        // Add speed properties
        this.baseBackgroundSpeed = 6;    // Increased from 0.5
    this.maxBackgroundSpeed = 7;     // Increased from 2
    this.currentBackgroundSpeed = this.baseBackgroundSpeed;
        this.speedIncreaseInterval = 15000; // Increase speed every 15 seconds
        
        // Define the base text style
        this.baseTextStyle = {
            fontFamily: 'VT323',
            fontSize: '24px',  // Made it bigger since VT323 is smaller than Press Start 2P
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        };

        // Update tallyConfig to use baseTextStyle
        this.tallyConfig = {
            x: 0,
            y: 0,
            width: 0,
            lineSpacing: 27,
            fontSize: 36,
            fontFamily: 'VT323',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'left',
            depth: 1000
        };

        // Add DEPTHS constants to the game scene
        this.DEPTHS = {
            BACKGROUND: 1,
            STARS: 2,
            MOON: 3,
            CANDLES: 4,
            POWERUPS: 5,
            METEORS: 6,
            PLAYER: 7,
            LASER: 8,
            DOLLARS: 9,
            PARTICLES: 10,
            UI: 1000
        };

        // Constants
        this.SECONDS_IN_MINUTE = 60;
        this.UI_DEPTH = 1000;

        // Game configuration
        this.gameConfig = {
            duration: 180, // 3 minutes in seconds
            phases: {
                intro: { start: 180, end: 165 }, // First 15 seconds
                early: { start: 165, end: 120 }, // 45 seconds
                mid: { start: 120, end: 60 },    // 60 seconds
                late: { start: 60, end: 20 },    // 40 seconds
                final: { start: 20, end: 0 }     // Last 20 seconds
            },
            spawnRates: {
                early: {
                    greenCandle: 0.7,
                    redCandle: 0.3,
                    powerUps: 0.1
                },
                mid: {
                    greenCandle: 0.5,
                    redCandle: 0.5,
                    powerUps: 0.15
                },
                late: {
                    greenCandle: 0.3,
                    redCandle: 0.7,
                    powerUps: 0.2
                }
            },
            redCandleDelay: 10,
            initialSpawnDelay: 1000,
            minSpawnDelay: 300,
            spawnRateIncreaseStart: 0.2,
            spawnRateDecreaseFactor: 0.9,
            candleSpeeds: {
                short: 150,
                mid: 130,
                tall: 110
            },
            candleScales: {
                short: 0.4,
                mid: 0.5,
                tall: 0.6
            },
            speedIncreaseFactor: 200,
            redSpeedMultiplier: 1.5,
            redSpeedIncreaseFactor: 2,
            redProbabilityFactor: 0.7,
            spawnStopTime: 10,
            moonGlassesStopTime: 20,
            asteroidExitTime: 15
        };

        // Moon configuration (without game-dependent values)
        this.moonConfig = {
            startY: -1000,
            entryDuration: 15000,
            finalYPercentage: 0.5,
            startTime: 20
        };

        // Game state
        this.gameTime = this.gameConfig.duration;
        this.difficultyFactor = 0;
        this.score = 0;
        this.scoreMultiplier = 1;
        this.consecutiveGreenCandles = 0;
        this.redCandlesEnabled = false;

        // Game objects
        this.player = null;
        this.candles = null;
        this.meteors = null;
        this.background = null;
        this.targetPosition = new Phaser.Math.Vector2(0, 0);
        this.isPointerInGame = true;

        // UI elements
        this.scoreText = null;
        this.timerText = null;
        this.multiplierText = null;

        // Timers and spawners
        this.spawnTimer = null;
        this.meteorSpawnTimer = null;
        this.meteorChunkTimer = null;
        this.moonGlassesTimer = null;

        // Audio
        this.backgroundMusic = null;
        this.greenSounds = [];
        this.redSounds = [];

        // Particles
        this.particles = null;

        // Motivational text
        this.motivationalTexts = [
            "Abundance flows\nto you!",
            "Success is your\nbirthright!",
            "You're attracting\nwealth!",
            "Luxury embraces\nyou!",
            "Prosperity is\nyour reality!",
            "You deserve the\nbest in life!",
            "Wealth finds its\nway to you!",
            "You're a magnet\nfor success!",
            "Your dreams are\nmanifesting now!",
            "You're living your\nbest life!",
            "HODL to the moon!",
            "Diamond hands\nwin always!",
            "Pump it up!",
            "To the moon\nand beyond!",
            "Lambo soon!",
            "We're all gonna\nmake it!",
            "Buy the dip!",
            "FOMO is real!",
            "Wen moon?",
            "This is the way!"
        ];
        this.textColors = ['#FFD700', '#FF4500', '#32CD32'];
        this.currentText = null;

        // Stars
        this.starsParticles = null;
        this.starsBack = null;
        this.starsMid = null;
        this.starsFront = null;

        // Input
        this.cursors = null;
        this.moon = null;

        // Add zoom configuration
        this.zoomConfig = {
            startTime: 60,        // Seconds before the end when zoom starts
            duration: 60,         // Duration of zoom in seconds
            startScale: 1,        // Keep the current scale as starting point
            endScale: 0.3        // Zoom out to half size (adjust this value as needed)
        };
        this.isZooming = false;
        this.zoomProgress = 0;

        // Add tracking for candles and dollar signs
        this.totalGreenCandles = 0;
        this.collectedGreenCandles = 0;
        this.totalRedCandles = 0;
        this.avoidedRedCandles = 0;
        this.totalDollarSigns = 0;
        this.collectedDollarSigns = 0;
        this.allTimeHigh = 0;

        // Add a custom font
        this.fontStyle = { 
            fontFamily: 'VT323', // Remove the quotes around Press Start 2P
            fontSize: '16px', 
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        };

        this.hasMoonglassesBonus = false;
        this.dollarsCollected = 0;
        this.isBonusActive = false;
        this.bonusDuration = 7000; // 7 seconds in milliseconds
        this.originalPlayerSprite = 'player';  // Add this line

        // Initialize tallyConfig with default values
        this.tallyConfig = {
            x: 0,
            y: 0,
            width: 0,
            lineSpacing: 20,
            fontSize: 16,
            fontFamily: 'VT323', // Remove the extra quotes
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'left',
            depth: 1000
        };

        // Add these properties to the constructor
        this.dollarCollectCount = 0;
        this.isSuperBonusActive = false;
        this.bonusDuration = 10000; // 10 seconds
        this.laserBeam = null;

        // Power-up manager
        this.powerUps = null;

        // Initialize dollarSigns array
        this.dollarSigns = [];

        // Add this property to track gravitational pull
        this.gravitationalPull = {
            active: false,
            radius: 150,  // Radius of gravitational effect
            strength: 200 // Strength of the pull
        };

        // In your MainGame class constructor, add:
        this.scoreHistory = [];
        this.lastLoggedTime = 0;
        this.scoreLoggingInterval = 250; // Log every 250ms
        
        // Add a property to track the timer event
        this.gameTimer = null;

        // Add this property to track the last update time
        this.lastUpdateTime = 0;
    }

    init() {
        this.gameTime = this.gameConfig.duration;
        this.difficultyFactor = 0;
        this.score = 0;
        this.scoreMultiplier = 1;
        this.consecutiveGreenCandles = 0;
        this.redCandlesEnabled = false;
        this.isZooming = false;
        this.zoomProgress = 0;
        this.totalGreenCandles = 0;
        this.collectedGreenCandles = 0;
        this.totalRedCandles = 0;
        this.avoidedRedCandles = 0;
        this.totalDollarSigns = 0;
        this.collectedDollarSigns = 0;
        this.allTimeHigh = 0;
        this.hasMoonglassesBonus = false;
        this.dollarsCollected = 0;
        this.isBonusActive = false;
        this.dollarCollectCount = 0;
        this.isSuperBonusActive = false;
        this.totalDollarSigns = 0;
        this.collectedDollarSigns = 0;
        this.dollarsCollected = 0;
        
        // Reset background speed
        this.currentBackgroundSpeed = this.baseBackgroundSpeed;
    }

    preload() {
        try {
            // Create a loading bar
            let loadingBar = this.add.graphics({
                fillStyle: {
                    color: 0xffffff
                }
            });

            // Add error handling for load events
            this.load.on('loaderror', (file) => {
                console.error('Error loading file:', file.src);
            });

            this.load.on('progress', (percent) => {
                loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
            });

            this.load.on('complete', () => {
                loadingBar.destroy();
            });

            // Load assets with error handling
            Object.entries(ASSETS.images).forEach(([key, value]) => {
                try {
                    this.load.image(key, value);
                } catch (error) {
                    console.error(`Error loading image ${key}:`, error);
                }
            });

            Object.entries(ASSETS.audio).forEach(([key, value]) => {
                try {
                    this.load.audio(key, value);
                } catch (error) {
                    console.error(`Error loading audio ${key}:`, error);
                }
            });

        } catch (error) {
            console.error('Error in preload:', error);
        }

        // Add any other preload code here (e.g., scanlines)
        // Create scanlines texture programmatically
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0xffffff);
        for (let y = 0; y < 100; y += 2) {
            graphics.moveTo(0, y);
            graphics.lineTo(100, y);
        }
        graphics.generateTexture('scanlines', 100, 100);
        graphics.destroy();
    }

    create() {
        // Add these properties
        this.gameEnded = false;
        this.hasReachedMoon = false;
        this.controlsEnabled = true;
        
        // Stop any existing background music
        if (this.game.backgroundMusic) {
            this.game.backgroundMusic.stop();
        }

        // Create new background music instance
        this.game.backgroundMusic = this.sound.add('backgroundMusic', {
            loop: true,
            volume: 0.5
        });
        this.game.backgroundMusic.play();

        // Start with a black screen
        this.cameras.main.fadeFrom(1000, 0, 0, 0);

        this.init();  // Call init method to reset game state
        
        // Initialize game-dependent values
        this.moonConfig.endY = this.sys.game.config.height * this.moonConfig.finalYPercentage;

        // Destroy existing game objects
        if (this.candles) {
            this.candles.destroy(true);
        }
        if (this.meteors) {
            this.meteors.destroy(true);
        }
        if (this.dollarSigns) {
            this.dollarSigns.forEach(dollar => dollar.destroy());
        }
        if (this.moon) {
            this.moon.destroy();
        }
        if (this.player) {
            this.player.destroy();
        }
        
        // Create new game objects
        this.candles = this.physics.add.group();
        this.meteors = this.physics.add.group();

        // Reset the moon
        this.resetMoon();

        // Initialize background
        this.background = this.add.tileSprite(
            0,                          // x position
            0,                          // y position
            this.game.config.width,     // width
            this.game.config.height,    // height
            'background'
        );
        this.background.setOrigin(0, 0);
        this.background.setScale(1);    // Adjust scale to zoom out the pattern
        this.background.setAlpha(0.3);  // Keep the existing alpha
        this.background.setDepth(this.DEPTHS.BACKGROUND);  // Ensure proper layering
        
        this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background')
        .setOrigin(0, 0)
        .setDepth(DEPTHS.BACKGROUND);
    
    // Create chart
    this.chart = new GameChart(this);

        // Initialize player
        this.player = this.physics.add.sprite(config.width / 2, config.height * 0.8, this.originalPlayerSprite);
        this.player.setScale(0.3);
        this.player.setDepth(6);

        // Adjust player's collision body
        this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.5);
        this.player.body.setOffset(this.player.width * 0.25, this.player.height * 0.25);

        // Remove world bounds collision
        this.player.setCollideWorldBounds(false);

        // Update score text
      /*  this.scoreText = this.add.text(10, 10, 'Market Cap: $0', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setDepth(this.UI_DEPTH);

      /*  // Timer text
        this.timerText = this.add.text(10, 40, 'Time: 3:00', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setDepth(this.UI_DEPTH);

        // Multiplier text
        this.multiplierText = this.add.text(10, 70, 'Multiplier: 1x', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setDepth(this.UI_DEPTH);*/

        // Initialize particle system
        this.particles = this.add.particles('particle');

        // Initialize sound pools
        this.greenSounds = ['green1', 'green2', 'green3', 'green4', 'green5', 'green6', 'green7', 'green8'];
        this.redSounds = ['red1', 'red2', 'red3', 'red4', 'red5', 'red6', 'red7', 'red8'];

        // Initialize input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.targetPosition = new Phaser.Math.Vector2(this.player.x, this.player.y);

        this.input.on('pointermove', (pointer) => {
            this.targetPosition.set(pointer.x, pointer.y);
        });

        this.input.on('pointerout', () => {
            this.isPointerInGame = false;
        });

        this.input.on('pointerover', () => {
            this.isPointerInGame = true;
        });

        // Set up collisions
        this.physics.add.overlap(this.player, this.candles, this.collectCandle, null, this);
        this.physics.add.overlap(this.player, this.meteors, this.collectMeteor, null, this);

        // Add power-up collision detection
        this.physics.add.overlap(
            this.player,
            this.children.getAll('texture.key', 'moonglasses'),
            (player, powerup) => this.powerUps.collectMoonGlasses(player, powerup),
            null,
            this
        );
        
        this.physics.add.overlap(
            this.player,
            this.children.getAll('texture.key', 'crystalball'),
            (player, powerup) => this.powerUps.collectCrystalBall(player, powerup),
            null,
            this
        );
        
        // Set up timers and events
        this.time.addEvent({
            delay: 1000,
            callback: this.updateGameTime,
            callbackScope: this,
            loop: true
        });

        this.spawnTimer = this.time.addEvent({
            delay: this.gameConfig.initialSpawnDelay,
            callback: this.spawnCandlestick,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 10000,
            callback: this.increaseSpawnRate,
            callbackScope: this,
            loop: true
        });

        this.time.delayedCall(this.gameConfig.redCandleDelay * 1000, () => {
            this.redCandlesEnabled = true;
            console.log("Red candles enabled");
        });

        this.time.delayedCall(120000, this.startMeteorSpawning, [], this);

        // Create star field
        this.createStarField();

        // Set depths for various game objects
        this.background.setDepth(1);
        this.starsParticles.setDepth(2);
        this.moon.setDepth(3);
        this.candles.setDepth(4);
        this.meteors.setDepth(5);
        this.player.setDepth(6);
        this.particles.setDepth(7);

        // Set depths for UI elements
        if (this.scoreText) this.scoreText.setDepth(10);
        if (this.timerText) this.timerText.setDepth(10);
        if (this.multiplierText) this.multiplierText.setDepth(10);
        
        // Set depth for motivational text
        if (this.currentText) this.currentText.setDepth(10);

        // Display motivational text
        this.displayMotivationalText();

        // Set up the moon entry timer
        const moonEntryDelay = this.gameConfig.duration * 1000 - this.moonConfig.startTime * 1000;
        console.log('Setting up moon entry timer. Delay:', moonEntryDelay);
        this.time.delayedCall(moonEntryDelay, this.startMoonEntry, [], this);

        // Update tallyConfig with actual dimensions
        this.tallyConfig.x = this.cameras.main.width * 0.1;
        this.tallyConfig.y = this.cameras.main.height * 0.2;
        this.tallyConfig.width = this.cameras.main.width * 0.8;

        this.tallySound = this.sound.add('tally');

        // Initialize PowerUpManager
        this.powerUps = new PowerUpManager(this);

        // Initialize dollarSigns array
        this.dollarSigns = [];

        // Create UI
        this.createUI();

        this.whaleSound = this.sound.add('whale_sound');

        // Add speed increase timer
        this.time.addEvent({
            delay: this.speedIncreaseInterval,
            callback: this.increaseBackgroundSpeed,
            callbackScope: this,
            loop: true
        });

        // Create chart after background but before other elements
        this.chart = new GameChart(this);

        // Add initial point
        this.chart.addDataPoint(0);

        // Set up regular updates
        this.time.addEvent({
            delay: 100, // Update every 100ms
            callback: () => {
                if (this.score !== undefined) {
                    this.chart.addDataPoint(this.score);
                }
            },
            loop: true
        });

        // Initialize game time to exactly 3 minutes (180 seconds)
        this.gameTime = GAME_SETTINGS.DURATION; // Should be 180

        // Create single timer event and store reference
        this.gameTimer = this.time.addEvent({
            delay: 100,  // Update every 100ms for smoother countdown
            callback: this.updateGameTime,
            callbackScope: this,
            loop: true
        });

        // Debug log to confirm timer creation
        console.log('Game timer created');
    }

    updateGameTime() {
        const currentTime = this.time.now;
        if (!this.lastUpdateTime) {
            this.lastUpdateTime = currentTime;
            return;
        }

        // Calculate actual elapsed time in seconds
        const deltaSeconds = (currentTime - this.lastUpdateTime) / 1000;
        this.gameTime = Math.max(0, this.gameTime - deltaSeconds);

        // Update timer display
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = Math.floor(this.gameTime % 60);
        this.timerText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);

        this.lastUpdateTime = currentTime;

        // Check end conditions if time is up
        if (this.gameTime <= 0) {
            this.checkEndConditions();
        }
    }

    resetMoon() {
        console.log('Resetting moon');
        if (this.moon) {
            this.moon.destroy();
        }

        const moonTexture = this.textures.get('moon');
        const moonWidth = moonTexture.getSourceImage().width;
        const moonHeight = moonTexture.getSourceImage().height;
        const scaleFactor = (this.sys.game.config.width * 0.8) / moonWidth;

        this.moon = this.add.image(this.sys.game.config.width / 2, this.moonConfig.startY, 'moon')
            .setScale(scaleFactor)
            .setDepth(3);
        this.moon.setVisible(false);

        // Calculate final Y position based on percentage of screen height
        this.moonConfig.finalY = this.sys.game.config.height * this.moonConfig.finalYPercentage;
        
        console.log('Moon reset. Position:', this.moon.y, 'Visible:', this.moon.visible);
    }

    startMoonEntry() {
        console.log('Starting moon entry');
        if (this.moon) {
            this.moon.setVisible(true);
            const remainingTime = this.gameTime * 1500; // Convert to milliseconds
            const entryDuration = Math.min(this.moonConfig.entryDuration, remainingTime);
            
            this.tweens.add({
                targets: this.moon,
                y: this.moonConfig.finalY,
                duration: entryDuration,
                ease: 'Power2',
                onComplete: () => {
                    console.log('Moon entry complete');
                }
            });
        } else {
            console.log('Moon object does not exist');
        }
    }

    startMeteorSpawning() {
        console.log('Starting meteor spawning');
        this.spawnMeteorChunk();

        // Spawn a chunk of meteors every 15 seconds
        this.meteorChunkTimer = this.time.addEvent({
            delay: 15000,
            callback: this.spawnMeteorChunk,
            callbackScope: this,
            loop: true
        });
    }

    spawnMeteorChunk() {
        console.log('Spawning meteor chunk');
        // Spawn 2-3 meteors in quick succession
        const meteorCount = Phaser.Math.Between(2, 3);
        
        this.meteorSpawnTimer = this.time.addEvent({
            delay: 500, // 0.5 second between each meteor in a chunk
            callback: this.spawnMeteor,
            callbackScope: this,
            repeat: meteorCount - 1
        });
    }

    spawnMeteor() {
        const x = Phaser.Math.Between(50, this.game.config.width - 50);
        const meteor = this.meteors.create(x, -50, 'meteor');
        
        // Make meteors smaller (adjust these values as needed)
        const scale = Phaser.Math.FloatBetween(0.3, 0.5);  // Changed from probably 0.6, 0.8
        meteor.setScale(scale);
        
        // Increase meteor speed
        const speed = Phaser.Math.Between(400, 600);  // Increased from probably 300, 400
        const angle = Phaser.Math.Between(80, 100);   // Slightly adjust angle range if needed
        
        // Convert angle to velocity
        const velocity = this.physics.velocityFromAngle(angle, speed);
        meteor.setVelocity(velocity.x, velocity.y);
        
        // Keep the rotation logic
        meteor.rotationSpeed = Phaser.Math.FloatBetween(-2, 2);
        meteor.setDepth(this.DEPTHS.METEORS);
    }

    isOverlappingWithOtherMeteors(x) {
        const buffer = 50; // Minimum distance between meteors
        return this.meteors.getChildren().forEach(meteor => {
            return Math.abs(meteor.x - x) < buffer;
        });
    }

    update(time, delta) {
        // Update background scroll speed
        this.background.tilePositionY -= this.currentBackgroundSpeed;

        // Update parallax effect based on current speed
        const contraryMovement = (this.player.x - config.width / 2) * (0.005 * this.currentBackgroundSpeed);
        this.background.tilePositionX += contraryMovement;

        // Update star speeds based on current background speed
        this.updateStarSpeeds(contraryMovement);

        // Smoothly move towards the target position
        const speed = 0.15;
        this.player.x = Phaser.Math.Linear(this.player.x, this.targetPosition.x, speed);
        this.player.y = Phaser.Math.Linear(this.player.y, this.targetPosition.y, speed);

        // Add a very slight wobble effect
        const wobbleAmount = 0.5;
        const wobbleSpeed = 0.003;
        this.player.x += Math.sin(this.time.now * wobbleSpeed) * wobbleAmount;
        this.player.y += Math.cos(this.time.now * wobbleSpeed) * wobbleAmount;

        // Only clamp the player's vertical position
        const halfPlayerHeight = this.player.displayHeight / 2;
        this.player.y = Phaser.Math.Clamp(this.player.y, halfPlayerHeight, config.height - halfPlayerHeight);

        // Clean up off-screen candles
        this.candles.getChildren().forEach(candle => {
            if (candle.y > this.game.config.height + 50) {
                candle.destroy();
            }
        });

        // Handle meteors
        if (this.meteors) {
            this.meteors.getChildren().forEach(meteor => {
                if (meteor && meteor.active) {
                    meteor.rotation += meteor.rotationSpeed;
                    if (meteor.y > this.game.config.height + 50) {
                        meteor.destroy();
                    }
                }
            });
        }

        // Update all-time high
        this.allTimeHigh = Math.max(this.allTimeHigh, this.score);

        // If you were updating multiplier text here, replace it with:
        // this.updateMultiplierBar();

        if (this.moon && this.moon.visible) {
            if (!this.children.exists(this.moon)) {
                console.log('Moon was removed from the scene, re-adding it');
                this.add.existing(this.moon);
            }
        }

        if (this.moon) {
            console.log('Moon update - Visible:', this.moon.visible, 'Position:', this.moon.y);
        } else {
            console.log('Moon object does not exist');
        }

        // Wrap player around screen
        this.wrapPlayerAroundScreen();

        // Check if it's time to start the moon entry
        if (this.gameTime <= this.moonConfig.startTime && !this.moon.visible) {
            this.startMoonEntry();
        }

        if (this.powerUps) {
            this.powerUps.update();
        }

        // Add this near the end of the update method
        if (this.powerUps.isCrystalBallActive && this.candles) {
            this.applyGravitationalPull();
        }

        // Update Pepe effects
        if (this.powerUps && this.powerUps.isPepeActive) {
            if (this.powerUps.updateVHSEffect) {
                this.powerUps.updateVHSEffect();
            }
        }

        // Update chart with current score and multiplier
        if (this.chart) {
            this.chart.addDataPoint(this.score, this.scoreMultiplier);
        }

        // Add this check for the final 7 seconds
        if (this.gameTime <= GAME_SETTINGS.SPAWN_STOP_TIME && !this.spawningStopped) {
            this.spawningStopped = true;
            this.stopAllSpawning();
            
            // Start epic ending sequence
            this.startEpicEnding();
        }

        // Add dramatic speed ramping
        this.updateDramaticSpeed();

        // Add this to your existing update method
        if (!this.gameEnded) {
            this.checkEndConditions();
        }
    }

    wrapPlayerAroundScreen() {
        const padding = 50; // Adjust this value to determine how far off-screen the player can go

        if (this.player.x < -padding) {
            this.player.x = this.game.config.width + padding;
        } else if (this.player.x > this.game.config.width + padding) {
            this.player.x = -padding;
        }

        if (this.player.y < -padding) {
            this.player.y = this.game.config.height + padding;
        } else if (this.player.y > this.game.config.height + padding) {
            this.player.y = -padding;
        }
    }

    updateStarSpeeds(contraryMovement) {
        // Increased vertical speed multipliers
        this.starsBack.setSpeedY({ min: this.currentBackgroundSpeed * 80, max: this.currentBackgroundSpeed * 100 });  // Doubled
        this.starsMid.setSpeedY({ min: this.currentBackgroundSpeed * 120, max: this.currentBackgroundSpeed * 140 });  // Doubled
        this.starsFront.setSpeedY({ min: this.currentBackgroundSpeed * 160, max: this.currentBackgroundSpeed * 180 }); // Doubled

        // Keep parallax effect proportional
        this.starsBack.setSpeedX({ min: contraryMovement * 13.2, max: contraryMovement * 14.2 });
        this.starsMid.setSpeedX({ min: contraryMovement * 14.5, max: contraryMovement * 15.5 });
        this.starsFront.setSpeedX({ min: contraryMovement * 15.8, max: contraryMovement * 16.8 });
    }

    handleAsteroidExit() {
        if (this.gameTime <= this.gameConfig.asteroidExitTime) {
            this.meteors.getChildren().forEach(meteor => {
                if (!meteor.isExiting) {
                    meteor.isExiting = true;
                    this.tweens.add({
                        targets: meteor,
                        x: this.game.config.width + 100,
                        y: -100,
                        duration: 2000,
                        ease: 'Power2',
                        onComplete: () => {
                            meteor.destroy();
                        }
                    });
                }
            });
        }
    }

    handleSpawnTimers() {
        if (this.gameTime !== this.gameConfig.spawnStopTime) return;

        this.stopTimer(this.spawnTimer, "Candlestick spawn timer");
        this.stopTimer(this.meteorChunkTimer, "Meteor chunk timer");
        this.stopTimer(this.meteorSpawnTimer, "Meteor spawn timer");
    }

    stopTimer(timer, timerName) {
        if (timer) {
            timer.remove(false);
            console.log(`${timerName} stopped`);
        }
    }

    updateTimerDisplay() {
        if (!this.timerText) return;

        const minutes = Math.floor(this.gameTime / this.SECONDS_IN_MINUTE);
        const seconds = this.gameTime % this.SECONDS_IN_MINUTE;
        this.timerText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }

    spawnCandlestick() {
        // Check if we should stop spawning
        if (this.gameTime <= this.gameConfig.spawnStopTime) {
            console.log("Spawning stopped");
            return; // Exit the method early if we're in the last 10 seconds
        }

        const x = Phaser.Math.Between(0, this.game.config.width);
        
        let isGreen = true;
        if (this.redCandlesEnabled) {
            isGreen = Math.random() > (this.gameConfig.redProbabilityFactor * this.difficultyFactor);
        }
        
        const size = Phaser.Math.Between(0, 2); // 0: short, 1: mid, 2: tall
        const sizeKey = ['short', 'mid', 'tall'][size];
        
        let candleKey;
        if (isGreen) {
            candleKey = 'green' + sizeKey.charAt(0).toUpperCase() + sizeKey.slice(1);
        } else {
            candleKey = 'red' + sizeKey.charAt(0).toUpperCase() + sizeKey.slice(1);
        }

        let candle = this.candles.create(x, -50, candleKey);
        candle.setDepth(4);

        let scale = this.gameConfig.candleScales[sizeKey];
        let baseSpeed = this.gameConfig.candleSpeeds[sizeKey];

        const speedIncrease = this.gameConfig.speedIncreaseFactor * Math.pow(this.difficultyFactor, 1.5);
        const colorSpeedFactor = isGreen ? 1 : this.gameConfig.redSpeedMultiplier + this.gameConfig.redSpeedIncreaseFactor * this.difficultyFactor;
        const finalSpeed = baseSpeed + (speedIncrease * colorSpeedFactor);

        candle.setScale(scale);
        candle.setVelocityY(finalSpeed);
        candle.isGreen = isGreen;
        candle.size = size;

        console.log(`Spawned ${isGreen ? 'green' : 'red'} candle. Speed: ${finalSpeed.toFixed(2)}, Difficulty: ${this.difficultyFactor.toFixed(2)}`);

        if (isGreen) {
            this.totalGreenCandles++;
        } else {
            this.totalRedCandles++;
            this.avoidedRedCandles--; // Decrease avoided count when hitting a red candle
        }
    }

    increaseSpawnRate() {
        if (this.difficultyFactor > this.gameConfig.spawnRateIncreaseStart) {
            const currentDelay = this.spawnTimer.delay;
            const newDelay = Math.max(currentDelay * this.gameConfig.spawnRateDecreaseFactor, this.gameConfig.minSpawnDelay);
            this.spawnTimer.delay = newDelay;
            console.log(`Increased spawn rate. New delay: ${newDelay}ms`);
        }
    }

    endGame() {
        this.physics.pause();
        this.time.removeAllEvents();
        this.tweens.killAll();
        
        // Disable player input
        this.input.off('pointermove');
        
        // If the moon entry hasn't finished, complete it instantly
        if (this.moon && this.moon.y < this.moonConfig.finalY) {
            this.tweens.add({
                targets: this.moon,
                y: this.moonConfig.finalY,
                scale: this.moonConfig.endSize,
                duration: 500,
                ease: 'Power2',
                onComplete: () => this.flyPlayerToMoon()
            });
        } else {
            this.flyPlayerToMoon();
        }

        // Call the new method to show final tally
        this.time.delayedCall(3000, this.showFinalTally, [], this);

        if (this.powerUps) {
            this.powerUps.clearTimers();
        }

        // Make sure to clean up the chart
        if (this.chart) {
            this.chart.destroy();
        }
    }

    flyPlayerToMoon() {
        // Create dramatic flash
        this.cameras.main.flash(1000, 255, 255, 255);
        
        // Create dollar sign particle explosion around moon
        const moonParticles = this.add.particles('dollar');
        const emitter = moonParticles.createEmitter({
            x: this.moon.x,
            y: this.moon.y,
            speed: { min: 200, max: 400 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.2, end: 0 },
            blendMode: 'ADD',
            lifespan: 2000,
            quantity: 3,
            frequency: 50,
            tint: [0xFFD700, 0xFFFFFF], // Gold and white tint
            gravityY: 100,
            rotate: { min: -180, max: 180 }
        });

        // Add spinning animation to player
        this.tweens.add({
            targets: this.player,
            angle: 720, // Two full rotations (360 * 2)
            scale: 0.5,  // Shrink slightly as it spins
            x: this.moon.x,
            y: this.moon.y,
            duration: 2000,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                // Hide player when it reaches the moon
                this.player.setVisible(false);
                
                // Add final burst effect
                emitter.explode(20, this.moon.x, this.moon.y);
                
                // Optional: Add a final flash
                this.cameras.main.flash(500, 255, 255, 255);
                
                // Stop emitter after the final burst
                this.time.delayedCall(100, () => {
                    emitter.stop();
                    // Optional: remove particles system after it's done
                    this.time.delayedCall(2100, () => {
                        moonParticles.destroy();
                    });
                });
            }
        });
    }

    showEndGameMessage() {
        const finalScore = this.score;
        const message = `Congratulations!\nYou've reached the moon!\nFinal Market Cap: $${finalScore}`;

        const textStyle = {
            fontFamily: 'VT323',
            fontSize: '24px', // Reduced from 32px since Press Start 2P runs larger
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center',
            lineSpacing: 20 // Add some spacing between lines for better readability
        };

        const endText = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2,
            message,
            textStyle
        ).setOrigin(0.5);

        // Add a restart button
        const restartButton = this.add.text(
            this.game.config.width / 2,
            this.game.config.height * 0.7,
            'Play Again',
            { ...textStyle, backgroundColor: '#4a4a4a', padding: { x: 10, y: 5 } }
        ).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('StartScene');  // Start from the beginning instead of restarting
        });
    }

    collectCandle(player, candle) {
        if (!candle.active) return; // Ensure the candle is still active

        candle.disableBody(true, true);

        let scoreChange;
        let particleColor;

        if (this.powerUps.isSuperBonusActive) {
            // In super bonus mode, every candle hit gives positive score
            scoreChange = 100; // Award fixed positive score
            particleColor = 0xFFFF00; // Yellow color for the laser mode
        } else {
            if (candle.texture.key.startsWith('green')) {
                // Increase green candle impact
                switch(candle.size) {
                    case 0: scoreChange = 2000; break;  // short (was 500)
                    case 1: scoreChange = 4000; break;  // mid (was 1000)
                    case 2: scoreChange = 8000; break;  // tall (was 1500)
                }
                particleColor = 0x00ff00;
            } else {
                // More dramatic red candle impact
                switch(candle.size) {
                    case 0: scoreChange = -8000; break;   // short (was -5000)
                    case 1: scoreChange = -16000; break;  // mid (was -10000)
                    case 2: scoreChange = -32000; break;  // tall (was -15000)
                }
                particleColor = 0xff0000;
                
                // Screen shake for red candles
                this.cameras.main.shake(200, 0.03);
                // Red flash effect
                this.cameras.main.flash(300, 255, 0, 0, 0.3);
            }

            // Apply multiplier to green candles
            if (candle.texture.key.startsWith('green')) {
                scoreChange *= this.scoreMultiplier;
            }
        }

        // Update score
        this.score += scoreChange;
        this.scoreText.setText('Market Cap: $' + this.score);

        // Create particle effect with smaller particles
        let emitter = this.particles.createEmitter({
            x: candle.x,
            y: candle.y,
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.25, end: 0 }, // Reduced from 0.5
            blendMode: 'ADD',
            lifespan: 800,
            gravityY: 300,
            quantity: 20,
            tint: particleColor
        });
        emitter.explode(20, candle.x, candle.y);

        // Create floating score text
        let scorePopupText = (scoreChange > 0 ? '+' : '') + scoreChange;
        if (candle.texture.key.startsWith('green') && this.scoreMultiplier > 1 && !this.powerUps.isSuperBonusActive) {
            scorePopupText += ` (${this.scoreMultiplier}x)`;
        }
        let scorePopup = this.add.text(candle.x, candle.y, scorePopupText, {
            fontSize: '24px',
            fill: scoreChange > 0 ? '#00ff00' : '#ff0000'
        }).setOrigin(0.5).setDepth(this.UI_DEPTH);

        this.tweens.add({
            targets: scorePopup,
            y: scorePopup.y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => scorePopup.destroy()
        });

        // Play sound effect only if not in super bonus mode
        if (!this.powerUps.isSuperBonusActive) {
            const isGreen = candle.texture.key.startsWith('green');
            const soundPool = isGreen ? this.greenSounds : this.redSounds;
            const randomSound = Phaser.Utils.Array.GetRandom(soundPool);
            this.sound.play(randomSound, { volume: 0.45 }); // Lowered from default (0.3 or 1.0)
        }

        if (candle.isGreen) {
            this.consecutiveGreenCandles++;
            this.scoreMultiplier = Math.min(10, this.consecutiveGreenCandles);
            this.collectedGreenCandles++;
            // Update multiplier display with animation
            this.updateMultiplierDisplay(this.scoreMultiplier);
        } else {
            this.consecutiveGreenCandles = 0;
            this.scoreMultiplier = 1;
            // Update multiplier display with animation
            this.updateMultiplierDisplay(this.scoreMultiplier);
        }
    }

    collectMeteor(player, meteor) {
        if (!meteor || !meteor.active) return;

        meteor.destroy();

        // Increase meteor damage
        const scoreDeduction = -50000; // Was -20000
        this.score += scoreDeduction;
        this.scoreText.setText('Market Cap: $' + this.score);

        // Reset multiplier
        this.consecutiveGreenCandles = 0;
        this.scoreMultiplier = 1;
        this.updateMultiplierDisplay(this.scoreMultiplier);

        // Create particle effect with smaller particles
        let emitter = this.particles.createEmitter({
            x: meteor.x,
            y: meteor.y,
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.25, end: 0 }, // Reduced from 0.5
            blendMode: 'ADD',
            lifespan: 800,
            gravityY: 300,
            quantity: 30,
            tint: 0xFF0000
        });
        emitter.explode(30, meteor.x, meteor.y);

        // Screen shake
        this.cameras.main.shake(200, 0.05);

        // Create floating text
        let meteorText = this.add.text(meteor.x, meteor.y, '-$50,000', {
            fontSize: '24px',
            fill: '#FF0000'
        }).setOrigin(0.5).setDepth(this.UI_DEPTH);

        this.tweens.add({
            targets: meteorText,
            y: meteorText.y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => meteorText.destroy()
        });

        // Play meteor sound effect
        this.sound.play('meteorSound', { volume: 0.2 }); // Lowered from default
    }

    collectDollar(player, dollar) {
        if (!dollar.active) return;

        // Calculate score based on collection count
        const baseScore = 1000;
        const collectionNumber = this.dollarsCollected + 1;
        const score = baseScore * Math.pow(2, collectionNumber - 1);

        // Update score
        this.score += score;
        this.dollarsCollected++;
        this.scoreText.setText('Market Cap: $' + this.score);

        // Create particle effect with smaller particles
        let emitter = this.particles.createEmitter({
            x: dollar.x,
            y: dollar.y,
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.25, end: 0 }, // Reduced from 0.5
            blendMode: 'ADD',
            lifespan: 800,
            gravityY: 300,
            quantity: 20,
            tint: 0xFFD700
        });
        emitter.explode(20, dollar.x, dollar.y);

        // Create floating score text
        let scoreText = this.add.text(dollar.x, dollar.y, `+$${score.toLocaleString()}`, {
            fontSize: '24px',
            fill: '#FFD700'
        }).setOrigin(0.5).setDepth(this.UI_DEPTH);

        this.tweens.add({
            targets: scoreText,
            y: scoreText.y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => scoreText.destroy()
        });

        // Play appropriate sound
        if (this.dollarsCollected === 10) {
            // Play special sound for final dollar
            this.sound.play('final_dollar_sound');
            
            // Maybe add some extra effects for the final collection
            this.cameras.main.flash(1000, 255, 215, 0); // Golden flash
            
            // Add celebratory text
            let finalText = this.add.text(
                this.game.config.width / 2,
                this.game.config.height / 2,
                'MOONSHOT COMPLETE!',
                {
                    fontSize: '48px',
                    fill: '#FFD700',
                    stroke: '#000000',
                    strokeThickness: 6
                }
            ).setOrigin(0.5).setDepth(this.UI_DEPTH + 1);

            this.tweens.add({
                targets: finalText,
                scale: { from: 0.5, to: 1.5 },
                alpha: { from: 1, to: 0 },
                duration: 2000,
                ease: 'Power2',
                onComplete: () => finalText.destroy()
            });
        } else {
            // Play regular dollar sound
            this.sound.play('dollar_sound');
        }

        // Destroy the dollar
        dollar.destroy();

        // Update the scale of dollar signs (20% smaller)
        dollar.setScale(0.24); // Assuming original scale was 0.3
    }
        
   createStarField() {
    this.starsParticles = this.add.particles('particle');
    
    // Common emitter config with increased lifespan and adjusted y range
    const emitterConfig = {
        x: { min: 0, max: this.game.config.width },
        y: { min: -50, max: this.game.config.height }, // Spawn stars across entire height
        lifespan: 4000, // Increased lifespan
        frequency: 50,  // Spawn rate
        blendMode: 'ADD',
        gravityY: 0,   // Remove gravity effect
        emitting: true // Ensure continuous emission
    };

    // Background stars (smallest, fastest)
    this.starsBack = this.starsParticles.createEmitter({
        ...emitterConfig,
        scale: { start: 0.08, end: 0 },     // Increased from 0.05
        speedY: { min: 400, max: 800 },     // Doubled from 200-400
        alpha: { start: 0.7, end: 0 },      // Increased from 0.5
        tint: 0xFFFFFF,
        quantity: 2,
        frequency: 20 // More frequent for background
    });

    // Middle layer stars
    this.starsMid = this.starsParticles.createEmitter({
        ...emitterConfig,
        scale: { start: 0.06, end: 0 },     // Increased from 0.04
        speedY: { min: 300, max: 600 },     // Doubled from 150-300
        alpha: { start: 0.8, end: 0 },      // Increased from 0.6
        tint: 0x00FFFF,
        quantity: 1,
        frequency: 40
    });

    // Foreground stars (largest, slowest)
    this.starsFront = this.starsParticles.createEmitter({
        ...emitterConfig,
        scale: { start: 0.09, end: 0 },     // Increased from 0.06
        speedY: { min: 200, max: 400 },     // Doubled from 100-200
        alpha: { start: 0.9, end: 0 },      // Increased from 0.7
        tint: 0xFFFF00,
        quantity: 1,
        frequency: 60
    });

    // Initial population of stars across the screen
    const initialStars = 50;
    for (let i =0; i < initialStars; i++) {
        this.starsBack.emitParticle();
        this.starsMid.emitParticle();
        this.starsFront.emitParticle();
    }
}
// ... existing code ...

    displayMotivationalText() {
        const randomText = Phaser.Utils.Array.GetRandom(this.motivationalTexts);
        const randomX = Phaser.Math.Between(this.game.config.width * 0.3, this.game.config.width * 0.7);
        const randomY = Phaser.Math.Between(this.game.config.height * 0.3, this.game.config.height * 0.7);
        const randomColor = Phaser.Utils.Array.GetRandom(this.textColors);
        const randomRotation = Phaser.Math.Between(-35, 35); // Random rotation between -35 and 35 degrees

        // Remove any existing text
        if (this.currentText) {
            this.currentText.destroy();
        }

        this.currentText = this.add.text(randomX, randomY, randomText, {
            ...this.baseTextStyle,
            fontSize: '24px',
            fill: randomColor,
            align: 'center'
        }).setOrigin(0.5).setDepth(this.UI_DEPTH);

        this.currentText.setAngle(randomRotation); // Apply random rotation

        this.tweens.add({
            targets: this.currentText,
            scale: { from: 0.8, to: 1.2 },
            alpha: { from: 0, to: 1 },
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Schedule the next text display every 7 seconds
        this.time.delayedCall(7000, this.displayMotivationalText, [], this);
    }

    startZoom() {
        this.isZooming = true;
        this.zoomProgress = 0;
    }

    updateZoom(delta) {
        this.zoomProgress += delta / (this.zoomConfig.duration * 1000);
        if (this.zoomProgress >= 1) {
            this.zoomProgress = 1;
            this.isZooming = false;
        }

        // Use an easing function for smoother zoom
        const easeZoomProgress = Phaser.Math.Easing.Sine.InOut(this.zoomProgress);
        const currentScale = Phaser.Math.Linear(
            this.zoomConfig.startScale,
            this.zoomConfig.endScale,
            easeZoomProgress
        );

        // Scale only the background tile
        this.background.tileScaleX = currentScale;
        this.background.tileScaleY = currentScale;

        // Instead of scaling particles, adjust their speed and spread
        if (this.starsBack && this.starsMid && this.starsFront) {
            const speedMultiplier = Phaser.Math.Linear(1, 1.5, easeZoomProgress);
            const spreadMultiplier = Phaser.Math.Linear(1, 2, easeZoomProgress);

            // Adjust particle emitter properties
            this.starsBack.setSpeedY({ min: 200 * speedMultiplier, max: 400 * speedMultiplier });
            this.starsMid.setSpeedY({ min: 150 * speedMultiplier, max: 300 * speedMultiplier });
            this.starsFront.setSpeedY({ min: 100 * speedMultiplier, max: 200 * speedMultiplier });

            // Adjust the spread of particles
            const width = this.game.config.width * spreadMultiplier;
            this.starsBack.setEmitZone({ type: 'random', source: new Phaser.Geom.Rectangle(-width/4, 0, width * 1.5, this.game.config.height) });
            this.starsMid.setEmitZone({ type: 'random', source: new Phaser.Geom.Rectangle(-width/4, 0, width * 1.5, this.game.config.height) });
            this.starsFront.setEmitZone({ type: 'random', source: new Phaser.Geom.Rectangle(-width/4, 0, width * 1.5, this.game.config.height) });
        }
    }

    createTallyText(text, y, delay) {
        const tallyText = this.add.text(
            this.cameras.main.width / 2, 
            y,
            text,
            {
                fontSize: '24px',
                fontFamily: 'VT323',
                fill: '#FFD700',
                stroke: '#000000',
                strokeThickness: 6,
                align: 'center'
            }
        )
        .setOrigin(0.5, 0.5)
        .setAlpha(0)
        .setDepth(this.UI_DEPTH);
    
        this.tweens.add({
            targets: tallyText,
            alpha: 1,
            y: y - 10,
            duration: 500,
            ease: 'Back.easeOut'
        });
    
        if (this.tallySound) {
            this.tallySound.play({ volume: 0.5 });
        }
    
        return tallyText;
    }
    
    showFinalTally() {
        // Clear existing timers and tweens
        this.time.removeAllEvents();
        this.tweens.killAll();
        
        const centerY = this.game.config.height / 2 - 200;
        const spacing = 55;
        let currentY = centerY;
    
        // Calculate avoided red candles (total spawned minus collected)
        this.avoidedRedCandles = this.totalRedCandles; // All red candles are considered avoided unless hit
    
        // Calculate final rewards with proper scaling
        const greenCandleBonus = Math.floor(this.collectedGreenCandles * 50);
        const redCandleBonus = Math.floor(this.avoidedRedCandles * 75);
        const multiplierBonus = Math.floor(this.allTimeHigh * 0.1);
        const communityBonus = 10000000; // Changed to 10M fixed bonus
    
        const finalScore = this.score + greenCandleBonus + redCandleBonus + multiplierBonus + communityBonus;
    
        const tallyData = [
            { 
                label: "Base Score", 
                value: this.score.toLocaleString(), 
                percentage: 100, 
                bonus: "", 
                noPercentage: true 
            },
            { 
                label: "Green Candles Collected", 
                value: this.collectedGreenCandles, 
                percentage: Math.floor((this.collectedGreenCandles / Math.max(1, this.totalGreenCandles)) * 100), 
                bonus: `+${greenCandleBonus.toLocaleString()}` 
            },
            { 
                label: "Red Candles Avoided", 
                value: this.avoidedRedCandles, 
                percentage: Math.floor((this.avoidedRedCandles / Math.max(1, this.totalRedCandles)) * 100), 
                bonus: `+${redCandleBonus.toLocaleString()}` 
            },
            { 
                label: "All-Time High Bonus", 
                value: this.allTimeHigh.toLocaleString(), 
                percentage: Math.floor((this.allTimeHigh / Math.max(1, this.score)) * 100), 
                bonus: `+${multiplierBonus.toLocaleString()}` 
            },
            { 
                label: "Community Love Bonus", 
                value: "10,000,000", // Changed from "WEN MOON?"
                percentage: 100, 
                bonus: `+${communityBonus.toLocaleString()}`, 
                noPercentage: true 
            },
            { 
                label: "Final Score", 
                value: finalScore.toLocaleString(), 
                percentage: 0, 
                bonus: "", 
                noPercentage: true, 
                isFinal: true 
            }
        ];
    
        // Display stats with delay
        let lastTextY = currentY;
        
        tallyData.forEach((item, index) => {
            this.time.delayedCall(index * 500, () => {
                let displayText;
                if (item.noPercentage) {
                    displayText = `${item.label}: ${item.value}`;
                } else {
                    displayText = `${item.label}: ${item.value} (${item.percentage}%) ${item.bonus}`;
                }
                
                const text = this.createTallyText(displayText, currentY + (spacing * index), 0);
                lastTextY = currentY + (spacing * index);
                
                if (item.isFinal) {
                    text.setFontSize('32px').setFill('#00FF00');
                    
                    // After the final score is displayed, show the name input
                    this.time.delayedCall(1000, () => {
                        this.showNameInput(lastTextY + spacing * 2, finalScore);
                    });
                }
            });
        });
    }

    // Add the showNameInput method
    showNameInput(yPosition, finalScore) {
        // Create a DOM element for name input with updated styling
        const inputElement = this.add.dom(
            this.cameras.main.width / 2,
            yPosition
        ).createFromHTML(`
            <div style="text-align: center;">
                <input type="text" id="playerName" name="name" placeholder="Enter your name" style="
                    font-family: 'VT323', monospace;
                    font-size: 32px;
                    padding: 10px;
                    width: 200px;
                    background-color: rgba(0, 0, 0, 0.7);
                    color: #00ff00;
                    border: 2px solid #00ff00;
                    border-radius: 5px;
                    text-align: center;
                    outline: none;
                " />
                <button id="submitScore" style="
                    font-family: 'VT323', monospace;
                    font-size: 32px;
                    padding: 10px 20px;
                    margin-left: 10px;
                    background-color: rgba(0, 0, 0, 0.7);
                    color: #00ff00;
                    border: 2px solid #00ff00;
                    border-radius: 5px;
                    cursor: pointer;
                ">Submit Score</button>
            </div>
        `);

        inputElement.setDepth(this.UI_DEPTH + 1);

        // Handle input submission
        inputElement.addListener('click');

        inputElement.on('click', async (event) => {
            if (event.target.id === 'submitScore') {
                const playerName = document.getElementById('playerName').value.trim();
                if (playerName !== '') {
                    // Submit score to Firebase
                    if (window.database) {
                        try {
                            await window.database.ref('scores').push({
                                name: playerName,
                                score: finalScore,
                                timestamp: Date.now()
                            });

                            // Remove the input element
                            inputElement.destroy();

                            // Add share button
                            const shareButton = this.add.text(
                                this.cameras.main.width / 2,
                                yPosition,
                                'Share Your Journey',
                                {
                                    fontFamily: 'VT323',
                                    fontSize: '32px',
                                    fill: '#00ff00',
                                    stroke: '#000000',
                                    strokeThickness: 6,
                                    backgroundColor: '#000000',
                                    padding: { x: 20, y: 10 }
                                }
                            )
                            .setOrigin(0.5)
                            .setInteractive()
                            .setDepth(this.UI_DEPTH + 1);

                            // Add hover effect
                            shareButton.on('pointerover', () => {
                                shareButton.setStyle({ fill: '#ffffff' });
                            });
                            
                            shareButton.on('pointerout', () => {
                                shareButton.setStyle({ fill: '#00ff00' });
                            });

                            shareButton.on('pointerdown', () => {
                                this.shareGameResults(playerName, finalScore);
                            });

                            // Show Play Again button below share button
                            this.showPlayAgainButton(yPosition + 60);
                        } catch (error) {
                            console.error('Error submitting score:', error);
                        }
                    }
                } else {
                    alert('Please enter your name!');
                }
            }
        });
    }

    // New method to handle sharing
    async shareGameResults(playerName, finalScore) {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 1200;
            canvas.height = 675;

            // Draw semi-transparent dark background
            ctx.fillStyle = 'rgba(26, 26, 26, 0.85)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw background image with reduced opacity
            const background = this.textures.get('background').getSourceImage();
            ctx.globalAlpha = 0.2;
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;

            // Draw the new crypto-style chart
            this.drawCryptoChart(ctx, 100, 50, canvas.width - 200, canvas.height - 200);

            // Draw logo at the top
            const logo = this.textures.get('logo').getSourceImage();
            ctx.drawImage(logo, canvas.width/2 - 200, 20, 400, 100);

            // Get images with proper aspect ratios
            const plane = this.textures.get('planeglasses').getSourceImage();
            const moon = this.textures.get('moon').getSourceImage();

            // Calculate proper dimensions
            const planeSize = 100;
            const planeAspectRatio = plane.width / plane.height;
            const planeWidth = planeSize * planeAspectRatio;
            const planeHeight = planeSize;

            // Position near the end of the chart line
            const chartEndX = canvas.width - 250;
            const chartEndY = canvas.height/2;

            // Draw plane and moon
            ctx.drawImage(plane, chartEndX - planeWidth/2, chartEndY - planeHeight/2, planeWidth, planeHeight);
            ctx.drawImage(moon, chartEndX + 100, chartEndY - 50, 100, 100);

            // Add text at the bottom
            ctx.font = '40px VT323';
            ctx.fillStyle = '#00ff00';
            ctx.textAlign = 'center';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 4;
            
            const text1 = `${playerName}'s Journey to the Moon`;
            const text2 = `Final Market Cap: $${finalScore.toLocaleString()}`;
            
            ctx.strokeText(text1, canvas.width/2, canvas.height - 100);
            ctx.fillText(text1, canvas.width/2, canvas.height - 100);
            
            ctx.strokeText(text2, canvas.width/2, canvas.height - 50);
            ctx.fillText(text2, canvas.width/2, canvas.height - 50);

            // Create blob and share
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const file = new File([blob], 'moon-journey.png', { type: 'image/png' });

            // If in Telegram, use Telegram sharing
            if (window.telegramIntegration) {
                await window.telegramIntegration.shareScoreWithImage(blob);
            } else if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'My Journey to the Moon',
                    text: `Check out my journey! Final Market Cap: $${finalScore.toLocaleString()}`,
                    files: [file]
                });
            } else {
                // Fallback for browsers that don't support sharing
                const link = document.createElement('a');
                link.download = 'moon-journey.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        } catch (err) {
            console.error('Error generating share image:', err);
            // Fallback to basic download if sharing fails
            try {
                const link = document.createElement('a');
                link.download = 'moon-journey.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (downloadErr) {
                console.error('Download fallback also failed:', downloadErr);
            }
        }
    }

    // Helper method to load images
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    // Method to submit high score to Firebase
    submitHighScore(name, score) {
        // Ensure Firebase is initialized
        if (window.database) {
            // First, fetch current scores
            window.database.ref('scores')
                .orderByChild('score')
                .once('value')
                .then((snapshot) => {
                    const scores = [];
                    snapshot.forEach((childSnapshot) => {
                        scores.push({
                            key: childSnapshot.key,
                            name: childSnapshot.val().name,
                            score: childSnapshot.val().score
                        });
                    });

                    // Sort scores in descending order
                    scores.sort((a, b) => b.score - a.score);

                    // Check if new score should be added (higher than lowest score or less than 10 scores)
                    if (scores.length < 10 || score > scores[scores.length - 1].score) {
                        // If we have 10 scores already, remove the lowest one
                        if (scores.length >= 10) {
                            window.database.ref('scores/' + scores[scores.length - 1].key).remove();
                        }

                        // Add new score
                        window.database.ref('scores').push({
                            name: name,
                            score: score,
                            timestamp: Date.now()
                        })
                        .then(() => {
                            console.log('High score submitted successfully');
                        })
                        .catch((error) => {
                            console.error('Error submitting high score:', error);
                        });
                    }
                });
        } else {
            console.error('Firebase database is not initialized.');
        }
    }

    // Method to show "Play Again" button
    showPlayAgainButton(yPosition) {
        const playAgainText = this.add.text(
            this.cameras.main.width / 2,
            yPosition,
            'Play Again',
            {
                fontSize: '32px',
                fontFamily: 'VT323',
                fill: '#00ff00',
                stroke: '#000000',
                strokeThickness: 6,
                align: 'center',
                backgroundColor: '#000000',
                padding: { x: 20, y: 10 }
            }
        )
        .setOrigin(0.5, 0.5)
        .setInteractive()
        .setDepth(this.UI_DEPTH + 1);

        // Add hover effect
        playAgainText.on('pointerover', () => {
            playAgainText.setStyle({ fill: '#ffffff' });
        });
        
        playAgainText.on('pointerout', () => {
            playAgainText.setStyle({ fill: '#00ff00' });
        });

        playAgainText.on('pointerdown', () => {
            this.scene.start('StartScene');  // Changed to go back to start scene
        });
    }

    switchPlayerSprite(spriteName) {
        if (this.player) {
            // Store the current position and velocity
            const currentX = this.player.x;
            const currentY = this.player.y;
            const currentVelocityX = this.player.body.velocity.x;
            const currentVelocityY = this.player.body.velocity.y;

            // Instead of destroying, just change the texture
            this.player.setTexture(spriteName);
            
            // Ensure collision body is properly sized
            this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.5);
            this.player.body.setOffset(this.player.width * 0.25, this.player.height * 0.25);

            // Restore velocity
            this.player.setVelocity(currentVelocityX, currentVelocityY);
        }
    }

    getPlayer() { return this.player; }

    createUI() {
        const uiContainer = this.add.container(0, 0);
        uiContainer.setDepth(this.DEPTHS.UI);
        
        // Top black bar for market cap
        const uiBg = this.add.rectangle(0, 0, this.game.config.width, 60, 0x000000, 0.7)
            .setOrigin(0, 0);
        
        // Text styles
        const marketCapStyle = {
            fontFamily: 'VT323',
            fontSize: '32px',
            fill: '#00ff00',
            stroke: '#000000',
            strokeThickness: 2
        };

        const multiplierStyle = {
            fontFamily: 'VT323',
            fontSize: '32px',
            fill: '#ffff00',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        };

        const timerStyle = {
            fontFamily: 'VT323',
            fontSize: '40px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            alpha: 0.7
        };

        // Market Cap at top left
        this.scoreText = this.add.text(20, 20, 'Market Cap: $0', marketCapStyle);
        
        // Timer at bottom center
        this.timerText = this.add.text(this.game.config.width / 2, this.game.config.height - 40, '3:00', timerStyle)
            .setOrigin(0.5)
            .setAlpha(0.7);
        
        // Create multiplier container
        const multiplierContainer = this.add.container(this.game.config.width - 80, 20);
        
        // Create the multiplier image
        this.multiplierImage = this.add.image(0, 0, 'x1')
            .setScale(0.15)  // Adjust scale as needed
            .setOrigin(0.1);
        
        // Add to container
        multiplierContainer.add([this.multiplierImage]);
        
        // Update the multiplier display method
        this.updateMultiplierDisplay = (value) => {
            // Ensure value is within 1-10 range
            const clampedValue = Phaser.Math.Clamp(value, 1, 10);
            const imageKey = `x${clampedValue}`;
            
            // Add pop effect
            this.tweens.add({
                targets: this.multiplierImage,
                scaleX: { from: 0.08, to: 0.15 },  // Adjust scales as needed
                scaleY: { from: 0.08, to: 0.15 },
                duration: 200,
                ease: 'Back.easeOut'
            });
            
            // Update the image
            this.multiplierImage.setTexture(imageKey);
        };

        // Add everything to the container
        multiplierContainer.add([this.multiplierImage]);
        
        this.powerUpDisplay = this.add.container(this.game.config.width/2, 20);
        
        uiContainer.add([uiBg, this.scoreText, this.timerText, multiplierContainer, this.powerUpDisplay]);

        // Update score with smoother chart movement
        this.updateScore = (newScore) => {
            const oldScore = this.score || 0;
            this.score = newScore;
            this.scoreText.setText(`Market Cap: $${this.score.toLocaleString()}`);
            
            if (this.chart) {
                // Add some organic movement by creating intermediate points
                const numSteps = 5; // Number of intermediate points
                const scoreDiff = newScore - oldScore;
                
                for (let i = 1; i <= numSteps; i++) {
                    const progress = i / numSteps;
                    // Add some randomness to create more organic movement
                    const randomFactor = 1 + (Math.random() * 0.4 - 0.2); // ±20% variation
                    const intermediateScore = oldScore + (scoreDiff * progress * randomFactor);
                    
                    // Add slight delay between points
                    this.time.delayedCall(i * 50, () => {
                        this.chart.addDataPoint(intermediateScore);
                    });
                }
            }
        };
    }

    // Add this new method
    applyGravitationalPull() {
        const baseRadius = 4000;  // Radius of gravitational effect
        const baseStrength = 8000;  // Strength of the pull
        
        this.candles.getChildren().forEach(candle => {
            if (candle.texture.key.startsWith('green')) {
                const dx = this.player.x - candle.x;
                const dy = this.player.y - candle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < baseRadius) {
                    // Simple distance-based pull strength
                    const pullFactor = 1 - distance / baseRadius;
                    const pullStrength = baseStrength * pullFactor;
                    
                    // Direct angle towards player
                    const angle = Math.atan2(dy, dx);
                    
                    // Apply force
                    const deltaMultiplier = 0.025;
                    candle.body.velocity.x += Math.cos(angle) * pullStrength * deltaMultiplier;
                    candle.body.velocity.y += Math.sin(angle) * pullStrength * deltaMultiplier;
                    
                    // Cap the maximum speed
                    const maxSpeed = 1200;
                    const currentSpeed = Math.sqrt(
                        candle.body.velocity.x * candle.body.velocity.x + 
                        candle.body.velocity.y * candle.body.velocity.y
                    );
                    
                    if (currentSpeed > maxSpeed) {
                        const scale = maxSpeed / currentSpeed;
                        candle.body.velocity.x *= scale;
                        candle.body.velocity.y *= scale;
                    }
                }
            }
        });
    }

    increaseBackgroundSpeed() {
        if (this.currentBackgroundSpeed < this.maxBackgroundSpeed) {
            this.currentBackgroundSpeed += 0.2;
            
            // Update star particle speeds individually
            if (this.starsBack) {
                this.starsBack.setSpeedY({ 
                    min: 200 * this.currentBackgroundSpeed, 
                    max: 400 * this.currentBackgroundSpeed 
                });
            }
            
            if (this.starsMid) {
                this.starsMid.setSpeedY({ 
                    min: 150 * this.currentBackgroundSpeed, 
                    max: 300 * this.currentBackgroundSpeed 
                });
            }
            
            if (this.starsFront) {
                this.starsFront.setSpeedY({ 
                    min: 100 * this.currentBackgroundSpeed, 
                    max: 200 * this.currentBackgroundSpeed 
                });
            }
        }
    }

    shutdown() {
        // Clean up chart when scene shuts down
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        // ... other cleanup code ...
        
        // Clean up timer when scene shuts down
        if (this.gameTimer) {
            this.gameTimer.remove();
            this.gameTimer = null;
        }
    }

    updateScore(newScore) {
        this.score = newScore;
        this.scoreText.setText(`Market Cap: $${this.score.toLocaleString()}`);
        
        // Log score with timestamp
        const now = Date.now();
        if (!this.lastLoggedTime || now - this.lastLoggedTime >= this.scoreLoggingInterval) {
            if (!this.scoreHistory) this.scoreHistory = [];
            this.scoreHistory.push({
                timestamp: now,
                score: newScore
            });
            this.lastLoggedTime = now;
        }
    }

    // Add new method for epic ending sequence
    startEpicEnding() {
        // Disable player controls
        this.controlsEnabled = false;
        
        // First gently move to center while slowing any momentum
        this.tweens.add({
            targets: this.player.body.velocity,
            x: 0,
            y: 0,
            duration: 1500,
            ease: 'Sine.easeOut'
        });

        // Move to center of screen
        this.tweens.add({
            targets: this.player,
            x: this.game.config.width / 2,
            y: this.game.config.height / 2,
            duration: 2000,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.flyToMoon();
            }
        });
    }

    flyToMoon() {
        // Add gentle particle trail
        const particles = this.add.particles('particle');
        const trailEmitter = particles.createEmitter({
            follow: this.player,
            scale: { start: 0.1, end: 0 },
            alpha: { start: 0.6, end: 0 },
            speed: 100,
            lifespan: 1000,
            blendMode: 'ADD',
            tint: 0x00ffff
        });

        // Gentle spin and fly to moon - removed scale change
        this.tweens.add({
            targets: this.player,
            x: this.moon.x,
            y: this.moon.y,
            angle: 360, // One full rotation
            duration: 3000,
            ease: 'Sine.easeIn',
            onComplete: () => {
                trailEmitter.stop();
                this.player.setVisible(false);
                this.createDollarExplosion();
            }
        });
    }

    createDollarExplosion() {
        // Create dollar particles using the 'dollar' image
        const dollarParticles = this.add.particles('dollar');
        
        // Initial burst of dollars
        dollarParticles.createEmitter({
            x: this.moon.x,
            y: this.moon.y,
            speed: { min: 200, max: 400 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.2, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 2000,
            quantity: 30
        });

        // Continuous stream of dollars
        const streamEmitter = dollarParticles.createEmitter({
            x: this.moon.x,
            y: this.moon.y,
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.15, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 1500,
            frequency: 50
        });

        // Add a flash effect
        this.cameras.main.flash(500, 255, 255, 255);

        // Clean up and show final tally
        this.time.delayedCall(3000, () => {
            streamEmitter.stop();
            this.time.delayedCall(1500, () => {
                dollarParticles.destroy();
                this.showFinalTally();
            });
        });
    }

    stopAllSpawning() {
        // Clear all spawn timers
        if (this.candleTimer) this.candleTimer.remove();
        if (this.meteorChunkTimer) this.meteorChunkTimer.remove();
        if (this.powerUpTimer) this.powerUpTimer.remove();
        
        // Stop power-up spawning
        if (this.powerUps) {
            if (typeof this.powerUps.stopSpawning === 'function') {
                this.powerUps.stopSpawning();
            }
            // Clear existing power-ups
            if (this.powerUps.group) {
                this.powerUps.group.clear(true, true);
            }
        }
        
        // Clear any existing objects
        if (this.candles) this.candles.clear(true, true);
        if (this.meteors) this.meteors.clear(true, true);
        
        console.log('All spawning stopped at 7 seconds remaining');
    }

    // Add new method for dramatic speed ramping
    updateDramaticSpeed() {
        if (this.gameTime <= GAME_SETTINGS.FINAL_EPIC_START) {
            // Calculate progress (7 seconds to 0)
            const progress = this.gameTime / GAME_SETTINGS.FINAL_EPIC_START;
            
            // Smoother bezier curve for background speed
            const speedMultiplier = this.bezierCurve(
                1.0,    // Start at normal speed
                1.2,    // First control point - gentle acceleration
                1.5,    // Second control point - peak speed
                2.0,    // End slightly faster for dramatic finish
                progress
            );
            
            // Apply speed multiplier to background
            this.currentBackgroundSpeed = this.baseBackgroundSpeed * speedMultiplier;
            
            // Start spinning animation at 6 seconds
            if (this.gameTime <= GAME_SETTINGS.SPIN_START_TIME && !this.spinStarted) {
                this.spinStarted = true;
                this.startSpinningAnimation();
            }
            
            // Final impact sequence
            if (this.gameTime <= GAME_SETTINGS.FINAL_IMPACT_TIME && !this.impactStarted) {
                this.impactStarted = true;
                this.startFinalImpact();
            }
        }
    }

    startSpinningAnimation() {
        // Add gentle spin to player
        this.tweens.add({
            targets: this.player,
            angle: '+=360', // One full rotation
            duration: 2000,
            repeat: 2,      // Repeat twice
            ease: 'Sine.easeInOut'
        });
        
        // Add particle trail to player
        const particles = this.add.particles('particle');
        const emitter = particles.createEmitter({
            follow: this.player,
            scale: { start: 0.1, end: 0 },
            alpha: { start: 0.6, end: 0 },
            speed: 100,
            lifespan: 1000,
            blendMode: 'ADD',
            tint: 0x00ffff
        });
        
        // Store emitter for cleanup
        this.playerTrailEmitter = emitter;
    }

    startFinalImpact() {
        // Final approach to moon
        this.tweens.add({
            targets: this.player,
            x: this.moon.x,
            y: this.moon.y,
            angle: '+=720', // Two more rotations
            scale: 0.5,
            duration: 1000,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                // Hide player and show impact effects
                this.player.setVisible(false);
                this.createImpactEffects();
                
                // Clean up particle trail - Modified this part
                if (this.playerTrailEmitter) {
                    this.playerTrailEmitter.stop();
                    // Check if the emitter is part of a particle manager
                    if (this.playerTrailEmitter.manager) {
                        this.playerTrailEmitter.manager.destroy();
                    } else {
                        // If it's just the emitter, remove it from the scene
                        this.playerTrailEmitter.remove();
                    }
                    this.playerTrailEmitter = null;
                }
            }
        });
    }

    createImpactEffects() {
        // Create dollar explosion
        const moonParticles = this.add.particles('dollar');
        const emitter = moonParticles.createEmitter({
            x: this.moon.x,
            y: this.moon.y,
            speed: { min: 200, max: 400 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.2, end: 0 },
            blendMode: 'ADD',
            lifespan: 2000,
            quantity: 20,
            tint: [0xFFD700, 0xFFFFFF]
        });
        
        // Camera effects
        this.cameras.main.flash(500, 255, 255, 255);
        this.cameras.main.shake(500, 0.02);
        
        // Clean up after effects
        this.time.delayedCall(2100, () => {
            moonParticles.destroy();
            this.showFinalTally();
        });
    }

    // Bezier curve helper method
    bezierCurve(p0, p1, p2, p3, t) {
        const oneMinusT = 1 - t;
        return Math.pow(oneMinusT, 3) * p0 +
               3 * Math.pow(oneMinusT, 2) * t * p1 +
               3 * oneMinusT * Math.pow(t, 2) * p2 +
               Math.pow(t, 3) * p3;
    }

    // Remove star speed updates from updateStarTrails
    updateStarTrails(speedMultiplier) {
        // Remove this method if not needed, or keep it empty if referenced elsewhere
    }

    // Reduce moon position logging
    updateMoonPosition() {
        // ... existing code ...
        
        // Only log significant moon position changes
        if (this.previousMoonPosition !== this.moonPosition) {
            console.log(`Moon position updated to: ${this.moonPosition}`);
            this.previousMoonPosition = this.moonPosition;
        }
    }

    // Throttle data point logging
    addDataPoint(value) {
        // Only log if value changed significantly (>1000)
        if (Math.abs(value - this.lastLoggedValue) > 1000) {
            console.log(`Adding data point: ${value}`);
            this.lastLoggedValue = value;
        }
        // ... rest of existing code ...
    }

    // Improve candle spawn logging
    spawnCandle() {
        // ... existing code ...
        
        // Add more useful debug info
        console.log(`Spawned ${color} candle. Speed: ${speed.toFixed(2)}, 
                     Difficulty: ${difficulty.toFixed(2)}, 
                     Total Active: ${this.activeCandles.length}`);
    }

    showFinalChart() {
        // Process score history into clean data points
        const startTime = this.scoreHistory[0].timestamp;
        const processedData = this.scoreHistory.map(point => ({
            x: (point.timestamp - startTime) / 1000, // Convert to seconds from start
            y: point.score
        }));

        // Create final sharing chart with processed data
        const chartConfig = {
            type: 'line',
            data: {
                datasets: [{
                    data: processedData,
                    borderColor: '#FFD700',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0 // Hide individual points for smoother line
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time (seconds)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Score'
                        }
                    }
                }
            }
        };

        // Create and display the chart
        // ... chart creation code ...
    }

    // Add these methods to your MainGame class (inside the class definition)
    drawCryptoChart(ctx, x, y, width, height) {
        // Prepare data
        const data = this.prepareChartData();
        
        // Style definitions
        const styles = {
            line: {
                color: '#00ff00',
                width: 3,
                alpha: 0.8
            },
            gradient: {
                top: 'rgba(0, 255, 0, 0.2)',
                bottom: 'rgba(0, 255, 0, 0)'
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                spacing: 50
            }
        };

        // Draw grid
        this.drawChartGrid(ctx, x, y, width, height, styles.grid);

        // Create gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, styles.gradient.top);
        gradient.addColorStop(1, styles.gradient.bottom);

        // Draw area
        ctx.beginPath();
        ctx.moveTo(x, y + height);
        
        // Draw line and fill area
        data.forEach((point, i) => {
            const px = x + (i / (data.length - 1)) * width;
            const py = y + height - (point.normalized * height);
            
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                // Add some controlled randomness for a more organic look
                const cp1x = px - (width / data.length) * 0.5;
                const cp2x = px - (width / data.length) * 0.5;
                const randomY = Math.random() * 5 - 2.5;
                ctx.bezierCurveTo(
                    cp1x, data[i-1].normalized * height + randomY,
                    cp2x, py + randomY,
                    px, py
                );
            }
        });

        // Complete the area fill
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw the line on top
        ctx.strokeStyle = styles.line.color;
        ctx.lineWidth = styles.line.width;
        ctx.globalAlpha = styles.line.alpha;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    prepareChartData() {
        // Ensure we have some data
        if (!this.scoreHistory || this.scoreHistory.length < 2) {
            return this.generateFakeChartData();
        }

        // Normalize the data
        const minScore = Math.min(...this.scoreHistory.map(p => p.score));
        const maxScore = Math.max(...this.scoreHistory.map(p => p.score));
        const scoreRange = maxScore - minScore;

        // Smooth and normalize the data
        return this.scoreHistory.map(point => ({
            score: point.score,
            normalized: (point.score - minScore) / scoreRange
        }));
    }

    generateFakeChartData() {
        const points = 100;
        const data = [];
        let currentValue = 0.5;
        let trend = 0; // Current trend direction
        let trendStrength = 0; // How strong the current trend is
        
        for (let i = 0; i < points; i++) {
            // Randomly change trend
            if (Math.random() < 0.15) { // 15% chance to change trend
                trend = (Math.random() - 0.5) * 2;
                trendStrength = Math.random() * 0.15; // Random trend strength
            }
            
            // Add micro-movements (noise)
            const noise = (Math.random() - 0.5) * 0.05;
            
            // Add sudden spikes occasionally
            const spike = (Math.random() < 0.08) ? (Math.random() - 0.5) * 0.2 : 0;
            
            // Combine trend, noise, and spikes
            currentValue += trend * trendStrength + noise + spike;
            
            // Add some mean reversion
            currentValue += (0.5 - currentValue) * 0.05;
            
            // Keep within bounds
            currentValue = Math.max(0.1, Math.min(0.9, currentValue));
            
            data.push({
                score: currentValue * this.score,
                normalized: currentValue
            });
        }

        return data;
    }

    drawChartGrid(ctx, x, y, width, height, gridStyle) {
        ctx.strokeStyle = gridStyle.color;
        ctx.lineWidth = 1;

        // Draw vertical grid lines
        for (let i = 0; i <= width; i += gridStyle.spacing) {
            ctx.beginPath();
            ctx.moveTo(x + i, y);
            ctx.lineTo(x + i, y + height);
            ctx.stroke();
        }

        // Draw horizontal grid lines
        for (let i = 0; i <= height; i += gridStyle.spacing) {
            ctx.beginPath();
            ctx.moveTo(x, y + i);
            ctx.lineTo(x + width, y + i);
            ctx.stroke();
        }
    }

    // Add these methods to your MainGame class (inside the class definition)
    checkEndConditions() {
        // Check if game should end
        if (this.gameTime <= 0 || this.hasReachedMoon) {
            this.startEpicEnding();
            console.log("Starting epic ending sequence");
        }
    }

    startEpicEnding() {
        // Disable all gameplay mechanics
        this.controlsEnabled = false;
        this.powerUps.stopSpawning();
        this.stopAllSpawning();

        // Start the sequence
        this.tweens.add({
            targets: this.player,
            x: this.game.config.width / 2,
            y: this.game.config.height / 2,
            duration: 2000,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.flyToMoon();
                console.log("Flying to moon");
            }
        });
    }

    flyToMoon() {
        // Add particle trail
        const particles = this.add.particles('particle');
        const emitter = particles.createEmitter({
            follow: this.player,
            scale: { start: 0.1, end: 0 },
            alpha: { start: 0.6, end: 0 },
            speed: 100,
            lifespan: 1000,
            blendMode: 'ADD',
            tint: 0x00ffff
        });

        // Fly to moon with rotation
        this.tweens.add({
            targets: this.player,
            x: this.moon.x,
            y: this.moon.y,
            angle: 360,
            duration: 3000,
            ease: 'Sine.easeIn',
            onComplete: () => {
                emitter.stop();
                this.player.setVisible(false);
                this.createDollarExplosion();
                console.log("Creating dollar explosion");
            }
        });
    }

    createDollarExplosion() {
        const dollarParticles = this.add.particles('dollar');
        
        // Initial burst
        dollarParticles.createEmitter({
            x: this.moon.x,
            y: this.moon.y,
            speed: { min: 200, max: 400 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.2, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 2000,
            quantity: 30
        });

        // Camera effects
        this.cameras.main.flash(500, 255, 255, 255);
        this.cameras.main.shake(500, 0.02);

        // Show final score after effects
        this.time.delayedCall(3000, () => {
            dollarParticles.destroy();
            this.showFinalScore();
            console.log("Showing final score");
        });
    }

    showFinalScore() {
        // Stop any ongoing effects
        this.cameras.main.resetFX();
        
        // Create final score display
        const centerX = this.game.config.width / 2;
        const centerY = this.game.config.height / 2;
        
        // Final score text with glow effect
        const finalScoreText = this.add.text(centerX, centerY - 50, 
            'FINAL MARKET CAP', {
            fontFamily: 'VT323',
            fontSize: '48px',
            fill: '#FFD700',
            align: 'center'
        }).setOrigin(0.5);
        
        const scoreAmount = this.add.text(centerX, centerY + 50, 
            '$' + this.score.toLocaleString(), {
            fontFamily: 'VT323',
            fontSize: '64px',
            fill: '#FFD700',
            align: 'center'
        }).setOrigin(0.5);
        
        // Add glow effect
        this.tweens.add({
            targets: [finalScoreText, scoreAmount],
            alpha: 0.7,
            yoyo: true,
            repeat: -1,
            duration: 1000
        });
        
        // Add "Enter Name" button after a short delay
        this.time.delayedCall(2000, () => {
            this.showNameInput(centerY + 150, this.score);
        });
    }

    // Modify the checkEndConditions to handle timing better
    checkEndConditions() {
        if (this.gameEnded) return; // Prevent multiple triggers
        
        if (this.gameTime <= 0 || this.hasReachedMoon) {
            console.log("End conditions met, starting sequence");
            this.gameEnded = true;
            this.startEpicEnding();
        }
    }

    // Modify startEpicEnding to handle VHS effects better
    startEpicEnding() {
        // Immediately stop gameplay
        this.controlsEnabled = false;
        if (this.powerUps) {
            this.powerUps.stopSpawning();
        }
        
        console.log("Starting epic ending");

        // Start VHS effect immediately
        this.addVHSEffect();
        
        // Center the player
        this.tweens.add({
            targets: this.player,
            x: this.game.config.width / 2,
            y: this.game.config.height / 2,
            duration: 2000,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.flyToMoon();
            }
        });
    }

    // Add or modify VHS effect
    addVHSEffect() {
        // Create scanline effect
        const scanlineGraphics = this.add.graphics();
        const scanlineHeight = 2;
        const scanlineSpacing = 4;
        
        // Set depth to ensure it's visible
        scanlineGraphics.setDepth(DEPTHS.UI - 1);
        
        // Create scanline animation
        this.time.addEvent({
            delay: 50,
            callback: () => {
                scanlineGraphics.clear();
                scanlineGraphics.lineStyle(scanlineHeight, 0xFFFFFF, 0.2);
                
                for (let y = 0; y < this.game.config.height; y += scanlineSpacing) {
                    scanlineGraphics.beginPath();
                    scanlineGraphics.moveTo(0, y);
                    scanlineGraphics.lineTo(this.game.config.width, y);
                    scanlineGraphics.strokePath();
                }
            },
            loop: true
        });

        // Add occasional glitch effect
        this.time.addEvent({
            delay: 500,
            callback: () => {
                if (Math.random() < 0.3) { // 30% chance of glitch
                    this.cameras.main.shake(100, 0.01);
                    this.cameras.main.setAlpha(0.8);
                    this.time.delayedCall(100, () => {
                        this.cameras.main.setAlpha(1);
                    });
                }
            },
            loop: true
        });
    }
}

function createGame() {
    const game = new Phaser.Game(GAME_CONFIG);
}

WebFont.load({
    google: {
        families: ['VT323']
    },
    active: function() {
        console.log('VT323 font loaded successfully');
        setTimeout(createGame, 200);
    },
    inactive: function() {
        console.warn('VT323 font failed to load');
        createGame();
    }
});
