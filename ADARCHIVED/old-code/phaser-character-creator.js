// =============================================================================
// PHASER.JS + SPINE CHARACTER CREATOR
// AuthenticaDetector - Veilbreakers Avatar System
// =============================================================================
// Uses Phaser 3 with Spine plugin for bone-rigged character animations
// Export from Blender using Spine format or directly from Rive
// =============================================================================

(function() {
    'use strict';

    // =========================================================================
    // CONFIGURATION
    // =========================================================================
    const CONFIG = {
        width: 400,
        height: 500,
        backgroundColor: 0x0f172a,
        parentElement: 'phaserCharacterCanvas',
        pixelArt: false,
        antialias: true
    };

    // Body part layer ordering (back to front)
    const LAYER_ORDER = [
        'shadow',
        'back',      // Wings, cloaks, backpacks
        'legs',      // Pants, boots
        'torso',     // Armor, shirts
        'leftArm',   // Left arm + accessories
        'rightArm',  // Right arm + weapon
        'head',      // Face, hair base
        'hat',       // Hats, helmets
        'glasses',   // Eyewear
        'weapon',    // Main weapon (held in right hand)
        'pet',       // Companion floating nearby
        'effect'     // Particle effects, auras
    ];

    // Animation states
    const ANIMATIONS = {
        idle: { name: 'idle', loop: true, speed: 1 },
        walk: { name: 'walk', loop: true, speed: 1 },
        attack: { name: 'attack', loop: false, speed: 1.2 },
        victory: { name: 'victory', loop: false, speed: 1 },
        hurt: { name: 'hurt', loop: false, speed: 1 },
        special: { name: 'special', loop: false, speed: 0.8 }
    };

    // Color tint presets
    const COLOR_PRESETS = {
        skin: ['#fef3c7', '#fcd5a7', '#d4a574', '#a67c52', '#6b4423'],
        hair: ['#1a1a1a', '#4a3728', '#8b4513', '#ffd700', '#ff6b6b', '#9b59b6', '#3498db', '#1abc9c'],
        eyes: ['#3498db', '#2ecc71', '#9b59b6', '#e74c3c', '#f39c12', '#1a1a1a', '#ecf0f1'],
        clothes: ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c', '#34495e', '#ecf0f1']
    };

    // =========================================================================
    // CHARACTER CREATOR CLASS
    // =========================================================================
    class PhaserCharacterCreator {
        constructor() {
            this.game = null;
            this.scene = null;
            this.character = null;
            this.spineAvailable = false;
            this.equipped = {};
            this.colors = {
                skin: '#fef3c7',
                hair: '#1a1a1a',
                eyes: '#3498db',
                clothes: '#3498db'
            };
            this.currentAnimation = 'idle';
            this.extraLimbs = { arms: 0, legs: 0 };
            this.initialized = false;
        }

        // Initialize the Phaser game instance
        init(parentElementId) {
            if (this.initialized) {
                console.log('[PhaserCC] Already initialized');
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                const parent = document.getElementById(parentElementId || CONFIG.parentElement);
                if (!parent) {
                    console.warn('[PhaserCC] Parent element not found, creating one');
                    // Create container if it doesn't exist
                    const container = document.createElement('div');
                    container.id = CONFIG.parentElement;
                    container.style.cssText = 'width: 100%; height: 400px; border-radius: 16px; overflow: hidden;';
                    document.querySelector('.character-stage')?.prepend(container);
                }

                // Check if Spine plugin is available
                this.spineAvailable = typeof SpinePlugin !== 'undefined';

                const gameConfig = {
                    type: Phaser.AUTO,
                    width: CONFIG.width,
                    height: CONFIG.height,
                    parent: parentElementId || CONFIG.parentElement,
                    backgroundColor: CONFIG.backgroundColor,
                    transparent: true,
                    antialias: CONFIG.antialias,
                    pixelArt: CONFIG.pixelArt,
                    scale: {
                        mode: Phaser.Scale.FIT,
                        autoCenter: Phaser.Scale.CENTER_BOTH
                    },
                    scene: {
                        preload: this.preload.bind(this),
                        create: this.create.bind(this),
                        update: this.update.bind(this)
                    }
                };

                // Add Spine plugin if available
                if (this.spineAvailable) {
                    gameConfig.plugins = {
                        scene: [
                            { key: 'SpinePlugin', plugin: SpinePlugin, mapping: 'spine' }
                        ]
                    };
                }

                try {
                    this.game = new Phaser.Game(gameConfig);
                    this.game.events.once('ready', () => {
                        this.initialized = true;
                        console.log('[PhaserCC] Phaser game initialized');
                        resolve();
                    });
                } catch (err) {
                    console.error('[PhaserCC] Failed to initialize:', err);
                    reject(err);
                }
            });
        }

        // Phaser preload phase
        preload() {
            this.scene = this.game.scene.scenes[0];

            // Load base character assets
            this.loadBaseAssets();

            // Load equipped items
            this.loadEquippedItems();

            // Load effects
            this.loadEffects();
        }

        loadBaseAssets() {
            const scene = this.scene;
            const basePath = 'assets/character/';

            // Load character sprite sheets (fallback if no Spine)
            scene.load.image('char_base', basePath + 'base.png');
            scene.load.image('char_shadow', basePath + 'shadow.png');

            // Load body part spritesheets
            LAYER_ORDER.forEach(part => {
                scene.load.image(`part_${part}_default`, `${basePath}parts/${part}_default.png`);
            });

            // Load Spine skeleton if available
            if (this.spineAvailable) {
                scene.load.spine('character',
                    basePath + 'spine/character.json',
                    basePath + 'spine/character.atlas'
                );
            }
        }

        loadEquippedItems() {
            const scene = this.scene;
            const itemsPath = 'assets/character/items/';

            // Load each equipped item
            Object.entries(this.equipped).forEach(([slot, item]) => {
                if (item && item.sprite) {
                    scene.load.image(`item_${slot}_${item.id}`, itemsPath + item.sprite);
                }
            });
        }

        loadEffects() {
            const scene = this.scene;
            const fxPath = 'assets/game/fx/';

            // Load particle textures
            scene.load.image('particle_sparkle', fxPath + 'sparkle.png');
            scene.load.image('particle_glow', fxPath + 'glow.png');
            scene.load.image('particle_magic', fxPath + 'magic.png');
        }

        // Phaser create phase
        create() {
            const scene = this.scene;
            this.setupCharacter(scene);
            this.setupAnimations(scene);
            this.setupInteractivity(scene);
            this.playAnimation('idle');

            // Emit ready event
            window.dispatchEvent(new CustomEvent('phaserCharacterReady'));
        }

        setupCharacter(scene) {
            // Create character container
            this.character = scene.add.container(CONFIG.width / 2, CONFIG.height * 0.75);

            // Add shadow
            const shadow = scene.add.ellipse(0, 40, 80, 20, 0x000000, 0.3);
            this.character.add(shadow);
            this.parts = { shadow };

            if (this.spineAvailable && scene.spine) {
                // Use Spine skeleton
                this.setupSpineCharacter(scene);
            } else {
                // Fallback to layered sprites
                this.setupLayeredCharacter(scene);
            }
        }

        setupSpineCharacter(scene) {
            try {
                const spine = scene.add.spine(0, 0, 'character', 'idle', true);
                spine.setScale(0.5);
                this.character.add(spine);
                this.spineCharacter = spine;
            } catch (err) {
                console.warn('[PhaserCC] Spine setup failed, using fallback:', err);
                this.setupLayeredCharacter(scene);
            }
        }

        setupLayeredCharacter(scene) {
            // Create layered sprite character
            const partSprites = {};

            LAYER_ORDER.forEach((part, index) => {
                if (part === 'shadow') return; // Already added

                const y = this.getPartYOffset(part);
                const sprite = scene.add.sprite(0, y, `part_${part}_default`);
                sprite.setOrigin(0.5, 1);
                sprite.setDepth(index);

                // Apply color tint if applicable
                this.applyPartColor(sprite, part);

                this.character.add(sprite);
                partSprites[part] = sprite;
            });

            this.parts = { ...this.parts, ...partSprites };
        }

        getPartYOffset(part) {
            const offsets = {
                back: -100,
                legs: 0,
                torso: -40,
                leftArm: -60,
                rightArm: -60,
                head: -100,
                hat: -140,
                glasses: -110,
                weapon: -50,
                pet: 20,
                effect: -80
            };
            return offsets[part] || 0;
        }

        applyPartColor(sprite, part) {
            const colorMap = {
                head: 'skin',
                leftArm: 'skin',
                rightArm: 'skin',
                legs: 'clothes',
                torso: 'clothes'
            };

            const colorType = colorMap[part];
            if (colorType && this.colors[colorType]) {
                const color = Phaser.Display.Color.HexStringToColor(this.colors[colorType]);
                sprite.setTint(color.color);
            }
        }

        setupAnimations(scene) {
            // If using Spine, animations are handled by the skeleton
            if (this.spineCharacter) return;

            // Create tweens for layered sprite animation
            this.createIdleAnimation(scene);
            this.createWalkAnimation(scene);
            this.createAttackAnimation(scene);
        }

        createIdleAnimation(scene) {
            // Subtle breathing/bobbing animation
            this.idleTween = scene.tweens.add({
                targets: this.character,
                y: this.character.y - 5,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Arm sway
            if (this.parts.leftArm) {
                scene.tweens.add({
                    targets: this.parts.leftArm,
                    rotation: Phaser.Math.DegToRad(-3),
                    duration: 2000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        }

        createWalkAnimation(scene) {
            // Store walk tween for later activation
            this.walkTween = null;
        }

        createAttackAnimation(scene) {
            // Store attack tween for later activation
            this.attackTween = null;
        }

        setupInteractivity(scene) {
            // Make character draggable for inspection
            this.character.setInteractive(
                new Phaser.Geom.Rectangle(-100, -200, 200, 250),
                Phaser.Geom.Rectangle.Contains
            );

            scene.input.setDraggable(this.character);

            scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
                // Rotate character slightly based on drag
                const rotation = (dragX - CONFIG.width / 2) * 0.001;
                gameObject.setRotation(rotation);
            });

            scene.input.on('dragend', (pointer, gameObject) => {
                // Reset rotation
                scene.tweens.add({
                    targets: gameObject,
                    rotation: 0,
                    x: CONFIG.width / 2,
                    duration: 300,
                    ease: 'Back.easeOut'
                });
            });

            // Click to cycle animations
            this.character.on('pointerdown', () => {
                this.cycleAnimation();
            });
        }

        // Phaser update loop
        update(time, delta) {
            // Update particles and effects
            this.updateEffects(time, delta);
        }

        updateEffects(time, delta) {
            // Aura rotation, particle updates, etc.
        }

        // =====================================================================
        // PUBLIC API
        // =====================================================================

        // Equip an item to a body part
        equipItem(slot, item) {
            if (!LAYER_ORDER.includes(slot)) {
                console.warn(`[PhaserCC] Invalid slot: ${slot}`);
                return;
            }

            this.equipped[slot] = item;

            if (this.scene && this.parts[slot]) {
                // Update the sprite texture
                const textureKey = item ? `item_${slot}_${item.id}` : `part_${slot}_default`;

                if (this.scene.textures.exists(textureKey)) {
                    this.parts[slot].setTexture(textureKey);
                } else if (item && item.icon) {
                    // Use icon as fallback (emoji or text)
                    this.createIconSprite(slot, item.icon);
                }
            }

            // Emit event
            window.dispatchEvent(new CustomEvent('characterEquipChanged', {
                detail: { slot, item }
            }));
        }

        createIconSprite(slot, icon) {
            if (!this.scene || !this.parts[slot]) return;

            const sprite = this.parts[slot];
            const text = this.scene.add.text(0, 0, icon, {
                fontSize: '48px',
                fontFamily: 'system-ui'
            });
            text.setOrigin(0.5);

            // Replace sprite with text
            const index = this.character.getIndex(sprite);
            this.character.remove(sprite);
            text.setDepth(index);
            text.y = this.getPartYOffset(slot);
            this.character.add(text);
            this.parts[slot] = text;
        }

        // Unequip an item
        unequipItem(slot) {
            this.equipItem(slot, null);
        }

        // Set character color
        setColor(type, hexColor) {
            if (!COLOR_PRESETS[type]) {
                console.warn(`[PhaserCC] Invalid color type: ${type}`);
                return;
            }

            this.colors[type] = hexColor;

            // Apply to relevant parts
            const colorMap = {
                skin: ['head', 'leftArm', 'rightArm'],
                hair: ['head'], // Hair layer
                eyes: ['head'], // Eyes layer
                clothes: ['torso', 'legs']
            };

            const affectedParts = colorMap[type] || [];
            affectedParts.forEach(part => {
                if (this.parts[part]) {
                    const color = Phaser.Display.Color.HexStringToColor(hexColor);
                    this.parts[part].setTint(color.color);
                }
            });

            // Update Spine skeleton tints if using Spine
            if (this.spineCharacter) {
                this.updateSpineColors();
            }
        }

        updateSpineColors() {
            if (!this.spineCharacter) return;

            // Spine color tinting through slot attachments
            // This requires the skeleton to have properly named slots
            const skeleton = this.spineCharacter.skeleton;

            Object.entries(this.colors).forEach(([type, hexColor]) => {
                const color = Phaser.Display.Color.HexStringToColor(hexColor);
                const slots = this.getSpineSlotsForColor(type);

                slots.forEach(slotName => {
                    const slot = skeleton.findSlot(slotName);
                    if (slot) {
                        slot.color.r = color.redGL;
                        slot.color.g = color.greenGL;
                        slot.color.b = color.blueGL;
                    }
                });
            });
        }

        getSpineSlotsForColor(type) {
            const mapping = {
                skin: ['body', 'head', 'leftArm', 'rightArm', 'leftHand', 'rightHand'],
                hair: ['hair', 'hairBack'],
                eyes: ['leftEye', 'rightEye'],
                clothes: ['torso', 'legs', 'feet']
            };
            return mapping[type] || [];
        }

        // Play animation
        playAnimation(animName) {
            if (!ANIMATIONS[animName]) {
                console.warn(`[PhaserCC] Invalid animation: ${animName}`);
                return;
            }

            this.currentAnimation = animName;
            const anim = ANIMATIONS[animName];

            if (this.spineCharacter) {
                // Play Spine animation
                this.spineCharacter.play(anim.name, anim.loop, true);
                this.spineCharacter.timeScale = anim.speed;
            } else {
                // Stop current tweens and play appropriate one
                this.stopAllAnimations();
                this.startLayeredAnimation(animName);
            }
        }

        stopAllAnimations() {
            if (this.idleTween) this.idleTween.pause();
            if (this.walkTween) this.walkTween.stop();
            if (this.attackTween) this.attackTween.stop();
        }

        startLayeredAnimation(animName) {
            switch(animName) {
                case 'idle':
                    if (this.idleTween) this.idleTween.resume();
                    break;
                case 'walk':
                    this.createWalkTween();
                    break;
                case 'attack':
                    this.createAttackTween();
                    break;
                case 'victory':
                    this.createVictoryTween();
                    break;
            }
        }

        createWalkTween() {
            if (!this.scene) return;

            this.walkTween = this.scene.tweens.add({
                targets: this.character,
                y: this.character.y - 10,
                duration: 300,
                yoyo: true,
                repeat: -1,
                ease: 'Quad.easeInOut'
            });

            // Leg movement
            if (this.parts.legs) {
                this.scene.tweens.add({
                    targets: this.parts.legs,
                    scaleX: 1.05,
                    duration: 300,
                    yoyo: true,
                    repeat: -1
                });
            }
        }

        createAttackTween() {
            if (!this.scene) return;

            // Quick lunge forward
            this.attackTween = this.scene.tweens.add({
                targets: this.character,
                x: this.character.x + 50,
                duration: 200,
                yoyo: true,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    this.playAnimation('idle');
                }
            });

            // Weapon swing
            if (this.parts.weapon) {
                this.scene.tweens.add({
                    targets: this.parts.weapon,
                    rotation: Phaser.Math.DegToRad(-90),
                    duration: 150,
                    yoyo: true,
                    ease: 'Power2'
                });
            }
        }

        createVictoryTween() {
            if (!this.scene) return;

            // Jump up with arms raised
            this.scene.tweens.add({
                targets: this.character,
                y: this.character.y - 80,
                duration: 500,
                yoyo: true,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    this.playAnimation('idle');
                }
            });
        }

        cycleAnimation() {
            const anims = Object.keys(ANIMATIONS);
            const currentIndex = anims.indexOf(this.currentAnimation);
            const nextIndex = (currentIndex + 1) % anims.length;
            this.playAnimation(anims[nextIndex]);
        }

        // Add extra limbs (mutation)
        setExtraLimbs(type, count) {
            if (type !== 'arms' && type !== 'legs') return;

            count = Math.max(0, Math.min(2, count)); // Max 2 extra
            this.extraLimbs[type] = count;

            if (!this.scene) return;

            // Remove existing extra limbs
            this.clearExtraLimbs(type);

            // Add new extra limbs
            for (let i = 0; i < count; i++) {
                this.addExtraLimb(type, i);
            }
        }

        clearExtraLimbs(type) {
            const prefix = `extra_${type}_`;
            Object.keys(this.parts).forEach(key => {
                if (key.startsWith(prefix)) {
                    this.character.remove(this.parts[key]);
                    this.parts[key].destroy();
                    delete this.parts[key];
                }
            });
        }

        addExtraLimb(type, index) {
            if (!this.scene) return;

            const isArm = type === 'arms';
            const offset = (index + 1) * (isArm ? 20 : 15);
            const side = index % 2 === 0 ? -1 : 1;

            const sprite = this.scene.add.sprite(
                side * offset,
                isArm ? -60 : 0,
                `part_${isArm ? 'leftArm' : 'legs'}_default`
            );
            sprite.setOrigin(0.5, 1);
            sprite.setScale(0.8);
            sprite.setAlpha(0.9);

            // Apply mutation tint (slightly different color)
            sprite.setTint(0x9b59b6);

            this.character.add(sprite);
            this.parts[`extra_${type}_${index}`] = sprite;

            // Add subtle animation
            this.scene.tweens.add({
                targets: sprite,
                rotation: Phaser.Math.DegToRad(side * 5),
                duration: 1500 + index * 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        // Get character data for saving
        getCharacterData() {
            return {
                equipped: { ...this.equipped },
                colors: { ...this.colors },
                extraLimbs: { ...this.extraLimbs },
                currentAnimation: this.currentAnimation
            };
        }

        // Load character data
        loadCharacterData(data) {
            if (!data) return;

            // Load colors
            if (data.colors) {
                Object.entries(data.colors).forEach(([type, color]) => {
                    this.setColor(type, color);
                });
            }

            // Load equipment
            if (data.equipped) {
                Object.entries(data.equipped).forEach(([slot, item]) => {
                    this.equipItem(slot, item);
                });
            }

            // Load mutations
            if (data.extraLimbs) {
                this.setExtraLimbs('arms', data.extraLimbs.arms || 0);
                this.setExtraLimbs('legs', data.extraLimbs.legs || 0);
            }
        }

        // Resize handler
        resize(width, height) {
            if (this.game) {
                this.game.scale.resize(width, height);
            }
        }

        // Cleanup
        destroy() {
            if (this.game) {
                this.game.destroy(true);
                this.game = null;
                this.scene = null;
                this.character = null;
                this.initialized = false;
            }
        }
    }

    // =========================================================================
    // BLENDER EXPORT HELPER
    // =========================================================================
    // Instructions for exporting bone-rigged characters from Blender to Spine format

    const BlenderExportGuide = {
        requirements: [
            'Blender 3.x or higher',
            'Spine Export Add-on OR DragonBones Export Add-on',
            'Character rigged with Armature'
        ],

        steps: [
            '1. Create character in Blender with separate meshes for each body part',
            '2. Set up Armature with bones for: spine, head, arms, legs',
            '3. Weight paint each mesh to appropriate bones',
            '4. Create animation actions: idle, walk, attack, victory, hurt',
            '5. Export using Spine Export add-on to JSON + Atlas format',
            '6. Place exported files in assets/character/spine/',
            '7. Files needed: character.json (skeleton), character.atlas, character.png (spritesheet)'
        ],

        boneNaming: {
            root: 'root',
            spine: ['spine1', 'spine2', 'chest'],
            head: ['neck', 'head'],
            leftArm: ['leftShoulder', 'leftUpperArm', 'leftForearm', 'leftHand'],
            rightArm: ['rightShoulder', 'rightUpperArm', 'rightForearm', 'rightHand'],
            leftLeg: ['leftHip', 'leftThigh', 'leftCalf', 'leftFoot'],
            rightLeg: ['rightHip', 'rightThigh', 'rightCalf', 'rightFoot']
        },

        animationRequirements: {
            idle: '2-4 second loop, subtle breathing motion',
            walk: '1 second loop, 8-12 frame cycle',
            attack: '0.5-1 second, strike motion with anticipation/follow-through',
            victory: '2-3 seconds, celebratory motion',
            hurt: '0.3-0.5 seconds, recoil motion'
        }
    };

    // =========================================================================
    // COLOR PICKER COMPONENT
    // =========================================================================
    class ColorPickerUI {
        constructor(container, type, onChange) {
            this.container = container;
            this.type = type;
            this.onChange = onChange;
            this.render();
        }

        render() {
            const presets = COLOR_PRESETS[this.type] || [];

            const html = `
                <div class="color-picker-row">
                    <label class="color-label">${this.type.charAt(0).toUpperCase() + this.type.slice(1)}</label>
                    <div class="color-swatches">
                        ${presets.map(color => `
                            <button class="color-swatch"
                                    style="background-color: ${color}"
                                    data-color="${color}"
                                    title="${color}">
                            </button>
                        `).join('')}
                        <input type="color" class="color-custom" value="#ffffff" title="Custom color">
                    </div>
                </div>
            `;

            this.container.innerHTML = html;
            this.bindEvents();
        }

        bindEvents() {
            // Preset swatches
            this.container.querySelectorAll('.color-swatch').forEach(swatch => {
                swatch.addEventListener('click', (e) => {
                    const color = e.target.dataset.color;
                    this.selectColor(color);
                });
            });

            // Custom color picker
            const customPicker = this.container.querySelector('.color-custom');
            if (customPicker) {
                customPicker.addEventListener('input', (e) => {
                    this.selectColor(e.target.value);
                });
            }
        }

        selectColor(color) {
            // Update active state
            this.container.querySelectorAll('.color-swatch').forEach(s => {
                s.classList.toggle('active', s.dataset.color === color);
            });

            // Callback
            if (this.onChange) {
                this.onChange(this.type, color);
            }
        }
    }

    // =========================================================================
    // GLOBAL INSTANCE & EXPORTS
    // =========================================================================
    const characterCreator = new PhaserCharacterCreator();

    // Expose to window for global access
    window.PhaserCharacterCreator = PhaserCharacterCreator;
    window.characterCreator = characterCreator;
    window.ColorPickerUI = ColorPickerUI;
    window.BlenderExportGuide = BlenderExportGuide;
    window.CHARACTER_COLOR_PRESETS = COLOR_PRESETS;
    window.CHARACTER_LAYER_ORDER = LAYER_ORDER;
    window.CHARACTER_ANIMATIONS = ANIMATIONS;

    // =========================================================================
    // INTEGRATION WITH EXISTING AVATAR SYSTEM
    // =========================================================================

    // Listen for avatar view open
    window.addEventListener('avatarViewOpened', () => {
        if (!characterCreator.initialized) {
            characterCreator.init('phaserCharacterCanvas').then(() => {
                // Load saved character data
                const savedData = localStorage.getItem('characterCreatorData');
                if (savedData) {
                    characterCreator.loadCharacterData(JSON.parse(savedData));
                }
            });
        }
    });

    // Save character data on changes
    window.addEventListener('characterEquipChanged', () => {
        const data = characterCreator.getCharacterData();
        localStorage.setItem('characterCreatorData', JSON.stringify(data));
    });

    // Handle color changes
    window.setCharacterColor = function(type, color) {
        characterCreator.setColor(type, color);
        const data = characterCreator.getCharacterData();
        localStorage.setItem('characterCreatorData', JSON.stringify(data));
    };

    // Handle equipment changes
    window.equipCharacterItem = function(slot, item) {
        characterCreator.equipItem(slot, item);
    };

    // Handle animations
    window.playCharacterAnimation = function(animName) {
        characterCreator.playAnimation(animName);
    };

    // Handle mutations
    window.setCharacterMutations = function(type, count) {
        characterCreator.setExtraLimbs(type, count);
        const data = characterCreator.getCharacterData();
        localStorage.setItem('characterCreatorData', JSON.stringify(data));
    };

    console.log('[PhaserCC] Phaser Character Creator loaded');

})();
