//////////////////////////////////////////////
// ============ LOADING SCREEN ============ //
// Čakanie na načítanie DOM obsahu          //
// Skrytie loading screen s animáciou       //
//////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('load', function() {
        setTimeout(hideLoadingScreen, 1000); // Čaká 1 sekundu potom skryje
    });
    
    console.log('Hra načítaná.');
});

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

/**
 * Kontext hry: ak sa spustí zo sveta (superjozino.html?worldId=…&levelId=…),
 * slová pre rečové cvičenia sú z levelu (config/levels.js, gameType 'mario')
 * a výsledok sa uloží do postupu sveta. Bez parametrov = skúšobná hra.
 */
const SJ = (() => {
    const q = new URLSearchParams(location.search);
    const worldId = q.get('worldId') || q.get('world');
    const levelId = q.get('levelId') || q.get('level');
    let config = null;
    try {
        if (levelId && typeof getLevelConfig === 'function') config = getLevelConfig(levelId);
    } catch (e) { /* bez konfigurácie */ }
    const words = (config && config.words && config.words.length)
        ? config.words.slice()
        : ['auto', 'dom', 'strom', 'slnko', 'ruka', 'ryba', 'rak', 'lopta'];
    // zamiešať, aby diamanty nemali vždy rovnaké poradie slov
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
    let next = 0;
    const inWorld = !!(worldId && levelId && config);
    return {
        worldId,
        levelId,
        config,
        inWorld,
        /** číslo mapy v js/superjozino/levels.js */
        map: (config && config.gameConfig && config.gameConfig.sjLevel) || Number(q.get('map')) || 1,
        backUrl: inWorld ? 'worldsmenu.html' : 'urovne.html',
        /** slová postupne (každý diamant iné slovo) */
        nextWord() { return words[next++ % words.length]; },
    };
})();
window.SJ = SJ;

document.addEventListener('DOMContentLoaded', () => {
    const back = document.querySelector('.sj-topbar .back-button a');
    if (back) back.href = SJ.backUrl;
});

/**
 * ANIMATION MANAGER
 * Správa animácií postavy - načítavanie a prehrávanie frame-ov
 */
class AnimationManager {
    constructor() {
        // Cesta k sprite-om
        this.basePath = 'images/superjozino/assets/player/keyframes/yellow_hat/';
        
        // Definícia animácií a počtu frame-ov
        this.animations = {
            idle: { frames: 20, speed: 15 },      // 000-019, pomalšie
            walk: { frames: 8, speed: 10 },      // 000-007
            run: { frames: 8, speed: 6 },        // 000-007, rýchlejšie
            jump: { frames: 10, speed: 8 },      // 000-009
            falling: { frames: 10, speed: 8 },   // 000-009
            vertical_slide: { frames: 10, speed: 5 },   // šmýkanie po stene
            horizontal_slide: { frames: 10, speed: 5 }, // šmyk po ľade
            hurt: { frames: 5, speed: 6 },              // zásah
            die: { frames: 5, speed: 8 }                // pád do diery
        };
        
        // Načítané obrázky
        this.images = {};
        
        // Aktuálny stav animácie
        this.currentAnimation = 'idle';
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.direction = 'right'; // 'left', 'right', 'front'
        
        // Načítanie všetkých sprite-ov
        this.loadAllSprites();
        
    }
    
    /**
     * Načítanie všetkých sprite frame-ov
     */
    loadAllSprites() {
        console.log('🎨 Načítavam sprite-y postavy...');
        
        for (let animName in this.animations) {
            this.images[animName] = [];
            const frameCount = this.animations[animName].frames;
            
            for (let i = 0; i < frameCount; i++) {
                const img = new Image();
                // Formát názvu: __yellow_hat_idle_000.png
                const frameNumber = i.toString().padStart(3, '0');
                img.src = `${this.basePath}__yellow_hat_${animName}_${frameNumber}.png`;
                
                this.images[animName].push(img);
                
                // Log pre prvý frame každej animácie (pre debugging)
                if (i === 0) {
                    img.onload = () => {
                        console.log(`✅ Načítaná animácia: ${animName} (${frameCount} frame-ov)`);
                    };
                    img.onerror = () => {
                        console.error(`❌ Chyba pri načítaní: ${img.src}`);
                    };
                }
            }
        }
    }
    
    /**
     * Nastavenie animácie
     * @param {string} animationName - Názov animácie (idle, walk, run, jump, falling)
     */
    setAnimation(animationName) {
        if (this.currentAnimation !== animationName) {
            this.currentAnimation = animationName;
            this.currentFrame = 0;
            this.frameCounter = 0;
        }
    }
    
    /**
     * Nastavenie smeru
     * @param {string} direction - 'left', 'right', 'front'
     */
    setDirection(direction) {
        this.direction = direction;
    }
    
    /**
     * Update animácie (volať v game loop-e)
     * @param {number} deltaTime - Čas od posledného frame-u (normalizovaný na 60 FPS)
     */
    update(deltaTime = 1) {
        const anim = this.animations[this.currentAnimation];
        if (!anim) return;
        
        // Počítadlo frame-ov s deltaTime
        this.frameCounter += deltaTime;
        
        // Keď uplynie dosť frame-ov, prejdi na ďalší sprite
        if (this.frameCounter >= anim.speed) {
            this.frameCounter = 0;
            this.currentFrame++;
            
            // Loop animácie
            if (this.currentFrame >= anim.frames) {
                this.currentFrame = 0;
            }
        }
    }
    
    /**
     * Vykreslenie aktuálneho frame-u
     * @param {CanvasRenderingContext2D} ctx - Canvas kontext
     * @param {number} x - X pozícia
     * @param {number} y - Y pozícia
     * @param {number} width - Šírka
     * @param {number} height - Výška
     */
    draw(ctx, x, y, width, height) {
        const frameImage = this.images[this.currentAnimation]?.[this.currentFrame];
        
        if (!frameImage || !frameImage.complete) {
            ctx.fillStyle = 'red';
            ctx.fillRect(x, y, width, height);
            return;
        }
        
        ctx.save();
        
        // ⭐ PRIDAJ TOTO - vypne anti-aliasing
        ctx.imageSmoothingEnabled = false;
        
        // Ak ide doľava, zrkadlovo otočíme sprite
        if (this.direction === 'left') {
            ctx.translate(x + width, y);
            ctx.scale(-1, 1);
            ctx.drawImage(frameImage, 0, 0, width, height);
        } else {
            ctx.drawImage(frameImage, x, y, width, height);
        }
        
        ctx.restore();
    }
}

// ============================================
// ENEMY SYSTEM - Systém nepriateľov
// ============================================

/**
 * ENEMY ANIMATION MANAGER
 * Správa animácií pre všetkých nepriateľov v hre
 */
class EnemyAnimationManager {
    constructor() {
        // Základná cesta k sprite-om nepriateľov
        this.basePath = 'images/superjozino/assets/mobs/';
        
        // Načítané sprite sheety pre každý typ nepriateľa
        this.spriteSheets = {};
        
        // Konfigurácia pre každý typ nepriateľa
        this.enemyConfig = {
            AngryPig: {
                path: 'AngryPig/',
                animations: {
                    idle: { 
                        frames: 9, 
                        frameWidth: 36, 
                        frameHeight: 30,
                        speed: 5,  // Pomalšia idle animácia
                        loop: true 
                    },
                    walk: { 
                        frames: 16, 
                        frameWidth: 36, 
                        frameHeight: 30,
                        speed: 4,   // Stredná rýchlosť animácie
                        loop: true 
                    },
                    run: { 
                        frames: 12, 
                        frameWidth: 36, 
                        frameHeight: 30,
                        speed: 3,   // Rýchlejšia animácia
                        loop: true 
                    },
                    hit: { 
                        frames: 5, 
                        frameWidth: 36, 
                        frameHeight: 30,
                        speed: 2,   // Rýchla hit animácia
                        loop: false // Prehráva sa len raz
                    }
                }
            },
            Bat: {
                path: 'Bat/',
                animations: {
                    idle: {
                        frames: 12,
                        frameWidth: 46,
                        frameHeight: 30,
                        speed: 5,  // Pomalá idle animácia (spí)
                        loop: true
                    },
                    flying: {
                        frames: 7,
                        frameWidth: 46,
                        frameHeight: 30,
                        speed: 4,   // Stredná rýchlosť mávnutia krídel
                        loop: true
                    },
                    ceiling_in: {  // Zasypanie (návrat na strop)
                        frames: 7,
                        frameWidth: 46,
                        frameHeight: 30,
                        speed: 5,
                        loop: false  // Prehráva sa len raz
                    },
                    ceiling_out: {  // Prebúdzanie (opustenie stropu)
                        frames: 7,
                        frameWidth: 46,
                        frameHeight: 30,
                        speed: 5,
                        loop: false  // Prehráva sa len raz
                    },
                    hit: {
                        frames: 5,
                        frameWidth: 46,
                        frameHeight: 30,
                        speed: 2,
                        loop: false
                    }
                }
            },
            Ghost: {
                path: 'Ghost/',
                animations: {
                    idle: {
                        frames: 10,
                        frameWidth: 44,
                        frameHeight: 30,
                        speed: 4,   // Stredná rýchlosť animácie (vlnenie ducha)
                        loop: true
                    },
                    appear: {
                        frames: 4,
                        frameWidth: 44,
                        frameHeight: 30,
                        speed: 4,   // Rýchlosť zjavenia
                        loop: false  // Prehráva sa len raz
                    },
                    disappear: {
                        frames: 4,
                        frameWidth: 44,
                        frameHeight: 30,
                        speed: 4,   // Rýchlosť zmiznutia
                        loop: false  // Prehráva sa len raz
                    },
                    hit: {
                        frames: 5,  // Použijeme idle animáciu aj pre hit (ghost sa nedá zabiť)
                        frameWidth: 44,
                        frameHeight: 30,
                        speed: 2,
                        loop: false
                    }
                }
            },
            Chameleon: {
                path: 'Chameleon/',
                animations: {
                    idle: {
                        frames: 13,
                        frameWidth: 84,
                        frameHeight: 38,
                        speed: 5,  // Pomalá idle animácia
                        loop: true
                    },
                    run: {
                        frames: 8,
                        frameWidth: 84,
                        frameHeight: 38,
                        speed: 4,   // Bežná rýchlosť
                        loop: true
                    },
                    attack: {
                        frames: 10,
                        frameWidth: 84,
                        frameHeight: 38,
                        speed: 3,   // Rýchla attack animácia
                        loop: false  // Prehráva sa len raz
                    },
                    hit: {
                        frames: 5,
                        frameWidth: 84,
                        frameHeight: 38,
                        speed: 2,
                        loop: false
                    }
                }
            }
        };
        
        // Načítanie sprite sheetov
        this.loadAllSprites();
    }
    
    /**
     * Načítanie všetkých sprite sheetov pre nepriateľov
     */
    loadAllSprites() {
        console.log('👹 Načítavam sprite-y nepriateľov...');
        
        // Pre každý typ nepriateľa
        for (let enemyType in this.enemyConfig) {
            const config = this.enemyConfig[enemyType];
            const enemyPath = this.basePath + config.path;
            
            // Inicializuj objekt pre tento typ nepriateľa
            this.spriteSheets[enemyType] = {};
            
            // Načítaj každú animáciu
            for (let animName in config.animations) {
                const img = new Image();
                img.src = `${enemyPath}${animName}.png`;
                
                // Ulož sprite sheet
                this.spriteSheets[enemyType][animName] = img;
                
                // Log pre debugging
                img.onload = () => {
                    const anim = config.animations[animName];
                    console.log(`✅ ${enemyType} - ${animName}: ${anim.frames} frame-ov (${anim.frameWidth}x${anim.frameHeight}px)`);
                };
                
                img.onerror = () => {
                    console.error(`❌ Chyba pri načítaní: ${img.src}`);
                };
            }
        }
    }
    
    /**
     * Vykreslenie konkrétneho nepriateľa
     * @param {CanvasRenderingContext2D} ctx - Canvas kontext
     * @param {Enemy} enemy - Objekt nepriateľa
     */
    draw(ctx, enemy) {
        // Kontrola či je nepriateľ viditeľný
        if (!enemy.visible) return;
        
        // Získaj konfiguráciu pre tento typ nepriateľa
        const config = this.enemyConfig[enemy.type];
        if (!config) {
            console.error(`❌ Neznámy typ nepriateľa: ${enemy.type}`);
            return;
        }
        
        // Získaj aktuálnu animáciu
        const animConfig = config.animations[enemy.currentAnimation];
        if (!animConfig) {
            console.error(`❌ Neznáma animácia: ${enemy.currentAnimation} pre ${enemy.type}`);
            return;
        }
        
        // Získaj sprite sheet pre túto animáciu
        const spriteSheet = this.spriteSheets[enemy.type][enemy.currentAnimation];
        if (!spriteSheet || !spriteSheet.complete) {
            // Placeholder ak sprite ešte nie je načítaný
            ctx.fillStyle = 'red';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            return;
        }
        
        // Vypočítaj pozíciu frame-u v sprite sheete
        const frameX = enemy.animationFrame * animConfig.frameWidth;
        const frameY = 0; // Všetky frame-y sú v jednom riadku
        
        // Vypni anti-aliasing pre pixel-perfect rendering
        ctx.imageSmoothingEnabled = false;
        
        // Zrkadlenie sprite-u podľa smeru pohybu
        ctx.save();
        
        if (enemy.direction === 1) {  // ⬅️ ZMENENÉ: Bolo -1, teraz 1
            // Otočenie doprava (flip horizontal)
            ctx.translate(enemy.x + enemy.width, enemy.y);
            ctx.scale(-1, 1);
            ctx.drawImage(
                spriteSheet,
                frameX, frameY,                          // Pozícia v sprite sheete
                animConfig.frameWidth, animConfig.frameHeight, // Veľkosť frame-u
                0, 0,                                    // Pozícia na canvase (upravené kvôli flip)
                enemy.width, enemy.height                // Veľkosť vykreslenia
            );
        } else {
            // Normálne vykreslenie doľava (bez flip)
            ctx.drawImage(
                spriteSheet,
                frameX, frameY,                          // Pozícia v sprite sheete
                animConfig.frameWidth, animConfig.frameHeight, // Veľkosť frame-u
                enemy.x, enemy.y,                        // Pozícia na canvase
                enemy.width, enemy.height                // Veľkosť vykreslenia
            );
        }

        ctx.restore();
    }
    
    /**
     * Aktualizácia animácie nepriateľa
     * @param {Enemy} enemy - Objekt nepriateľa
     * @param {number} deltaTime - Čas od posledného frame-u
     */
    updateAnimation(enemy, deltaTime = 1) {
        const config = this.enemyConfig[enemy.type];
        if (!config) return;
        
        const animConfig = config.animations[enemy.currentAnimation];
        if (!animConfig) return;
        
        // Počítadlo frame-ov pre rýchlosť animácie - s deltaTime
        enemy.animationCounter += deltaTime;
        
        if (enemy.animationCounter >= animConfig.speed) {
            enemy.animationCounter = 0;
            enemy.animationFrame++;
            
            // Kontrola konca animácie
            if (enemy.animationFrame >= animConfig.frames) {
                if (animConfig.loop) {
                    // Loop animácia - vráť sa na začiatok
                    enemy.animationFrame = 0;
                } else {
                    // Non-loop animácia (napr. hit) - zostane na poslednom frame
                    enemy.animationFrame = animConfig.frames - 1;
                    enemy.animationFinished = true;
                }
            }
        }
    }
}

/**
 * ENEMY - Základná trieda pre nepriateľa
 */
class Enemy {
    constructor(x, y, type, config = {}) {
        // Pozícia
        this.x = x;
        this.y = y;
        
        // Typ nepriateľa (AngryPig, Bat, Ghost, atď.)
        this.type = type;
        
        // Veľkosť collision boxu
        this.width = config.width || 40;
        this.height = config.height || 30;
        
        // Pohyb
        this.startX = config.startX || x;
        this.endX = config.endX || x + 200;
        this.speed = config.speed || 2;
        this.direction = 1; // 1 = doprava, -1 = doľava
        
        // Vlastnosti
        this.hp = config.hp || 1;
        this.maxHp = config.hp || 1;
        this.damage = config.damage || 1; // Koľko životov zoberie hráčovi
        this.killable = config.killable !== undefined ? config.killable : true;
        this.stunnable = config.stunnable !== undefined ? config.stunnable : false;
        
        // Stav
        this.visible = true;
        this.alive = true;
        this.dying = false;
        this.stunned = false;
        this.stunnedTimer = 0;
        
        // Animácia
        this.currentAnimation = 'walk';
        this.animationFrame = 0;
        this.animationCounter = 0;
        this.animationFinished = false;
        
        // Správanie (pre rôzne typy nepriateľov)
        this.behaviorType = config.behaviorType || 'patrol'; // patrol, flying, stationary
    }
    
    /**
     * Nastavenie animácie
     * @param {string} animationName - Názov animácie
     */
    setAnimation(animationName) {
        if (this.currentAnimation !== animationName) {
            this.currentAnimation = animationName;
            this.animationFrame = 0;
            this.animationCounter = 0;
            this.animationFinished = false;
        }
    }
    
    /**
     * Aktualizácia nepriateľa
     * @param {number} deltaTime - Čas od posledného frame-u
     */
    update(deltaTime) {
        // Ak umiera, nezastavuj update
        if (!this.alive && !this.dying) return;
        
        // Ak umiera, nerobíme pohyb
        if (this.dying) {
            return;
        }

        // Ak je omráčený, počítaj čas
        if (this.stunned) {
            // Odpočítaj čas omráčenia (deltaTime už je normalizované)
            this.stunnedTimer -= deltaTime;
            if (this.stunnedTimer <= 0) {
                this.stunned = false;
                this.setAnimation('walk');
            }
            return;
        }
        
        // Pohyb podľa typu správania
        if (this.behaviorType === 'patrol') {
            this.patrolBehavior(deltaTime);
        } else if (this.behaviorType === 'flying') {
            this.patrolBehavior(deltaTime);
        } else if (this.behaviorType === 'sleeping') {
            // SleepingBat má vlastnú update()
        } else if (this.behaviorType === 'ghost') {
            this.patrolBehavior(deltaTime);
        } else if (this.behaviorType === 'chameleon') {
            // Chameleon má vlastnú update() metódu
            // (nepotrebujeme tu nič robiť)
        }
    }
    
    /**
     * Správanie: Patrola medzi dvoma bodmi
     * @param {number} deltaTime - Čas od posledného frame-u
     */
    patrolBehavior(deltaTime) {
        // Pohyb - rýchlosť × smer × deltaTime
        this.x += this.speed * this.direction * deltaTime;  // ✅ S deltaTime
        
        // Zmena smeru pri dosiahnutí hraníc
        if (this.x <= this.startX) {
            this.direction = 1;
            this.x = this.startX;
        } else if (this.x >= this.endX) {
            this.direction = -1;
            this.x = this.endX;
        }
        
        // Animácia podľa rýchlosti
        if (Math.abs(this.speed) > 1.3) {
            this.setAnimation('run');
        } else {
            this.setAnimation('walk');
        }
    }
    
    /**
     * Zasah od hráča (skok zhora)
     */
    hit() {
        if (!this.alive) return;
        
        this.hp--;
        
        if (this.hp <= 0) {
            if (this.killable) {
                // ⬅️ OPRAVA: Namiesto alive=false použijeme dying stav
                this.dying = true;  // ⬅️ NOVÝ STAV
                this.alive = false; // Stále označíme ako neživý (pre kolízie)
                this.setAnimation('hit');
                
                // Skryje sa po dokončení animácie
                // Hit má 5 frame-ov, speed 4 = 5*4 = 20 update cyklov pri 60 FPS = ~333ms
                setTimeout(() => {
                    this.visible = false;
                    this.dying = false; // ⬅️ Reset stavu
                }, 400); // ⬅️ Trochu dlhší timeout aby určite stihla dobehnúť
                
            } else if (this.stunnable) {
                // Omráčiteľný nepriateľ - dočasne sa zastaví
                this.stunned = true;
                this.stunnedTimer = 120;
                this.setAnimation('hit');
                this.hp = this.maxHp;
            }
        }
    }
    
    /**
     * Kontrola kolízie s iným objektom (napr. hráčom)
     * @param {Object} other - Objekt na kontrolu kolízie
     * @returns {boolean} - True ak došlo ku kolízii
     */
    collidesWith(other) {
        return this.alive &&
               this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }
}

/**
 * ANGRY PIG - Špecifická trieda pre AngryPig nepriateľa
 */
class AngryPig extends Enemy {
    constructor(x, y, config = {}) {
        // Predvolené hodnoty pre AngryPig
        const pigConfig = {
            width: 40,        // Stredná veľkosť
            height: 30,
            speed: config.speed || 4,  // Stredná rýchlosť
            hp: 1,            // Zabije sa jedným skokom
            damage: 1,        // Zoberie 1 život hráčovi
            killable: true,   // Dá sa zabiť
            stunnable: false, // Nedá sa omráčiť
            behaviorType: 'patrol',
            ...config         // Prepíš default hodnoty ak sú v config
        };
        
        // Zavolaj konštruktor rodiča
        super(x, y, 'AngryPig', pigConfig);
    }
}



/**
 * GREEN PIG - Zelené prasa (iba walk, pomalé)
 * Jednoduché prasa ktoré len pomaly chodí
 */
class GreenPig extends Enemy {
    constructor(x, y, config = {}) {
        const pigConfig = {
            width: 40,
            height: 30,
            speed: 2,         // ⬅️ Vždy 1 (walk animácia)
            hp: 1,
            damage: 1,
            killable: true,
            stunnable: false,
            behaviorType: 'patrol',
            ...config
        };
        
        super(x, y, 'AngryPig', pigConfig);
        this.pigType = 'green'; // Označenie typu
    }
    
    /**
     * Prepísané správanie - vždy iba walk
     * @param {number} deltaTime - Čas od posledného frame-u
     */
    patrolBehavior(deltaTime) {
        // Pohyb - s deltaTime
        this.x += this.speed * this.direction * deltaTime;
        
        // Zmena smeru
        if (this.x <= this.startX) {
            this.direction = 1;
            this.x = this.startX;
        } else if (this.x >= this.endX) {
            this.direction = -1;
            this.x = this.endX;
        }
        
        // Vždy iba walk animácia
        this.setAnimation('walk');
    }
}

/**
 * RED PIG - Červené prasa (iba run, rýchle)
 * Agresívne prasa ktoré stále beží
 */
class RedPig extends Enemy {
    constructor(x, y, config = {}) {
        const pigConfig = {
            width: 40,
            height: 30,
            speed: config.speed || 1.7,  // ⬅️ Default rýchlejšie (1.5-2)
            hp: 1,
            damage: 1,
            killable: true,
            stunnable: false,
            behaviorType: 'patrol',
            ...config
        };
        
        super(x, y, 'AngryPig', pigConfig);
        this.pigType = 'red';
    }
    
    /**
     * Prepísané správanie - vždy iba run
     * @param {number} deltaTime - Čas od posledného frame-u
     */
    patrolBehavior(deltaTime) {
        // Pohyb - s deltaTime
        this.x += this.speed * this.direction * deltaTime;
        
        // Zmena smeru
        if (this.x <= this.startX) {
            this.direction = 1;
            this.x = this.startX;
        } else if (this.x >= this.endX) {
            this.direction = -1;
            this.x = this.endX;
        }
        
        // Vždy iba run animácia
        this.setAnimation('run');
    }
}

/**
 * COMBO PIG - Kombinované prasa (walk -> idle -> run -> idle)
 * Inteligentné prasa s meniacim sa správaním
 */
class ComboPig extends Enemy {
    constructor(x, y, config = {}) {
        const pigConfig = {
            width: 40,
            height: 30,
            speed: 1,  // Začína pomaly
            hp: 1,
            damage: 1,
            killable: true,
            stunnable: false,
            behaviorType: 'patrol',
            ...config
        };
        
        super(x, y, 'AngryPig', pigConfig);
        this.pigType = 'combo';
        
        // ⬅️ State machine pre kombináciu správania
        this.state = 'walking';  // walking, waiting_to_run, running, waiting_to_walk
        this.stateTimer = 0;
        this.waitTime = 120;     // ~2 sekundy čakania pri 60 FPS
        
        // Rýchlosti pre rôzne stavy
        this.walkSpeed = 1;
        this.runSpeed = 4;
    }
    
    /**
     * Prepísané update - vlastný state machine
     * @param {number} deltaTime - Čas od posledného frame-u
     */
    update(deltaTime) {
        // Ak umiera, nezastavuj update
        if (!this.alive && !this.dying) return;
        
        // Ak umiera, nerobíme pohyb
        if (this.dying) {
            return;
        }
        
        if (this.stunned) {
            this.stunnedTimer -= deltaTime;
            if (this.stunnedTimer <= 0) {
                this.stunned = false;
                this.state = 'walking';
                this.speed = this.walkSpeed;
            }
            return;
        }
        
        // Pohyb - s deltaTime
        this.x += this.speed * this.direction * deltaTime;
        
        // Zmena smeru na krajoch
        let reachedEnd = false;
        if (this.x <= this.startX) {
            this.direction = 1;
            this.x = this.startX;
            reachedEnd = true;
        } else if (this.x >= this.endX) {
            this.direction = -1;
            this.x = this.endX;
            reachedEnd = true;
        }
        
        // STATE MACHINE
        switch(this.state) {
            case 'walking':
                this.speed = this.walkSpeed;
                this.setAnimation('walk');
                
                // Ak dosiahol koniec, prejdi do čakania
                if (reachedEnd) {
                    this.state = 'waiting_to_run';
                    this.stateTimer = this.waitTime;
                    this.speed = 0; // Zastav sa
                }
                break;
                
            case 'waiting_to_run':
                this.speed = 0; // Stojí
                this.setAnimation('idle');
                this.stateTimer -= deltaTime; // Odpočítaj s deltaTime
                
                // Po dočkaní sa rozbehni
                if (this.stateTimer <= 0) {
                    this.state = 'running';
                    this.speed = this.runSpeed;
                }
                break;
                
            case 'running':
                this.speed = this.runSpeed;
                this.setAnimation('run');
                
                // Ak dosiahol koniec, prejdi do čakania
                if (reachedEnd) {
                    this.state = 'waiting_to_walk';
                    this.stateTimer = this.waitTime;
                    this.speed = 0; // Zastav sa
                }
                break;
                
            case 'waiting_to_walk':
                this.speed = 0; // Stojí
                this.setAnimation('idle');
                this.stateTimer -= deltaTime; // Odpočítaj s deltaTime
                
                // Po dočkaní sa pomaly pohni
                if (this.stateTimer <= 0) {
                    this.state = 'walking';
                    this.speed = this.walkSpeed;
                }
                break;
        }
    }
}


/**
 * ============================================
 * BAT SYSTEM - Lietajúci nepriatelia
 * ============================================
 */

/**
 * SIMPLE BAT - Jednoduchý netopier
 * Lieta horizontálne medzi dvoma bodmi (konštantná výška)
 */
class SimpleBat extends Enemy {
    constructor(x, y, config = {}) {
        const batConfig = {
            width: 46,
            height: 30,
            speed: 1,          // Pomalý pohyb
            hp: 1,
            damage: 1,
            killable: true,
            stunnable: false,
            behaviorType: 'flying',  // ⬅️ Nový typ správania
            ...config
        };
        
        super(x, y, 'Bat', batConfig);
        this.batType = 'simple';
    }
    
    /**
     * Prepísané správanie - horizontálny let
     */
    patrolBehavior() {
        // Pohyb
        this.x += this.speed * this.direction;
        
        // Zmena smeru
        if (this.x <= this.startX) {
            this.direction = 1;
            this.x = this.startX;
        } else if (this.x >= this.endX) {
            this.direction = -1;
            this.x = this.endX;
        }
        
        // ⬅️ Vždy flying animácia
        this.setAnimation('flying');
    }
}

/**
 * WAVE BAT - Vlnovitý netopier
 * Lieta horizontálne + vlní sa hore-dole (sine wave)
 */
class WaveBat extends Enemy {
    constructor(x, y, config = {}) {
        const batConfig = {
            width: 46,
            height: 30,
            speed: 2,
            hp: 1,
            damage: 1,
            killable: true,
            stunnable: false,
            behaviorType: 'flying',
            ...config
        };
        
        super(x, y, 'Bat', batConfig);
        this.batType = 'wave';
        
        // ⬅️ Pre vlnovitý pohyb
        this.baseY = y;           // Základná Y pozícia (stred vlny)
        this.waveAmplitude = 30;  // Amplitúda vlny (ako vysoko/nízko)
        this.waveFrequency = 0.05; // Frekvencia vlny (ako rýchlo sa vlní)
        this.waveOffset = 0;      // Aktuálny offset pre výpočet
    }
    
    /**
     * Prepísané správanie - horizontálny pohyb + vlnenie
     * @param {number} deltaTime - Čas od posledného frame-u
     */
    patrolBehavior(deltaTime) {
        // Horizontálny pohyb - s deltaTime
        this.x += this.speed * this.direction * deltaTime;
        
        // Zmena smeru
        if (this.x <= this.startX) {
            this.direction = 1;
            this.x = this.startX;
        } else if (this.x >= this.endX) {
            this.direction = -1;
            this.x = this.endX;
        }
        
        // Vertikálne vlnenie (sine wave) - s deltaTime
        this.waveOffset += this.waveFrequency * deltaTime;
        this.y = this.baseY + Math.sin(this.waveOffset) * this.waveAmplitude;
        
        // Vždy flying animácia
        this.setAnimation('flying');
    }
}

/**
 * SLEEPING BAT - Spiaci netopier
 * Visí na platforme → prebúdza sa → letí → vracia sa → zaspí
 */
class SleepingBat extends Enemy {
    constructor(x, y, config = {}) {
        const batConfig = {
            width: 46,
            height: 30,
            speed: 3,        // Rýchlejší keď lieta
            hp: 1,
            damage: 1,
            killable: true,
            stunnable: false,
            behaviorType: 'sleeping',  // ⬅️ Vlastný typ
            ...config
        };
        
        super(x, y, 'Bat', batConfig);
        this.batType = 'sleeping';
        
        // ⬅️ State machine
        this.state = 'sleeping';  // sleeping, waking, flying, returning, falling_asleep
        this.stateTimer = 0;
        
        // Pozície
        this.sleepX = x;          // Pozícia kde spí (zavesený)
        this.sleepY = y;          // Y pozícia strechy
        this.patrolStartX = config.patrolStartX || x - 50;  // Začiatok patroly
        this.patrolEndX = config.patrolEndX || x + 50;      // Koniec patroly
        
        // Časovanie
        this.sleepDuration = config.sleepDuration || 320;    // ~3 sekundy spí
        this.flyDuration = config.flyDuration || 320;        // ~4 sekundy letí
        
        // Pre vlnenie počas letu (ako WaveBat)
        this.waveAmplitude = 20;
        this.waveFrequency = 0.05;
        this.waveOffset = 0;
        this.baseY = y + 50;  // Lietať nižšie pod stropom
    }
    
    /**
     * Prepísané update - state machine
     * @param {number} deltaTime - Čas od posledného frame-u
     */
    update(deltaTime) {
        // Kontrola dying stavu
        if (!this.alive && !this.dying) return;
        if (this.dying) return;
        
        if (this.stunned) {
            this.stunnedTimer -= deltaTime;
            if (this.stunnedTimer <= 0) {
                this.stunned = false;
                this.state = 'sleeping';
                this.x = this.sleepX;
                this.y = this.sleepY;
            }
            return;
        }
        
        // STATE MACHINE
        switch(this.state) {
            case 'sleeping':
                // Spí zavesený na platforme
                this.speed = 0;
                this.x = this.sleepX;
                this.y = this.sleepY;
                this.setAnimation('idle');
                
                this.stateTimer += deltaTime; // Odpočítaj s deltaTime
                if (this.stateTimer >= this.sleepDuration) {
                    // Prebúdza sa
                    this.state = 'waking';
                    this.stateTimer = 0;
                }
                break;
                
            case 'waking':
                // Prebúdzanie - ceiling_out animácia
                this.speed = 0;
                this.setAnimation('ceiling_out');
                
                // Počkaj na dokončenie animácie
                this.stateTimer += deltaTime; // S deltaTime
                if (this.stateTimer >= 50) {
                    // Začni lietať
                    this.state = 'flying';
                    this.stateTimer = 0;
                    this.direction = 1;  // Začni letieť doprava
                    this.startX = this.patrolStartX;
                    this.endX = this.patrolEndX;
                    this.x = this.sleepX;
                    this.waveOffset = 0;
                }
                break;
                
            case 'flying':
                // Lietanie - wave pattern
                this.speed = 1.5;
                this.setAnimation('flying');
                
                // Horizontálny pohyb - s deltaTime
                this.x += this.speed * this.direction * deltaTime;
                
                // Zmena smeru na krajoch
                if (this.x <= this.startX) {
                    this.direction = 1;
                    this.x = this.startX;
                } else if (this.x >= this.endX) {
                    this.direction = -1;
                    this.x = this.endX;
                }
                
                // Vertikálne vlnenie - s deltaTime
                this.waveOffset += this.waveFrequency * deltaTime;
                this.y = this.baseY + Math.sin(this.waveOffset) * this.waveAmplitude;
                
                // Časovač letu - s deltaTime
                this.stateTimer += deltaTime;
                if (this.stateTimer >= this.flyDuration) {
                    // Vráť sa späť
                    this.state = 'returning';
                    this.stateTimer = 0;
                }
                break;
                
            case 'returning':
                // Návrat na spací miesto
                this.speed = 2;  // Rýchlejší návrat
                this.setAnimation('flying');
                
                // Pohyb smerom k sleep pozícii
                const dx = this.sleepX - this.x;
                const dy = this.sleepY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 5) {
                    // Pohybuj sa k cieľu - s deltaTime
                    this.x += (dx / distance) * this.speed * deltaTime;
                    this.y += (dy / distance) * this.speed * deltaTime;
                    
                    // Nastav smer podľa pohybu
                    this.direction = dx > 0 ? 1 : -1;
                } else {
                    // Dosiahol spací bod
                    this.x = this.sleepX;
                    this.y = this.sleepY;
                    this.state = 'falling_asleep';
                    this.stateTimer = 0;
                }
                break;
                
            case 'falling_asleep':
                // Zasypanie - ceiling_in animácia
                this.speed = 0;
                this.x = this.sleepX;
                this.y = this.sleepY;
                this.setAnimation('ceiling_in');
                
                // Počkaj na dokončenie animácie - s deltaTime
                this.stateTimer += deltaTime;
                if (this.stateTimer >= 50) {
                    // Zaspi
                    this.state = 'sleeping';
                    this.stateTimer = 0;
                }
                break;
        }
    }
}

/**
 * ============================================
 * GHOST SYSTEM - Duchovia (nezabiteľní)
 * ============================================
 */

/**
 * PATROL GHOST - Klasický duch
 * Lietá medzi bodmi, prechádza stenami, nezabiteľný
 */
class PatrolGhost extends Enemy {
    constructor(x, y, config = {}) {
        const ghostConfig = {
            width: 44,
            height: 30,
            speed: config.speed || 2,
            hp: 999,           // ⬅️ Veľa HP (nezabiteľný)
            damage: 1,
            killable: false,   // ⬅️ Nedá sa zabiť!
            stunnable: false,
            behaviorType: 'ghost',  // ⬅️ Nový typ
            ...config
        };
        
        super(x, y, 'Ghost', ghostConfig);
        this.ghostType = 'patrol';
        
        // ⬅️ Duch ignoruje gravitáciu a steny
        this.ignoresWalls = true;
    }
    
    /**
     * Prepísané správanie - patrol bez kolízií
     */
    patrolBehavior() {
        // Pohyb (prechádza stenami!)
        this.x += this.speed * this.direction;
        
        // Zmena smeru
        if (this.x <= this.startX) {
            this.direction = 1;
            this.x = this.startX;
        } else if (this.x >= this.endX) {
            this.direction = -1;
            this.x = this.endX;
        }
        
        // ⬅️ Vždy idle animácia (vlnenie ducha)
        this.setAnimation('idle');
    }
}

/**
 * PHASING GHOST - Mizne a objavuje sa
 * State machine: visible → disappearing → invisible → appearing → visible
 */
class PhasingGhost extends Enemy {
    constructor(x, y, config = {}) {
        const ghostConfig = {
            width: 44,
            height: 30,
            speed: config.speed || 2,
            hp: 999,
            damage: 1,
            killable: false,
            stunnable: false,
            behaviorType: 'ghost',
            ...config
        };
        
        super(x, y, 'Ghost', ghostConfig);
        this.ghostType = 'phasing';
        this.ignoresWalls = true;
        
        // ⬅️ State machine pre phasing
        this.state = 'visible';  // visible, disappearing, invisible, appearing
        this.stateTimer = 0;
        
        // Časovanie (v frame-och pri 60 FPS)
        this.visibleDuration = config.visibleDuration || 180;      // ~3 sekundy viditeľný
        this.invisibleDuration = config.invisibleDuration || 120;  // ~2 sekundy neviditeľný
        
        // Phasing vlastnosti
        this.canHurt = true;  // Počas invisible nemôže ublížiť
    }
    
    /**
     * Prepísané update - state machine s phasing
     * @param {number} deltaTime - Čas od posledného frame-u
     */
    update(deltaTime) {
        // Duch nikdy neumiera, ale kontrolujeme dying stav pre istotu
        if (this.dying) return;
        
        // STATE MACHINE
        switch(this.state) {
            case 'visible':
                // Normálny pohyb, viditeľný, môže ublížiť
                this.visible = true;
                this.canHurt = true;
                this.setAnimation('idle');
                
                // Pohyb - s deltaTime
                this.x += this.speed * this.direction * deltaTime;
                if (this.x <= this.startX) {
                    this.direction = 1;
                    this.x = this.startX;
                } else if (this.x >= this.endX) {
                    this.direction = -1;
                    this.x = this.endX;
                }
                
                // Časovač - s deltaTime
                this.stateTimer += deltaTime;
                if (this.stateTimer >= this.visibleDuration) {
                    this.state = 'disappearing';
                    this.stateTimer = 0;
                }
                break;
                
            case 'disappearing':
                // Animácia zmiznutia
                this.canHurt = false;  // Už nemôže ublížiť
                this.setAnimation('disappear');
                
                // Stále sa pohybuje - s deltaTime
                this.x += this.speed * this.direction * deltaTime;
                if (this.x <= this.startX) {
                    this.direction = 1;
                    this.x = this.startX;
                } else if (this.x >= this.endX) {
                    this.direction = -1;
                    this.x = this.endX;
                }
                
                // Počkaj na dokončenie animácie - s deltaTime
                this.stateTimer += deltaTime;
                if (this.stateTimer >= 40) {
                    this.state = 'invisible';
                    this.stateTimer = 0;
                    this.visible = false;  // Skry ducha
                }
                break;
                
            case 'invisible':
                // Neviditeľný, pohybuje sa, nemôže ublížiť
                this.visible = false;
                this.canHurt = false;
                
                // Stále sa pohybuje (aj keď neviditeľný) - s deltaTime
                this.x += this.speed * this.direction * deltaTime;
                if (this.x <= this.startX) {
                    this.direction = 1;
                    this.x = this.startX;
                } else if (this.x >= this.endX) {
                    this.direction = -1;
                    this.x = this.endX;
                }
                
                // Časovač - s deltaTime
                this.stateTimer += deltaTime;
                if (this.stateTimer >= this.invisibleDuration) {
                    this.state = 'appearing';
                    this.stateTimer = 0;
                }
                break;
                
            case 'appearing':
                // Animácia zjavenia
                this.visible = true;
                this.canHurt = false;  // Ešte nemôže ublížiť
                this.setAnimation('appear');
                
                // Stále sa pohybuje - s deltaTime
                this.x += this.speed * this.direction * deltaTime;
                if (this.x <= this.startX) {
                    this.direction = 1;
                    this.x = this.startX;
                } else if (this.x >= this.endX) {
                    this.direction = -1;
                    this.x = this.endX;
                }
                
                // Počkaj na dokončenie animácie - s deltaTime
                this.stateTimer += deltaTime;
                if (this.stateTimer >= 40) {
                    this.state = 'visible';
                    this.stateTimer = 0;
                    this.canHurt = true;  // Teraz môže ublížiť
                }
                break;
        }
    }
}


/**
 * ============================================
 * CHAMELEON - Chameleón s útokom jazykom
 * ============================================
 */

/**
 * CHAMELEON - Útočí jazykom na hráča
 * Patruluje → detekuje hráča → zastaví → útok jazykom → cooldown
 */
class Chameleon extends Enemy {
    constructor(x, y, config = {}) {
        const chameleonConfig = {
            width: 84,
            height: 38,
            speed: config.speed || 0.7,
            hp: 1,
            damage: 1,
            killable: true,
            stunnable: false,
            behaviorType: 'chameleon',
            ...config
        };
        
        super(x, y, 'Chameleon', chameleonConfig);
        
        // ⬅️ NOVÝ STATE: patrol, turning, preparing, attacking, cooldown
        this.state = 'patrol';
        this.stateTimer = 0;
        
        // Útok jazykom
        this.detectionRange = config.detectionRange || 150;
        this.tongueRange = config.tongueRange || 100;
        this.attackDuration = 50;
        this.cooldownDuration = 90;
        this.turningDuration = 40;  // ⬅️ NOVÉ: ~0.7 sekundy idle na otočke
        
        // ⬅️ NOVÉ: Vertikálna tolerancia pre detekciu (hráč musí byť približne na rovnakej výške)
        this.verticalTolerance = config.verticalTolerance || 50;  // 50px hore/dole
        
        this.tongueHitbox = null;
        this.tongueActive = false;
        this.player = null;
    }
    
    /**
     * Aktualizácia Chameleona
     * @param {number} deltaTime - Čas od posledného frame-u
     */
    update(deltaTime) {
        if (!this.alive && !this.dying) return;
        if (this.dying) return;
        
        if (this.stunned) {
            this.stunnedTimer -= deltaTime;
            if (this.stunnedTimer <= 0) {
                this.stunned = false;
                this.state = 'patrol';
            }
            return;
        }
        
        switch(this.state) {
            case 'patrol':
                this.tongueActive = false;
                this.tongueHitbox = null;
                
                // Pohyb - s deltaTime
                this.x += this.speed * this.direction * deltaTime;
                
                // Pri dosiahnutí konca trasy prejdi do turning state
                if (this.x <= this.startX) {
                    this.x = this.startX;
                    this.state = 'turning';
                    this.stateTimer = 0;
                    this.speed = 0;
                    this.direction = 1;  // Priprav sa otočiť doprava
                } else if (this.x >= this.endX) {
                    this.x = this.endX;
                    this.state = 'turning';
                    this.stateTimer = 0;
                    this.speed = 0;
                    this.direction = -1;  // Priprav sa otočiť doľava
                }
                
                // Animácia
                if (Math.abs(this.speed) > 0.1) {
                    this.setAnimation('run');
                } else {
                    this.setAnimation('idle');
                }
                
                // Lepšia detekcia hráča
                if (this.player && this.isPlayerInAttackRange()) {
                    this.state = 'preparing';
                    this.stateTimer = 0;
                    this.speed = 0;
                    
                    // Otoč sa smerom k hráčovi
                    if (this.player.x < this.x) {
                        this.direction = -1;
                    } else {
                        this.direction = 1;
                    }
                }
                break;
                
            case 'turning':
                // Idle animácia na otočke
                this.speed = 0;
                this.setAnimation('idle');
                
                this.stateTimer += deltaTime; // S deltaTime
                if (this.stateTimer >= this.turningDuration) {
                    // Otočka dokončená, pokračuj v patrole
                    this.state = 'patrol';
                    this.stateTimer = 0;
                    this.speed = 0.7;  // Obnov rýchlosť
                }
                
                // Aj počas otáčania môže útočiť ak je hráč blízko
                if (this.player && this.isPlayerInAttackRange()) {
                    this.state = 'preparing';
                    this.stateTimer = 0;
                    
                    // Otoč sa k hráčovi
                    if (this.player.x < this.x) {
                        this.direction = -1;
                    } else {
                        this.direction = 1;
                    }
                }
                break;
                
            case 'preparing':
                this.speed = 0;
                this.setAnimation('idle');
                
                this.stateTimer += deltaTime; // S deltaTime
                if (this.stateTimer >= 20) {
                    this.state = 'attacking';
                    this.stateTimer = 0;
                }
                break;
                
            case 'attacking':
                this.speed = 0;
                this.setAnimation('attack');
                
                const attackProgress = this.stateTimer / this.attackDuration;
                if (attackProgress >= 0.3 && attackProgress <= 0.8) {
                    this.tongueActive = true;
                    this.updateTongueHitbox();
                } else {
                    this.tongueActive = false;
                    this.tongueHitbox = null;
                }
                
                this.stateTimer += deltaTime; // S deltaTime
                if (this.stateTimer >= this.attackDuration) {
                    this.state = 'cooldown';
                    this.stateTimer = 0;
                    this.tongueActive = false;
                    this.tongueHitbox = null;
                }
                break;
                
            case 'cooldown':
                this.speed = 0;
                this.setAnimation('idle');
                this.tongueActive = false;
                this.tongueHitbox = null;
                
                this.stateTimer += deltaTime; // S deltaTime
                if (this.stateTimer >= this.cooldownDuration) {
                    this.state = 'patrol';
                    this.stateTimer = 0;
                    this.speed = 0.7;
                }
                break;
        }
    }
    
    /**
     * ⬅️ OPRAVENÉ: Lepšia detekcia - kontrola horizontálnej A vertikálnej pozície
     */
    isPlayerInAttackRange() {
        if (!this.player) return false;
        
        // Horizontálna vzdialenosť
        const horizontalDistance = Math.abs(this.player.x - this.x);
        
        // Vertikálna vzdialenosť (rozdiel Y súradníc)
        const playerCenterY = this.player.y + this.player.height / 2;
        const enemyCenterY = this.y + this.height / 2;
        const verticalDistance = Math.abs(playerCenterY - enemyCenterY);
        
        // Kontrola smeru (hráč musí byť PRED Chameleonom)
        const isInFront = (this.direction === 1 && this.player.x > this.x) ||
                         (this.direction === -1 && this.player.x < this.x);
        
        // ⬅️ NOVÉ: Hráč musí byť:
        // 1. V horizontálnom dosahu (detection range)
        // 2. V vertikálnom dosahu (verticalTolerance) - približne na rovnakej výške
        // 3. Pred Chameleonom (nie za ním)
        return horizontalDistance <= this.detectionRange && 
               verticalDistance <= this.verticalTolerance &&
               isInFront;
    }
    
    updateTongueHitbox() {
        const tongueWidth = this.tongueRange;
        const tongueHeight = 20;
        
        let tongueX;
        if (this.direction === 1) {
            tongueX = this.x + this.width;
        } else {
            tongueX = this.x - tongueWidth;
        }
        
        const tongueY = this.y + (this.height / 2) - (tongueHeight / 2);
        
        this.tongueHitbox = {
            x: tongueX,
            y: tongueY,
            width: tongueWidth,
            height: tongueHeight
        };
    }
}











//============================================================
//


/**
 * COIN ANIMATION MANAGER
 * Správa animácií odmien - mince, diamanty
 */
class CoinAnimationManager {
    constructor() {
        // Cesta k obrázkom odmien
        this.basePath = 'images/superjozino/assets/treasure/';
        
        // Definícia typov odmien
        this.coinTypes = {
            // 💛 Normálne mince
            gold: {
                folder: 'Gold Coin',
                frames: 4,
                speed: 8
            },
            
            // 🥈 Strieborné mince - posluchové cvičenia (TODO: overiť cestu)
            silver: {
                folder: 'Silver Coin',
                frames: 4,
                speed: 8
            },
            
            // 💙 Modrý diamant - rečové cvičenia
            blueDiamond: {
                folder: 'Blue Diamond',
                frames: 4,
                speed: 6
            },
            
            // 💚 Zelený diamant - bonusový predmet (power-up)
            greenDiamond: {
                folder: 'Green Diamond',
                frames: 4,
                speed: 10
            },
            
            // ❤️ Červený diamant - bonusový predmet (extra život)
            redDiamond: {
                folder: 'Red Diamond',
                frames: 4,
                speed: 10
            }
        };
        
        // Načítané obrázky
        this.images = {};
        
        // Globálny frame counter (všetky mince sa animujú synchronizovane)
        this.globalFrame = 0;
        this.frameCounter = 0;
        
        // Načítanie všetkých sprite-ov
        this.loadAllSprites();
    }
    
    /**
     * Načítanie všetkých sprite frame-ov
     */
    loadAllSprites() {
        console.log('💰 Načítavam sprite-y odmien...');
        
        for (let typeName in this.coinTypes) {
            const coinType = this.coinTypes[typeName];
            this.images[typeName] = [];
            
            for (let i = 1; i <= coinType.frames; i++) {
                const img = new Image();
                // Formát: 01.png, 02.png, 03.png, 04.png
                const frameNumber = i.toString().padStart(2, '0');
                img.src = `${this.basePath}${coinType.folder}/${frameNumber}.png`;
                
                this.images[typeName].push(img);
                
                // Log pre prvý frame každého typu (pre debugging)
                if (i === 1) {
                    img.onload = () => {
                        console.log(`✅ Načítaná odmena: ${typeName} (${coinType.frames} frame-ov)`);
                    };
                    img.onerror = () => {
                        console.error(`❌ Chyba pri načítaní: ${img.src}`);
                    };
                }
            }
        }
    }
    
    /**
     * Update animácie (volať v game loop-e)
     * @param {number} deltaTime - Čas od posledného frame-u
     */
    update(deltaTime = 1) {
        // Počítadlo frame-ov s deltaTime
        this.frameCounter += deltaTime;
        
        // Všetky mince používajú rovnakú rýchlosť animácie
        if (this.frameCounter >= 10) { // speed z coinTypes
            this.frameCounter = 0;
            this.globalFrame++;
            
            // Loop animácie (4 frame-y: 0,1,2,3,0,1,2,3...)
            if (this.globalFrame >= 4) {
                this.globalFrame = 0;
            }
        }
    }
    
    /**
     * Vykreslenie odmeny
     * @param {CanvasRenderingContext2D} ctx - Canvas kontext
     * @param {string} type - Typ odmeny ('gold', 'blueDiamond', 'greenDiamond', 'redDiamond')
     * @param {number} x - X pozícia
     * @param {number} y - Y pozícia
     * @param {number} size - Veľkosť (šírka/výška)
     */
    draw(ctx, type, x, y, size) {
        const frameImage = this.images[type]?.[this.globalFrame];
        
        if (!frameImage || !frameImage.complete) {
            // Placeholder ak sprite ešte nie je načítaný
            ctx.fillStyle = type === 'gold' ? '#FFD700' : '#00FFFF';
            ctx.beginPath();
            ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
            ctx.fill();
            return;
        }
        
        // Vypni anti-aliasing pre pixel-perfect rendering
        ctx.imageSmoothingEnabled = false;
        
        // Zachovanie aspect ratio (pôvodných proporcií obrázka)
        const imgWidth = frameImage.naturalWidth || frameImage.width;
        const imgHeight = frameImage.naturalHeight || frameImage.height;
        const aspectRatio = imgWidth / imgHeight;
        
        let drawWidth = size;
        let drawHeight = size;
        
        // Ak obrázok nie je štvorec, zachováme proporcie
        if (aspectRatio > 1) {
            // Širší ako vyšší
            drawHeight = size / aspectRatio;
        } else if (aspectRatio < 1) {
            // Vyšší ako širší
            drawWidth = size * aspectRatio;
        }
        
        // Vycentruj obrázok
        const offsetX = (size - drawWidth) / 2;
        const offsetY = (size - drawHeight) / 2;
        
        // Vykresli animovaný sprite so zachovanými proporciami
        ctx.drawImage(frameImage, x + offsetX, y + offsetY, drawWidth, drawHeight);
    }
}

/**
 * CHECKPOINT ANIMATION MANAGER
 * Správa animácií checkpointov - neaktívny, aktivácia, idle
 */
class CheckpointAnimationManager {
    constructor() {
        // Cesta k obrázkom checkpointov
        this.basePath = 'images/superjozino/assets/checkpoint/';
        
        // Sprite sheety (veľké obrázky s frame-mi)
        this.spriteSheets = {
            noflag: null,      // Jednoduchý obrázok (stĺpik bez vlajky)
            flag: null,        // 1664x64px (26 frame-ov po 64px)
            idleflag: null     // 640x64px (10 frame-ov po 64px)
        };
        
        // Definícia animácií
        this.animations = {
            inactive: {
                spriteSheet: 'noflag',
                frames: 1,
                speed: 0  // Žiadna animácia
            },
            activating: {
                spriteSheet: 'flag',
                frames: 26,
                frameWidth: 64,
                speed: 2,  // Rýchla animácia aktivácie
                loop: false  // Prehráva sa len raz
            },
            idle: {
                spriteSheet: 'idleflag',
                frames: 10,
                frameWidth: 64,
                speed:4,  // Pomalšia idle animácia
                loop: true
            }
        };
        
        // Načítanie sprite sheetov
        this.loadSprites();
    }
    
    /**
     * Načítanie všetkých sprite sheetov
     */
    loadSprites() {
        console.log('🚩 Načítavam sprite-y checkpointov...');
        
        // Načítaj noflag
        this.spriteSheets.noflag = new Image();
        this.spriteSheets.noflag.src = `${this.basePath}noflag.png`;
        this.spriteSheets.noflag.onload = () => {
            console.log('✅ Načítaný checkpoint: noflag');
        };
        
        // Načítaj flag (aktivácia)
        this.spriteSheets.flag = new Image();
        this.spriteSheets.flag.src = `${this.basePath}flag.png`;
        this.spriteSheets.flag.onload = () => {
            console.log('✅ Načítaný checkpoint: flag (26 frame-ov)');
        };
        
        // Načítaj idleflag
        this.spriteSheets.idleflag = new Image();
        this.spriteSheets.idleflag.src = `${this.basePath}idleflag.png`;
        this.spriteSheets.idleflag.onload = () => {
            console.log('✅ Načítaný checkpoint: idleflag (10 frame-ov)');
        };
    }
    
    /**
     * Update animácie checkpointu
     * @param {Object} checkpoint - Checkpoint objekt
     * @param {number} deltaTime - Čas od posledného frame-u
     */
    updateCheckpoint(checkpoint, deltaTime = 1) {
        // Inicializuj animačné vlastnosti ak neexistujú
        if (!checkpoint.animState) {
            // Prvý checkpoint (isStart) a finish začínajú ako idle
            if (checkpoint.isStart || checkpoint.isFinish) {
                checkpoint.animState = 'idle';
            } else {
                checkpoint.animState = 'inactive';
            }
            checkpoint.animFrame = 0;
            checkpoint.animCounter = 0;
        }
        
        const anim = this.animations[checkpoint.animState];
        if (!anim || anim.frames <= 1) return;
        
        // Počítadlo s deltaTime
        checkpoint.animCounter += deltaTime;
        
        // Posun na ďalší frame
        if (checkpoint.animCounter >= anim.speed) {
            checkpoint.animCounter = 0;
            checkpoint.animFrame++;
            
            // Koniec animácie
            if (checkpoint.animFrame >= anim.frames) {
                if (anim.loop) {
                    // Loop animácia (idle)
                    checkpoint.animFrame = 0;
                } else {
                    // Animácia sa prehráva len raz (activating)
                    checkpoint.animFrame = anim.frames - 1; // Zostaň na poslednom frame
                    checkpoint.animState = 'idle'; // Prejdi do idle stavu
                    checkpoint.animFrame = 0;
                }
            }
        }
    }
    
    /**
     * Aktivácia checkpointu (spustenie animácie)
     * @param {Object} checkpoint - Checkpoint objekt
     */
    activateCheckpoint(checkpoint) {
        if (checkpoint.animState !== 'inactive') return;
        
        console.log('🚩 Aktivujem checkpoint!');
        checkpoint.animState = 'activating';
        checkpoint.animFrame = 0;
        checkpoint.animCounter = 0;
    }
    
    /**
     * Vykreslenie checkpointu
     * @param {CanvasRenderingContext2D} ctx - Canvas kontext
     * @param {Object} checkpoint - Checkpoint objekt
     */
    draw(ctx, checkpoint) {
        // Inicializuj animačný stav ak neexistuje
        if (!checkpoint.animState) {
            // Prvý checkpoint (isStart) začína ako idle, ostatné ako inactive
            if (checkpoint.isStart || checkpoint.isFinish) {
                checkpoint.animState = 'idle';
            } else {
                checkpoint.animState = checkpoint.active ? 'idle' : 'inactive';
            }
            checkpoint.animFrame = 0;
            checkpoint.animCounter = 0;
        }
        
        const anim = this.animations[checkpoint.animState];
        const spriteSheet = this.spriteSheets[anim.spriteSheet];
        
        if (!spriteSheet || !spriteSheet.complete) {
            // Placeholder - starý spôsob vykreslenia
            this.drawOldStyle(ctx, checkpoint);
            return;
        }
        
        // Vypni anti-aliasing
        ctx.imageSmoothingEnabled = false;
        
        // Výpočet pozície frame-u v sprite sheete
        let sourceX = 0;
        if (anim.frames > 1) {
            sourceX = checkpoint.animFrame * anim.frameWidth;
        }
        
        // Vypočítaj veľkosť vykreslenia
        const drawWidth = checkpoint.width || 64;
        const drawHeight = checkpoint.height || 64;
        
        // Pre finish flag môžeme upraviť pozíciu aby bol vyššie
        let drawY = checkpoint.y;
        if (checkpoint.isFinish) {
            // Posun Y hore aby vlajka bola vyššie (ale collision box zostane rovnaký)
            drawY = checkpoint.y - (drawHeight - 64) / 2;
        }
        
        // Vykresli checkpoint
        ctx.drawImage(
            spriteSheet,
            sourceX, 0,              // Pozícia v sprite sheete
            anim.frameWidth || 64, 64,  // Veľkosť frame-u v sprite sheete
            checkpoint.x,
            drawY,
            drawWidth,   // Veľkosť na canvase
            drawHeight
        );
    }
    
    /**
     * Starý štýl vykreslenia (fallback)
     */
    drawOldStyle(ctx, checkpoint) {
        // Kreslenie stožiaru vlajky
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(
            checkpoint.x,
            checkpoint.y,
            checkpoint.width,
            checkpoint.height
        );

        // Kreslenie vlajky
        ctx.beginPath();
        ctx.fillStyle = checkpoint.isStart ? '#00FF00' : (checkpoint.active ? '#FF0000' : '#800000');
        
        if (checkpoint.active) {
            // Vztýčená vlajka
            ctx.moveTo(checkpoint.x, checkpoint.y);
            ctx.lineTo(checkpoint.x + 30, checkpoint.y + 15);
            ctx.lineTo(checkpoint.x, checkpoint.y + 30);
        } else {
            // Spustená vlajka
            ctx.moveTo(checkpoint.x, checkpoint.y + checkpoint.height - 30);
            ctx.lineTo(checkpoint.x + 30, checkpoint.y + checkpoint.height - 15);
            ctx.lineTo(checkpoint.x, checkpoint.y + checkpoint.height);
        }
        ctx.fill();
    }
}


class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        // Svet je vysoký 800 px; šírka plátna podľa pomeru strán obrazovky,
        // takže hra vyplní celú plochu (na širokom telefóne vidno viac sveta).
        this.worldH = 800;
        this.belowWorld = 160; // koľko hliny pod svetom môže kamera ukázať
        this.camera = { x: 0, y: 0, look: 0 };
        this.fitCanvas();
        window.addEventListener('resize', () => this.fitCanvas());

        // Pozadie s paralaxou (les zo sveta L)
        this.bgImage = new Image();
        this.bgImage.src = 'images/worlds/world_l.png';
        
        // Herné vlastnosti
        this.gravity = 0.4;
        this.friction = 0.75;
        this.maxFallSpeed = 12;
        this.currentLevel = SJ.map;
        this.startedAt = Date.now();
        this.gameState = 'playing'; // 'playing', 'paused', 'completed'
        this.lives = 3;
        this.isInvulnerable = false;
        this.invulnerableTime = 2000; // 2 sekundy nezraniteľnosti po zásahu
        this.lastCheckpoint = null;

        // Mince a diamanty
        this.collectedCoins = 0;
        this.totalCoins = 0;
        this.collectedDiamonds = 0;
        this.requiredDiamonds = this.currentLevelData?.diamonds?.length || 4;

        // debug mód
        this.debug = false;
        this.debugInfo = document.getElementById('debugInfo');
        this.setupDebugControls();
        this.lastTime = 0;
        this.fps = 0;
    
        // Inicializácia hráča
        // Inicializácia hráča
        this.player = {
            x: 100,
            y: 100,
            
            // COLLISION BOX - skutočná veľkosť pre kolízie (menšia!)
            width: 32,      // Šírka collision boxu (užší)
            height: 64,     // Výška collision boxu (vyšší, ale menší ako sprite)
            
            // SPRITE - veľkosť obrázka (väčší pre vizuál)
            spriteWidth: 96,   // Šírka sprite-u
            spriteHeight: 96,  // Výška sprite-u
            
            // OFFSET - posun sprite-u relatívne k collision boxu
            spriteOffsetX: -32,  // Posun doľava aby bol sprite centrovaný (96-32)/2 = 32
            spriteOffsetY: -22,  // Posun hore aby nohy boli na spodku collision boxu
            
            velocityX: 0,
            velocityY: 0,
            speed: 4.2,
            jumpForce: -11.2,
            isJumping: false,
            onGround: false,
            facing: 1,
            coyote: 0,
            jumpBuffer: 0,
            prevBottom: 0
        };
        this.animationManager = new AnimationManager();
        this.coinAnimationManager = new CoinAnimationManager();
        this.checkpointAnimationManager = new CheckpointAnimationManager();
        this.enemyAnimationManager = new EnemyAnimationManager(); 

        // Kamera
        this.camera = {
            x: 0,
            y: 0
        };

        
        // ==========================================
        // NAČÍTANIE SPRITE SHEETOV
        // ==========================================

        // Terrain sprite sheet (obsahuje zem, platformy, bloky)
        this.terrainSprite = new Image();
        this.terrainSprite.src = 'images/superjozino/assets/terrain.png';
        this.terrainSprite.loaded = false;

        // Event listener pre načítanie sprite sheetu
        this.terrainSprite.onload = () => {
            this.terrainSprite.loaded = true;
            console.log('✅ Terrain sprite sheet načítaný');
        };

        this.terrainSprite.onerror = () => {
            console.error('❌ Chyba pri načítaní terrain sprite sheetu!');
            console.error('Skontroluj cestu: images/superjozino/assets/terrain.png');
        };

        // Definícia tile-ov v sprite sheete (súradnice a rozmery)
        this.tiles = {
            ground: {
                x: 98,      // Pozícia X v sprite sheete
                y: 2,       // Pozícia Y v sprite sheete
                width: 45,  // Šírka tile-u
                height: 45  // Výška tile-u
            },
            // Platformy (4 typy)
            platform1: {
                x: 193,     // Začiatok x
                y: 2,       // Začiatok y
                width: 46,  // Šírka (239 - 193)
                height: 13  // Výška (15 - 2)
            },
            platform2: {
                x: 193,     // Začiatok x
                y: 16,      // Začiatok y
                width: 14,  // Šírka (207 - 193)
                height: 14  // Výška (30 - 16)
            },
            platform3: {
                x: 209,     // Začiatok x
                y: 16,      // Začiatok y
                width: 30,  // Šírka (239 - 209)
                height: 30  // Výška (46 - 16)
            },
            platform4: {
                x: 242,     // Začiatok x
                y: 2,       // Začiatok y
                width: 14,  // Šírka (256 - 242)
                height: 44  // Výška (46 - 2)
            }
        };

        // Speech UI
        this.createSpeechUI();

        // Načítanie levelu
        this.loadLevel(this.currentLevel);

        // animacia smrti
        this.deathAnimation = {
            active: false,
            timer: 0,
            duration: 70, // počet krokov hry (~1,2 s)
            type: null // 'gap' alebo 'enemy'
        };

        // Ovládanie

        // Exponuj game objekt pre joystick
        window.game = this;

        // Efekty a bloky (sj-fx.js, sj-blocks.js)
        this.fxInit();
        this.blocksInit();
        this.totalCoins += this.bonusCoins;

        // Spustenie hernej slučky
        this.lastTime = null;
        this.updateCamera(true);
        requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    setupDebugControls() {
        if (/[?&]debug\b/.test(location.search)) document.documentElement.classList.add('sj-debug');
        const toggleBtn = document.getElementById('toggleDebug');
        toggleBtn.addEventListener('click', () => {
            this.debug = !this.debug;
            toggleBtn.textContent = `Debug Mode: ${this.debug ? 'ON' : 'OFF'}`;
        });

        // Pridáme aj klávesovú skratku 'D'
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyD') {
                this.debug = !this.debug;
                toggleBtn.textContent = `Debug Mode: ${this.debug ? 'ON' : 'OFF'}`;
            }
        });
    }

    createSpeechUI() {
        // Vytvorenie modálneho okna pre rečové cvičenia
        this.speechModal = document.createElement('div');
        this.speechModal.className = 'speech-modal';
        this.speechModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        (document.getElementById('bj-stage') || document.body).appendChild(this.speechModal);
    }

    hideSpeechExercise() {
        this.speechModal.style.display = 'none';
    }


    showGameOver() {
        const modalContent = `
            <div class="game-over-content">
                <h2>Game Over</h2>
                <p>Zozbierané mince: ${this.collectedCoins}/${this.totalCoins}</p>
                <p>Zozbierané diamanty: ${this.collectedDiamonds}/${this.requiredDiamonds}</p>
                <div class="game-over-buttons">
                    <button class="button" onclick="location.href=SJ.backUrl">Späť</button>
                    <button class="button button--primary" id="restartLevel">Znova</button>
                </div>
            </div>
        `;
        
        this.speechModal.innerHTML = modalContent;
        this.speechModal.style.display = 'flex';
        this.speechModal.className = 'modal game-over-modal';

        document.getElementById('restartLevel').addEventListener('click', () => location.reload());
    }

    handleCheckpoints() {
        for (let checkpoint of this.currentLevelData.checkpoints) {
            if (!checkpoint.active && this.checkCollision(this.player, checkpoint)) {
                this.activateCheckpoint(checkpoint);
            }
        }
    }

    activateCheckpoint(checkpoint) {
        // Deaktivujeme predchádzajúci checkpoint
        if (this.lastCheckpoint && this.lastCheckpoint !== checkpoint) {
            this.lastCheckpoint.active = false;
            // Resetuj animáciu predchádzajúceho checkpointu
            this.lastCheckpoint.animState = 'inactive';
            this.lastCheckpoint.animFrame = 0;
        }

        // Aktivujeme nový checkpoint
        checkpoint.active = true;
        this.lastCheckpoint = checkpoint;

        // Spustíme animáciu aktivácie
        this.checkpointAnimationManager.activateCheckpoint(checkpoint);
        
        console.log('🚩 Checkpoint aktivovaný!');
        // TODO: Pridať zvukový efekt
    }

    respawnAtCheckpoint() {
        const cp = this.lastCheckpoint;
        if (cp) {
            // na zemi pod stĺpikom checkpointu
            this.player.x = cp.x + cp.width / 2 - this.player.width / 2;
            this.player.y = cp.y + cp.height - this.player.height;
        } else {
            // Ak nie je žiadny checkpoint, začneme od začiatku levelu
            const sp = this.currentLevelData.spawn || { x: 100, y: 100 };
            this.player.x = sp.x;
            this.player.y = sp.y;
        }
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.player.isJumping = false;
        this.player.onGround = false;
        this.player.standOn = null;
        this.player.locked = true; // ovládanie až po dopade
        this.player.facing = 1;
        this.player.canDouble = true;
        this.player.hurtT = 0;
        this.isInvulnerable = true;
        this.updateCamera(true);
        this.appearPlayer();

        // Krátka doba nezraniteľnosti po respawne
        clearTimeout(this.invulnTimer);
        this.invulnTimer = setTimeout(() => {
            this.isInvulnerable = false;
        }, this.invulnerableTime);
    }


    drawDebugInfo() {
        if (!this.debug) return;
    
        this.ctx.save();

        this.drawDebugGrid();
        this.drawCollisionBoxes();
        this.drawObjectInfo();
        this.ctx.restore();
        this.drawFixedDebugInfo();

        this.ctx.strokeStyle = 'cyan';
        for (let diamond of this.currentLevelData.diamonds) {
            if (!diamond.collected) {
                this.ctx.strokeRect(
                    diamond.x,
                    diamond.y,
                    diamond.width,
                    diamond.height
                );
            }
        }  

    }

    drawDebugGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        // Vertikálne čiary
        for (let x = 0; x < this.currentLevelData.width; x += 100) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.worldH);
            this.ctx.stroke();
        }

        // Horizontálne čiary
        for (let y = 0; y < this.worldH; y += 100) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.currentLevelData.width, y);
            this.ctx.stroke();
        }
    }

    drawCollisionBoxes() {
        // Hráč
        this.ctx.strokeStyle = 'red';
        this.ctx.strokeRect(
            this.player.x, 
            this.player.y, 
            this.player.width, 
            this.player.height
        );

        // Platformy
        this.ctx.strokeStyle = 'yellow';
        for (let platform of this.currentLevelData.platforms) {
            this.ctx.strokeRect(
                platform.x,
                platform.y,
                platform.width,
                platform.height
            );
        }

        //Nepriatelia
        this.ctx.strokeStyle = 'purple';
        for (let enemy of this.currentLevelData.enemies) {
            this.ctx.strokeRect(
                enemy.x,
                enemy.y,
                enemy.width,
                enemy.height
            );
            
            // Trasa nepriateľa
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(enemy.startX, enemy.y + enemy.height/2);
            this.ctx.lineTo(enemy.endX, enemy.y + enemy.height/2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            // ⬅️ PRIDANÉ: Debug tongue hitbox (Chameleon)
            if (enemy.behaviorType === 'chameleon' && enemy.tongueActive && enemy.tongueHitbox) {
                this.ctx.strokeStyle = 'red';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(
                    enemy.tongueHitbox.x,
                    enemy.tongueHitbox.y,
                    enemy.tongueHitbox.width,
                    enemy.tongueHitbox.height
                );
                this.ctx.lineWidth = 1;
            }
            
            // ⬅️ PRIDANÉ: Debug detection range (Chameleon)
            if (enemy.behaviorType === 'chameleon' && this.debug) {
                this.ctx.strokeStyle = 'orange';
                this.ctx.setLineDash([2, 2]);
                this.ctx.beginPath();
                
                // Detekčná zóna - polkruh pred chameleonom
                if (enemy.direction === 1) {
                    // Doprava
                    this.ctx.arc(
                        enemy.x + enemy.width,
                        enemy.y + enemy.height/2,
                        enemy.detectionRange,
                        -Math.PI/2,
                        Math.PI/2
                    );
                } else {
                    // Doľava
                    this.ctx.arc(
                        enemy.x,
                        enemy.y + enemy.height/2,
                        enemy.detectionRange,
                        Math.PI/2,
                        Math.PI*1.5
                    );
                }
                
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            }
        }

        // Mince
        this.ctx.strokeStyle = 'gold';
        for (let coin of this.currentLevelData.coins) {
            if (!coin.collected) {
                this.ctx.strokeRect(
                    coin.x,
                    coin.y,
                    coin.width,
                    coin.height
                );
            }
        }
    }

    drawObjectInfo() {
        this.ctx.font = '12px monospace';
        this.ctx.fillStyle = 'white';

        // Informácie o hráčovi
        this.ctx.fillText(
            `x: ${Math.round(this.player.x)} y: ${Math.round(this.player.y)}`,
            this.player.x,
            this.player.y - 20
        );
        this.ctx.fillText(
            `vx: ${this.player.velocityX.toFixed(2)} vy: ${this.player.velocityY.toFixed(2)}`,
            this.player.x,
            this.player.y - 35
        );
    }

    drawFixedDebugInfo() {
        // Aktualizácia debug panelu
        if (this.debugInfo) {
            this.debugInfo.innerHTML = `
                <div>FPS: ${Math.round(this.fps || 0)}</div>
                <div>Camera X: ${Math.round(this.camera.x)}</div>
                <div>Player State: ${this.player.isJumping ? 'Jumping' : 'Grounded'}</div>
                <div>Game State: ${this.gameState}</div>
                <div>Lives: ${this.lives}</div>
                <div>Coins: ${this.collectedCoins}/${this.totalCoins}</div>
                <div>Diamonds: ${this.collectedDiamonds}/${this.requiredDiamonds}</div>
            `;
        }
    }
    
    loadLevel(levelNumber) {
        if (!LEVELS[levelNumber]) {
            console.error('Level neexistuje!');
            return;
        }

        this.currentLevelData = LEVELS[levelNumber].data;
        const L = this.currentLevelData;
        // výška sveta: dlaždicové levely majú vlastnú, pôvodné 800
        this.worldH = L.height || 800;
        this.belowWorld = L.belowWorld ?? 160;
        const sp = L.spawn || { x: 100, y: 100 };
        this.player.x = sp.x;
        this.player.y = sp.y;
        this.player.appear = 21;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        
        // Počítanie celkového počtu mincí a diamantov
        this.totalCoins = this.currentLevelData.coins.length;
        this.collectedCoins = 0;
        this.collectedDiamonds = 0;
        // do cieľa treba modré diamanty (rečové cvičenia); zelený a červený sú bonus
        this.requiredDiamonds = this.currentLevelData.diamonds.filter((d) => d.type === 'blueDiamond').length;
    }


    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    handleSpecialBlockCollision() {
        for (let block of this.currentLevelData.specialBlocks) {
            if (!block.hit && this.checkCollision(this.player, block)) {
                // Zberie sa pri akomkoľvek kontakte (nie len pri skoku zdola)
                block.hit = true;
                this.collectSpecialItem(block.itemType);
                
                // Zvukový efekt alebo animácia (TODO)
                console.log(`✨ Získaný bonus: ${block.itemType}`);
            }
        }
    }

    collectSpecialItem(type, block) {
        const x = block ? block.x + block.width / 2 : this.player.x + this.player.width / 2;
        const y = block ? block.y + block.height / 2 : this.player.y;
        this.fxGem(type, x, y);
        if (!this.currentLevelData.collectedSpecialItems) this.currentLevelData.collectedSpecialItems = [];
        this.currentLevelData.collectedSpecialItems.push(type);
    }

    /**
     * Kontrola kolízií s nepriateľmi
     */
    handleEnemyCollisions() {
        if (this.isInvulnerable) return;

        for (let enemy of this.currentLevelData.enemies) {
            if (!enemy.alive || !enemy.visible) continue;
            
            // ⬅️ NOVÉ: Kontrola tongue attack (Chameleon)
            if (enemy.behaviorType === 'chameleon' && enemy.tongueActive && enemy.tongueHitbox) {
                // Kontrola kolízie jazyka s hráčom
                if (this.checkCollision(this.player, enemy.tongueHitbox)) {
                    console.log('👅 Chameleon ťa trafil jazykom!');
                    this.hitByEnemy(enemy);
                    // Deaktivuj jazyk aby neudieral opakovane
                    enemy.tongueActive = false;
                    enemy.tongueHitbox = null;
                    continue;  // Preskočiť normálnu kolíziu
                }
            }
            
            // PhasingGhost kontrola
            if (enemy.ghostType === 'phasing' && !enemy.canHurt) {
                continue;
            }
            
            if (this.checkCollision(this.player, enemy)) {
                
                // Ghost je nezabiteľný
                if (enemy.behaviorType === 'ghost') {
                    this.hitByEnemy(enemy);
                    continue;
                }
                
                // ⬅️ NOVÉ: Chameleon - dá sa zabiť len skokom zhora (ako Pig)
                if (enemy.behaviorType === 'chameleon') {
                    const playerBottom = this.player.y + this.player.height;
                    const enemyTop = enemy.y;
                    const jumpTolerance = 14;
                    
                    const isJumpingOnEnemy = this.player.velocityY > 0 &&
                                            this.player.prevBottom <= enemyTop + jumpTolerance;
                    
                    if (isJumpingOnEnemy) {
                        enemy.hit();
                        this.player.velocityY = (window.SJInput && window.SJInput.jump) ? -12 : -8; this.fxStomp(enemy);
                        console.log(`💀 Zabil si ${enemy.type}!`);
                    } else {
                        // Dotyk zboku/zdola = damage
                        this.hitByEnemy(enemy);
                    }
                    continue;
                }
                
                // Lietajúci nepriateľ (Bat) - zhora aj zdola
                if (enemy.behaviorType === 'flying' || enemy.behaviorType === 'sleeping') {
                    const playerBottom = this.player.y + this.player.height;
                    const playerTop = this.player.y;
                    const enemyTop = enemy.y;
                    const enemyBottom = enemy.y + enemy.height;
                    const jumpTolerance = 14;
                    
                    const isJumpingOnTop = this.player.velocityY > 0 &&
                                        this.player.prevBottom <= enemyTop + jumpTolerance;
                    
                    const isJumpingFromBelow = this.player.velocityY < 0 &&
                                            playerTop >= enemyBottom - jumpTolerance;
                    
                    if (isJumpingOnTop || isJumpingFromBelow) {
                        if (enemy.killable || enemy.stunnable) {
                            enemy.hit();
                            
                            if (isJumpingOnTop) {
                                this.player.velocityY = (window.SJInput && window.SJInput.jump) ? -12 : -8; this.fxStomp(enemy);
                            } else {
                                this.player.velocityY = 5;
                            }
                            
                            console.log(`💀 Zabil si ${enemy.type}!`);
                        } else {
                            this.hitByEnemy(enemy);
                        }
                    } else {
                        this.hitByEnemy(enemy);
                    }
                    
                } else {
                    // Pozemný nepriateľ (Pig) - len zhora
                    const playerBottom = this.player.y + this.player.height;
                    const enemyTop = enemy.y;
                    const jumpTolerance = 14;
                    
                    const isJumpingOnEnemy = this.player.velocityY > 0 &&
                                            this.player.prevBottom <= enemyTop + jumpTolerance;
                    
                    if (isJumpingOnEnemy) {
                        if (enemy.killable || enemy.stunnable) {
                            enemy.hit();
                            this.player.velocityY = (window.SJInput && window.SJInput.jump) ? -12 : -8; this.fxStomp(enemy);
                            console.log(`💀 Zabil si ${enemy.type}!`);
                        } else {
                            this.hitByEnemy(enemy);
                        }
                    } else {
                        this.hitByEnemy(enemy);
                    }
                }
            }
        }
    }

    handleCoinCollection() {
        const p = this.player;
        const near = (o) => Math.abs(o.x - p.x) < 120;
        // mince (zlatá = +1, strieborná = posluchové cvičenie)
        for (let coin of this.currentLevelData.coins) {
            if (coin.collected || !near(coin) || !this.checkCollision(p, coin)) continue;
            coin.collected = true;
            this.collectedCoins++;
            this.fxCoin(coin);
            if (coin.type === 'silver') this.startListening(coin);
        }

        // drahokamy (modrý = rečové cvičenie, zelený = super skok, červený = život)
        for (let diamond of this.currentLevelData.diamonds) {
            if (diamond.collected || !near(diamond) || !this.checkCollision(p, diamond)) continue;
            diamond.collected = true;
            const cx = diamond.x + diamond.width / 2;
            const cy = diamond.y + diamond.height / 2;
            if (diamond.type === 'blueDiamond') {
                this.fxGem('blueDiamond', cx, cy);
                this.collectedDiamonds++;
                this.flyToHud(cx, cy, 'hudDiamonds', 'blueDiamond');
                if (!diamond.speechExercise.completed) this.showSpeechExercise(diamond.speechExercise);
            } else if (diamond.type === 'silver') {
                this.fxCoin(diamond);
                this.startListening(diamond);
            } else {
                this.fxGem(diamond.type, cx, cy);
            }
        }
    }

    /** Strieborná minca: posluchové cvičenie „Rovnaké alebo iné?“. */
    startListening(coin) {
        // malé oneskorenie – dieťa vidí, že mincu zobralo
        this.gameState = 'listening';
        if (window.SJInput) window.SJInput.reset();
        setTimeout(() => this.showListeningExercise((ok) => {
            coin.listeningOk = ok;
        }), 350);
    }

    /** Skok na nepriateľa. */
    fxStomp(enemy) {
        if (window.SJSound) window.SJSound('stomp');
        const x = enemy.x + enemy.width / 2;
        this.burst(x, enemy.y, ['#ffffff', '#FFD900'], 10, 2.8, { gravity: 0.05 });
        this.floatText(x, enemy.y - 10, 'BUM!', '#ffffff');
    }

    async handleDiamondCollection(coin) {
        if (!coin.collected) {
            this.gameState = 'speech';
            this.showSpeechExercise(coin.speechExercise);
        }
    }

    /**
     * Koniec levelu: hviezdy podľa mincí a vyslovených slov, uloženie postupu
     * sveta (odomkne ďalší level, udelí karty) a okno s výsledkom.
     */
    showLevelComplete() {
        if (this.gameState === 'completed') return;
        this.gameState = 'completed';
        if (window.SJInput) window.SJInput.reset();

        const coinShare = this.totalCoins ? this.collectedCoins / this.totalCoins : 1;
        const speech = this.currentLevelData.diamonds.filter((d) => d.speechExercise);
        const spokenOk = speech.filter((d) => d.speechExercise.completed).length;
        const speechShare = speech.length ? spokenOk / speech.length : 1;
        let stars = 1;
        if (coinShare >= 0.5 && speechShare >= 0.5) stars = 2;
        if (coinShare >= 0.85 && speechShare >= 0.99) stars = 3;
        const time = Math.round((Date.now() - this.startedAt) / 1000);

        this.speechModal.innerHTML = `
            <div class="level-complete-content">
                <h2>Výborne!</h2>
                <div class="stars">
                    ${[0, 1, 2].map((i) => `<img src="images/star_active.png" alt="" class="${i < stars ? '' : 'off'}">`).join('')}
                </div>
                <p>Ovocie: ${this.collectedCoins} / ${this.totalCoins}</p>
                <p>Slová: ${spokenOk} / ${speech.length}</p>
                <div data-reward-slot></div>
                <div class="game-over-buttons">
                    <button class="button" id="sjAgain">Znova</button>
                    <button class="button button--primary" id="sjNext">${SJ.inWorld ? 'Ďalej' : 'Späť'}</button>
                </div>
            </div>
        `;
        this.speechModal.className = 'speech-modal modal level-complete-modal';
        this.speechModal.style.display = 'flex';
        document.getElementById('sjAgain').onclick = () => location.reload();
        document.getElementById('sjNext').onclick = () => { location.href = SJ.backUrl; };
        if (window.SJSound) window.SJSound('win');
        try { window.BJ && window.BJ.say('Výborne! Level je hotový.'); } catch (e) { /* bez hlasu */ }

        if (SJ.inWorld && window.progressManager) {
            try {
                window.progressManager.saveLevelProgress(SJ.worldId, SJ.levelId, stars, {
                    time,
                    completion: Math.round(coinShare * 100),
                });
            } catch (e) {
                console.error('Uloženie postupu zlyhalo:', e);
            }
        }
    }

    /**
     * Kamera sleduje hráča vodorovne aj zvislo.
     *  - vodorovne: hráč mierne za stredom, kamera sa pozerá dopredu v smere behu,
     *  - zvislo: pokojná zóna v strede obrazovky; keď hráč stojí, kamera sa
     *    plynulo zarovná tak, aby bolo vidno zem pod ním aj priestor nad ním.
     * @param {boolean} snap – nastaviť hneď (štart, oživenie)
     */
    updateCamera(snap) {
        const p = this.player;
        const L = this.currentLevelData;
        if (!L || !this.viewW) return;
        const vw = this.viewW;
        const vh = this.viewH;
        const cam = this.camera;

        const lookTarget = (p.facing || 1) * vw * 0.12;
        cam.look = snap ? lookTarget : cam.look + (lookTarget - cam.look) * 0.03;
        const tx = p.x + p.width / 2 - vw / 2 + cam.look;

        let ty = cam.ty == null ? p.y + p.height - vh * this.feetAt : cam.ty;
        const feet = p.y + p.height;
        if (p.onGround || snap) {
            ty = feet - vh * this.feetAt;
        } else {
            const top = ty + vh * 0.25;
            const bottom = ty + vh * 0.8;
            if (p.y < top) ty = p.y - vh * 0.25;
            else if (feet > bottom) ty = feet - vh * 0.8;
        }
        // kamera smie ísť kúsok pred začiatok levelu a pod spodok sveta
        // (dokreslená zem/hlina) – postava tak nie je pod dotykovými tlačidlami
        const minX = L.tilemap ? 0 : -vw * 0.18;
        const maxX = L.tilemap ? Math.max(0, L.width - vw) : Math.max(minX, L.width - vw * 0.82);
        const maxY = Math.max(0, this.worldH + this.belowWorld - vh);
        const clampX = Math.max(minX, Math.min(maxX, tx));
        // dlaždicové levely: kamera môže ísť aj nad mapu (obloha) pri vysokom skoku
        const minY = L.tilemap ? -vh * 0.6 : 0;
        ty = Math.max(minY, Math.min(maxY, ty));
        cam.ty = ty;

        if (snap) {
            cam.x = clampX;
            cam.y = ty;
        } else {
            cam.x += (clampX - cam.x) * 0.15;
            cam.y += (ty - cam.y) * (p.onGround ? 0.07 : 0.12);
        }
    }

    /**
     * Zásah nepriateľom: stratí život, odhodí ho dozadu a chvíľu bliká
     * (nezraniteľný). Na checkpoint sa vracia len po páde do diery.
     */
    hitByEnemy(enemy) {
        if (this.isInvulnerable) return;
        this.lives--;
        if (this.lives <= 0) {
            this.gameOver();
            return;
        }
        const p = this.player;
        p.hurtT = 30;
        if (window.SJSound) window.SJSound('hit');
        this.shake = 12;
        this.burst(p.x + p.width / 2, p.y + p.height / 2, ['#ff4d5e', '#ffffff'], 12, 3.4);
        this.floatText(p.x + p.width / 2, p.y - 6, '-1', '#ff4d5e');
        const from = enemy ? enemy.x + enemy.width / 2 : p.x + p.width / 2 - p.facing;
        const away = p.x + p.width / 2 < from ? -1 : 1;
        p.velocityX = away * 7;
        p.velocityY = -8;
        p.onGround = false;
        this.isInvulnerable = true;
        clearTimeout(this.invulnTimer);
        this.invulnTimer = setTimeout(() => { this.isInvulnerable = false; }, this.invulnerableTime);
    }

    /**
     * Aktualizácia všetkých nepriateľov v leveli
     * @param {number} deltaTime - Čas od posledného frame-u (normalizovaný na 60 FPS)
     */
    updateEnemies(deltaTime) {
        for (let enemy of this.currentLevelData.enemies) {
            // Nastav player referenciu pre Chameleon (potrebuje pre detekciu)
            if (enemy.behaviorType === 'chameleon') {
                enemy.player = this.player;
            }
            
            // Aktualizuj správanie nepriateľa - pošli deltaTime
            enemy.update(deltaTime);
            
            // Aktualizuj animáciu nepriateľa - pošli deltaTime
            this.enemyAnimationManager.updateAnimation(enemy, deltaTime);
        }
    }

    startDeathAnimation(type) {
        this.deathAnimation.active = true;
        this.deathAnimation.timer = 0;
        this.deathAnimation.type = type;
        this.lives--;
    }

    checkGapCollision() {
        // pád pod svet (aj mimo definovanej diery)
        if (this.player.y > this.worldH + 20 && !this.deathAnimation.active) {
            this.startDeathAnimation('gap');
            return true;
        }
        for (let gap of this.currentLevelData.gaps) {
            if (this.checkCollision(this.player, gap)) {
                if (!this.deathAnimation.active) {
                    this.startDeathAnimation('gap');
                }
                return true;
            }
        }
        return false;
    }

    updateDeathAnimation(deltaTime) {
        if (!this.deathAnimation.active) return;

        this.deathAnimation.timer += deltaTime;

        if (this.deathAnimation.type === 'gap') {
            // Padanie do diery
            this.player.velocityY += this.gravity;
            this.player.y += this.player.velocityY;
        }

        // Keď hráč spadne dostatočne hlboko alebo uplynie čas animácie
        if (this.player.y > this.worldH + 100 || this.deathAnimation.timer >= this.deathAnimation.duration) {
            this.deathAnimation.active = false;
            if (this.lives <= 0) {
                this.gameOver();
            } else {
                this.respawnAtCheckpoint();
            }
        }
    }

    gameOver() {
        this.gameState = 'gameOver';
        
        // Vytvorenie game over obrazovky
        const modalContent = `
            <div class="game-over-content">
                <h2>Koniec hry</h2>
                <p>Mince: ${this.collectedCoins}/${this.totalCoins}</p>
                <p>Diamanty: ${this.collectedDiamonds}/${this.requiredDiamonds}</p>
                <div class="game-over-buttons">
                    <button class="button" onclick="location.href=SJ.backUrl">Späť</button>
                    <button class="button button--primary" id="restartLevel">Znova</button>
                </div>
            </div>
        `;
        
        this.speechModal.innerHTML = modalContent;
        this.speechModal.style.display = 'flex';

        // Pridanie event listenera pre reštart levelu
        document.getElementById('restartLevel').addEventListener('click', () => location.reload());
    }

    restartLevel() {
        // Reset všetkých potrebných vlastností
        this.lives = 3;
        this.collectedCoins = 0;
        this.collectedDiamonds = 0;
        this.lastCheckpoint = null;
        this.isInvulnerable = false;
        this.deathAnimation.active = false;
        
        // Znovu načítanie levelu
        this.loadLevel(this.currentLevel);
        
        // Skrytie modálneho okna
        this.speechModal.style.display = 'none';
        
        // Obnovenie hry
        this.gameState = 'playing';
    }

    /**
     * Aktualizácia hernej logiky
     * @param {number} timestamp - Aktuálny čas v milisekundách
     */
    /**
     * Jeden krok hry (vždy 1/60 s – viď gameLoop). Pevný krok = rovnaké
     * správanie na rýchlom aj pomalom telefóne a kolízie sedia s pohybom.
     */
    update() {
        if (this.gameState !== 'playing') return;
        this.tick = (this.tick || 0) + 1;
        this.fxUpdate();

        if (this.deathAnimation.active) {
            this.updateDeathAnimation(1);
            this.updatePlayerAnimation();
            this.updateCamera();
            return;
        }

        this.blocksUpdate();
        this.updatePlayer();

        // Aktualizácia nepriateľov
        this.updateEnemies(0.8); // nepriatelia o niečo pomalší

        // Ostatné kontroly
        this.handleEnemyCollisions();
        this.handleCheckpoints();
        this.checkGapCollision();
        this.handleCoinCollection();
        this.checkFinish();

        this.updatePlayerAnimation(); // sj-player.js
        this.coinAnimationManager.update(1);
        for (let checkpoint of this.currentLevelData.checkpoints) {
            this.checkpointAnimationManager.updateCheckpoint(checkpoint, 1);
        }
        if (this.currentLevelData.endPoint) {
            this.checkpointAnimationManager.updateCheckpoint(this.currentLevelData.endPoint, 1);
        }

        this.updateCamera();
    }

    /** Cieľ: level končí, keď má hráč všetky diamanty so slovami. */
    checkFinish() {
        const end = this.currentLevelData.endPoint;
        if (!end || !this.checkCollision(this.player, end)) {
            this.finishHintShown = false;
            return;
        }
        if (this.collectedDiamonds >= this.requiredDiamonds) {
            this.showLevelComplete();
        } else if (!this.finishHintShown) {
            this.finishHintShown = true;
            const left = this.requiredDiamonds - this.collectedDiamonds;
            this.toast(left === 1 ? 'Ešte 1 modrý diamant!' : `Ešte ${left} modré diamanty!`);
        }
    }

    /** Krátka správa nad hrou. */
    toast(text) {
        const el = document.getElementById('sjToast');
        if (!el) return;
        el.textContent = text;
        el.classList.add('is-visible');
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2200);
        try { window.BJ && window.BJ.say(text); } catch (e) { /* bez hlasu */ }
    }



    /**
     * Vykreslenie jedného tile-u zo sprite sheetu
     * @param {string} tileName - Názov tile-u (napr. 'ground')
     * @param {number} x - X pozícia kde vykresliť
     * @param {number} y - Y pozícia kde vykresliť
     * @param {number} width - Šírka výsledného tile-u
     * @param {number} height - Výška výsledného tile-u
     */
    drawTile(tileName, x, y, width, height) {
        // Skontroluj, či je sprite sheet načítaný
        if (!this.terrainSprite.loaded) {
            // Ak ešte nie je načítaný, vykresli placeholder (farebný obdĺžnik)
            this.ctx.fillStyle = '#8B4513'; // Hnedá farba
            this.ctx.fillRect(x, y, width, height);
            return;
        }

        // Získaj definíciu tile-u
        const tile = this.tiles[tileName];
        if (!tile) {
            console.error(`Tile "${tileName}" neexistuje v definícii!`);
            return;
        }

        // Vykresli tile zo sprite sheetu
        // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        // sx, sy = pozícia v sprite sheete
        // sWidth, sHeight = veľkosť v sprite sheete
        // dx, dy = pozícia na canvase
        // dWidth, dHeight = veľkosť na canvase
        this.ctx.drawImage(
            this.terrainSprite,     // Sprite sheet
            tile.x,                 // X v sprite sheete
            tile.y,                 // Y v sprite sheete
            tile.width,             // Šírka v sprite sheete
            tile.height,            // Výška v sprite sheete
            x,                      // X na canvase
            y,                      // Y na canvase
            width,                  // Šírka na canvase
            height                  // Výška na canvase
        );
    }

    /**
     * Vykreslenie veľkej plochy tile-om (opakovaním)
     * Používa sa pre zem, dlhé platformy atď.
     * @param {string} tileName - Názov tile-u
     * @param {number} x - Začiatočná X pozícia
     * @param {number} y - Začiatočná Y pozícia
     * @param {number} width - Celková šírka plochy
     * @param {number} height - Celková výška plochy
     */
    drawTiledArea(tileName, x, y, width, height) {
        const tile = this.tiles[tileName];
        if (!tile) {
            console.error(`Tile "${tileName}" neexistuje!`);
            return;
        }

        // Vypočítaj, koľko tile-ov potrebujeme v X a Y smere
        const tilesX = Math.ceil(width / tile.width);
        const tilesY = Math.ceil(height / tile.height);

        // Vykresli tile-y v mriežke s malým prekrytím (eliminuje čierne čiary)
        for (let row = 0; row < tilesY; row++) {
            for (let col = 0; col < tilesX; col++) {
                // Zaokrúhli pozície na celé pixely (zabráni sub-pixel renderingu)
                const tileX = Math.floor(x + (col * tile.width));
                const tileY = Math.floor(y + (row * tile.height));
                
                // Vypočítaj skutočnú veľkosť tile-u (posledné tile-y môžu byť orezané)
                let tileWidth = tile.width;
                let tileHeight = tile.height;
                
                // Pre posledný tile v rade - orez šírku
                if (col === tilesX - 1 && (x + width) < (tileX + tile.width)) {
                    tileWidth = Math.ceil(x + width - tileX);
                }
                
                // Pre posledný tile v stĺpci - orez výšku
                if (row === tilesY - 1 && (y + height) < (tileY + tile.height)) {
                    tileHeight = Math.ceil(y + height - tileY);
                }
                
                // Pridaj 1px prekrytie okrem posledných tile-ov (eliminuje čierne čiary)
                const drawWidth = (col < tilesX - 1) ? tileWidth + 1 : tileWidth;
                const drawHeight = (row < tilesY - 1) ? tileHeight + 1 : tileHeight;
                
                // Vykresli tile
                this.drawTile(tileName, tileX, tileY, drawWidth, drawHeight);
            }
        }
    }

    /**
 * Vykreslenie zeme - horizontálne opakuje tile, vertikálne natiahne
 * @param {string} tileName - Názov tile-u
 * @param {number} x - X pozícia
 * @param {number} y - Y pozícia
 * @param {number} width - Celková šírka
 * @param {number} height - Celková výška (tile sa natiahne na túto výšku)
 */
drawGroundTerrain(tileName, x, y, width, height) {
    // Skontroluj, či je sprite načítaný
    if (!this.terrainSprite.loaded) {
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x, y, width, height);
        return;
    }

    const tile = this.tiles[tileName];
    if (!tile) {
        console.error(`Tile "${tileName}" neexistuje!`);
        return;
    }

    // Vypočítaj koľko tile-ov potrebujeme v ŠÍRKE (horizontálne opakujeme)
    const tilesX = Math.ceil(width / tile.width);

    // V ŠÍRKE opakujeme tile-y, v VÝŠKE jeden tile natiahneme
    for (let col = 0; col < tilesX; col++) {
        const tileX = Math.floor(x + (col * tile.width));
        
        // Šírka tile-u (posledný môže byť orezaný)
        let tileWidth = tile.width;
        if (col === tilesX - 1 && (x + width) < (tileX + tile.width)) {
            tileWidth = Math.ceil(x + width - tileX);
        }

        // Pridaj 1px prekrytie okrem posledného tile-u (eliminuje vertikálne čiary)
        const drawWidth = (col < tilesX - 1) ? tileWidth + 1 : tileWidth;

        // Vykresli tile - šírka sa opakuje, výška sa natiahne
        this.ctx.drawImage(
            this.terrainSprite,     // Sprite sheet
            tile.x,                 // X v sprite sheete
            tile.y,                 // Y v sprite sheete
            tile.width,             // Šírka v sprite sheete (celá šírka tile-u)
            tile.height,            // Výška v sprite sheete (celá výška tile-u)
            tileX,                  // X na canvase
            y,                      // Y na canvase
            drawWidth,              // Šírka na canvase (opakuje sa)
            height                  // Výška na canvase (NATIAHNE SA na celú výšku!)
        );
    }
}

/**
 * Vykreslenie platformy - horizontálne opakuje tile, vertikálne natiahne
 * @param {string} tileName - Názov platformy (platform1, platform2, platform3, platform4)
 * @param {number} x - X pozícia
 * @param {number} y - Y pozícia
 * @param {number} width - Celková šírka
 * @param {number} height - Celková výška
 */
drawPlatform(tileName, x, y, width, height) {
    // Skontroluj, či je sprite načítaný
    if (!this.terrainSprite.loaded) {
        this.ctx.fillStyle = '#CD853F';
        this.ctx.fillRect(x, y, width, height);
        return;
    }

    const tile = this.tiles[tileName];
    if (!tile) {
        console.error(`Tile "${tileName}" neexistuje!`);
        return;
    }

    // Vypočítaj koľko tile-ov potrebujeme v ŠÍRKE
    const tilesX = Math.ceil(width / tile.width);

    // V ŠÍRKE opakujeme tile-y, v VÝŠKE natiahnutie
    for (let col = 0; col < tilesX; col++) {
        const tileX = Math.floor(x + (col * tile.width));
        
        // Šírka tile-u (posledný môže byť orezaný)
        let tileWidth = tile.width;
        if (col === tilesX - 1 && (x + width) < (tileX + tile.width)) {
            tileWidth = Math.ceil(x + width - tileX);
        }

        // Pridaj 1px prekrytie okrem posledného tile-u
        const drawWidth = (col < tilesX - 1) ? tileWidth + 1 : tileWidth;

        // Vykresli tile
        this.ctx.drawImage(
            this.terrainSprite,     // Sprite sheet
            tile.x,                 // X v sprite sheete
            tile.y,                 // Y v sprite sheete
            tile.width,             // Šírka v sprite sheete
            tile.height,            // Výška v sprite sheete
            tileX,                  // X na canvase
            y,                      // Y na canvase
            drawWidth,              // Šírka na canvase
            height                  // Výška na canvase (natiahne sa)
        );
    }
}






    /** Šírka plátna podľa obrazovky (výška sveta ostáva 800). */
    /**
     * Plátno v rozlíšení obrazovky (ostré aj na telefóne) a priblíženie sveta.
     * Svet je vysoký 800 px; na obrazovke je vidno `viewH` = 800 / zoom,
     * kamera sa preto pohybuje vodorovne aj zvislo.
     */
    fitCanvas() {
        const vw = window.innerWidth || 1600;
        const vh = window.innerHeight || 900;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const ch = Math.round(Math.min(1200, Math.max(400, vh * dpr)));
        const cw = Math.round(ch * (vw / vh));
        if (this.canvas.width !== cw) this.canvas.width = cw;
        if (this.canvas.height !== ch) this.canvas.height = ch;
        this.width = cw;
        this.height = ch;
        const phone = document.documentElement.classList.contains('bj-compact');
        this.zoom = phone ? 1.55 : 1.3;
        // kde na obrazovke sú nohy postavy (na telefóne vyššie – dole sú tlačidlá)
        this.feetAt = phone ? 0.64 : 0.78;
        this.viewH = 800 / this.zoom;
        this.scale = ch / this.viewH;
        this.viewW = cw / this.scale;
        if (this.currentLevelData) this.updateCamera(true);
    }

    /** Kúsky zeme na okrajoch levelu (kamera ich môže ukázať). */
    edgeGrounds() {
        const L = this.currentLevelData;
        if (L.tilemap) return [];
        if (this._edgeFor === L) return this._edges;
        const grounds = L.platforms.filter((p) => p.type === 'ground');
        const out = [];
        const first = grounds.reduce((a, g) => (!a || g.x < a.x ? g : a), null);
        const last = grounds.reduce((a, g) => (!a || g.x + g.width > a.x + a.width ? g : a), null);
        if (first && first.x <= 0) out.push({ x: -1200, y: first.y, width: 1200, height: first.height });
        if (last && last.x + last.width >= L.width) out.push({ x: L.width, y: last.y, width: 1200, height: last.height });
        this._edgeFor = L;
        this._edges = out;
        return out;
    }

    /** Obloha + les s paralaxou (pohybuje sa pomalšie ako svet). */
    drawBackground() {
        const ctx = this.ctx;
        const sky = ctx.createLinearGradient(0, 0, 0, this.height);
        sky.addColorStop(0, '#5fb8ff');
        sky.addColorStop(0.6, '#bfe6ff');
        sky.addColorStop(1, '#fff3c9');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, this.width, this.height);
        const img = this.bgImage;
        if (img && img.complete && img.naturalWidth) {
            // les je o niečo vyšší ako obrazovka – pri pohybe kamery hore/dole
            // sa posúva pomalšie (paralaxa aj zvislo)
            const h = this.height * 1.15;
            const w = img.naturalWidth * (h / img.naturalHeight);
            const off = -((((this.camera.x * this.scale * 0.3) % w) + w) % w);
            const range = Math.max(1, this.worldH + this.belowWorld - this.viewH);
            const t = Math.max(0, Math.min(1, this.camera.y / range));
            const oy = -t * (h - this.height);
            ctx.imageSmoothingEnabled = true;
            for (let x = off - w; x < this.width; x += w) ctx.drawImage(img, x, oy, w, h);
        }
        // jemný opar – pozadie ustúpi, platformy a postavy vyniknú
        ctx.fillStyle = 'rgba(255, 246, 225, 0.45)';
        ctx.fillRect(0, 0, this.width, this.height);
    }

    draw() {
        // Vyčistenie canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawBackground();

        // Uloženie kontextu pred transformáciou
        this.ctx.save();
        
        // Mierka (priblíženie) + posun podľa kamery, zaokrúhlené na pixely
        const sc = this.scale;
        // otras obrazovky pri zásahu / rozbití tehly
        const sh = this.shake > 0 ? this.shake * 0.6 : 0;
        const shx = sh ? (Math.random() - 0.5) * sh * sc : 0;
        const shy = sh ? (Math.random() - 0.5) * sh * sc : 0;
        this.ctx.setTransform(sc, 0, 0, sc, -Math.round(this.camera.x * sc) + shx, -Math.round(this.camera.y * sc) + shy);
        // viditeľná časť sveta (kreslí sa len to, čo je na obrazovke)
        const vx0 = this.camera.x - 80, vx1 = this.camera.x + this.viewW + 80;
        const visible = (o) => o.x + (o.width || 0) > vx0 && o.x < vx1;


        // Vykreslenie platforiem a zeme
this.ctx.imageSmoothingEnabled = false;

// zem pred začiatkom a za koncom levelu (len vzhľad – hráč tam nedôjde)
for (const edge of this.edgeGrounds()) {
    if (visible(edge)) this.drawGroundTerrain('ground', edge.x, edge.y, edge.width, this.worldH + this.belowWorld - edge.y);
}
// dlaždicový terén (sj-tilemap.js) – kreslí sa naraz z pripravených kúskov
this.drawTilemap();
for (let platform of this.currentLevelData.platforms) {
    if (platform.tile || !visible(platform)) continue;
    if (platform.type === 'ground') {
        // Automaticky predĺž zem až po spodný okraj canvasu
        const groundHeight = this.worldH + this.belowWorld - platform.y; // Výška od platformy po spodok
        
        // Zem - horizontálne opakuje tile, vertikálne natiahne
        this.drawGroundTerrain('ground', platform.x, platform.y, platform.width, groundHeight);
    } else {
        // Platformy - vykresli pomocou sprite sheetu
        // Automatický výber typu platformy podľa veľkosti
        let platformType = 'platform3'; // Default (30x30px)
        
        if (platform.height <= 15) {
            platformType = 'platform1'; // Tenká (13px výška)
        } else if (platform.width <= 20) {
            platformType = 'platform2'; // Malá štvorcová (14x14px)
        } else if (platform.height >= 35) {
            platformType = 'platform4'; // Vysoká (44px výška)
        }
        
        // Vykresli platformu
        this.drawPlatform(platformType, platform.x, platform.y, platform.width, platform.height);
    }
}

        // štart (Pixel Adventure) a checkpointy
        this.drawStart();
        for (let checkpoint of this.currentLevelData.checkpoints) {
            if (visible(checkpoint)) this.checkpointAnimationManager.draw(this.ctx, checkpoint);
        }

        // Vykreslenie špeciálnych blokov
        for (let block of this.currentLevelData.specialBlocks) {
            if (!block.hit) {
                // Určenie typu diamantu podľa itemType
                let diamondType = 'greenDiamond'; // Default
                if (block.itemType === 'extraLife') {
                    diamondType = 'redDiamond';
                } else if (block.itemType === 'powerup') {
                    diamondType = 'greenDiamond';
                }
                
                // Vykresli animovaný diamant
                this.coinAnimationManager.draw(
                    this.ctx,
                    diamondType,
                    block.x,
                    block.y,
                    block.width
                );
            }
        }

        // Vykreslenie nepriateľov (animované sprite-y)
        for (let enemy of this.currentLevelData.enemies) {
            if (enemy.visible && visible(enemy)) {  // ⬅️ Vykreslí všetkých viditeľných, vrátane dying
                this.enemyAnimationManager.draw(this.ctx, enemy);
            }
        }

        // Vykreslenie stien (v štýle terénu, nie sivý obdĺžnik)
        for (let wall of this.currentLevelData.walls) {
            if (!visible(wall)) continue;
            this.drawPlatform('platform4', wall.x, wall.y, wall.width, wall.height);
        }

        // nové bloky (sj-blocks.js)
        this.drawBlocks(visible);


        // Vykreslenie všetkých mincí (gold, silver)
        for (let coin of this.currentLevelData.coins) {
            if (!coin.collected && visible(coin)) {
                if (coin.fruit && this.drawFruit(coin)) continue;
                this.coinAnimationManager.draw(
                    this.ctx,
                    coin.getAnimationType(),  // 'gold' alebo 'silver'
                    coin.x,
                    coin.y,
                    coin.width
                );
            }
        }

        // Vykreslenie všetkých diamantov (blue, green, red)
        for (let diamond of this.currentLevelData.diamonds) {
            if (!diamond.collected && visible(diamond)) {
                this.coinAnimationManager.draw(
                    this.ctx,
                    diamond.getAnimationType(),  // 'blueDiamond', 'greenDiamond', 'redDiamond'
                    diamond.x,
                    diamond.y,
                    diamond.width
                );
            }
        }

        // hráč (sj-player.js)
        this.drawPlayer();

        // efekty vo svete (častice, „+1“, žiara power-upu)
        this.fxDrawWorld();

        // Vykreslenie cieľa (finish flag)
        const endPoint = this.currentLevelData.endPoint;

        // Priprav endPoint ako finish flag checkpoint
        if (!endPoint.isFinish) {
            endPoint.isFinish = true;
            endPoint.animState = 'idle'; // Vždy viditeľný
            endPoint.animFrame = 0;
            endPoint.animCounter = 0;
        }

        // cieľ: trofej z Pixel Adventure, v pôvodných mapách vlajka
        if (endPoint.paEnd) this.drawTrophy(endPoint);
        else this.checkpointAnimationManager.draw(this.ctx, endPoint);


        // Debug informácie
        if (this.debug) {
            this.drawDebugInfo();
        }

        // Obnovenie kontextu
        this.ctx.restore();

        // mince letiace do počítadla (na obrazovke)
        this.fxDrawScreen();

        // Vykreslenie UI elementov (ak nejaké máme)
        this.drawUI();
    }


    drawUI() {
        // Skóre v rámčekoch nad hrou (HTML, viď superjozino.html .sj-hud)
        const hud = this.hud || (this.hud = {
            coins: document.getElementById('hudCoins'),
            diamonds: document.getElementById('hudDiamonds'),
            lives: document.getElementById('hudLives'),
        });
        const c = `${this.collectedCoins}/${this.totalCoins}`;
        const d = `${this.collectedDiamonds}/${this.requiredDiamonds}`;
        const l = '❤'.repeat(Math.max(0, this.lives)) || '–';
        if (hud.coins && hud.coins.textContent !== c) hud.coins.textContent = c;
        if (hud.diamonds && hud.diamonds.textContent !== d) hud.diamonds.textContent = d;
        if (hud.lives && hud.lives.textContent !== l) hud.lives.textContent = l;


        if (this.debug) {
            // Debug panel v pravom hornom rohu
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(this.width - 200, 0, 200, 100);
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(`FPS: ${Math.round(this.fps || 0)}`, this.width - 190, 20);
            this.ctx.fillText(`Level Width: ${this.currentLevelData.width}`, this.width - 190, 40);
            this.ctx.fillText(`Game State: ${this.gameState}`, this.width - 190, 60);
            this.ctx.fillText(`Level: ${this.currentLevel}`, this.width - 190, 80);
        }
    }

    /**
     * Hlavný herný loop - volá update a draw každý frame
     * @param {number} timestamp - Čas od spustenia stránky v milisekundách
     */
    gameLoop(timestamp) {
        const STEP = 1000 / 60;
        if (this.lastTime == null) this.lastTime = timestamp;
        const elapsed = Math.min(100, Math.max(0, timestamp - this.lastTime));
        this.lastTime = timestamp;
        if (elapsed) this.fps = this.fps * 0.9 + (1000 / elapsed) * 0.1;

        this.accumulator = (this.accumulator || 0) + elapsed;
        let steps = 0;
        while (this.accumulator >= STEP && steps < 5) {
            this.update();
            this.accumulator -= STEP;
            steps++;
        }
        if (steps === 5) this.accumulator = 0; // po dlhej pauze nedobiehať

        this.draw();
        requestAnimationFrame((ts) => this.gameLoop(ts));
    }
}

/**
 * COIN CLASS - Reprezentuje odmeny v hre
 * Typy: gold, silver, blueDiamond, greenDiamond, redDiamond
 */
class Coin {
    constructor(x, y, type = 'gold') {
        this.x = x;
        this.y = y;
        this.width = 40;   // Väčšie pre lepšiu viditeľnosť
        this.height = 40;
        this.type = type;  // 'gold', 'silver', 'blueDiamond', 'greenDiamond', 'redDiamond'
        this.collected = false;
        
        // Rečové cvičenie (len pre Blue Diamond)
        this.speechExercise = type === 'blueDiamond' ? {
            // slovo a obrázok musia patriť k sebe
            ...(() => { const w = this.getRandomWord(); return { word: w, imageUrl: `images/slova/${w}.png` }; })(),
            attempts: 0,
            completed: false
        } : null;
        
        // Posluchové cvičenie (len pre Silver Coin)
        this.listeningExercise = type === 'silver' ? {
            completed: false,
            attempts: 0
        } : null;
        
        // Bonusové predmety (Green/Red Diamond)
        this.bonusType = null;
        if (type === 'greenDiamond') {
            this.bonusType = 'powerup';
        } else if (type === 'redDiamond') {
            this.bonusType = 'extraLife';
        }
    }
    
    /**
     * Získanie náhodného slova pre rečové cvičenie
     */
    getRandomWord() {
        return SJ.nextWord();
    }
    
    /**
     * Získanie náhodného obrázka pre rečové cvičenie
     */
    getRandomImage() {
        return `images/slova/${this.getRandomWord()}.png`;
    }
    
    /**
     * Získanie animačného typu pre CoinAnimationManager
     */
    getAnimationType() {
        return this.type; // 'gold', 'silver', 'blueDiamond', 'greenDiamond', 'redDiamond'
    }
}

// Spustenie hry
window.onload = () => {
    new Game();
};
