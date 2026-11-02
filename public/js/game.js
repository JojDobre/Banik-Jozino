//////////////////////////////////////////////
// Game.js - hlavný kód pre minmihru miner  //
// Autor: Adam Renak                        //
// Diplomová práca - 28.8.2025              //
//////////////////////////////////////////////



// ==========================================
// GLOBÁLNE PREMENNÉ PRE PRELOADING
// ==========================================
let preloadedImages = {};        // Cache pre prednačítané obrázky
let totalResources = 0;          // Celkový počet zdrojov
let loadedResources = 0;         // Počet načítaných zdrojov
let isPreloadingComplete = false; // Flag či je preloading hotový


//////////////////////////////////////////////
// ============ LOADING SCREEN ============ //
// Čakanie na načítanie DOM obsahu          //
// Skrytie loading screen s animáciou       //
//////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 DOM načítaný, spúšťam preloading...');
    
    // Inicializuj Speech Recognition
    initSpeechRecognition();
    
    // Spusti prednačítanie zdrojov
    startPreloading();
});



/**
 * Hlavná funkcia preloadingu
 */
async function startPreloading() {
    try {
        // 1. Získaj konfiguráciu levelu z URL
        const levelConfig = getLevelConfigFromURL();
        
        // 2. Zisti všetky obrázky na načítanie
        const imagesToLoad = collectAllImages(levelConfig);
        
        totalResources = imagesToLoad.length;
        console.log(`📦 Načítavam ${totalResources} obrázkov...`);
        
        // 3. Načítaj všetky obrázky paralelne
        const promises = imagesToLoad.map(imagePath => preloadImage(imagePath));
        await Promise.all(promises);
        
        console.log('✅ Všetky obrázky načítané!');
        isPreloadingComplete = true;
        
        // 4. Skry loading screen a spusti hru
        setTimeout(() => {
            hideLoadingScreen();
            
            // Inicializuj hru s level configom
            if (levelConfig) {
                initializeGameWithLevel(levelConfig);
            }
        }, 500);
        
    } catch (error) {
        console.error('❌ Chyba pri preloadingu:', error);
        // Aj pri chybe spusti hru
        hideLoadingScreen();
    }
}

/**
 * Získanie konfigurácie levelu z URL parametrov
 */
function getLevelConfigFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const worldId = urlParams.get('worldId') || urlParams.get('world');
    const levelId = urlParams.get('levelId') || urlParams.get('level');

    // ========================================
    // PRIDANÉ: Načítanie tréningovej konfigurácie
    // ========================================
    const isTraining = urlParams.get('training') === 'true';
    const trainingConfig = urlParams.get('config');
    
    // Ak je tréningový level, načítaj konfiguráciu z URL
    if (isTraining && trainingConfig) {
        try {
            const config = JSON.parse(decodeURIComponent(trainingConfig));
            console.log('📋 Načítaná tréningová konfigurácia:', config);
            return config; // Vráť tréningovú konfiguráciu
        } catch (error) {
            console.error('❌ Chyba pri parsovaní tréningovej konfigurácie:', error);
            // Pokračuj na fallback
        }
    }
    
    console.log('URL parametre:', { worldId, levelId });
    
    // Ak máme levelId, načítaj konfiguráciu
    if (levelId && typeof window.getLevelConfig === 'function') {
        const config = window.getLevelConfig(levelId);
        console.log('📋 Načítaná level konfigurácia:', config);
        return config;
    }
    
    // Fallback konfigurácia
    console.warn('⚠️ Používam fallback konfiguráciu');
    return {
        id: 'fallback',
        worldId: worldId || 'world_r',
        words: ['rak', 'ryba', 'ruka', 'ruža'],
        gameConfig: { diamonds: 3, golds: 3, crystals: 1 }
    };
}

/**
 * Zber všetkých obrázkov ktoré treba načítať
 */
function collectAllImages(levelConfig) {
    const images = [];
    
    // ==========================================
    // 1. OBRÁZKY SLOV (najdôležitejšie!)
    // ==========================================
    if (levelConfig && levelConfig.words) {
        levelConfig.words.forEach(word => {
            images.push(`images/slova/${word}.png`);
        });
        console.log(`   ✅ Pridaných ${levelConfig.words.length} obrázkov slov`);
    }
    
    // ==========================================
    // 2. SPRITE OBRÁZKY HRÁČA
    // ==========================================
    images.push(
        'images/hrac.png',
        'images/hrac-otoceny-vlavo.png',
        'images/hrac-otoceny-vpravo.png',
        'images/hrac-kope-vpravo.png',
        'images/hrac-kope-vlavo.png'
    );
    
    // ==========================================
    // 3. ITEMY (diamanty, zlato, kryštály)
    // ==========================================
    images.push(
        'images/diamond.png',
        'images/gold.png',
        'images/kov.png',
        'images/stone.png'
    );
    
    // ==========================================
    // 4. UI ELEMENTY
    // ==========================================
    images.push(
        'images/spravne.png',
        'images/nespravne.png',
        'images/star_active.png',
        'images/star_inactive.png',
        'images/banik.ico'
    );
    
    // ==========================================
    // 5. POZADIE SVETA (ak existuje)
    // ==========================================
    if (levelConfig && levelConfig.worldId) {
        const worldBackgrounds = {
            'world_r': 'images/worlds/world_r.png',
            'world_l': 'images/worlds/world_l.png',
            'world_s': 'images/worlds/world_s.png',
            'world_ch': 'images/worlds/world_ch.png',
            'world_z': 'images/worlds/world_z.jpg',
            'world_c': 'images/worlds/world_c.png',
            'world_sh': 'images/worlds/world_sh.png',
            'world_zh': 'images/worlds/world_zh.png',
            'world_d': 'images/worlds/world_d.png',
            'world_t': 'images/worlds/world_t.png',
            'world_n': 'images/worlds/world_n.png',
            'world_k': 'images/worlds/world_k.png',
            'world_g': 'images/worlds/world_g.png'
        };
        
        const worldBg = worldBackgrounds[levelConfig.worldId];
        if (worldBg) {
            images.push(worldBg);
        }
    }
    
    // Základné pozadie
    images.push('images/pozadie.jpg');
    
    // Menu obrázky
    images.push(
        'images/menubutton.png',
        'images/cursor.png',
        'images/active_cursor4.png'
    );
    
    console.log(`📦 Celkovo zozbieraných ${images.length} obrázkov`);
    return images;
}

/**
 * Načítanie jedného obrázka
 */
function preloadImage(imagePath) {
    return new Promise((resolve) => {
        // Ak už je načítaný, vráť ho
        if (preloadedImages[imagePath]) {
            updateProgress();
            resolve(preloadedImages[imagePath]);
            return;
        }
        
        const img = new Image();
        
        // Pri úspešnom načítaní
        img.onload = () => {
            preloadedImages[imagePath] = img;  // Ulož do cache
            updateProgress();
            console.log(`✅ ${imagePath}`);
            resolve(img);
        };
        
        // Pri chybe (nechaj hru pokračovať)
        img.onerror = () => {
            console.warn(`⚠️ Chyba pri načítaní: ${imagePath}`);
            updateProgress();
            resolve(null);
        };
        
        // Spusti načítanie
        img.src = imagePath;
    });
}

/**
 * Aktualizácia progress baru
 */
function updateProgress() {
    loadedResources++;
    
    // Vypočítaj percento
    const percentage = Math.round((loadedResources / totalResources) * 100);
    
    // Aktualizuj progress bar
    const progressFill = document.getElementById('loading-progress-fill');
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    // Aktualizuj text percentá
    const progressPercentage = document.getElementById('loading-progress-percentage');
    if (progressPercentage) {
        progressPercentage.textContent = `${percentage}%`;
    }
    
    // Aktualizuj počet načítaných
    const progressDetails = document.getElementById('loading-progress-details');
    if (progressDetails) {
        progressDetails.textContent = `${loadedResources}/${totalResources} zdrojov`;
    }
    
    // Aktualizuj hlavnú správu
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        if (percentage < 100) {
            loadingMessage.textContent = 'Načítavam obrázky...';
        } else {
            loadingMessage.textContent = 'Hotovo! Spúšťam hru...';
        }
    }
    
    console.log(`📊 Progress: ${percentage}% (${loadedResources}/${totalResources})`);
}

/**
 * Skrytie loading screenu s animáciou
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    console.log('👋 Loading screen skrytý, hra pripravená!');
}

/**
 * Pomocná funkcia na získanie prednačítaného obrázka
 * Môžeš ju použiť neskôr v kóde ak chceš
 */
function getPreloadedImage(imagePath) {
    return preloadedImages[imagePath] || null;
}

// Export pre ostatné časti kódu
if (typeof window !== 'undefined') {
    window.preloadedImages = preloadedImages;
    window.getPreloadedImage = getPreloadedImage;
}








///////////////////////////////////////////////
// ========== ZAKLADNE PREMENNE ============ //
// Diamonds, kov, Golds, Kov, Zvukové efekty //
// velkosti blokov, pocet ziskanych itemov   //
///////////////////////////////////////////////

//////////////////////////////////
// Získanie canvasu a kontextu  //
//////////////////////////////////
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const blockSize = 50; // Veľkosť jednej blokovej kocky

const playerSize = blockSize;           // Veľkosť hráča
const diamondSize = blockSize;          // Veľkosť diamantu
const GoldSize = blockSize;             // Veľkosť diamantu
const claySize = blockSize;             // Veľkosť hliny
const kovSize = blockSize;              // Veľkosť diamantu
const mapWidth = 16;                    // Počet blokov na šírku
const mapHeight = 10;                   // Počet blokov na výšku

let playerX = blockSize;                // Začiatočná pozícia hráča na osi X
let playerY = blockSize;                // Začiatočná pozícia hráča na osi Y

const diamonds = [];
const kov = [];                         ///////////////////////
const golds = [];                       // Základné premenné //
const clay = [];                        ///////////////////////
let generatedPositions = []; // Globálny zoznam pozícií všetkých objektov
let PocetGenDiamant = 3;                
let PocetGenKov = 1;
let PocetGenGolds = 4;

let diamondsDestroyed = 0;              // Počet zničených diamantov
let kovDestroyed = 0;                   // Počet zničených diamantov
let goldsDestroyed = 0;                 // Počet zničených goldov
let isDestroying = false;               // Premenná určujúca, či hráč zničí blok
let playerRotation = 0;                 // Úvodná rotácia hráča
let diamondsCollected = 0;              // Počet zozbieraných diamantov
let kovCollected = 0;                   // Počet zozbieraných kovov
let goldsCollected = 0;                 // Počet zozbieraných diamantov

let spaceBarPressed = 0;                // Počet stlačení medzerníka
let playerBlockX;                       // Pozicia hraca X
let playerBlockY;                       // Pozicia hraca Y
let targetBlockX;                       
let targetBlockY;
let blockX;
let blockY;

let correctAnswers = 0;                 // Počet správnych odpovedi
let incorrectAnswers = 0;               // Počet nesprávnych odpovedi

/////////////////////////////////////////
// Globálne premenné pre časový systém //
/////////////////////////////////////////
let gameTimer = {
    startTime: null,           // Čas spustenia hry
    currentTime: 0,            // Aktuálny čas v sekundách
    intervalId: null,          // ID intervalu pre aktualizáciu
    timeLimit: null,           // Časový limit z levelConfig (v sekundách)
    isRunning: false,          // Označuje či timer beží
    isPaused: false            // Označuje či je timer pozastavený
};

//////////////////////////////////////////////  
// Globálne premenné pre Speech Recognition //
//////////////////////////////////////////////
let speechRecognition = null;           // Spoločná služba window.BJ.speech (nastaví sa pri inicializácii)
let isListening = false;                // Flag či práve počúvame
let currentExpectedWord = '';           // Aktuálne očakávané slovo

let isExerciseActive = false;           // Flag či práve prebieha cvičenie



///////////////////////
// Obrázky postavy   //
///////////////////////
playerX = 100;
playerY = 200;
const goldImg = new Image();
goldImg.src = 'images/gold.png';
const diamondImg = new Image();
diamondImg.src = 'images/diamond.png';
const kovImg = new Image();
kovImg.src = 'images/kov.png';
const clayImg = new Image();
clayImg.src = 'images/stone.png';
const playerImg = new Image();
playerImg.src = 'images/hrac.png';
const playerImgVl = new Image();
playerImgVl.src = 'images/hrac-otoceny-vlavo.png';
const playerImgVp = new Image();
playerImgVp.src = 'images/hrac-otoceny-vpravo.png';
const playerImgchrbat = new Image();
playerImgchrbat.src = 'images/hrac.png';
const hracKopaVpravoImg = new Image();
hracKopaVpravoImg.src = 'images/hrac-kope-vpravo.png';
const hracKopaVlavoImg = new Image();
hracKopaVlavoImg.src = 'images/hrac-kope-vlavo.png';
let playerDirection = 'front';
let kope = false;

////////////////////
// zvukové efekty //
////////////////////
const EffectssoundFolder = `zvuky/effects`;
let  effectVyhra = new Howl({ src: [`zvuky/effects/vyhra.mp3`] });
let effectZle = new Howl({ src: [`zvuky/effects/zle.mp3`] });
let effectSpravne = new Howl({ src: [`zvuky/effects/spravne.mp3`] });
let effectkopanie = new Howl({ src: [`zvuky/effects/kopanie.wav`] });
let effectzlato = new Howl({ src: [`zvuky/effects/zlato.wav`] });






////////////////////////////////////////////////////////////
//      ========== KONFIGURÁCIA LEVELU ==========         //
// Globálna premenná pre konfiguráciu aktuálneho levelu   //
// Obsahuje: words, diamonds, golds, crystals, timeLimit  //
//           positions                                    //
////////////////////////////////////////////////////////////
let currentLevelConfig = null;
let isCustomLevel = false; // Označuje či je spustený custom level

/**
 * Inicializácia hry s konfiguráciou levelu
 * @param {Object} levelConfig - konfigurácia levelu z levels.js
 * @param {Boolean} customLevel - true ak je to custom level
 */

function initializeGameWithLevel(levelConfig, customLevel = false) {
    console.log('Inicializujem hru s levelConfig:', levelConfig);
    
    currentLevelConfig = levelConfig;
    isCustomLevel = customLevel;
    
    // Aktualizácia počtov objektov podľa levelConfig
    // OPRAVA: Použuj gameConfig namiesto priameho prístupu
if (levelConfig.gameConfig && levelConfig.gameConfig.diamonds) {
    PocetGenDiamant = levelConfig.gameConfig.diamonds;
}
if (levelConfig.gameConfig && levelConfig.gameConfig.golds) {
    PocetGenGolds = levelConfig.gameConfig.golds;
}
if (levelConfig.gameConfig && levelConfig.gameConfig.crystals) {
    PocetGenKov = levelConfig.gameConfig.crystals;
}

console.log(`Aktualizované počty z gameConfig: Diamanty=${PocetGenDiamant}, Zlato=${PocetGenGolds}, Kryštály=${PocetGenKov}`);

    // Nastavenie pozície hráča ak je definovaná v levelConfig
    if (levelConfig.positions && levelConfig.positions.player) {
        playerX = levelConfig.positions.player.x * blockSize;
        playerY = levelConfig.positions.player.y * blockSize;
        console.log(`Pozícia hráča nastavená na: ${levelConfig.positions.player.x}, ${levelConfig.positions.player.y}`);
    } else {
        // Predvolená pozícia
        playerX = blockSize;
        playerY = blockSize;
    }
    
    console.log(`Nastavené počty: Diamanty=${PocetGenDiamant}, Zlato=${PocetGenGolds}, Kryštály=${PocetGenKov}`);
    console.log('Custom level:', isCustomLevel);

    // Inicializácia sledovania výkonu
    initializePerformanceTracking();

    const timeLimit = levelConfig && levelConfig.timeLimit ? levelConfig.timeLimit : null;
    startTimer(timeLimit);
    
    resetGame();
}





//////////////////////////////////////////////////
//      ========== ČASOMIERA ==========         //
// spustenie časomiery, zastavenie časomiery    //
// pozastavenie a obnovenie časomiery           //
// aktualizacia časomiery atd                   //
//////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
// Spustenie časomery - volať pri štarte hry                                        //
// @param {number|null} timeLimit - Časový limit v sekundách (null = bez limitu)    //
//////////////////////////////////////////////////////////////////////////////////////
function startTimer(timeLimit = null) {
    console.log('Spúšťam časomeru...', timeLimit ? `Limit: ${timeLimit}s` : 'Bez limitu');
    
    // Nastav časový limit z parametra
    gameTimer.timeLimit = timeLimit;
    gameTimer.startTime = Date.now();
    gameTimer.currentTime = 0;
    gameTimer.isRunning = true;
    gameTimer.isPaused = false;
    
    // Aktualizuj UI ihneď
    updateTimerDisplay();
    
    // Spusti pravidelné aktualizácie každú sekundu
    gameTimer.intervalId = setInterval(() => {
        if (!gameTimer.isPaused && gameTimer.isRunning) {
            // Vypočítaj aktuálny čas
            gameTimer.currentTime = Math.floor((Date.now() - gameTimer.startTime) / 1000);
            
            // Aktualizuj zobrazenie
            updateTimerDisplay();
            
            // Kontrola časového limitu
            if (gameTimer.timeLimit && gameTimer.currentTime >= gameTimer.timeLimit) {
                console.log('Čas vypršal!');
                handleTimeUp();
            }
        }
    }, 1000);
}

////////////////////////////////////////
//       Zastavenie časomery          //
////////////////////////////////////////
function stopTimer() {
    console.log('Zastavujem časomeru...');
    gameTimer.isRunning = false;
    
    if (gameTimer.intervalId) {
        clearInterval(gameTimer.intervalId);
        gameTimer.intervalId = null;
    }
}

////////////////////////////////////////////////////////////////////////////////
// Pozastavenie/obnovenie časomery                                            //
// @param {boolean} pause - true = pozastav, false = pokračuj                 //
////////////////////////////////////////////////////////////////////////////////
function pauseTimer(pause = true) {
    console.log(pause ? 'Pozastavujem časomeru...' : 'Obnovujem časomeru...');
    gameTimer.isPaused = pause;
    
    if (!pause && gameTimer.isRunning) {
        // Pri obnovení prepočítaj štartovací čas
        gameTimer.startTime = Date.now() - (gameTimer.currentTime * 1000);
    }
}

//////////////////////////////////////////
// Aktualizácia zobrazenia času v HTML  //
//////////////////////////////////////////
function updateTimerDisplay() {
    const timeElement = document.getElementById('game-timer');
    
    if (timeElement) {
        let displayTime;
        
        if (gameTimer.timeLimit) {
            // Ak je nastavený limit, zobrazuj zostávajúci čas
            const remainingTime = Math.max(0, gameTimer.timeLimit - gameTimer.currentTime);
            displayTime = formatTime(remainingTime);
            
            // Pridaj varovnú farbu keď zostáva málo času
            if (remainingTime <= 30) {
                timeElement.style.color = '#ff4444'; // Červená
            } else if (remainingTime <= 60) {
                timeElement.style.color = '#ffaa00'; // Oranžová
            } else {
                timeElement.style.color = ''; // Pôvodná farba
            }
        } else {
            // Bez limitu, zobrazuj uplynulý čas
            displayTime = formatTime(gameTimer.currentTime);
            timeElement.style.color = ''; // Pôvodná farba
        }
        
        timeElement.textContent = displayTime;
    } else {
        console.warn('Element #game-timer nebol nájdený v HTML');
    }
}

//////////////////////////////////////////////////
// Formátovanie času do MM:SS formátu           //
// @param {number} seconds - Čas v sekundách    //
// @returns {string} - Formátovaný čas          //
//////////////////////////////////////////////////
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

////////////////////////////////////////
//       Obsluha vypršania času       //
////////////////////////////////////////
function handleTimeUp() {
    console.log('Čas vypršal! Ukončujem hru...');
    stopTimer();
    
    // Zastav hru
    gameRunning = false;
    
    // Zobraz konečný dialog s informáciou o vypršaní času
    setTimeout(() => {
        document.getElementById("endgame").style.display = "block";
        document.getElementById("blur-background").style.display = "block";
        document.body.style.overflow = "hidden";
        
        // Pridaj informáciu o vypršaní času do konečného dialógu
        const endGameContent = document.querySelector('#endgame .execise-window');
        if (endGameContent && !endGameContent.querySelector('.time-up-message')) {
            const timeUpMessage = document.createElement('div');
            timeUpMessage.className = 'time-up-message';
            timeUpMessage.innerHTML = '<h3 style="color: #ff4444;">⏰ Čas vypršal!</h3>';
            endGameContent.insertBefore(timeUpMessage, endGameContent.querySelector('nav'));
        }
    }, 100);
}

//////////////////////////////////////////////////
// Získanie aktuálneho času hry                 //
// @returns {number} - Aktuálny čas v sekundách //
//////////////////////////////////////////////////
function getCurrentGameTime() {
    return gameTimer.currentTime;
}

//////////////////////////////////////////////////////////////////////////////////////
// Získanie zostávajúceho času (ak je nastavený limit)                              //
// @returns {number|null} - Zostávajúci čas v sekundách alebo null ak nie je limit  //
//////////////////////////////////////////////////////////////////////////////////////
function getRemainingTime() {
    if (gameTimer.timeLimit) {
        return Math.max(0, gameTimer.timeLimit - gameTimer.currentTime);
    }
    return null;
}





//////////////////////////////////////////////////
// ===== SPUSTENIE HRY S URL PARAMETRAMI =====  //
// Inicializácia hry na základe URL parametrov  //
// Očakáva parametry: worldId, levelId          //
//////////////////////////////////////////////////
function initializeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // OPRAVENÉ: Podporuj oba formáty parametrov
    const worldId = urlParams.get('worldId') || urlParams.get('world');
    const levelId = urlParams.get('levelId') || urlParams.get('level');

    const isTraining = urlParams.get('training') === 'true';
    const trainingConfig = urlParams.get('config');
    
    console.log('URL parametre:', { worldId, levelId });
    
    // Zvyšok funkcie zostáva rovnaký...
    if (worldId && levelId) {
        if (typeof getLevelConfig === 'function') {
            const levelConfig = getLevelConfig(levelId);
            if (levelConfig) {
                console.log('Načítaná konfigurácia levelu:', levelConfig);
                initializeGameWithLevel(levelConfig);
                return;
            } else {
                console.warn(`Level ${levelId} nebol nájdený`);
            }
        } else {
            console.warn('Funkcia getLevelConfig nie je dostupná - levels.js nebol načítaný');
        }
    }

    if (isTraining && trainingConfig) {
        try {
            const config = JSON.parse(decodeURIComponent(trainingConfig));
            console.log('Spúšťam tréningový level s konfiguráciou:', config);
            initializeGameWithLevel(config, true); // true = custom level
            return;
        } catch (error) {
            console.error('Chyba pri načítaní tréningovej konfigurácie:', error);
        }
    }
       
    // OPRAVENÝ FALLBACK - správne počty
    console.log('Spúšťam hru s predvolenými nastaveniami');
    const fallbackLevelConfig = {
        words: ['rak', 'ryba', 'ruka', 'rosa'],
        diamonds: 2,    
        golds: 3,      
        crystals: 1,
        timeLimit: null,
        positions: {
            diamonds: [{ x: 3, y: 8 }, { x: 12, y: 7 }], // len 2 pozície
            golds: [{ x: 2, y: 9 }, { x: 7, y: 8 }, { x: 14, y: 6 }], // len 3 pozície
            crystals: [{ x: 9, y: 7 }],
            player: { x: 1, y: 1 }
        }
    };

    console.log('Fallback timeLimit:', fallbackLevelConfig.timeLimit);

    initializeGameWithLevel(fallbackLevelConfig);
}

///////////////////////////////////////////////
// Spustenie inicializácie po načítaní DOM   //
///////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    // Čakaj kým sa načítajú všetky scripty, potom inicializuj
    setTimeout(initializeFromURL, 100);
    initializeNavigation();
});






//////////////////////////////////////////////////
// ====== VIRTUAL JOYSTICK FUNKCIONALITA ====== //
//        MECHANIKA POHYBU PRE MOBILY           //
//////////////////////////////////////////////////

///////////////////////////////////////////////
//       Premenné pre virtual joystick       //
///////////////////////////////////////////////
let joystickActive = false;
let joystickCenter = { x: 0, y: 0 };
let joystickKnob = null;
let joystickBase = null;
let joystickContainer = null;
let joystickRadius = 45; // Polomer pohybu knobu
let lastMoveTime = 0;
const moveDelay = 150; // Delay medzi pohybmi v ms

///////////////////////////////////////////////
// Inicializácia joysticku po načítaní DOM   //
///////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    initVirtualJoystick();
});

function initVirtualJoystick() {
    joystickContainer = document.querySelector('.virtual-joystick');
    joystickKnob = document.querySelector('.joystick-knob');
    joystickBase = document.querySelector('.joystick-base');
    
    if (!joystickContainer || !joystickKnob) return;
    
    // Získanie centra joysticku
    const rect = joystickContainer.getBoundingClientRect();
    joystickCenter.x = rect.width / 2;
    joystickCenter.y = rect.height / 2;
    
    // Event listenery pre touch
    joystickKnob.addEventListener('touchstart', handleTouchStart, { passive: false });
    joystickKnob.addEventListener('touchmove', handleTouchMove, { passive: false });
    joystickKnob.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Event listenery pre mouse (testovanie na desktop)
    joystickKnob.addEventListener('mousedown', handleMouseStart);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseEnd);
}

///////////////////////////////////////////////
//                Touch start                //
///////////////////////////////////////////////
function handleTouchStart(e) {
    e.preventDefault();
    joystickActive = true;
    joystickContainer.classList.add('active');
}

///////////////////////////////////////////////
//                Touch move                 //
///////////////////////////////////////////////
function handleTouchMove(e) {
    e.preventDefault();
    if (!joystickActive) return;
    
    const touch = e.touches[0];
    const rect = joystickContainer.getBoundingClientRect();
    const x = touch.clientX - rect.left - joystickCenter.x;
    const y = touch.clientY - rect.top - joystickCenter.y;
    
    updateJoystickPosition(x, y);
}

///////////////////////////////////////////////
//                Touch end                  //
///////////////////////////////////////////////
function handleTouchEnd(e) {
    e.preventDefault();
    resetJoystick();
}

///////////////////////////////////////////////
//      Mouse start (pre testovanie)         //
///////////////////////////////////////////////
function handleMouseStart(e) {
    e.preventDefault();
    joystickActive = true;
    joystickContainer.classList.add('active');
}

///////////////////////////////////////////////
//              Mouse move                   //
///////////////////////////////////////////////
function handleMouseMove(e) {
    if (!joystickActive) return;
    
    const rect = joystickContainer.getBoundingClientRect();
    const x = e.clientX - rect.left - joystickCenter.x;
    const y = e.clientY - rect.top - joystickCenter.y;
    
    updateJoystickPosition(x, y);
}

///////////////////////////////////////////////
//                Mouse end                  //
///////////////////////////////////////////////
function handleMouseEnd(e) {
    resetJoystick();
}

///////////////////////////////////////////////
// Aktualizácia pozície knobu a pohyb hráča  //
///////////////////////////////////////////////
function updateJoystickPosition(x, y) {
    // Obmedz pohyb v kruhu
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = joystickRadius;
    
    if (distance > maxDistance) {
        x = (x / distance) * maxDistance;
        y = (y / distance) * maxDistance;
    }
    
    // Aktualizuj pozíciu knobu
    joystickKnob.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    
    // Pohyb hráča na základe pozície joysticku
    const currentTime = Date.now();
    if (currentTime - lastMoveTime > moveDelay) {
        handleJoystickMovement(x, y);
        lastMoveTime = currentTime;
    }
}

///////////////////////////////////////////////
//      Spracovanie pohybu hráča             //
///////////////////////////////////////////////
function handleJoystickMovement(x, y) {
    const threshold = 15; // Minimálna vzdialenosť pre aktiváciu pohybu
    const distance = Math.sqrt(x * x + y * y);
    
    if (distance < threshold) return;
    
    // Určenie smeru na základe uhla
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    let direction = '';
    
    if (angle >= -45 && angle <= 45) {
        direction = 'right';
    } else if (angle > 45 && angle <= 135) {
        direction = 'down';
    } else if (angle > 135 || angle <= -135) {
        direction = 'left';
    } else if (angle > -135 && angle < -45) {
        direction = 'up';
    }
    
    // Vykonaj pohyb
    movePlayer(direction);
}

///////////////////////////////////////////////
// Pohyb hráča (používa existujúcu logiku)   //
///////////////////////////////////////////////
function movePlayer(direction) {
    const newPlayerX = playerX;
    const newPlayerY = playerY;
    
    switch (direction) {
        case 'up':
            if (playerY - blockSize >= 0) {
                playerY -= blockSize;
                playerRotation = 0;
                playerDirection = 'front';
            }
            break;
        case 'left':
            if (playerX - blockSize >= 0) {
                playerX -= blockSize;
                playerRotation = 270;
                playerDirection = 'vlavo';
            }
            break;
        case 'down':
            if (playerY + blockSize < 800) {
                playerY += blockSize;
                playerRotation = 180;
                playerDirection = 'front';
            }
            break;
        case 'right':
            if (playerX + blockSize < 800) {
                playerX += blockSize;
                playerRotation = 90;
                playerDirection = 'vpravo';
            }
            break;
    }
    
    // Kontrola kolízií (použije existujúcu logiku)
    checkCollisions(newPlayerX, newPlayerY);
}

/////////////////////////////////////////////////////
// Kontrola kolízií (extrahované z pôvodného kódu) //
/////////////////////////////////////////////////////
function checkCollisions(newPlayerX, newPlayerY) {
    // Kontrola kolízií s clay
    clay.forEach((clayBlock, clayIndex) => {
        const blockX = clayBlock.x;
        const blockY = clayBlock.y;
        if (playerX === blockX && playerY === blockY) {
            if (isDestroying) {
                clay.splice(clayIndex, 1);
                isDestroying = false;
            } else {
                playerX = newPlayerX;
                playerY = newPlayerY;
            }
        }
    });
    
    // Kontrola kolízií s diamonds
    diamonds.forEach((diamond, diamondIndex) => {
        const blockX = diamond.x;
        const blockY = diamond.y;
        if (playerX === blockX && playerY === blockY && !diamond.destroyed) {
            if (isDestroying) {
                diamond.destroyed = true;
                isDestroying = false;
            } else {
                playerX = newPlayerX;
                playerY = newPlayerY;
            }
        }
    });
    
    // Kontrola kolízií s kov
    kov.forEach((kov, kovIndex) => {
        const blockX = kov.x;
        const blockY = kov.y;
        if (playerX === blockX && playerY === blockY && !kov.destroyed) {
            if (isDestroying) {
                kov.destroyed = true;
                isDestroying = false;
            } else {
                playerX = newPlayerX;
                playerY = newPlayerY;
            }
        }
    });
    
    // Kontrola kolízií s golds
    golds.forEach((gold, goldIndex) => {
        const blockX = gold.x;
        const blockY = gold.y;
        if (playerX === blockX && playerY === blockY && !gold.destroyed) {
            if (isDestroying) {
                gold.destroyed = true;
                isDestroying = false;
            } else {
                playerX = newPlayerX;
                playerY = newPlayerY;
            }
        }
    });
}

///////////////////////////////////////////////
//         Reset joysticku na stred          //
///////////////////////////////////////////////
function resetJoystick() {
    joystickActive = false;
    joystickContainer.classList.remove('active');
    joystickKnob.style.transform = 'translate(-50%, -50%)';
}

///////////////////////////////////////////////
//           Akčné tlačidlo                  //
///////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    const actionButton = document.querySelector('.action-button');
    if (actionButton) {
        actionButton.addEventListener('touchstart', handleActionTouch, { passive: false });
        actionButton.addEventListener('click', handleActionClick);
    }
});

function handleActionTouch(e) {
    e.preventDefault();
    destroyBlock();
    animateDigging();
}

function handleActionClick(e) {
    e.preventDefault();
    destroyBlock();
    animateDigging();
}


///////////////////////////////////////////////
// ========== OVLADANIE PRE PC ============= //
//         POHYB - KLAVESNICA (PC)           //
///////////////////////////////////////////////
window.addEventListener('keydown', (e) => {
    if (isExerciseActive) {
        console.log('⚠️ Pohyb zablokovaný - cvičenie prebieha');
        return; // Ignoruj všetky klávesy
    }

    const newPlayerX = playerX;
    const newPlayerY = playerY;
    
    switch (e.key) {
        case 'w':
        case 'ArrowUp':
            if (playerY - blockSize >= 0) { // Kontrola pohybu nahor
                playerY -= blockSize;
                playerRotation = 0; // Rotácia smeru hore
                playerDirection = 'front';
            }
            break;
        case 'a':
        case 'ArrowLeft':
            if (playerX - blockSize >= 0) {
                playerX -= blockSize;
                playerRotation = 270;
                playerDirection = 'vlavo';
            }
            break;
        case 's':
        case 'ArrowDown':
            if (playerY + blockSize < 800) {
                playerY += blockSize;
                playerRotation = 180;
                playerDirection = 'front';
            }
            break;
        case 'd':
        case 'ArrowRight':
            if (playerX + blockSize < 800) { 
                playerX += blockSize;
                playerRotation = 90; 
                playerDirection = 'vpravo';
            }
            break;
  }
  
  //////////////////////////////////////////////
  //            Kontrola kolízií              //
  //////////////////////////////////////////////
  clay.forEach((clayBlock, clayIndex) => {
      const blockX = clayBlock.x;
      const blockY = clayBlock.y;
      if (playerX === blockX && playerY === blockY) {
          if (isDestroying) {
              clay.splice(clayIndex, 1);
              isDestroying = false;
          } else {
              // Nastavenie hráča späť na pôvodné miesto, keď sa snaží prejsť cez blok
              playerX = newPlayerX;
              playerY = newPlayerY;
          }
      }
  });
  diamonds.forEach((diamond, diamondIndex) => {
      const blockX = diamond.x;
      const blockY = diamond.y;
      if (playerX === blockX && playerY === blockY && !diamond.destroyed) {
          if (isDestroying) {
              diamond.destroyed = true;
              isDestroying = false;
          } else {
              playerX = newPlayerX;
              playerY = newPlayerY;
          }
      }
  });
  kov.forEach((kov, kovIndex) => {
    const blockX = kov.x;
    const blockY = kov.y;
    if (playerX === blockX && playerY === blockY && !kov.destroyed) {
        if (isDestroying) {
            kov.destroyed = true;
            isDestroying = false;
        } else {
            playerX = newPlayerX;
            playerY = newPlayerY;
        }
    }
});
  golds.forEach((gold, goldIndex) => {
      const blockX = gold.x;
      const blockY = gold.y;
      if (playerX === blockX && playerY === blockY && !gold.destroyed) {
          if (isDestroying) {
              gold.destroyed = true;
              isDestroying = false;
          } else {
              playerX = newPlayerX;
              playerY = newPlayerY;
          }
      }
  });

});

document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      destroyBlock();
      animateDigging();
    }
});

///////////////////////////////////////////////
//      Funkcia na ničenie itemov            // 
///////////////////////////////////////////////
function destroyBlock() {
    if (isExerciseActive) {
        console.log('⚠️ Kopanie zablokované - cvičenie prebieha');
        return; // Ignoruj akciu kopania
    }

    playerBlockX = Math.floor(playerX / blockSize);
    playerBlockY = Math.floor(playerY / blockSize);
    targetBlockX = playerBlockX;
    targetBlockY = playerBlockY;
    // Zistí smer hráča a určí cieľový blok podľa toho
    switch (playerRotation) {
        case 0:
            targetBlockY--;
            break;
        case 90:
            targetBlockX++;
            break;
        case 180:
            targetBlockY++;
            break;
        case 270:
            targetBlockX--;
            break;
    }

    clay.forEach((clayBlock, clayIndex) => {
        const blockX = clayBlock.x / blockSize;
        const blockY = clayBlock.y / blockSize;
        // Kontrola zničenia bloku, ktorý je pred hráčom v smeru, ktorým je hráč otáčaný
        if (blockX === targetBlockX && blockY === targetBlockY) {
            clay.splice(clayIndex, 1);
        }
    });

    diamonds.forEach((diamond, diamondIndex) => {
      blockX = diamond.x / blockSize;
      blockY = diamond.y / blockSize;
      if (blockX === targetBlockX && blockY === targetBlockY && !diamond.destroyed) {
        spaceBarPressed++;
        if (spaceBarPressed === 3) {
          openCvicenie();
        }
      }
    });

    golds.forEach((gold, goldIndex) => {
      const blockX = gold.x / blockSize;
      const blockY = gold.y / blockSize;
      if (blockX === targetBlockX && blockY === targetBlockY && !gold.destroyed) {
        spaceBarPressed++;
        if (spaceBarPressed === 2) {
          gold.destroyed = true;
          goldsCollected++;
          effectzlato.play();
          updateGoldCount();
          updategoldsCollected(goldsCollected);
          recordGoldCollected();
          checkWinConditionWithRating();
          spaceBarPressed = 0; 
        }
      }
    });

    kov.forEach((kov, kovIndex) => {
      const blockX = kov.x / blockSize;
      const blockY = kov.y / blockSize;
      if (blockX === targetBlockX && blockY === targetBlockY && !kov.destroyed) {
        spaceBarPressed++;
        if (spaceBarPressed === 4) {
          showInfoDialog();
        }
      }
    });
}
///////////////////////////////////////////////
//          Animácia kopania                 // 
///////////////////////////////////////////////
function animateDigging() {
    if (isExerciseActive) {
        console.log('⚠️ Pohyb zablokovaný - cvičenie prebieha');
        return; // Ignoruj všetky klávesy
    }

    kope = true;
    drawPlayer();
    effectkopanie.play();
    setTimeout(() => {
        kope = false;
        drawPlayer();
    }, 200); // Čas, po ktorom sa obrázok vráti späť (200 milisekúnd)
}





//////////////////////////////////////////////////
//  ======= GENEROVANIE SVETA A ITEMOV =======  //
// Inicializácia sveta, generovanie a kreslenie //
//  itemov a hrača                              //
//////////////////////////////////////////////////

//////////////////////////////////////////////////
// Generovanie diamantov                        //
// Podporuje presné pozície z levelConfig       //
// alebo náhodné generovanie                    //
//////////////////////////////////////////////////
function generateDiamonds() {
    // Ak máme presné pozície v levelConfig a nie je to custom level
    if (currentLevelConfig && currentLevelConfig.positions && 
        currentLevelConfig.positions.diamonds && !isCustomLevel) {
        
        console.log('Generujem diamanty na presných pozíciach z levelConfig');
        currentLevelConfig.positions.diamonds.forEach(pos => {
            const newPosition = { x: pos.x * blockSize, y: pos.y * blockSize };
            diamonds.push(newPosition);
            generatedPositions.push(newPosition);
            console.log(`Diamant na pozícii: ${pos.x}, ${pos.y}`);
        });
    } else {
        // Náhodné generovanie (pre custom levely alebo ak nie sú definované pozície)
        console.log('Generujem diamanty náhodne');
        while (diamonds.length != PocetGenDiamant) {
            const diamondX = Math.floor(Math.random() * mapWidth) * blockSize;
            const diamondY = (Math.floor(Math.random() * mapHeight) + 6) * blockSize;
            const newPosition = { x: diamondX, y: diamondY };
            
            const positionExists = generatedPositions.some(pos => pos.x === diamondX && pos.y === diamondY);
            if (!positionExists) {
                diamonds.push(newPosition);
                generatedPositions.push(newPosition);
            }
        }
    }
    
    initializeDiamonds(PocetGenDiamant);
}

//////////////////////////////////////////////////
// Generovanie Kovov                            //
// Podporuje presné pozície z levelConfig       //
// alebo náhodné generovanie                    //
//////////////////////////////////////////////////
function generateKov() {  
    if (currentLevelConfig && currentLevelConfig.positions && 
        currentLevelConfig.positions.crystals && !isCustomLevel) {
        
        console.log('Generujem kryštály na presných pozíciach z levelConfig');
        currentLevelConfig.positions.crystals.forEach(pos => {
            const newPosition = { x: pos.x * blockSize, y: pos.y * blockSize };
            kov.push(newPosition);
            generatedPositions.push(newPosition);
            console.log(`Kryštál na pozícii: ${pos.x}, ${pos.y}`);
        });
    } else {
        console.log('Generujem kryštály náhodne');
        while (kov.length != PocetGenKov) {
            const kovX = Math.floor(Math.random() * mapWidth) * blockSize;
            const kovY = (Math.floor(Math.random() * mapHeight) + 6) * blockSize;
            const newPosition = { x: kovX, y: kovY };
            
            const positionExists = generatedPositions.some(pos => pos.x === kovX && pos.y === kovY);
            if (!positionExists) {
                kov.push(newPosition);
                generatedPositions.push(newPosition);
            }
        }
    }
    
    initializeKov(PocetGenKov);
}

//////////////////////////////////////////////////
// Generovanie Goldov                           //
// Podporuje presné pozície z levelConfig       //
// alebo náhodné generovanie                    //
//////////////////////////////////////////////////
function generateGolds() {    
    if (currentLevelConfig && currentLevelConfig.positions && 
        currentLevelConfig.positions.golds && !isCustomLevel) {
        
        console.log('Generujem goldy na presných pozíciách z levelConfig');
        currentLevelConfig.positions.golds.forEach(pos => {
            const newPosition = { x: pos.x * blockSize, y: pos.y * blockSize };
            golds.push(newPosition);
            generatedPositions.push(newPosition);
            console.log(`Gold na pozícii: ${pos.x}, ${pos.y}`);
        });
    } else {
        console.log('Generujem goldy náhodne');
        while (golds.length !== PocetGenGolds) {
            const goldX = Math.floor(Math.random() * mapWidth) * blockSize;
            const goldY = (Math.floor(Math.random() * mapHeight) + 6) * blockSize;
            const newPosition = { x: goldX, y: goldY };
            
            const positionExists = generatedPositions.some(pos => pos.x === goldX && pos.y === goldY) ||
                                   diamonds.some(diamond => diamond.x === goldX && diamond.y === goldY) || 
                                   kov.some(kov => kov.x === goldX && kov.y === goldY);
            if (!positionExists) {
                golds.push(newPosition);
                generatedPositions.push(newPosition);
            }
        }
    }
    
    initializeGolds(PocetGenGolds);
}

//////////////////////////////////////////////////
// Generovanie Clay                             //
// Generuje hlinu všade okrem pozícií           //
// kde sú iné objekty                           //
//////////////////////////////////////////////////
function generateClay() {
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        let isPositionEmpty = true;
        diamonds.forEach(diamond => {
          if (diamond.x === x * blockSize && diamond.y === (y + 6) * blockSize) { 
            isPositionEmpty = false;
          }
        });
        kov.forEach(kov => {
          if (kov.x === x * blockSize && kov.y === (y + 6) * blockSize) { 
            isPositionEmpty = false;
          }
        });
        golds.forEach(gold => {
          if (gold.x === x * blockSize && gold.y === (y + 6) * blockSize) { 
            isPositionEmpty = false;
          }
        });
        if (isPositionEmpty) {
          clay.push({ x: x * blockSize, y: (y + 6) * blockSize }); 
        }
      }
    }
}

//////////////////////////////////////////////////
// Funkcia na vykreslovanie postavy             //
//////////////////////////////////////////////////
function drawPlayer() {
    let image;
    if (playerDirection == 'front' ){
      image = playerImg;
      if(kope == true){
        image = hracKopaVpravoImg;
      }
    }else if (playerDirection == 'vpravo' ){
      image = playerImgVp;
      if(kope == true){
        image = hracKopaVpravoImg;
      }
    } else if (playerDirection == 'vlavo' ){
      image = playerImgVl;
      if(kope == true){
        image = hracKopaVlavoImg;
      }
    }else{
      image = playerImg;
  }
    ctx.drawImage(image, playerX, playerY, playerSize, playerSize);
    if(kope == true){
      image = hracKopaVpravoImg;
    }
}    
//////////////////////////////////////////////////
// Funkcia na vykreslovanie diamantov           //
//////////////////////////////////////////////////
function drawDiamonds() {
    diamonds.forEach(diamond => {
      if (!diamond.destroyed) {
        ctx.drawImage(diamondImg, diamond.x, diamond.y, diamondSize, diamondSize);
      }
    });
}
//////////////////////////////////////////////////
// Funkcia na vykreslovanie kovu                //
//////////////////////////////////////////////////
function drawKov() {
  kov.forEach(kov => {
    if (!kov.destroyed) {
      ctx.drawImage(kovImg, kov.x, kov.y, kovSize, kovSize);
    }
  });
}
//////////////////////////////////////////////////
// Funkcia na vykreslovanie goldov              //
//////////////////////////////////////////////////
function drawGolds() {
  golds.forEach(gold => {
    if (!gold.destroyed) {
      ctx.drawImage(goldImg, gold.x, gold.y, GoldSize, GoldSize);
    }
  });
}
//////////////////////////////////////////////////
// Funkcia na vykreslovanie hliny               //
//////////////////////////////////////////////////
function drawClay() {
    ctx.lineWidth = 2;
    clay.forEach(clayObj => {
      ctx.drawImage(clayImg, clayObj.x, clayObj.y, claySize, claySize);
    });
}





//////////////////////////////////////////////////
// ==========================================   //
//  ====== SYSTÉM HVIEZD A HODNOTENIA =======   //
// ==========================================   //
//////////////////////////////////////////////////

/////////////////////////////////////////////
// Globálne premenné pre sledovanie výkonu //
/////////////////////////////////////////////
let gamePerformance = {
    speechExercises: {
        totalExercises: 0,        // Celkový počet rečových cvičení v leveli (diamantov)
        completedExercises: 0,    // Dokončené rečové cvičenia
        completedRounds: 0,       // Počet absolvovaných kôl (slov) naprieč všetkými cvičeniami
        roundResults: [],         // Výsledky každého kola [{attempts: 1, points: 3, success: true}, ...]
        currentExerciseRounds: 0, // Počet kôl v aktuálnom cvičení (z levelConfig)
        totalPoints: 0            // Celkové body za rečové cvičenia
    },
    listeningExercises: {
        totalExercises: 0,        // Celkový počet posluchových cvičení (kryštálov)
        completedExercises: 0,    // Dokončené posluchové cvičenia
        completedRounds: 0,       // Počet absolvovaných kôl (párov) naprieč všetkými cvičeniami
        roundResults: [],         // Výsledky každého kola [{attempts: 1, points: 3, success: true}, ...]
        currentExerciseRounds: 0, // Počet kôl v aktuálnom cvičení (z levelConfig)
        totalPoints: 0            // Celkové body za posluchové cvičenia
    },
    golds: {
        total: 0,                 // Celkový počet goldov
        collected: 0              // Zozbierané goldy
    },
    levelCompleted: false,        // Či bol level dokončený
    finalStars: 0,               // Finálny počet hviezd
    totalPoints: 0,              // Celkové body
    maxPossiblePoints: 0         // Maximálne možné body (vypočítané dynamicky)
};

//////////////////////////////////////////////////////////
// Inicializácia sledovania výkonu na začiatku levelu   //
//////////////////////////////////////////////////////////
function initializePerformanceTracking() {
    console.log('Inicializujem sledovanie výkonu...');
    
    // Resetuj gamePerformance
    gamePerformance = {
        speechExercises: {
            totalExercises: PocetGenDiamant,
            completedExercises: 0,
            completedRounds: 0,           // Nová vlastnosť - absolvované kolá
            roundResults: [],             // Nová vlastnosť - výsledky jednotlivých kôl
            currentExerciseRounds: 0,     // Nová vlastnosť - počet kôl v aktuálnom cvičení
            totalPoints: 0
        },
        listeningExercises: {
            totalExercises: PocetGenKov,
            completedExercises: 0,
            completedRounds: 0,           // Nová vlastnosť - absolvované kolá
            roundResults: [],             // Nová vlastnosť - výsledky jednotlivých kôl
            currentExerciseRounds: 0,     // Nová vlastnosť - počet kôl v aktuálnom cvičení
            totalPoints: 0
        },
        golds: {
            total: PocetGenGolds,
            collected: 0
        },
        levelCompleted: false,
        finalStars: 0,
        totalPoints: 0,
        maxPossiblePoints: 0  // Bude vypočítané dynamicky v calculateFinalRating()
    };
    
    console.log(`Výkon inicializovaný - Max body sa vypočítajú dynamicky podľa absolvovaných kôl`);
    console.log(`Diamanty: ${PocetGenDiamant}, Kryštály: ${PocetGenKov}, Goldy: ${PocetGenGolds}`);
}

//////////////////////////////////////////////////////////
/**                                                     //
 * Zaznamenanie výsledku rečového cvičenia              //
 * NOVÝ SYSTÉM: Volá sa po KAŽDOM DOKONČENOM SLOVE     //
 * @param {number} attempts - Počet pokusov (1-3, alebo 0 pri neúspechu) //
 * @param {boolean} success - Či bolo kolo úspešné     //
 */                                                     //
//////////////////////////////////////////////////////////
function recordSpeechExerciseResult(attempts, success) {
    console.log(`📝 Zaznamenávam rečové kolo: ${attempts} pokusov, úspech: ${success}`);
    
    // Výpočet bodov podľa počtu pokusov
    let points = 0;
    if (success) {
        switch(attempts) {
            case 1: points = 3; break;  // 1 pokus = 3 body
            case 2: points = 2; break;  // 2 pokusy = 2 body
            case 3: points = 1; break;  // 3 pokusy = 1 bod
            default: points = 0; break; // Inak 0 bodov
        }
        gamePerformance.speechExercises.completedRounds++;
    }
    
    // Ulož výsledok kola do poľa
    gamePerformance.speechExercises.roundResults.push({
        attempts: attempts,
        points: points,
        success: success
    });
    
    // Pripočítaj body
    gamePerformance.speechExercises.totalPoints += points;
    
    const totalRounds = gamePerformance.speechExercises.roundResults.length;
    console.log(`✅ Rečové kolo dokončené: +${points} bodov (celkom: ${gamePerformance.speechExercises.totalPoints} z ${totalRounds * 3} možných)`);
}

//////////////////////////////////////////////////////////////////////
/**                                                                 //
 * Zaznamenanie výsledku posluchového cvičenia                      //
 * NOVÝ SYSTÉM: Volá sa po KAŽDOM DOKONČENOM PÁRE (KOLE)          //
 * @param {number} attempts - Počet pokusov (1-3, alebo 0 pri neúspechu) //
 * @param {boolean} success - Či bolo kolo úspešné                  //
 */                                                                 //
//////////////////////////////////////////////////////////////////////
function recordListeningExerciseResult(attempts, success) {
    console.log(`📝 Zaznamenávam posluchové kolo: ${attempts} pokusov, úspech: ${success}`);
    
    // Výpočet bodov podľa počtu pokusov
    let points = 0;
    if (success) {
        switch(attempts) {
            case 1: points = 3; break;  // 1 pokus = 3 body
            case 2: points = 2; break;  // 2 pokusy = 2 body
            case 3: points = 1; break;  // 3 pokusy = 1 bod
            default: points = 0; break; // Inak 0 bodov
        }
        gamePerformance.listeningExercises.completedRounds++;
    }
    
    // Ulož výsledok kola do poľa
    gamePerformance.listeningExercises.roundResults.push({
        attempts: attempts,
        points: points,
        success: success
    });
    
    // Pripočítaj body
    gamePerformance.listeningExercises.totalPoints += points;
    
    const totalRounds = gamePerformance.listeningExercises.roundResults.length;
    console.log(`✅ Posluchové kolo dokončené: +${points} bodov (celkom: ${gamePerformance.listeningExercises.totalPoints} z ${totalRounds * 3} možných)`);
}

//////////////////////////////////////
// Zaznamenanie zozbierania goldu   //
//////////////////////////////////////
function recordGoldCollected() {
    gamePerformance.golds.collected++;
}

//////////////////////////////////////////////////////////////////////////////
/**                                                                         //
 * Výpočet finálneho hodnotenia                                             //
 * @returns {Object} Objekt s hviezdami a detailnými štatistikami           //
*/                                                                          //
//////////////////////////////////////////////////////////////////////////////
function calculateFinalRating() {
    console.log('🧮 Vypočítavam finálne hodnotenie...');
    
    // === DYNAMICKÝ PREPOČET MAX BODOV ===
    // Max body = počet absolvovaných kôl × 3 (každé kolo má max 3 body)
    const speechRoundsCompleted = gamePerformance.speechExercises.roundResults.length;
    const listeningRoundsCompleted = gamePerformance.listeningExercises.roundResults.length;
    
    // Každé absolvované kolo (či úspešné alebo nie) sa započítava do max bodov
    gamePerformance.maxPossiblePoints = 
        (speechRoundsCompleted * 3) +      // Rečové kolá: max 3 body/kolo
        (listeningRoundsCompleted * 3);    // Posluchové kolá: max 3 body/kolo
    
    console.log(`📊 Rečové kolá: ${speechRoundsCompleted} × 3 = ${speechRoundsCompleted * 3} bodov`);
    console.log(`📊 Posluchové kolá: ${listeningRoundsCompleted} × 3 = ${listeningRoundsCompleted * 3} bodov`);
    console.log(`📊 Max možné body: ${gamePerformance.maxPossiblePoints}`);
    
    // Celkové body
    const totalPoints = gamePerformance.speechExercises.totalPoints + 
                       gamePerformance.listeningExercises.totalPoints;
    
    gamePerformance.totalPoints = totalPoints;
    
    // Percentuálny výkon
    const percentage = gamePerformance.maxPossiblePoints > 0 
        ? (totalPoints / gamePerformance.maxPossiblePoints) * 100 
        : 0;
    
    // Výpočet hviezd podľa percentuálneho výkonu
    let stars = 0;
    if (percentage >= 70) {
        stars = 3;
    } else if (percentage >= 40) {
        stars = 2;
    } else if (percentage >= 20) {
        stars = 1;
    } else {
        stars = 0;
    }
    
    gamePerformance.finalStars = stars;
    
    const result = {
        stars: stars,
        totalPoints: totalPoints,
        maxPossiblePoints: gamePerformance.maxPossiblePoints,
        percentage: Math.round(percentage),
        speechPoints: gamePerformance.speechExercises.totalPoints,
        listeningPoints: gamePerformance.listeningExercises.totalPoints,
        speechSuccess: gamePerformance.speechExercises.completedExercises,
        speechTotal: gamePerformance.speechExercises.totalExercises,
        listeningSuccess: gamePerformance.listeningExercises.completedExercises,
        listeningTotal: gamePerformance.listeningExercises.totalExercises,
        goldsCollected: gamePerformance.golds.collected,
        goldsTotal: gamePerformance.golds.total,
        gameTime: getCurrentGameTime()
    };
    
    console.log('Finálne hodnotenie:', result);
    return result;
}

//////////////////////////////////////////////////////////
/**                                                     //
 * Uloženie výsledkov do progress managera              //
 * @param {Object} rating - Výsledky hodnotenia         //
 */                                                     //
//////////////////////////////////////////////////////////
function saveResultsToProgress(rating) {
    console.log('💾 Ukladám výsledky do progress managera...', rating);
    
    // Získaj informácie o aktuálnom leveli
    const urlParams = new URLSearchParams(window.location.search);
    const worldId = urlParams.get('worldId') || urlParams.get('world');
    const levelId = urlParams.get('levelId') || urlParams.get('level');
    const isTraining = urlParams.get('training') === 'true';
    
    // Pre tréningové levely neukladaj do progress managera
    if (isTraining) {
        console.log('🎯 Tréningový level - neukladám do progress managera');
        return {
            saved: false,
            reason: 'training_level',
            unlocked: { levels: [], worlds: [] }
        };
    }
    
    if (!worldId || !levelId) {
        console.warn('⚠️ Chýbajú URL parametre pre uloženie pokroku');
        return {
            saved: false,
            reason: 'missing_params',
            unlocked: { levels: [], worlds: [] }
        };
    }
    
    if (!window.progressManager) {
        console.warn('⚠️ ProgressManager nie je dostupný');
        return {
            saved: false,
            reason: 'no_progress_manager',
            unlocked: { levels: [], worlds: [] }
        };
    }
    
    try {
        // Príprava rozšírených dát pre progress manager
        const levelData = {
            // Základné údaje
            stars: rating.stars,
            completed: true,
            time: rating.gameTime,
            
            // Detailné štatistiky
            points: rating.totalPoints,
            maxPoints: rating.maxPossiblePoints,
            percentage: rating.percentage,
            
            // Rozdelenie bodov
            speechExercises: {
                completed: rating.speechSuccess,
                total: rating.speechTotal,
                points: rating.speechPoints,
                roundResults: gamePerformance.speechExercises.roundResults // NOVÁ ŠTRUKTÚRA: Výsledky každého kola
            },
            listeningExercises: {
                completed: rating.listeningSuccess,
                total: rating.listeningTotal,
                points: rating.listeningPoints,
                roundResults: gamePerformance.listeningExercises.roundResults // NOVÁ ŠTRUKTÚRA: Výsledky každého kola
            },
            golds: {
                collected: rating.goldsCollected,
                total: rating.goldsTotal
            },
            
            // Metadáta
            timestamp: new Date().toISOString(),
            gameVersion: '2.0',
            levelType: 'banik'
        };
        
        console.log('📊 Ukladané dáta:', levelData);
        
        // Ulož do progress managera - VOLÁ VYLEPŠENÚ FUNKCIU
        const success = window.progressManager.updateLevelProgress(worldId, levelId, levelData);
        
        if (success) {
            console.log('✅ Výsledky úspešne uložené do progress managera');
            
            // Aktualizuj celkové štatistiky hráča
            const playerStats = {
                wordsSpoken: rating.speechTotal,
                correctPronunciations: rating.speechSuccess,
                incorrectPronunciations: rating.speechTotal - rating.speechSuccess,
                gamesPlayed: 1,
                gameType: 'banik',
                totalPlayTime: rating.gameTime
            };
            
            if (typeof window.progressManager.updateProgressStatistics === 'function') {
                window.progressManager.updateProgressStatistics(playerStats);
            }
            
            // Získaj informácie o odomknutom obsahu
            const worldProgress = window.progressManager.getWorldProgress(worldId);
            const detailedProgress = window.progressManager.getDetailedWorldProgress(worldId);
            
            console.log('🏆 Aktuálny pokrok sveta:', detailedProgress);
            
            // Vráť informácie o uložení a odomknutom obsahu
            return {
                saved: true,
                worldProgress: worldProgress,
                detailedProgress: detailedProgress,
                unlocked: {
                    levels: [], // Vyplní sa automaticky v progress manageri
                    worlds: []  // Vyplní sa automaticky v progress manageri
                }
            };
            
        } else {
            console.error('❌ Chyba pri ukladaní do progress managera');
            return {
                saved: false,
                reason: 'save_failed',
                unlocked: { levels: [], worlds: [] }
            };
        }
        
    } catch (error) {
        console.error('💥 Chyba pri ukladaní výsledkov:', error);
        return {
            saved: false,
            reason: 'exception',
            error: error.message,
            unlocked: { levels: [], worlds: [] }
        };
    }
}

//////////////////////////////////////////////////////////
/// Aktualizácia zobrazenia výkonu v UI (voliteľné)     //
//////////////////////////////////////////////////////////
function updateAnswerCounters() {
  const correctElement = document.getElementById('correct-words');
  const incorrectElement = document.getElementById('incorrect-words');
  
  if (correctElement) {
    correctElement.innerHTML = `${correctAnswers} <img src="images/spravne.png">`;
  }
  
  if (incorrectElement) {
    incorrectElement.innerHTML = `${incorrectAnswers} <img src="images/nespravne.png">`;
  }
  
  console.log(`Počítadlá aktualizované: ${correctAnswers} správnych, ${incorrectAnswers} nesprávnych`);
}

/////////////////////////////////////////////////////////////////////////////////////
/**                                                                                //
 * Zobrazenie detailných výsledkov v win dialógu                                   //
 * @param {Object} rating - Výsledky hodnotenia                                    //
 * @param {Object} saveResult - Výsledok uloženia do progress managera             //
 */                                                                                //
/////////////////////////////////////////////////////////////////////////////////////
function displayResultsInWinDialog(rating, saveResult) {
    console.log('📋 Zobrazujem výsledky v existujúcom win dialógu...', rating);
    
    // Nájdi win dialóg
    const endGameDialog = document.querySelector('#endgame');
    if (!endGameDialog) {
        console.warn('⚠️ Win dialóg nebol nájdený');
        return;
    }
    
    // OPRAVA: Aktualizuj existujúce HTML elementy namiesto pridávania nových
    
    // 1. Aktualizuj čas
    const timeSpan = endGameDialog.querySelector('.stats div:first-child span');
    if (timeSpan) {
        timeSpan.textContent = formatTime(rating.gameTime);
        console.log('✅ Čas aktualizovaný:', formatTime(rating.gameTime));
    }
    
    // 2. Aktualizuj slová - nájdi správny div (druhý div v stats)
    const wordsDiv = endGameDialog.querySelector('.stats div:nth-child(2)');
    if (wordsDiv) {
        // Vypočítaj nesprávne pokusy
        const speechIncorrect = rating.speechTotal - rating.speechSuccess;
        
        // Aktualizuj HTML obsah celého div-u
        wordsDiv.innerHTML = `
            <a>Slová: </a>
            <span>${rating.speechSuccess}</span> <img src="images/spravne.png">
            <span> / </span>
            <span>${speechIncorrect}</span> <img src="images/nespravne.png">
        `;
        console.log(`✅ Slová aktualizované: ${rating.speechSuccess} správne, ${speechIncorrect} nesprávne`);
    }
    
    // 3. Pridaj nové štatistiky pod existujúce (ak nie sú už tam)
    const statsDiv = endGameDialog.querySelector('.stats');
    if (statsDiv && !statsDiv.querySelector('.additional-stats')) {
        // Vytvor div pre dodatočné štatistiky
        const additionalStatsDiv = document.createElement('div');
        additionalStatsDiv.className = 'additional-stats';
        additionalStatsDiv.innerHTML = `
            <div style="margin-top: 10px;">
                <a>Body: </a>
                <span>${rating.totalPoints}/${rating.maxPossiblePoints}</span>
            </div>
            <div>
                <a>Úspešnosť: </a>
                <span>${rating.percentage}%</span>
            </div>
        `;
        
        statsDiv.appendChild(additionalStatsDiv);
        console.log('✅ Dodatočné štatistiky pridané');
    }
    
    // 4. Aktualizuj hviezdy v existujúcom modal-stars div
    const starsDiv = endGameDialog.querySelector('#modal-stars');
    if (starsDiv) {
        starsDiv.innerHTML = generateStarsHTML(rating.stars);
        console.log(`✅ Hviezdy aktualizované: ${rating.stars}/3`);
    }
    
    console.log('🎉 Win dialóg úspešne aktualizovaný!');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**                                                                                                               //
 * Generovanie HTML pre zobrazenie hviezd (kompatibilné s existujúcim dizajnom)                                   //
 * @param {number} stars - Počet hviezd (0-3)                                                                     //
 * @returns {string} HTML string                                                                                  //    
 */                                                                                                               //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function generateStarsHTML(stars) {
    let starsHTML = '<div class="stars-container" style="display: flex; gap: 5px; justify-content: center; margin: 0px 0px 10px 0px;">';
    
    for (let i = 1; i <= 3; i++) {
        if (i <= stars) {
            // Aktívna hviezda
            starsHTML += `<img src="images/star_active.png" alt="Hviezda" style="width: 50px; height: 50px;">`;
        } else {
            // Neaktívna hviezda
            starsHTML += `<img src="images/star_inactive.png" alt="Hviezda" style="width: 50px; height: 5updatePerformanceDisplayupdatePerformanceDisplay0px; opacity: 0.3;">`;
        }
    }
    
    starsHTML += '</div>';
    return starsHTML;
}





//////////////////////////////////////////////////////////
// kontrola vitaznych podmienok - pridať hodnotenie     //
//////////////////////////////////////////////////////////
function checkWinConditionWithRating() {
    if (diamondsCollected === PocetGenDiamant && goldsCollected === PocetGenGolds && kovCollected === PocetGenKov) {
        gamePerformance.levelCompleted = true;
        
        // Zastav timer
        stopTimer();
        
        // Vypočítaj hodnotenie
        const rating = calculateFinalRating();
        const saveResult = saveResultsToProgress(rating);

        // Aktualizuj navigáciu
        updateDialogNavigation();
        
        setTimeout(() => {
            effectVyhra.play();
            document.getElementById("endgame").style.display = "block";
            document.getElementById("blur-background").style.display = "block";
            document.body.style.overflow = "hidden";
            
            // Zobraz výsledky v dialógu
            displayResultsInWinDialog(rating, saveResult);
            
        }, 100);
    }
}

///////////////////////////////
// Reset hry - vynulovanie   //
///////////////////////////////
function resetGame() {
    stopTimer();
    initializePerformanceTracking();

    let hasWon = false; // Premenná na sledovanie, či hráč už vyhral
    playerX = blockSize; // Začiatočná pozícia hráča na osi X
    playerY = blockSize; // Začiatočná pozícia hráča na osi Y
        
    diamonds.length = 0;
    kov.length = 0;
    clay.length = 0;
    golds.length = 0;

    wordList = [];
    currentWordIndex = 0;
    
    diamondsDestroyed = 0; // Počet zničených diamantov
    kovsDestroyed = 0; // Počet zničených diamantov
    goldsDestroyed = 0;
    isDestroying = false; // Premenná určujúca, či hráč zničí blok
    playerRotation = 0; // Úvodná rotácia hráča
    diamondsCollected = 0; // Počet zozbieraných diamantov
    kovCollected = 0; // Počet zozbieraných diamantov
    goldsCollected = 0;
    generatedPositions = []; // Vyčisti pozície objektov

    correctAnswers = 0;
    incorrectAnswers = 0;
    updateAnswerCounters();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    generateDiamonds();
    generateKov();
    generateGolds();
    generateClay();
    drawPlayer();
    drawClay();
    drawDiamonds();
    drawKov();
    drawGolds();
    requestAnimationFrame(gameLoop);

    const timeLimit = currentLevelConfig && currentLevelConfig.timeLimit ? currentLevelConfig.timeLimit : null;
    startTimer(timeLimit);

    console.log('Hra spustená s časovým systémom');
}

//////////////////////
//  BOČNY PANEL     //
//////////////////////
function updateDiamondCount() {
    const diamondCountElement = document.getElementById('diamondCount');
    if (diamondCountElement) {
        diamondCountElement.textContent = diamondsCollected;
    }
}
function updateKovCount() {
    const kovCountElement = document.getElementById('kovCount');
    if (kovCountElement) {
        kovCountElement.textContent = kovCollected;
    }
}
function updateGoldCount() {
    const goldCountElement = document.getElementById('goldCount');
    if (goldCountElement) {
        goldCountElement.textContent = goldsCollected;
    }
}

///////////////////////////////////////////////////
// Funkcia na inicializáciu zobrazenia itemu     //
///////////////////////////////////////////////////
function initializeDiamonds(count) {
    const diamondsContainer = document.querySelector('.diamonds-container');
    // Vymažte všetky existujúce diamantové položky
    diamondsContainer.innerHTML = '';
    // Vytvorte a pridajte diamantové položky na základe počtu diamantov
    for (let i = 0; i < count; i++) {
        const diamondItem = document.createElement('div');
        diamondItem.classList.add('diamond-item');
        const diamondImage = document.createElement('img');
        diamondImage.src = 'images/diamond.png';
        diamondImage.alt = 'Diamond';
        diamondImage.classList.add('diamond-image');
        const diamondOverlay = document.createElement('div');
        diamondOverlay.classList.add('diamond-overlay');
        diamondItem.appendChild(diamondImage);
        diamondItem.appendChild(diamondOverlay);
        diamondsContainer.appendChild(diamondItem);
    }
}
function initializeKov(count) {
    const kovContainer = document.querySelector('.kov-container');
    kovContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const kovItem = document.createElement('div');
        kovItem.classList.add('kov-item');
        const kovImage = document.createElement('img');
        kovImage.src = 'images/kov.png';
        kovImage.alt = 'Kov';
        kovImage.classList.add('kov-image');
        const kovOverlay = document.createElement('div');
        kovOverlay.classList.add('kov-overlay');
        kovItem.appendChild(kovImage);
        kovItem.appendChild(kovOverlay);
        kovContainer.appendChild(kovItem);
    }
}
function initializeGolds(count) {
    const goldsContainer = document.querySelector('.golds-container');
    goldsContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const goldItem = document.createElement('div');
        goldItem.classList.add('gold-item');
        const goldImage = document.createElement('img');
        goldImage.src = 'images/gold.png';
        goldImage.alt = 'Gold';
        goldImage.classList.add('gold-image');
        const goldOverlay = document.createElement('div');
        goldOverlay.classList.add('gold-overlay');
        goldItem.appendChild(goldImage);
        goldItem.appendChild(goldOverlay);
        goldsContainer.appendChild(goldItem);
    }
}

/////////////////////////////////////////////////////////////////////////////
// Funkcia na aktualizáciu zobrazenia itemov po získaní nového itemu       //
/////////////////////////////////////////////////////////////////////////////
function updateDiamondsCollected(count) {
    const diamonds = document.querySelectorAll('.diamond-item');
    // Aktualizujte triedy pre všetky diamanty po získaní nového diamantu
    for (let i = 0; i < count; i++) {
        diamonds[i].classList.add('collected');
    }
}
function updateKovCollected(count) {
    const kov = document.querySelectorAll('.kov-item');
    for (let i = 0; i < count; i++) {
        kov[i].classList.add('collected');
    }
}
function updategoldsCollected(count) {
    const golds = document.querySelectorAll('.gold-item');
    for (let i = 0; i < count; i++) {
        golds[i].classList.add('collected');
    }
}






//////////////////////////////////////////////////////////////////////
// ================================================================ //
//      ===== CVIČENIE NA ROZPOZNANIE PODOBNÝCH ZVUKOV =====        //
// ================================================================ //
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
// ================================================================ //
//              ===== POSLUCHOVÉ MINICVIČENIE =====                 //
// ================================================================ //
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////
// ====== POSLUCHOVÉ CVIČENIE ======    //
// Premenné pre posluchové cvičenie     //
//////////////////////////////////////////
let listeningCurrentIndex = 0;          // Aktuálny index cvičenia
let listeningWordPairs = [];            // Pár slov pre porovnanie
let listeningAttempts = 0;              // Počet pokusov v aktuálnom cvičení (DEPRECATED - už nepoužívame)
let listeningCurrentAttempts = 0;       // NOVÁ PREMENNÁ: Počet pokusov pre aktuálny pár (kolo)
let listeningMaxAttempts = 3;           // Maximálny počet pokusov na jedno cvičenie
let listeningCorrectAnswers = 0;        // Počet správnych odpovedí (DEPRECATED)
let listeningIncorrectAnswers = 0;      // Počet nesprávnych odpovedí (DEPRECATED)
let listeningTotalExercises = 2;        // Celkový počet cvičení (rovnaké ako rečové)
let listeningCompletedExercises = 0;    // Dokončené cvičenia

// Zvukové objekty pre posluchové cvičenie
let listeningSound1 = null;
let listeningSound2 = null;

//////////////////////////////////////////
// Funkcia na otvorenie posluchového    //
// cvičenia - podobne ako openCvicenie  //
//////////////////////////////////////////
function openListeningExercise() {
    console.log('Otváranie posluchového cvičenia...');
    
    // Nastav flag - posluchové cvičenie je aktívne
    isExerciseActive = true;
    console.log('🔒 Herné akcie zablokované - posluchové cvičenie aktívne');
    
    console.log('=== DEBUG openListeningExercise ===');
    console.log('currentLevelConfig:', currentLevelConfig);
    
    // Nastavenie počtu cvičení z levelConfig - používame pocetcviceni ak existuje
    if (currentLevelConfig && currentLevelConfig.gameConfig && currentLevelConfig.gameConfig.listeningExercises) {
        listeningTotalExercises = currentLevelConfig.gameConfig.listeningExercises;
        console.log(`Počet posluchových cvičení nastavený z levelConfig: ${listeningTotalExercises}`);
    } else {
        listeningTotalExercises = 2; // predvolená hodnota
        console.log(`Používam predvolenú hodnotu posluchových cvičení: ${listeningTotalExercises}`);
    }
    
    // Ulož počet kôl pre aktuálne cvičenie do gamePerformance
    if (typeof gamePerformance !== 'undefined') {
        gamePerformance.listeningExercises.currentExerciseRounds = listeningTotalExercises;
        console.log(`✅ Posluchové cvičenie bude mať ${listeningTotalExercises} kôl (párov)`);
    }
    
    // Reset hodnôt pre nové cvičenie
    listeningCurrentIndex = 0;
    listeningAttempts = 0;
    listeningCorrectAnswers = 0;
    listeningIncorrectAnswers = 0;
    listeningCompletedExercises = 0;
    
    // Generovanie párov slov pre cvičenie
    generateListeningPairs();
    
    // Zobrazenie dialogového okna
    const infoDialog = document.getElementById('zvuky');
    if (infoDialog) {
        infoDialog.style.display = 'block';
    }
    document.getElementById("blur-background").style.display = "block";
    document.body.classList.add("cvicenie-open");
    document.body.style.overflow = "hidden";
    
    // Zobrazenie prvého cvičenia
    displayListeningExercise();
    
}

//////////////////////////////////////////
// Generovanie párov slov pre cvičenie //
// Používa pôvodný systém s priečinkami//
//////////////////////////////////////////
function generateListeningPairs() {
    listeningWordPairs = [];
    
    // Generujeme páry pre každé cvičenie
    for (let i = 0; i < listeningTotalExercises; i++) {
        // Náhodný výber priečinka (1-15 ako v pôvodnom kóde)
        const randomFolder = Math.floor(Math.random() * 15) + 1;
        const soundFolder = `zvuky/${randomFolder}/`;
        
        // Získanie zoznamu zvukov (1.wav, 2.wav)
        const allSounds = ['1.wav', '2.wav'];
        
        // Náhodný výber dvoch indexov (môžu byť rovnaké alebo rôzne)
        const index1 = Math.floor(Math.random() * allSounds.length);
        const index2 = Math.floor(Math.random() * allSounds.length);
        
        // Vytvorenie páru
        listeningWordPairs.push({
            folder: randomFolder,
            soundFolder: soundFolder,
            index1: index1,
            index2: index2,
            sound1Path: `${soundFolder}${allSounds[index1]}`,
            sound2Path: `${soundFolder}${allSounds[index2]}`,
            areSame: index1 === index2 // Sú rovnaké ak majú rovnaký index
        });
    }
    
    console.log('Generované páry zvukov pre posluchové cvičenie:', listeningWordPairs);
}

//////////////////////////////////////////
// Zobrazenie aktuálneho cvičenia       //
// Podobne ako displayWord()            //
//////////////////////////////////////////
function displayListeningExercise() {
    // === RESET POKUSOV PRE NOVÝ PÁR ===
    listeningCurrentAttempts = 0;
    console.log(`🔄 Začínam nový pár (kolo ${listeningCurrentIndex + 1}/${listeningWordPairs.length})`);
    
    if (listeningCurrentIndex >= listeningWordPairs.length) {
        // Všetky cvičenia dokončené
        closeListeningExercise(true);
        return;
    }
    
    const currentPair = listeningWordPairs[listeningCurrentIndex];
    console.log(`Zobrazujem posluchové cvičenie ${listeningCurrentIndex + 1}/${listeningWordPairs.length}`);
    console.log('Aktuálny pár:', currentPair);
    
    // Aktualizácia obsahu dialógu
    const dialogContent = document.querySelector('.cvicenie-content-2');
    if (dialogContent) {
        // Resetovanie pokusov pre nové cvičenie
        listeningAttempts = 0;
        
        dialogContent.innerHTML = `
            <!-- Hlavička -->
            <div class="cvicenie-text">
                <H1 style="font-size: 30px">POSLUCHOVÉ CVIČENIE</h1>
            </div>

            <div id="listening-word-progress" class="word-progress">
                <div class="progress-text">Kolo ${listeningCurrentIndex + 1} / ${listeningWordPairs.length}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${((listeningCurrentIndex + 1) / listeningWordPairs.length) * 100}%"></div>
                </div>
            </div>

            <!-- Inštrukcie -->
            <div class="listening-instruction">
                <p>Počúvaj pozorne a rozhodni, či sú slová rovnaké alebo rôzne</p>
            </div>

            <!-- Status zvuku -->
            <div class="sound-status-container">
                <div id="listening-status" class="sound-status">Pripravujem slová...</div>
            </div>

            <!-- Tlačidlá pre odpoveď -->
            <div id="listening-buttons-container" class="listening-buttons-container" style="display: flex;">
                <button id="listening-same-btn" class="listening-btn listening-btn-same disabled-btn" disabled>
                    <img src="images/rovnake.png" alt="Rovnaké">
                    <span>ROVNAKÉ</span>
                </button>
                <button id="listening-different-btn" class="listening-btn listening-btn-different disabled-btn" disabled>
                    <img src="images/rozdielne.png" alt="Rozdielne">  
                    <span>RÔZNE</span>
                </button>
            </div>
        `;
        
        // Pripojenie event listenerov na tlačidlá
        setTimeout(() => {
            const sameBtn = document.getElementById('listening-same-btn');
            const differentBtn = document.getElementById('listening-different-btn');
            
            if (sameBtn) {
                sameBtn.addEventListener('click', () => handleListeningAnswer(true));
            }
            if (differentBtn) {
                differentBtn.addEventListener('click', () => handleListeningAnswer(false));
            }
        }, 100);
    }
    
    // Spustenie prehrávania zvukov
    setTimeout(() => {
        playListeningSounds(currentPair);
    }, 1000);
}

//////////////////////////////////////////
// Prehranie zvukov pre posluchové      //
// cvičenie - používa pôvodné cesty     //
//////////////////////////////////////////
function playListeningSounds(soundPair) {
    const statusElement = document.getElementById('listening-status');
    const sameBtn = document.getElementById('listening-same-btn');
    const differentBtn = document.getElementById('listening-different-btn');
    
    // BLOKUJ tlačidlá počas prehrávania
    if (sameBtn) {
        sameBtn.disabled = true;
        sameBtn.classList.add('disabled-btn');
    }
    if (differentBtn) {
        differentBtn.disabled = true;
        differentBtn.classList.add('disabled-btn');
    }
    
    // Vytvorenie Howl objektov s cestami z páru
    listeningSound1 = new Howl({ 
        src: [soundPair.sound1Path],
        onloaderror: () => {
            console.warn(`Zvuk z cesty "${soundPair.sound1Path}" sa nepodarilo načítať`);
        }
    });
    
    listeningSound2 = new Howl({ 
        src: [soundPair.sound2Path],
        onloaderror: () => {
            console.warn(`Zvuk z cesty "${soundPair.sound2Path}" sa nepodarilo načítať`);
        }
    });
    
    // Prehratie prvého zvuku
    if (statusElement) {
        statusElement.textContent = "Prehráva sa prvý zvuk...";
    }
    
    console.log(`Prehrávam prvý zvuk: ${soundPair.sound1Path}`);
    listeningSound1.play();
    
    // Po skončení prvého zvuku prehrať druhý
    listeningSound1.on('end', () => {
        setTimeout(() => {
            if (statusElement) {
                statusElement.textContent = "Prehráva sa druhý zvuk...";
            }
            console.log(`Prehrávam druhý zvuk: ${soundPair.sound2Path}`);
            listeningSound2.play();
            
            // Po skončení druhého zvuku ODBLOKOVAŤ tlačidlá
            listeningSound2.on('end', () => {
                setTimeout(() => {
                    if (statusElement) {
                        statusElement.textContent = "Vyber svoju odpoveď:";
                    }
                    
                    // ODBLOKOVAŤ tlačidlá
                    if (sameBtn) {
                        sameBtn.disabled = false;
                        sameBtn.classList.remove('disabled-btn');
                    }
                    if (differentBtn) {
                        differentBtn.disabled = false;
                        differentBtn.classList.remove('disabled-btn');
                    }
                    
                    const buttonsContainer = document.getElementById('listening-buttons-container');
                    if (buttonsContainer) {
                        buttonsContainer.style.display = 'flex';
                    }
                }, 500);
            });
        }, 1000); // Pauza medzi zvukmi
    });
}

//////////////////////////////////////////
// Spracovanie odpovede hráča           //
// Podobne ako checkSpeechResult()      //
//////////////////////////////////////////
function handleListeningAnswer(playerAnswerSame) {
    // Skrytie tlačidiel
    const buttonsContainer = document.getElementById('listening-buttons-container');
    if (buttonsContainer) {
        buttonsContainer.style.display = 'none';
    }
    
    // Zastavenie zvukov
    if (listeningSound1) listeningSound1.stop();
    if (listeningSound2) listeningSound2.stop();
    
    const currentPair = listeningWordPairs[listeningCurrentIndex];
    const isCorrect = playerAnswerSame === currentPair.areSame;
    
    console.log(`Hráčova odpoveď: ${playerAnswerSame ? 'rovnaké' : 'rôzne'}`);
    console.log(`Správna odpoveď: ${currentPair.areSame ? 'rovnaké' : 'rôzne'}`);
    console.log(`Je správne: ${isCorrect}`);
    
    // Nájdi alebo vytvor vysledok element (rovnako ako pri rečovom cvičení)
    let vysledokElement = document.getElementById('listening-vysledok');
    if (!vysledokElement) {
        // Vytvor vysledok element ak neexistuje
        const execiseWindow = document.querySelector('#zvuky .execise-window');
        vysledokElement = document.createElement('div');
        vysledokElement.id = 'listening-vysledok';
        vysledokElement.className = 'vysledok';
        execiseWindow.appendChild(vysledokElement);
    }
    
    if (isCorrect) {
        // === SPRÁVNA ODPOVEĎ ===
        listeningCurrentAttempts++; // Zvýš počet pokusov pre tento pár
        correctAnswers++;
        updateAnswerCounters();
        
        vysledokElement.innerHTML = `<center> <img src="images/spravne.png" alt="Správne"> <div class="success-message">Výborne!</div></center>`;
        vysledokElement.classList.add('show');
        
        // Použiť existujúci zvukový efekt
        if (typeof effectSpravne !== 'undefined') {
            effectSpravne.play();
        }
        
        setTimeout(() => {
            vysledokElement.innerHTML = ''; 
            vysledokElement.classList.remove('show');
            
            // === ZAZNAMENANIE VÝSLEDKU TOHTO KOLA ===
            if (typeof recordListeningExerciseResult === 'function') {
                recordListeningExerciseResult(listeningCurrentAttempts, true);
            }
            console.log(`✅ Posluchové kolo ${listeningCurrentIndex + 1}/${listeningWordPairs.length} dokončené s ${listeningCurrentAttempts} pokusmi`);
            
            // Prejsť na ďalšie cvičenie
            listeningCurrentIndex++;
            displayListeningExercise();
        }, 2000);
        
    } else {
        // === NESPRÁVNA ODPOVEĎ ===
        listeningCurrentAttempts++; // Zvýš počet pokusov pre tento pár
        incorrectAnswers++;
        updateAnswerCounters();
        
        console.log(`Skús to znova, pokusy pre tento pár: ${listeningCurrentAttempts}`);
        
        // Vypočítaj zostávajúce pokusy
        const remainingAttempts = listeningMaxAttempts - listeningCurrentAttempts;
        
        if (remainingAttempts > 0) {
            // Ešte má pokusy - zobraz správu so zostávajúcimi pokusmi
            const attemptMessage = `<div class="attempt-message">Zostávajúce pokusy: ${remainingAttempts}</div>`;
            
            vysledokElement.innerHTML = `
                <center>
                <img src="images/nespravne.png" alt="Nesprávne">
                ${attemptMessage}
                </center>
            `;
            vysledokElement.classList.add('show');
            
            // Použiť existujúci zvukový efekt
            if (typeof effectZle !== 'undefined') {
                effectZle.play();
            }
            
            // Po 2 sekundách skryť výsledok a umožniť nový pokus
            setTimeout(() => {
                vysledokElement.innerHTML = '';
                vysledokElement.classList.remove('show');
                
                // Znovu zobraziť tlačidlá a prehrať zvuky
                if (buttonsContainer) {
                    buttonsContainer.style.display = 'flex';
                }
                
                const statusElement = document.getElementById('listening-status');
                if (statusElement) {
                    statusElement.textContent = "Počúvaj znova...";
                }
                
                playListeningSounds(currentPair);
            }, 2000);
            
        } else {
            // Vyčerpané pokusy - OKAMŽITE zatvor po vyhodnotení
            const attemptMessage = `<div class="attempt-message final-attempt">Posledný pokus vyčerpaný</div>`;
            
            vysledokElement.innerHTML = `
                <center>
                <img src="images/nespravne.png" alt="Nesprávne">
                ${attemptMessage}
                </center>
            `;
            vysledokElement.classList.add('show');
            
            // Použiť existujúci zvukový efekt
            if (typeof effectZle !== 'undefined') {
                effectZle.play();
            }
            
            // OKAMŽITE zatvor po 2 sekundách (bez čakania na zmiznutie výsledku)
            setTimeout(() => {
                // === ZAZNAMENANIE NEÚSPEŠNÉHO KOLA ===
                if (typeof recordListeningExerciseResult === 'function') {
                    recordListeningExerciseResult(0, false);
                }
                console.log(`❌ Posluchové kolo ${listeningCurrentIndex + 1}/${listeningWordPairs.length} neúspešné`);
                
                closeListeningExercise(false);
            }, 2000);
        }
    }
}

//////////////////////////////////////////
// Zatvorenie posluchového cvičenia     //
// Podobne ako closeCvicenie()         //
//////////////////////////////////////////
function closeListeningExercise(success = false) {
    isExerciseActive = false;
    console.log('🔓 Herné akcie odblokované - posluchové cvičenie ukončené');
    
    // Zastavenie všetkých zvukov
    if (listeningSound1) {
        listeningSound1.stop();
        listeningSound1 = null;
    }
    if (listeningSound2) {
        listeningSound2.stop();
        listeningSound2 = null;
    }
    
    // OKAMŽITE skryj modal okno
    const infoDialog = document.getElementById('zvuky');
    if (infoDialog) {
        infoDialog.style.display = 'none';
    }
    document.getElementById("blur-background").style.display = "none";
    document.body.classList.remove("cvicenie-open");
    document.body.style.overflow = "auto";
    
    // Vyčisti vysledok element
    const vysledokElement = document.getElementById('listening-vysledok');
    if (vysledokElement) {
        vysledokElement.innerHTML = '';
        vysledokElement.classList.remove('show');
    }
    
    // Zaznamenanie výsledku
    if (success) {
        console.log('Posluchové cvičenie úspešne dokončené!');
        listeningCompletedExercises = listeningWordPairs.length;
        
        // Zaznamenávanie už prebehlo priebežne po každom páre
        // Táto časť už len označí kryštál ako vykopaný
        
        // Označenie kryštálu ako vykopaného
        if (typeof kov !== 'undefined' && Array.isArray(kov)) {
            kov.forEach((kristal, kristalIndex) => {
                const blockX = kristal.x / blockSize;
                const blockY = kristal.y / blockSize;
                if (blockX === targetBlockX && blockY === targetBlockY && !kristal.destroyed) {
                    kristal.destroyed = true;
                    kovCollected++;
                    if (typeof effectzlato !== 'undefined') {
                        effectzlato.play();
                    }
                    if (typeof updateKovCount === 'function') {
                        updateKovCount();
                    }
                    if (typeof updateKovCollected === 'function') {
                        updateKovCollected(kovCollected);
                    }
                    if (typeof checkWinConditionWithRating === 'function') {
                        checkWinConditionWithRating();
                    }
                    spaceBarPressed = 0;
                }
            });
        }
    } else {
        console.log('Posluchové cvičenie neúspešné');
        // Zaznamenávanie neúspešného kola už prebehlo pri vyčerpaní pokusov
        spaceBarPressed = 0;
    }
}

//////////////////////////////////////////
// NOVÁ FUNKCIA showInfoDialog()        //
// Nahradenie starej funkcie            //
//////////////////////////////////////////
function showInfoDialog() {
    console.log('Otváranie posluchového cvičenia...');
    openListeningExercise(); 
}






//////////////////////////////////////////////////////////////////////
// ================================================================ //
//                  ===== REČOVÉ MINICVIČENIE =====                 //
// ================================================================ //
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////
// ====== HLASOVÉ CVIČENIE ======       //
// Premenné                             //
//////////////////////////////////////////
let currentWordIndex = 0; 
let wordList = []; // Pole slov na vyslovenie
let pocetcviceni = 2;
let kontrolacvicenia = 0;
let slovicka = 0;





//////////////////////////////////////////
// Inicializácia rozpoznávania reči      //
// Samotné rozpoznávanie je v spoločnej  //
// službe window.BJ.speech (src/core/    //
// speech.js) – funguje v prehliadači aj //
// v Android appke.                      //
//////////////////////////////////////////
function initSpeechRecognition() {
    console.log('🎤 Inicializácia speech recognition...');

    const speech = window.BJ && window.BJ.speech;
    if (!speech || !speech.isSupported()) {
        console.error('❌ Speech recognition nie je podporované v tomto prehliadači');

        // Zobraz chybovú hlášku pre používateľa
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            if (isIOS) {
                showErrorMessage('Používaj Safari prehliadač na iPhone/iPad pre rozpoznávanie reči.');
            } else {
                showErrorMessage('Používaj Chrome prehliadač na Android pre rozpoznávanie reči.');
            }
        } else {
            showErrorMessage('Tvoj prehliadač nepodporuje rozpoznávanie reči. Použi Chrome, Edge alebo Safari.');
        }

        return false;
    }

    // Stav tlačidla mikrofónu podľa služby (nastaví sa len raz)
    if (!speechRecognition) {
        speechRecognition = speech;
        speech.on('start', () => {
            console.log('🎤 Rozpoznávanie spustené');
            isListening = true;
            updateMicrophoneButton(true);
        });
        speech.on('end', () => {
            console.log('🎤 Rozpoznávanie ukončené');
            isListening = false;
            updateMicrophoneButton(false);
        });
    }

    console.log('✅ Speech recognition úspešne inicializované');
    return true;
}

//////////////////////////////////////////
// Spustenie rozpoznávania              //
// Zavolá sa pri kliknutí na mikrofón   //
//////////////////////////////////////////
function startSpeechRecognition(expectedWord) {
    console.log('🎙️ Pokus o spustenie rozpoznávania pre slovo:', expectedWord);

    // CHECK 1: Je rozpoznávanie inicializované?
    if (!speechRecognition) {
        console.warn('⚠️ Speech recognition nie je inicializované, inicializujem...');
        const initialized = initSpeechRecognition();
        if (!initialized) {
            console.error('❌ Nepodarilo sa inicializovať speech recognition');
            return;
        }
    }

    // CHECK 2: Už beží rozpoznávanie?
    if (isListening || speechRecognition.isListening) {
        console.warn('⚠️ Rozpoznávanie už beží, ignorujem pokus o opätovné spustenie');
        return;
    }

    // Uložím očakávané slovo
    currentExpectedWord = expectedWord;

    console.log('▶️ Spúšťam rozpoznávanie...');
    speechRecognition.listen()
        .then(({ transcript }) => handleSpeechResult(transcript))
        .catch((error) => {
            if (error && error.code === 'busy') return;
            handleSpeechError({ error: (error && error.code) || 'unknown' });
        });
}

//////////////////////////////////////////
// Spracovanie výsledku rozpoznávania   //
// Volá sa automaticky z callback       //
//////////////////////////////////////////
function handleSpeechResult(transcript) {
    
    console.log('🗣️ Rozpoznaný text:', transcript);
    console.log('🎯 Očakávané slovo:', currentExpectedWord);
    
    // Porovnanie (spoločné pravidlo pre všetky hry – src/core/slovak.js)
    console.log('🔍 Porovnanie:', window.BJ.normalizeTranscript(transcript), 'vs', currentExpectedWord.toLowerCase());
    
    // Kontrola či sa zhodujú
    if (window.BJ.matchesWord(transcript, currentExpectedWord)) {
        // ✅ SPRÁVNE VYSLOVENÉ
        console.log('✅ Správne vyslovené slovo "' + currentExpectedWord + '"');
        
        // Zobraz správny výsledok
        document.getElementById("vysledok").innerHTML = `
            <center>
                <img src="images/spravne.png" alt="Správne">
                <div class="success-message">Výborne!</div>
            </center>
        `;
        document.getElementById("vysledok").classList.add('show');
        
        // Prehraj zvuk
        if (typeof effectSpravne !== 'undefined') {
            effectSpravne.play();
        }
        
        // Aktualizuj počítadlá
        correctAnswers++;
        updateAnswerCounters();
        currentWordIndex++;
        
        // Zaznamenaj výsledok
        const attempts = slovicka + 1;
        if (typeof recordSpeechExerciseResult === 'function') {
            recordSpeechExerciseResult(attempts, true);
        }
        slovicka = 0;
        console.log(`✅ Kolo ${currentWordIndex}/${wordList.length} dokončené s ${attempts} pokusmi`);
        
        // Po 2 sekundách zobraz ďalšie slovo alebo ukonči
        setTimeout(() => {
            document.getElementById("vysledok").innerHTML = '';
            document.getElementById("vysledok").classList.remove('show');
            
            if (currentWordIndex < wordList.length) {
                displayWord(); // Zobraz ďalšie slovo
            } else {
                kontrolacvicenia = 1;
                closeCvicenie(); // Ukonči cvičenie
            }
        }, 2000);
        
    } else {
        // ❌ NESPRÁVNE VYSLOVENÉ
        console.log('❌ Nesprávne vyslovené. Slovo "' + currentExpectedWord + '" nebolo správne rozpoznané');
        
        slovicka++;
        incorrectAnswers++;
        updateAnswerCounters();
        console.log('Počet pokusov:', slovicka);
        
        // Vypočítaj zostávajúce pokusy
        const remainingAttempts = 3 - slovicka;
        
        // Zobraz chybovú správu
        if (remainingAttempts > 0) {
            document.getElementById("vysledok").innerHTML = `
                <center>
                    <img src="images/nespravne.png" alt="Nesprávne">
                    <div class="attempt-message">
                        <span style="color: #ff6b6b; font-size: 28px;">SKÚSTE ZNOVA</span><br>
                        <span style="color: white; font-size: 20px;">Zostávajú ${remainingAttempts} pokusy</span>
                    </div>
                </center>
            `;
        } else {
            document.getElementById("vysledok").innerHTML = `
                <center>
                    <img src="images/nespravne.png" alt="Nesprávne">
                    <div class="attempt-message">
                        <span style="color: #ff6b6b; font-size: 28px;">VYČERPANÉ POKUSY</span><br>
                        <span style="color: white; font-size: 18px;">Pokračujeme ďalej</span>
                    </div>
                </center>
            `;
        }
        
        document.getElementById("vysledok").classList.add('show');
        
        // Prehraj zvuk
        if (typeof effectZle !== 'undefined') {
            effectZle.play();
        }
        
        // Kontrola maximalneho poctu pokusov
        if (slovicka >= 3) {
            console.log('❌ Vyčerpané pokusy pre slovo:', currentExpectedWord);
            
            // Zaznamenaj neúspešné kolo
            if (typeof recordSpeechExerciseResult === 'function') {
                recordSpeechExerciseResult(3, false);
            }
            
            slovicka = 0;
            currentWordIndex++;
            
            // Po 2 sekundách prejdi na ďalšie slovo alebo ukonči
            setTimeout(() => {
                document.getElementById("vysledok").innerHTML = '';
                document.getElementById("vysledok").classList.remove('show');
                
                if (currentWordIndex < wordList.length) {
                    displayWord(); // Zobraz ďalšie slovo
                } else {
                    kontrolacvicenia = 2;
                    closeCvicenie(); // Ukonči cvičenie
                }
            }, 2000);
        } else {
            // Ešte sú pokusy - skry hlášku po chvíli
            setTimeout(() => {
                document.getElementById("vysledok").innerHTML = '';
                document.getElementById("vysledok").classList.remove('show');
            }, 2000);
        }
    }
}

//////////////////////////////////////////
// Spracovanie chýb rozpoznávania       //
// Volá sa automaticky z callback       //
//////////////////////////////////////////
function handleSpeechError(event) {
    console.error('❌ Chyba rozpoznávania:', event.error);
    
    // Reset stavu
    isListening = false;
    updateMicrophoneButton(false);
    
    // Detailné error handling podľa typu chyby
    let errorTitle = '';
    let errorMessage = '';
    let canRetry = true;
    
    switch(event.error) {
        case 'no-speech':
            errorTitle = 'Nepočul som ťa';
            errorMessage = 'Skús to znova a hovor hlasnejšie blízko mikrofónu.';
            canRetry = true;
            break;
            
        case 'audio-capture':
            errorTitle = 'Problém s mikrofónom';
            errorMessage = 'Skontroluj, či je mikrofón správne pripojený a funguje.';
            canRetry = true;
            break;
            
        case 'not-allowed':
            errorTitle = 'Prístup zamietnutý';
            errorMessage = 'Potrebujem povolenie na používanie mikrofónu. Klikni na ikonu zámku v adresovom riadku a povol mikrofón.';
            canRetry = false;
            showPermissionsHelp(); // Zobraz návod
            break;
            
        case 'network':
            errorTitle = 'Problém s internetom';
            errorMessage = 'Skontroluj svoje internetové pripojenie a skús to znova.';
            canRetry = true;
            break;
            
        case 'aborted':
            errorTitle = 'Rozpoznávanie zrušené';
            errorMessage = '';
            canRetry = true;
            break;
            
        case 'service-not-allowed':
            errorTitle = 'Služba nie je dostupná';
            errorMessage = 'Rozpoznávanie reči nie je povolené pre túto stránku. Skontroluj nastavenia prehliadača.';
            canRetry = false;
            break;
            
        default:
            errorTitle = 'Neznáma chyba';
            errorMessage = 'Niečo sa pokazilo. Skús to znova.';
            canRetry = true;
    }
    
    // Zobraz chybovú hlášku
    if (errorMessage) {
        showErrorMessage(errorTitle + ': ' + errorMessage);
    }
    
    // Ak je to dočasná chyba, používateľ môže skúsiť znova kliknutím na mikrofón
    // Ak je to permissions problém, musí najprv povoliť mikrofón
}

//////////////////////////////////////////
// Aktualizácia tlačidla mikrofónu      //
// Volá sa z callbacks                  //
//////////////////////////////////////////
function updateMicrophoneButton(listening) {
    const button = document.getElementById('rozpoznanie');
    const tlacidloDiv = document.querySelector('.tlacidlo');
    
    if (!button || !tlacidloDiv) {
        console.warn('⚠️ Tlačidlo mikrofónu nenájdené v DOM');
        return;
    }
    
    if (listening) {
        // Stav: Počúvanie
        button.disabled = true;
        tlacidloDiv.classList.add('recording');
        button.innerHTML = '<a>POČÚVAM...</a>';
        console.log('🎙️ UI: Počúvam...');
    } else {
        // Stav: Pripravený
        button.disabled = false;
        tlacidloDiv.classList.remove('recording');
        button.innerHTML = '<a>HOVORIŤ</a>';
        console.log('🎙️ UI: Pripravený');
    }
}

//////////////////////////////////////////
// Zobrazenie chybovej hlášky           //
// Helper funkcia pre user feedback     //
//////////////////////////////////////////
function showErrorMessage(message) {
    console.log('💬 Zobrazujem hlášku:', message);
    
    // Zobraz hlášku v existujúcom vysledok div
    const vysledokDiv = document.getElementById("vysledok");
    if (vysledokDiv) {
        vysledokDiv.innerHTML = `
            <center>
                <div class="error-message">
                    <span style="color: #ff6b6b; font-size: 24px;">⚠️</span><br>
                    <span style="color: white; font-size: 18px;">${message}</span>
                </div>
            </center>
        `;
        vysledokDiv.classList.add('show');
        
        // Skry po 5 sekundách
        setTimeout(() => {
            vysledokDiv.innerHTML = '';
            vysledokDiv.classList.remove('show');
        }, 5000);
    } else {
        // Fallback na alert ak vysledok div neexistuje
        alert(message);
    }
}

//////////////////////////////////////////
// Zobrazenie návodu na povolenie       //
// mikrofónu                            //
//////////////////////////////////////////
function showPermissionsHelp() {
    // Detekcia prehliadača
    const isChrome = /chrome/i.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isEdge = /edg/i.test(navigator.userAgent);
    
    let helpText = '';
    
    if (isChrome) {
        helpText = 'V Chrome: Klikni na ikonu zámku vedľa URL a povol mikrofón.';
    } else if (isEdge) {
        helpText = 'V Edge: Klikni na ikonu zámku vedľa URL a povol mikrofón.';
    } else if (isSafari) {
        helpText = 'V Safari: Choď do Safari → Nastavenia pre túto webstránku → Mikrofón → Povoliť';
    } else {
        helpText = 'V nastaveniach prehliadača povol mikrofón pre túto stránku.';
    }
    
    console.log('📖 Návod na povolenie:', helpText);
    
    // Zobraz rozšírenú hlášku s návodom
    showErrorMessage('PRÍSTUP K MIKROFÓNU ZAMIETNUTÝ\n\n' + helpText);
}

//////////////////////////////////////////
// Detekcia mobile zariadení            //
// Helper funkcie                       //
//////////////////////////////////////////
function isMobileDevice() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isAndroid() {
    return /Android/.test(navigator.userAgent);
}

//////////////////////////////////////////
// Funkcia na otvorenie cvičenia        //
// Používa slová z levelConfig          //
//////////////////////////////////////////
function openCvicenie() {
    // DEBUG informácie
    console.log('=== DEBUG openCvicenie ===');
    console.log('currentLevelConfig:', currentLevelConfig);
    console.log('isCustomLevel:', isCustomLevel);
    console.log('URL parameters:', window.location.search);

    // Nastavit počet cvičení z levelConfig
    if (currentLevelConfig && currentLevelConfig.gameConfig && currentLevelConfig.gameConfig.speechExercises) {
        pocetcviceni = currentLevelConfig.gameConfig.speechExercises;
        console.log(`Počet rečových cvičení nastavený z levelConfig: ${pocetcviceni}`);
    } else {
        pocetcviceni = 2; // default hodnota
        console.log(`Používam predvolenú hodnotu rečových cvičení: ${pocetcviceni}`);
    }
    
    // Ulož počet kôl pre aktuálne cvičenie do gamePerformance
    if (typeof gamePerformance !== 'undefined') {
        gamePerformance.speechExercises.currentExerciseRounds = pocetcviceni;
        console.log(`✅ Rečové cvičenie bude mať ${pocetcviceni} kôl (slov)`);
    }
    
    // Kontrola či máme dostupnú konfiguráciu levelu
    if (!currentLevelConfig || !currentLevelConfig.words || currentLevelConfig.words.length === 0) {
        console.error('Chyba: Nie sú dostupné slová pre cvičenie v levelConfig');
        console.error('currentLevelConfig je:', currentLevelConfig);
        
        // OPRAVENÝ FALLBACK - náhodný výber slov
        console.log('Používam fallback slová pre testovanie...');
        const allFallbackWords = ['rak', 'ryba', 'ruka', 'rosa', 'ruža', 'robot', 'raketa', 'ryžou'];
        
        // Náhodný výber pocetcviceni slov z fallback zoznamu
        const shuffled = allFallbackWords.sort(() => 0.5 - Math.random());
        wordList = shuffled.slice(0, pocetcviceni);
        
        console.log('Fallback slová (náhodne vybrané):', wordList);
        console.log(`Finálny zoznam slov pre cvičenie (${pocetcviceni} slov):`, wordList);
        startExercise();
        return;
    }
    
    console.log('Začínam cvičenie s slovami z levelConfig:', currentLevelConfig.words);
    
    // Výber náhodných slov z levelConfig namiesto zo súboru
    let vybraneSlova = []; // Zoznam vybratých slov
    const dostupneSlova = currentLevelConfig.words; // Slová z levelConfig
    
    // Vyber pocet cviceni počet náhodných slov
    while (wordList.length < pocetcviceni && vybraneSlova.length < dostupneSlova.length) {
        const nahodnyIndex = Math.floor(Math.random() * dostupneSlova.length);
        const slovo = dostupneSlova[nahodnyIndex].trim();
        
        if (!vybraneSlova.includes(slovo)) { // kontrola či sa vybralo iné/rozdielne slovo
            wordList.push(slovo);
            vybraneSlova.push(slovo);
            console.log(`Pridané slovo do cvičenia: ${slovo}`);
        }
    }
    
    // Ak nemáme dostatok slov, pridáme všetky dostupné
    if (wordList.length === 0) {
        console.warn('Neboli vybrané žiadne slová, používam všetky dostupné');
        wordList = dostupneSlova.slice(0, Math.min(pocetcviceni, dostupneSlova.length));
    }
    
    console.log('Finálny zoznam slov pre cvičenie:', wordList);
    startExercise();
}
//////////////////////////////////////////
//       Spustenie Cvicenia             //
//////////////////////////////////////////
function startExercise() {
    isExerciseActive = true;
    console.log('🔒 Herné akcie zablokované - cvičenie aktívne');
    
    document.getElementById("cvicenie").style.display = "block";
    document.getElementById("blur-background").style.display = "block";
    document.body.classList.add("cvicenie-open");
    document.body.style.overflow = "hidden"; 
    displayWord();
}

//////////////////////////////////////////
// Funkcia na zobrazenie aktuálneho     //
// slova na vyslovenie                  //
//////////////////////////////////////////
function displayWord() {
    document.getElementById("word-display").innerText = wordList[currentWordIndex].toUpperCase();
    const imageName = wordList[currentWordIndex] + ".png"; 
    document.getElementById("cvicenie-image").src = "images/slova/" + imageName;
    updateWordProgress();
}
//////////////////////////////////////////
// Samotna funckia na rozpoznanie       //
//////////////////////////////////////////
function rozpoznanieS() {
    console.log('🎤 rozpoznanieS() zavolaná');
    
    // Získaj aktuálne očakávané slovo
    const expectedWord = wordList[currentWordIndex];
    console.log('📝 Aktuálne slovo:', expectedWord);
    
    // Zavolaj bezpečnú funkciu na spustenie rozpoznávania
    startSpeechRecognition(expectedWord);
}
//////////////////////////////////////////
//   Funkcia na zatvorenie cvičenia     //
//////////////////////////////////////////
function closeCvicenie() {
    if (kontrolacvicenia === 1) {
        // Zaznamenávanie už prebieha priebežne po každom slove
        // Táto časť už len označí diamant ako zozbieraný
        
        diamonds.forEach((diamond, diamondIndex) => {
            blockX = diamond.x / blockSize;
            blockY = diamond.y / blockSize;
            if (blockX === targetBlockX && blockY === targetBlockY && !diamond.destroyed) {
                diamond.destroyed = true; 
                diamondsCollected++;
                effectzlato.play();
                updateDiamondCount();
                updateDiamondsCollected(diamondsCollected);
                checkWinConditionWithRating();
                spaceBarPressed = 0;
            }     
        })
    }
    else if (kontrolacvicenia === 2) {
        // Zaznamenávanie neúspešného kola už prebehlo pri vyčerpaní pokusov
        spaceBarPressed = 0;
    }

    slovicka = 0;
    kontrolacvicenia = 0;
    currentWordIndex = 0;
    wordList = [];
    document.getElementById("cvicenie").style.display = "none";
    document.getElementById("blur-background").style.display = "none";
    document.body.classList.remove("cvicenie-open");
    document.body.style.overflow = "auto"; 
    // Reset progress indikátora
    const progressContainer = document.getElementById('word-progress');
    if (progressContainer) {
        progressContainer.remove();
    }

    isExerciseActive = false;
    console.log('🔓 Herné akcie odblokované - cvičenie ukončené');
    
}

//////////////////////////////////////////
//      Aktualizácia progress           //      
//      indikátora pre slová            //
//////////////////////////////////////////
function updateWordProgress() {
    // Nájde alebo vytvori progress kontajner
    let progressContainer = document.getElementById('word-progress');
    if (!progressContainer) {
        progressContainer = createWordProgressElement();
    }
    
    const currentWord = currentWordIndex + 1;
    const totalWords = wordList.length;
    
    // Aktualizuje text
    const progressText = progressContainer.querySelector('.progress-text');
    progressText.textContent = `Slovo ${currentWord} / ${totalWords}`;
    
    // Aktualizuje progress bar
    const progressBar = progressContainer.querySelector('.progress-fill');
    const percentage = (currentWord / totalWords) * 100;
    progressBar.style.width = `${percentage}%`;
    
    console.log(`Progress aktualizovaný: ${currentWord}/${totalWords} (${percentage}%)`);
}

//////////////////////////////////////////
// Vytvorenie progress elementu         //
// ak neexistuje                        //
//////////////////////////////////////////
function createWordProgressElement() {
    const cvicenieContent = document.querySelector('.cvicenie-content');
    
    const progressHTML = `
        <div id="word-progress" class="word-progress">
        <div class="progress-text">Slovo 1 / 2</div>
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        </div>
    `;
    
    // Pridaj progress na začiatok cvicenie-content
    cvicenieContent.insertAdjacentHTML('afterbegin', progressHTML);
    
    return document.getElementById('word-progress');
}

const rozpoznanie = document.getElementById('rozpoznanie');
rozpoznanie.addEventListener('click', rozpoznanieS);







////////////////////////////////////////////////
// ========================================== //
// DYNAMICKÁ NAVIGÁCIA PRE KONEČNÉ DIALÓGY    //
// ========================================== //
////////////////////////////////////////////////


//////////////////////////////////////////////////////////////
// Aktualizácia navigačných tlačidiel v konečných dialógoch //
// Volať pri spustení hry a pri zobrazení dialógov          //
//////////////////////////////////////////////////////////////
function updateDialogNavigation() {
    console.log('Aktualizujem navigačné tlačidlá dialogov...');
    
    // Získaj informácie o aktuálnom leveli
    const urlParams = new URLSearchParams(window.location.search);
    const worldId = urlParams.get('worldId') || urlParams.get('world');
    const levelId = urlParams.get('levelId') || urlParams.get('level');
    const isTraining = urlParams.get('training') === 'true';
    
    console.log('Navigačné parametre:', { worldId, levelId, isTraining });
    
    // Aktualizuj endgame dialog (pri výhre)
    updateEndGameDialog(worldId, levelId, isTraining);
    
    // Aktualizuj menu dialog (tlačidlo menu)
    updateMenuDialog(worldId, levelId, isTraining);
}

//////////////////////////////////////////////////
//   Aktualizácia endgame dialógu (pri výhre)   //
//////////////////////////////////////////////////
function updateEndGameDialog(worldId, levelId, isTraining) {
    const endGameNav = document.querySelector('#endgame nav ul');
    if (!endGameNav) {
        console.warn('Endgame navigation nebol nájdený');
        return;
    }
    
    let restartUrl = 'game.html'; // fallback
    let backUrl = 'worldsmenu.html'; // fallback
    
    if (isTraining) {
        // Pre tréningové levely
        restartUrl = window.location.href; // Reštart s rovnakými parametrami
        backUrl = 'worldsmenu.html';
    } else if (worldId && levelId) {
        // Pre normálne levely - zachovaj URL parametre
        restartUrl = `game.html?worldId=${worldId}&levelId=${levelId}`;
        backUrl = `worldsmenu.html`; // Späť na worlds menu
    }
    
    // Aktualizuj obsah
    endGameNav.innerHTML = `
        <li><button onclick="restartCurrentLevel()" class="menu-button">Hrať znova</button></li>
        <li><button onclick="goToNextLevel()" class="menu-button">Ďalší level</button></li>
        <li><button onclick="returnToMenu()" class="menu-button">Mapa levelov</button></li>
    `;
    
    console.log('Endgame dialog aktualizovaný');
}

//////////////////////////////////////////////////
//          Aktualizácia menu dialógu           //
//////////////////////////////////////////////////
function updateMenuDialog(worldId, levelId, isTraining) {
    const menuNav = document.querySelector('#dialogove-okno nav ul');
    if (!menuNav) {
        console.warn('Menu dialog navigation nebol nájdený');
        return;
    }
    
    let restartUrl = 'game.html';
    let backUrl = 'worldsmenu.html';
    
    if (isTraining) {
        restartUrl = window.location.href;
        backUrl = 'worldsmenu.html';
    } else if (worldId && levelId) {
        restartUrl = `game.html?worldId=${worldId}&levelId=${levelId}`;
        backUrl = `worldsmenu.html`;
    }
    
    // Aktualizuj obsah
    menuNav.innerHTML = `
        <li><button onclick="restartCurrentLevel()" class="menu-button">Reštart</button></li>
        <li><button onclick="returnToMenu()" class="menu-button">Svety</button></li>
        <li><button onclick="window.location.href='index.html'" class="menu-button">Menu</button></li>
    `;
    
    console.log('Menu dialog aktualizovaný');
}

//////////////////////////////////////////////////
//          Reštart aktuálneho levelu           //
//////////////////////////////////////////////////
function restartCurrentLevel() {
    console.log('Reštartujem aktuálny level...');
    
    // Zatvor všetky dialógy
    closeAllDialogs();
    
    // Reštartuj hru s rovnakými parametrami
    const urlParams = new URLSearchParams(window.location.search);
    const isTraining = urlParams.get('training') === 'true';
    
    if (isTraining) {
        // Pre tréningové levely - reload stránky
        window.location.reload();
    } else {
        // Pre normálne levely - reinicializuj s rovnakou konfiguráciou
        if (currentLevelConfig) {
            initializeGameWithLevel(currentLevelConfig, isCustomLevel);
        } else {
            window.location.reload();
        }
    }
}

//////////////////////////////////////////////////
//           Prechod na ďalší level             //
//////////////////////////////////////////////////
function goToNextLevel() {
    console.log('Pokúsim sa prejsť na ďalší level...');
    
    const urlParams = new URLSearchParams(window.location.search);
    const worldId = urlParams.get('worldId') || urlParams.get('world');
    const levelId = urlParams.get('levelId') || urlParams.get('level');
    
    if (!worldId || !levelId) {
        console.log('Nie sú dostupné URL parametre, vraciam sa do menu');
        returnToMenu();
        return;
    }
    
    // Použij gameRouter ak je dostupný
    if (window.gameRouter && typeof window.gameRouter.continueToNextLevel === 'function') {
        closeAllDialogs();
        window.gameRouter.continueToNextLevel(worldId, levelId);
    } else {
        // Fallback - manuálne hľadanie ďalšieho levelu
        console.log('GameRouter nie je dostupný, používam fallback');
        if (typeof getLevelConfig === 'function') {
            const currentLevel = getLevelConfig(levelId);
            if (currentLevel) {
                const nextLevelNumber = currentLevel.levelNumber + 1;
                const nextLevelId = `${worldId}_${nextLevelNumber}`;
                const nextLevel = getLevelConfig(nextLevelId);
                
                if (nextLevel) {
                    closeAllDialogs();
                    window.location.href = `game.html?worldId=${worldId}&levelId=${nextLevelId}`;
                } else {
                    console.log('Ďalší level neexistuje, vraciam sa do menu');
                    returnToMenu();
                }
            }
        } else {
            returnToMenu();
        }
    }
}

//////////////////////////////////////////////////
//           Návrat do menu svetov              //
//////////////////////////////////////////////////
function returnToMenu() {
    console.log('Vraciam sa do menu svetov...');
    closeAllDialogs();
    window.location.href = 'worldsmenu.html';
}

//////////////////////////////////////////////////
//       Zatvorenie všetkých dialógov           //
//////////////////////////////////////////////////
function closeAllDialogs() {
    // Zatvor endgame dialog
    const endGameDialog = document.getElementById("endgame");
    if (endGameDialog) {
        endGameDialog.style.display = "none";
    }
    
    // Zatvor menu dialog
    const menuDialog = document.getElementById("dialogove-okno");
    if (menuDialog) {
        menuDialog.style.display = "none";
    }
    
    // Zatvor cvicenie dialog
    const cvicenieDialog = document.getElementById("cvicenie");
    if (cvicenieDialog) {
        cvicenieDialog.style.display = "none";
    }
    
    // Resetuj blur background
    const blurBackground = document.getElementById("blur-background");
    if (blurBackground) {
        blurBackground.style.display = "none";
    }
    
    // Resetuj body overflow
    document.body.classList.remove("dialog-open", "cvicenie-open");
    document.body.style.overflow = "auto";
}

////////////////////////////////////////////////
// ========================================== //
//          INICIALIZÁCIA NAVIGÁCIE           //
// ========================================== //
////////////////////////////////////////////////

//////////////////////////////////////////
// Inicializácia navigačného systému    //
//////////////////////////////////////////
function initializeNavigation() {
    console.log('Inicializujem navigačný systém...');
    
    // Aktualizuj dialógy hneď po načítaní
    updateDialogNavigation();
    
    // Nastav event listenery pre existujúce funkcie
    setupNavigationEventListeners();
}

//////////////////////////////////////////////////
// Nastavenie event listenerov pre navigáciu    //
//////////////////////////////////////////////////
function setupNavigationEventListeners() {
    // Existujúce funkcie closeDialog1 a openDialog1 zostávajú rovnaké
    // ale sa môžu rozšíriť o aktualizáciu navigácie
    
    console.log('Navigation event listenery nastavené');
}





/////////////////////////////////////
// ====== Dodatočné funkcie ====== //
/////////////////////////////////////

  /* Otvorenie custom level modalu */
  function openCustomLevelModal() {
      document.getElementById("custom-level-modal").style.display = "block";
      document.getElementById("blur-background").style.display = "block";
      document.body.style.overflow = "hidden";
  }

  /* Zatvorenie custom level modalu */
  function closeCustomModal() {
      document.getElementById("custom-level-modal").style.display = "none";
      document.getElementById("blur-background").style.display = "none";
      document.body.style.overflow = "auto";
}

  /* Spustenie custom levelu s vlastnými slovami */
  function startCustomLevel() {
      const wordsInput = document.getElementById('custom-words-input').value.trim();
      
      if (!wordsInput) {
          alert('Prosím zadajte aspoň jedno slovo!');
          return;
      }
      
      // Rozdelenie slov po riadkoch a vyčistenie
      const customWords = wordsInput.split('\n')
          .map(word => word.trim())
          .filter(word => word.length > 0);
      
      if (customWords.length === 0) {
          alert('Prosím zadajte platné slová!');
          return;
      }
      
      console.log('Custom slová:', customWords);
      
      // Vytvorenie custom levelConfig
      const customLevelConfig = {
          words: customWords,
          diamonds: 3,        // predvolené hodnoty
          golds: 4,
          crystals: 1,
          timeLimit: null,    // bez časového limitu
          // žiadne positions = náhodné generovanie
      };
      
      closeCustomModal();
      initializeGameWithLevel(customLevelConfig, true); // true = custom level
  }

  
/////////////////////////////////
//   ===== HERNÁ SLUČKA ====== //
//  vykreslenie hraca          //
//  vykreslenie itemov         //
/////////////////////////////////
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawClay();
    drawDiamonds();
    drawKov();
    drawGolds();
    requestAnimationFrame(gameLoop);
}


/////////////////////////////////
// ====== Hlavná slučka ====== //
// Generovanie sveta, Gameloop //
/////////////////////////////////
generateDiamonds();
generateKov();
generateGolds();
generateClay();
gameLoop();


















/////////////////////////////////////////////
// ========== UŽITOČNÉ FUNKCIE ========== //
/////////////////////////////////////////////

/**
 * Rýchle dokončenie levelu s perfektným výkonom
 * Použitie: Pre testovanie a debug
 */
function quickCompleteLevel() {
    console.log('Rýchle dokončenie levelu...');
    
    // Inicializuj sledovanie výkonu
    initializePerformanceTracking();
    
    // Simuluj perfektný výkon pre všetky rečové cvičenia
    // Každý diamant má X kôl (slov) podľa konfigurácie
    const speechRoundsPerDiamond = currentLevelConfig?.gameConfig?.speechExercises || 2;
    for (let diamond = 0; diamond < PocetGenDiamant; diamond++) {
        for (let round = 0; round < speechRoundsPerDiamond; round++) {
            recordSpeechExerciseResult(1, true); // 1 pokus = 3 body
        }
    }
    
    // Simuluj perfektný výkon pre všetky posluchové cvičenia
    // Každý kryštál má X kôl (párov) podľa konfigurácie
    const listeningRoundsPerCrystal = currentLevelConfig?.gameConfig?.listeningExercises || 2;
    for (let crystal = 0; crystal < PocetGenKov; crystal++) {
        for (let round = 0; round < listeningRoundsPerCrystal; round++) {
            recordListeningExerciseResult(1, true); // 1 pokus = 3 body
        }
    }
    
    // Zozbieraj všetky goldy
    for (let i = 0; i < PocetGenGolds; i++) {
        recordGoldCollected();
    }
    
    // Nastav počty ako zozbierané
    diamondsCollected = PocetGenDiamant;
    goldsCollected = PocetGenGolds;
    kovCollected = PocetGenKov;
    gamePerformance.levelCompleted = true;
    
    // Aktualizuj UI
    updateDiamondsCollected(diamondsCollected);
    updategoldsCollected(goldsCollected);
    updateKovCollected(kovCollected);
    
    // Dokončenie levelu
    completeLevel();
    
    console.log('Level dokončený s perfektným výkonom!');
}

/**
 * Získanie detailných štatistík výkonu
 * @returns {Object} Objekt so štatistikami
 */
function getPerformanceStats() {
    const stats = {
        // Rečové cvičenia
        speech: {
            totalRounds: gamePerformance.speechExercises.roundResults.length,
            completedRounds: gamePerformance.speechExercises.completedRounds,
            totalPoints: gamePerformance.speechExercises.totalPoints,
            maxPossiblePoints: gamePerformance.speechExercises.roundResults.length * 3,
            roundDetails: gamePerformance.speechExercises.roundResults,
            averageAttempts: gamePerformance.speechExercises.roundResults.length > 0
                ? (gamePerformance.speechExercises.roundResults.reduce((sum, r) => sum + r.attempts, 0) / 
                    gamePerformance.speechExercises.roundResults.length).toFixed(2)
                : 0
        },
        
        // Posluchové cvičenia
        listening: {
            totalRounds: gamePerformance.listeningExercises.roundResults.length,
            completedRounds: gamePerformance.listeningExercises.completedRounds,
            totalPoints: gamePerformance.listeningExercises.totalPoints,
            maxPossiblePoints: gamePerformance.listeningExercises.roundResults.length * 3,
            roundDetails: gamePerformance.listeningExercises.roundResults,
            averageAttempts: gamePerformance.listeningExercises.roundResults.length > 0
                ? (gamePerformance.listeningExercises.roundResults.reduce((sum, r) => sum + r.attempts, 0) / 
                    gamePerformance.listeningExercises.roundResults.length).toFixed(2)
                : 0
        },
        
        // Celkové štatistiky
        overall: {
            totalPoints: gamePerformance.totalPoints,
            maxPossiblePoints: gamePerformance.maxPossiblePoints,
            percentage: gamePerformance.maxPossiblePoints > 0 
                ? Math.round((gamePerformance.totalPoints / gamePerformance.maxPossiblePoints) * 100)
                : 0,
            stars: gamePerformance.finalStars,
            levelCompleted: gamePerformance.levelCompleted
        },
        
        // Goldy
        golds: {
            collected: gamePerformance.golds.collected,
            total: gamePerformance.golds.total
        },
        
        // Čas
        time: {
            seconds: gameTimer.currentTime,
            formatted: formatTime(gameTimer.currentTime)
        }
    };
    
    return stats;
}

/**
 * Vypočítanie počtu hviezd na základe percentuálneho výkonu
 * @param {number} percentage - Percentuálny výkon (0-100)
 * @returns {number} Počet hviezd (0-3)
 */
function getStarRating(percentage) {
    if (percentage >= 70) return 3;  // 70%+ = 3 hviezdy
    if (percentage >= 40) return 2;  // 40-69% = 2 hviezdy
    if (percentage >= 20) return 1;  // 20-39% = 1 hviezda
    return 0;                         // <20% = 0 hviezd
}

/**
 * Zobrazenie súhrnu výkonu v konzole
 */
function showPerformanceSummary() {
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('           SÚHRN VÝKONU');
    console.log('═══════════════════════════════════════');
    
    const stats = getPerformanceStats();
    
    // Rečové cvičenia
    console.log('');
    console.log('  REČOVÉ CVIČENIA:');
    console.log(`   Absolvované kolá: ${stats.speech.completedRounds}/${stats.speech.totalRounds}`);
    console.log(`   Body: ${stats.speech.totalPoints}/${stats.speech.maxPossiblePoints}`);
    console.log(`   Priemerný počet pokusov: ${stats.speech.averageAttempts}`);
    
    // Detaily kôl
    if (stats.speech.roundDetails.length > 0) {
        console.log('   Detaily kôl:');
        stats.speech.roundDetails.forEach((round, index) => {
            const icon = round.success ? '✅' : '❌';
            console.log(`     ${icon} Kolo ${index + 1}: ${round.attempts} pokusov = ${round.points} bodov`);
        });
    }
    
    // Posluchové cvičenia
    console.log('');
    console.log(' POSLUCHOVÉ CVIČENIA:');
    console.log(`   Absolvované kolá: ${stats.listening.completedRounds}/${stats.listening.totalRounds}`);
    console.log(`   Body: ${stats.listening.totalPoints}/${stats.listening.maxPossiblePoints}`);
    console.log(`   Priemerný počet pokusov: ${stats.listening.averageAttempts}`);
    
    // Detaily kôl
    if (stats.listening.roundDetails.length > 0) {
        console.log('   Detaily kôl:');
        stats.listening.roundDetails.forEach((round, index) => {
            const icon = round.success ? '✅' : '❌';
            console.log(`     ${icon} Kolo ${index + 1}: ${round.attempts} pokusov = ${round.points} bodov`);
        });
    }
    
    // Goldy
    console.log('');
    console.log(' GOLDY:');
    console.log(`   Zozbierané: ${stats.golds.collected}/${stats.golds.total}`);
    
    // Celkový výsledok
    console.log('');
    console.log(' CELKOVÝ VÝSLEDOK:');
    console.log(`   Body: ${stats.overall.totalPoints}/${stats.overall.maxPossiblePoints}`);
    console.log(`   Úspešnosť: ${stats.overall.percentage}%`);
    console.log(`   Hviezdy: ${'⭐'.repeat(stats.overall.stars)} (${stats.overall.stars}/3)`);
    console.log(`   Čas: ${stats.time.formatted}`);
    console.log(`   Level dokončený: ${stats.overall.levelCompleted ? 'Áno' : 'Nie'}`);
    
    console.log('═══════════════════════════════════════');
    console.log('');
    
    return stats;
}

/**
 * Reset levelu - kompletné resetovanie stavu hry
 */
function resetLevel() {
    console.log(' Resetujem level...');
    
    // Reset zbieraných itemov
    diamondsCollected = 0;
    goldsCollected = 0;
    kovCollected = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    
    // Reset výkonu
    initializePerformanceTracking();
    
    // Reset timera
    if (gameTimer.intervalId) {
        clearInterval(gameTimer.intervalId);
    }
    gameTimer = {
        startTime: null,
        currentTime: 0,
        intervalId: null,
        timeLimit: currentLevelConfig?.timeLimit || null,
        isRunning: false,
        isPaused: false
    };
    
    // Aktualizuj UI
    updateDiamondsCollected(0);
    updategoldsCollected(0);
    updateKovCollected(0);
    updateAnswerCounters();
    
    // Resetuj timer display
    const timerElement = document.getElementById('game-timer');
    if (timerElement) {
        timerElement.textContent = gameTimer.timeLimit ? formatTime(gameTimer.timeLimit) : '00:00';
    }
    
    console.log(' Level resetovaný');
}

/**
 * Získanie aktuálneho stavu hry
 * @returns {Object} Stav hry
 */
function getGameState() {
    return {
        items: {
            diamonds: { collected: diamondsCollected, total: PocetGenDiamant },
            golds: { collected: goldsCollected, total: PocetGenGolds },
            crystals: { collected: kovCollected, total: PocetGenKov }
        },
        timer: {
            running: gameTimer.isRunning,
            currentTime: gameTimer.currentTime,
            timeLimit: gameTimer.timeLimit,
            formatted: formatTime(gameTimer.currentTime)
        },
        performance: getPerformanceStats(),
        level: {
            config: currentLevelConfig,
            isCustom: isCustomLevel,
            completed: gamePerformance.levelCompleted
        }
    };
}

// Pridanie funkcií do window pre ľahší prístup v konzole
window.quickCompleteLevel = quickCompleteLevel;
window.getPerformanceStats = getPerformanceStats;
window.showPerformanceSummary = showPerformanceSummary;
window.getStarRating = getStarRating;
window.resetLevel = resetLevel;
window.getGameState = getGameState;

console.log('✅ Užitočné funkcie načítané:');
console.log('   - quickCompleteLevel() - Rýchle dokončenie levelu');
console.log('   - getPerformanceStats() - Získanie štatistík');
console.log('   - showPerformanceSummary() - Zobrazenie súhrnu');
console.log('   - getStarRating(percentage) - Výpočet hviezd');
console.log('   - resetLevel() - Reset levelu');
console.log('   - getGameState() - Aktuálny stav hry');

/////////////////////////////////////////////
// ===== DOKONČENIE LEVELU A POKROK ===== //
/////////////////////////////////////////////

/**
 * Hlavná funkcia na dokončenie levelu
 * Volá všetky potrebné kroky vrátane uloženia a navigácie
 */
function completeLevel() {
    console.log(' Dokončujem level...');
    
    // 1. Zastav timer
    stopTimer();
    
    // 2. Vypočítaj hodnotenie
    const rating = calculateFinalRating();
    console.log(' Hodnotenie levelu:', rating);
    
    // 3. Ulož výsledky do progress managera a získaj info o odomknutom obsahu
    const saveResult = saveResultsToProgress(rating);
    console.log(' Výsledok uloženia:', saveResult);
    
    // 4. Aktualizuj navigáciu pre win dialóg
    updateDialogNavigation();
    
    // 5. Zobraz win dialóg s výsledkami
    setTimeout(() => {
        // Prehrať zvuk výhry
        if (typeof effectVyhra !== 'undefined') {
            effectVyhra.play();
        }
        
        // Zobraziť dialóg
        document.getElementById("endgame").style.display = "block";
        document.getElementById("blur-background").style.display = "block";
        document.body.style.overflow = "hidden";
        
        // Pridať výsledky do dialógu s informáciou o pokroku
        displayResultsInWinDialog(rating, saveResult);
        
        console.log(' Win dialóg zobrazený s výsledkami!');
        
        // 6. Zobraz notifikácie o odomknutom obsahu
        if (saveResult.saved) {
            setTimeout(() => {
                showUnlockNotificationsInGame(saveResult);
            }, 1000);
        }
        
    }, 500);
}

/**
 * Kontrola a zobrazenie odomknutého obsahu
 */
function checkUnlockedContent() {
    if (!window.progressManager) {
        console.log('ProgressManager nie je dostupný pre kontrolu odomknutia');
        return;
    }
    
    setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const worldId = urlParams.get('worldId') || urlParams.get('world');
        const levelId = urlParams.get('levelId') || urlParams.get('level');
        
        if (!worldId || !levelId) return;
        
        // Skontroluj či sa odomkol ďalší level
        if (typeof getLevelConfig === 'function') {
            const currentLevel = getLevelConfig(levelId);
            if (currentLevel) {
                const nextLevelNumber = currentLevel.levelNumber + 1;
                const nextLevelId = `${worldId}_${nextLevelNumber}`;
                const nextLevel = getLevelConfig(nextLevelId);
                
                if (nextLevel) {
                    const nextProgress = window.progressManager.getLevelProgress(worldId, nextLevelId);
                    if (nextProgress && nextProgress.isUnlocked) {
                        console.log(` Odomknutý ďalší level: ${nextLevel.name}`);
                        
                        // Môžeš pridať notifikáciu do UI
                        showUnlockNotification('level', nextLevel);
                    }
                }
            }
        }
        
        // Skontroluj či sa odomkol nový svet
        const worldProgress = window.progressManager.getProgress().worlds[worldId];
        if (worldProgress && worldProgress.completedLevels > 0) {
            console.log(` Pokrok sveta ${worldId}: ${worldProgress.completedLevels} levelov, ${worldProgress.stars} hviezd`);
        }
        
    }, 1000);
}