/**
 * JavaScript súbor pre worldsmenu.html - spracovanie interaktívnych prvkov
 * Integrovaný s config/worlds.js a config/levels.js
 * Autor: Adam Reňak
 */

// Globálne premenné
let allWorlds = []; // Všetky svety z config/worlds.js
let currentWorldIndex = 0; // Index aktuálneho sveta (stred z 3 zobrazených)
let visibleWorldsStartIndex = 0; // Index prvého zo 3 zobrazených svetov
let currentSelectedWorld = null; // Aktuálne vybraný svet pre zobrazenie levelov
let playerProgress = null; // Pokrok hráča
let allWorldButtons = []; // NOVÉ: Cache pre všetky predgenerované world buttony

// Čakanie na načítanie DOM obsahu
document.addEventListener('DOMContentLoaded', function() {
    console.log('World menu načítané a pripravené na použitie');
    
    // Spusti preloading ako prvé
    if (typeof startWorldsMenuPreloading === 'function') {
        // Najprv preloading, potom inicializácia
        startWorldsMenuPreloading().then(() => {
            console.log('✅ Preloading dokončený, inicializujem menu...');
            initializeWorldsMenu();
        }).catch(error => {
            console.error('❌ Chyba pri preloadingu, inicializujem menu aj tak...', error);
            initializeWorldsMenu();
        });
    } else {
        // Fallback ak preloader nie je dostupný
        console.warn('⚠️ Preloader nie je dostupný, používam základné načítanie');
        window.addEventListener('load', function() {
            setTimeout(hideLoadingScreen, 1000);
        });
        initializeWorldsMenu();
    }
});

/**
 * Skrytie loading screen s animáciou
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ===== INICIALIZÁCIA MENU SVETOV =====
async function initializeWorldsMenu() {
    console.log('Inicializujem worlds menu s config súbormi...');
    
    try {
        // Načítaj konfigurácie svetov
        await loadWorldsConfiguration();
        
        // Načítaj pokrok hráča
        loadPlayerProgress();
        
        // NOVÉ: Vytvor všetky world buttony naraz (predgenerované)
        createAllWorldButtons();
        
        // Nastaví počiatočný svet (najaktívnejší alebo prvý odomknutý)
        setInitialWorld();
        
        // Nastaví event listenery
        setupEventListeners();
        
        // Aktualizuje zobrazenie
        updateDisplay();
        
        console.log('Worlds menu úspešne inicializované');
    } catch (error) {
        console.error('Chyba pri inicializácii worlds menu:', error);
        // Fallback na základnú konfiguráciu
        setupFallbackConfiguration();
    }
}

/**
 * Načítanie konfigurácie svetov
 */
async function loadWorldsConfiguration() {
    console.log('Načítavam konfiguráciu svetov...');
    
    // Skontroluj či sú dostupné funkcie z config súborov
    if (typeof getAllWorlds === 'function') {
        allWorlds = getAllWorlds();
        console.log(`Načítaných ${allWorlds.length} svetov:`, allWorlds.map(w => w.name));
    } else {
        throw new Error('Funkcia getAllWorlds nie je dostupná');
    }
    
    // Inicializuj všetky svety ako odomknuté (podľa požiadavky)
    allWorlds.forEach(world => {
        world.isUnlocked = true; // Všetky svety sú odomknuté
    });
}

/**
 * Načítanie pokroku hráča
 */
function loadPlayerProgress() {
    console.log('Načítavam pokrok hráča...');
    
    // Pokús sa načítať z progressManager ak existuje
    if (window.progressManager) {
        playerProgress = window.progressManager.getProgress();
        console.log('Pokrok načítaný z progressManager');
        ensureAllWorldsUnlockedWithFirstLevel();
    } else {
        // Vytvor základný pokrok
        playerProgress = createDefaultProgress();
        console.log('Vytvorený základný pokrok');
    }
}

/**
 * Vytvorenie základného pokroku ak neexistuje progressManager
 */
function createDefaultProgress() {
    const progress = {
        worlds: {}
    };
    
    allWorlds.forEach(world => {
        progress.worlds[world.id] = {
            isUnlocked: true, // Všetky svety sú odomknuté
            totalStars: 0,
            completedLevels: 0,
            levels: {}
        };
        
        // Ak existuje getWorldLevels, pridaj levely
        if (typeof getWorldLevels === 'function') {
            const worldLevels = getWorldLevels(world.id);
            worldLevels.forEach((level, index) => {
                progress.worlds[world.id].levels[level.id] = {
                    isUnlocked: index === 0, // Prvý level je odomknutý
                    stars: 0,
                    completed: false
                };
            });
        }
    });
    
    return progress;
}

/**
 * Nastavenie počiatočného sveta
 */
function setInitialWorld() {
    console.log('Nastavujem počiatočný svet...');
    
    // Nájdi svet s najvyšším pokrokom alebo prvý odomknutý
    let bestWorldIndex = 0;
    let maxProgress = -1;
    
    allWorlds.forEach((world, index) => {
        if (world.isUnlocked && playerProgress.worlds[world.id]) {
            const worldProgress = playerProgress.worlds[world.id];
            const progress = worldProgress.completedLevels || 0;
            
            if (progress > maxProgress) {
                maxProgress = progress;
                bestWorldIndex = index;
            }
        }
    });
    
    currentWorldIndex = bestWorldIndex;
    currentSelectedWorld = allWorlds[currentWorldIndex];
    
    // Nastav visible worlds tak, aby bol vybraný svet v strede
    setVisibleWorldsForCenter(currentWorldIndex);
    
    console.log(`Počiatočný svet: ${currentSelectedWorld.name} (index: ${currentWorldIndex})`);
}

/**
 * NOVÁ FUNKCIA: Zabezpečenie, že všetky svety majú odomknuté prvé levely
 */
function ensureAllWorldsUnlockedWithFirstLevel() {
    console.log('Zabezpečujem odomknuté prvé levely pre všetky svety...');
    
    let needsSave = false;
    
    allWorlds.forEach(world => {
        // Zabezpeč, že svet je odomknutý
        if (!playerProgress.worlds[world.id]) {
            playerProgress.worlds[world.id] = {
                isUnlocked: true,
                totalStars: 0,
                completedLevels: 0,
                levels: {}
            };
            needsSave = true;
        } else if (!playerProgress.worlds[world.id].isUnlocked) {
            playerProgress.worlds[world.id].isUnlocked = true;
            needsSave = true;
            console.log(`Odomykam svet: ${world.name}`);
        }
        
        // Zabezpeč, že prvý level je odomknutý
        if (typeof getWorldLevels === 'function') {
            const worldLevels = getWorldLevels(world.id);
            if (worldLevels.length > 0) {
                const firstLevel = worldLevels[0];
                
                if (!playerProgress.worlds[world.id].levels[firstLevel.id]) {
                    playerProgress.worlds[world.id].levels[firstLevel.id] = {
                        isUnlocked: true,
                        stars: 0,
                        completed: false
                    };
                    needsSave = true;
                    console.log(`Odomykam prvý level ${firstLevel.id} v svete ${world.name}`);
                } else if (!playerProgress.worlds[world.id].levels[firstLevel.id].isUnlocked) {
                    playerProgress.worlds[world.id].levels[firstLevel.id].isUnlocked = true;
                    needsSave = true;
                    console.log(`Opravujem odomknutie prvého levelu ${firstLevel.id} v svete ${world.name}`);
                }
            }
        }
    });
    
    // Ulož zmeny ak boli nejaké
    if (needsSave && window.progressManager) {
        window.progressManager.saveProgress();
        console.log('Uložené opravy pokroku');
    }
}

/**
 * Nastavenie viditeľných svetov s vybraným svetom v strede
 */
function setVisibleWorldsForCenter(centerIndex) {
    visibleWorldsStartIndex = Math.max(0, centerIndex - 1);
    
    // Zabezpečí, aby sme mali vždy 3 svety ak je to možné
    if (visibleWorldsStartIndex + 2 >= allWorlds.length) {
        visibleWorldsStartIndex = Math.max(0, allWorlds.length - 3);
    }
}

/**
 * Event listenery pre checkboxy
 */
function setupTrainingModalListeners() {
    document.addEventListener('DOMContentLoaded', function() {
        const showLockedCheckbox = document.getElementById('show-locked-words');
        const showAllWorldsCheckbox = document.getElementById('show-all-worlds-words');
        
        if (showLockedCheckbox) {
            showLockedCheckbox.addEventListener('change', updateWordsDisplay);
        }
        
        if (showAllWorldsCheckbox) {
            showAllWorldsCheckbox.addEventListener('change', function() {
                updateWordsDisplay();
            });
        }
    });
}

/**
 * Nastavenie event listenerov pre training modal keď sa vytvára
 */
function setupTrainingModalEvents() {
    const showLockedCheckbox = document.getElementById('show-locked-words');
    const showAllWorldsCheckbox = document.getElementById('show-all-worlds-words');
    const closeBtn = document.getElementById('training-modal-close');
    const startBtn = document.getElementById('start-training-btn');
    
    console.log('Nastavujem event listenery pre training modal');
    
    if (showLockedCheckbox) {
        showLockedCheckbox.addEventListener('change', updateWordsDisplay);
        console.log('Show locked words checkbox listener nastavený');
    }
    
    if (showAllWorldsCheckbox) {
        showAllWorldsCheckbox.addEventListener('change', function() {
            console.log('Show all worlds checkbox clicked');
            updateWordsDisplay();
        });
        console.log('Show all worlds checkbox listener nastavený');
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeTrainingModal);
        console.log('Close button listener nastavený');
    }
    
    if (startBtn) {
        startBtn.addEventListener('click', startTrainingLevel);
        console.log('Start button listener nastavený');
    }
}

/**
 * Aktualizácia setupEventListeners funkcie - pridanie pexeso button listenera
 */
function setupEventListeners() {
    console.log('Nastavujem event listenery...');
    
    // Navigačné šípky
    const prevButton = document.getElementById('prev-world');
    const nextButton = document.getElementById('next-world');
    const banikButton = document.getElementById('banik-button');
    const pexesoButton = document.getElementById('pexeso-button'); // PRIDANÉ
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            navigateWorlds(-1);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            navigateWorlds(1);
        });
    }

    if (banikButton) {
        banikButton.addEventListener('click', openTrainingModal);
    }
    
    // PRIDANÉ: Event listener pre pexeso training
    if (pexesoButton) {
        pexesoButton.addEventListener('click', openPexesoTrainingModal);
        console.log('✅ Pexeso button event listener nastavený');
    }
    
    // Tlačidlá svetov - pridajú sa dynamicky v updateWorldButtons()
    // Level cards - pridajú sa dynamicky v updateLevelsGrid()
    
    // Event listener pre level modal zatvorenie
    setupLevelModalListeners();
    setupTrainingModalListeners();
    setupPexesoTrainingModalListeners(); 
}

/**
 * Nastavenie listenerov pre level modal
 */
function setupLevelModalListeners() {
    // Zatvorenie modalu kliknutím na overlay
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('level-modal-overlay')) {
            closeLevelModal();
        }
    });
    
    // Zatvorenie modalu ESC klávesou
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLevelModal();
        }
    });
}

/**
 * Navigácia medzi svetmi (šípky)
 * OPRAVENÉ: Plynulá cyklická navigácia - vždy posun o 1 svet
 */
function navigateWorlds(direction) {
    console.log(`Navigujem svety: ${direction}`);
    
    // Vypočítaj nový index s wrap-around (modulo)
    visibleWorldsStartIndex = (visibleWorldsStartIndex + direction + allWorlds.length) % allWorlds.length;
    
    // Aktualizuj display
    updateDisplay();
}

/**
 * Výber konkrétneho sveta (kliknutie na tlačidlo)
 */
function selectWorld(worldIndex) {
    console.log(`Vyberám svet: ${worldIndex}`);
    
    if (worldIndex >= 0 && worldIndex < allWorlds.length) {
        currentWorldIndex = worldIndex;
        currentSelectedWorld = allWorlds[worldIndex];
        updateDisplay();
    }
}

/**
 * Hlavná funkcia na aktualizáciu celého zobrazenia
 */
function updateDisplay() {
    console.log('Aktualizujem zobrazenie...');
    
    // Aktualizuj tlačidlá svetov (horná navigácia)
    updateWorldButtons();
    
    // Aktualizuj názov sveta
    updateWorldTitle();
    
    // Aktualizuj pozadie herného panelu
    updateGamePanelBackground();
    
    // Aktualizuj grid levelov
    updateLevelsGrid();
    
    // Aktualizuj počet hviezd
    updateStarsDisplay();
}

/**
 * NOVÁ FUNKCIA: Vytvorenie všetkých world buttonov naraz
 * Volá sa raz pri inicializácii, čím sa eliminuje prebliknutie pri navigácii
 */
function createAllWorldButtons() {
    console.log('🎨 Vytváram všetky world buttony naraz...');
    
    // Vymaž staré buttony ak existujú
    allWorldButtons = [];
    
    // Vytvor button pre každý svet
    allWorlds.forEach((world, worldIndex) => {
        const button = document.createElement('button');
        button.className = 'world-button';
        button.dataset.worldIndex = worldIndex;
        
        // Aplikuj pozadie priamo z prednačítanej cache
        applyWorldButtonBackground(button, world);
        
        // Vytvor span s písmenom
        const span = document.createElement('span');
        span.textContent = world.name; // Písmeno (napr. "R", "L", "S")
        button.appendChild(span);
        
        // Event listener
        button.addEventListener('click', () => {
            selectWorld(worldIndex);
        });
        
        // Skry button defaultne (zobrazíme len potrebné 3)
        button.style.display = 'none';
        
        // Ulož do cache
        allWorldButtons[worldIndex] = button;
    });
    
    console.log(`✅ Predgenerovaných ${allWorldButtons.length} world buttonov`);
}

/**
 * Aktualizácia tlačidiel svetov (3 viditeľné)
 */
/**
 * Aktualizácia tlačidiel svetov (3 viditeľné)
 * UPRAVENÉ: Používa predgenerované buttony namiesto vytvárania nových
 */
function updateWorldButtons() {
    const container = document.querySelector('.worlds-buttons-container');
    if (!container) return;
    
    // Vymaž container
    container.innerHTML = '';
    
    // Najprv skry všetky buttony a odstráň active triedu
    allWorldButtons.forEach(button => {
        if (button) {
            button.classList.remove('active');
            button.style.display = 'none';
        }
    });
    
    // Zobraz 3 viditeľné buttony s wrap-around
    for (let i = 0; i < 3; i++) {
        // Vypočítaj worldIndex s wrap-around (modulo)
        const worldIndex = (visibleWorldsStartIndex + i) % allWorlds.length;
        const button = allWorldButtons[worldIndex];
        
        if (button) {
            // Zobraz button
            button.style.display = 'block';
            
            // Pridaj active triedu ak je to aktuálny svet
            if (worldIndex === currentWorldIndex) {
                button.classList.add('active');
            }
            
            // Pridaj do containera
            container.appendChild(button);
        }
    }
}

/**
 * NOVÁ FUNKCIA: Aplikuje pozadie world buttonu z prednačítanej cache
 * Toto zabezpečí okamžité zobrazenie bez prebliknutia
 */
function applyWorldButtonBackground(button, world) {
    // Mapovanie world name na súbor pozadia
    const backgroundMap = {
        'R': 'world_r.png',
        'L': 'world_l.png',

        'C': 'world_c.png',
        'Z': 'world_z.jpg',
        'S': 'world_s.png',

        'Č': 'world_ch.png',
        'Ž': 'world_zh.png',
        'Š': 'world_sh.png',

        'K': 'world_k.png',
        'G': 'world_g.png',

        'D': 'world_d.png',
        'T': 'world_t.png',
        'N': 'world_n.png',

        'Ď': 'world_dh.png',
        'Ť': 'world_th.png',
        'Ň': 'world_nh.png',
    };
    
    const backgroundFile = backgroundMap[world.name];
    if (!backgroundFile) {
        console.warn(`⚠️ Nenašiel sa background pre svet: ${world.name}`);
        return;
    }
    
    const imagePath = `images/worlds/${backgroundFile}`;
    
    // Skús použiť prednačítaný obrázok z cache
    if (typeof getPreloadedImage === 'function') {
        const preloadedImg = getPreloadedImage(imagePath);
        
        if (preloadedImg) {
            // Použij prednačítaný obrázok - okamžite bez čakania!
            button.style.backgroundImage = `url('${preloadedImg.src}')`;
            button.style.backgroundSize = '115%';
            button.style.backgroundPosition = 'center center';
            button.style.backgroundRepeat = 'no-repeat';
            console.log(`✅ Použitý prednačítaný obrázok pre ${world.name}`);
        } else {
            // Fallback na CSS triedu ak obrázok nie je v cache
            console.log(`⚠️ Obrázok ${imagePath} nie je v cache, používam CSS`);
            button.classList.add(`world-${world.name.toLowerCase()}`);
        }
    } else {
        // Fallback ak preloader nie je dostupný
        button.classList.add(`world-${world.name.toLowerCase()}`);
    }
}

/**
 * Aktualizácia názvu sveta
 */
function updateWorldTitle() {
    const titleElement = document.getElementById('world-title');
    if (titleElement && currentSelectedWorld) {
        titleElement.textContent = `LEVELY ${currentSelectedWorld.name}`;
    }
}

/**
 * Aktualizácia pozadia herného panelu
 */
function updateGamePanelBackground() {
    const gamePanel = document.getElementById('game-panel');
    if (!gamePanel || !currentSelectedWorld) return;
    
    // Odstráni všetky world-bg triedy
    gamePanel.classList.remove(...Array.from(gamePanel.classList).filter(cls => cls.includes('world-') && cls.includes('-bg')));
    
    // Pridá novú background triedu
    const bgClass = `world-${currentSelectedWorld.name.toLowerCase()}-bg`;
    gamePanel.classList.add(bgClass);
}

/**
 * Aktualizácia gridu levelov
 */
function updateLevelsGrid() {
    const gridElement = document.getElementById('levels-grid');
    if (!gridElement || !currentSelectedWorld) return;
    
    console.log(`Aktualizujem levely pre svet: ${currentSelectedWorld.name}`);
    
    // Vymaž existujúce levely
    gridElement.innerHTML = '';
    
    // Načítaj levely pre aktuálny svet
    let worldLevels = [];
    if (typeof getWorldLevels === 'function') {
        worldLevels = getWorldLevels(currentSelectedWorld.id);
    }
    
    if (worldLevels.length === 0) {
        gridElement.innerHTML = `<p>Žiadne levely pre svet ${currentSelectedWorld.name}</p>`;
        return;
    }
    
    // Vygeneruj level cards
    worldLevels.forEach((level, index) => {
        const levelCard = createLevelCard(level, index + 1);
        gridElement.appendChild(levelCard);
    });
}

/**
 * Vytvorenie level card
 */
function createLevelCard(level, levelNumber) {
    const card = document.createElement('div');
    card.className = 'level-card';
    card.dataset.levelId = level.id;
    
    // Získaj pokrok levelu
    const levelProgress = playerProgress?.worlds?.[level.worldId]?.levels?.[level.id];
    const isUnlocked = levelProgress?.isUnlocked || false;
    const stars = levelProgress?.stars || 0;
    
    if (isUnlocked) {
        // Odomknutý level
        card.innerHTML = `
            <div class="level-number">
                <h1>${levelNumber}</h1>
            </div>
            <div class="level-stars">
                ${generateStarsHTML(stars)}
            </div>
        `;
        
        // Event listener na otvorenie modalu
        card.addEventListener('click', () => {
            openLevelModal(level, levelNumber);
        });
    } else {
        // Zamknutý level
        card.innerHTML = `
            <div class="lock">
                <img src="images/zamok.png" class="lock-image" alt="Zamknutý">
            </div>
            <div class="level-number">
                <h1>${levelNumber}</h1>
            </div>
            <div class="level-stars">
                ${generateStarsHTML(0)}
            </div>
        `;
    }
    
    return card;
}

/**
 * Generovanie HTML pre hviezdy
 */
function generateStarsHTML(stars) {
    let html = '';
    for (let i = 0; i < 3; i++) {
        const starClass = i < stars ? 'active-star' : 'deactive-star';
        html += `<img src="images/star_active.png" class="${starClass}" alt="Hviezda">`;
    }
    return html;
}

/**
 * Aktualizácia zobrazenia počtu hviezd
 */
function updateStarsDisplay() {
    const starsCountElement = document.getElementById('stars-count');
    if (!starsCountElement || !currentSelectedWorld || !playerProgress) return;
    
    const worldProgress = playerProgress.worlds[currentSelectedWorld.id];
    const currentStars = worldProgress?.stars || 0;
    
    // Spočítaj maximálny počet hviezd pre svet
    let maxStars = 0;
    if (typeof getWorldLevels === 'function') {
        const worldLevels = getWorldLevels(currentSelectedWorld.id);
        maxStars = worldLevels.length * 3; // 3 hviezdy za level
    }
    
    starsCountElement.textContent = currentStars;
    
    // Aktualizuj aj total
    const starsTotalElement = document.querySelector('.stars-total');
    if (starsTotalElement) {
        starsTotalElement.textContent = ` / ${maxStars}`;
    }
}

/**
 * Otvorenie modalu s detailami levelu
 */
function openLevelModal(level, levelNumber) {
    console.log(`Otváram modal pre level: ${level.name}`);
    
    // Vytvor modal ak neexistuje
    createLevelModalIfNotExists();
    
    // Naplň modal dátami
    populateLevelModal(level, levelNumber);
    
    // Zobraz modal
    const modal = document.getElementById('level-detail-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Zablokuj scrollovanie
    }
}

/**
 * Vytvorenie level modalu ak neexistuje
 */
function createLevelModalIfNotExists() {
    if (document.getElementById('level-detail-modal')) return;
    
    const modalHTML = `
        <div id="level-detail-modal" class="level-modal-overlay" style="display: none;">
            <div class="close" id="modal-close-btn">X</div>
            <div class="level-modal-content">
                <div class="level-modal-header">
                    <h2 id="modal-level-name">Názov levelu</h2>
                </div>
                <div class="level-modal-body">
                    <div class="level-info">
                        <p><strong>Svet:</strong> <span id="modal-world-name">-</span></p>
                        <p><strong>Typ hry:</strong> <span id="modal-game-type">-</span></p>
                        <p><strong>Slová na precvičovanie:</strong></p>
                        <div id="modal-words" class="words-list"></div>
                    </div>
                    <div class="level-progress">
                        <p><strong>Tvoj pokrok:</strong></p>
                        <div id="modal-stars" class="modal-stars"></div>
                        <p id="modal-best-time"><strong>Najlepší čas:</strong> --:--</p>
                    </div>
                </div>
                <div class="level-modal-footer">
                    <button id="modal-play-btn" class="btn-primary"><a>Spustiť level</a></button>
                </div>
            </div>
        </div>
    `;
    
    (document.getElementById('bj-stage') || document.body).insertAdjacentHTML('beforeend', modalHTML);
    
    // Pridaj event listenery
    document.getElementById('modal-close-btn').addEventListener('click', closeLevelModal);
    document.getElementById('modal-play-btn').addEventListener('click', playSelectedLevel);
}

/**
 * Naplnenie modalu dátami levelu
 */
function populateLevelModal(level, levelNumber) {
    document.getElementById('modal-level-name').textContent = `Level ${levelNumber}`;
    document.getElementById('modal-world-name').textContent = currentSelectedWorld.title || currentSelectedWorld.name;
    document.getElementById('modal-game-type').textContent = getGameTypeName(level.gameType);
    
    // Slová
    const wordsContainer = document.getElementById('modal-words');
    wordsContainer.innerHTML = '';
    level.words.forEach(word => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word-tag';
        wordSpan.textContent = word;
        wordsContainer.appendChild(wordSpan);
    });
    
    // Pokrok
    const levelProgress = playerProgress?.worlds?.[level.worldId]?.levels?.[level.id];
    const stars = levelProgress?.stars || 0;
    const bestTime = levelProgress?.bestTime;
    
    document.getElementById('modal-stars').innerHTML = generateStarsHTML(stars);
    document.getElementById('modal-best-time').textContent = `Najlepší čas: ${bestTime ? formatTime(bestTime) : '--:--'}`;
    
    // Ulož aktuálny level pre play button
    document.getElementById('modal-play-btn').dataset.levelId = level.id;
}

/**
 * Získanie názvu typu hry
 */
function getGameTypeName(gameType) {
    const names = {
        'banik': 'Baník',
        'pexeso': 'Pexeso', 
        'mario': 'Super Mario'
    };
    return names[gameType] || gameType;
}

/**
 * Formátovanie času
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Zatvorenie level modalu
 */
function closeLevelModal() {
    const modal = document.getElementById('level-detail-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Obnoví scrollovanie
    }
}

/**
 * Spustenie vybraného levelu
 */
function playSelectedLevel() {
    const levelId = document.getElementById('modal-play-btn').dataset.levelId;
    if (!levelId) return;
    
    console.log(`Spúšťam level: ${levelId}`);
    
    closeLevelModal();
    
    // Pokús sa použiť gameRouter
    if (window.gameRouter && typeof window.gameRouter.startLevel === 'function') {
        window.gameRouter.startLevel(currentSelectedWorld.id, levelId);
    } else {
        // Fallback - priama navigácia s OPRAVENÝMI parametrami
        const level = getLevelConfig(levelId);
        if (level) {
            const gameUrls = {
                'banik': 'game.html',
                'pexeso': 'pexeso.html', 
                'mario': 'superjozino.html'
            };
            const url = gameUrls[level.gameType];
            if (url) {
                // OPRAVENÉ: worldId namiesto world, levelId namiesto level
                window.location.href = `${url}?worldId=${currentSelectedWorld.id}&levelId=${levelId}`;
                console.log(`Navigujem na: ${url}?worldId=${currentSelectedWorld.id}&levelId=${levelId}`);
            }
        }
    }
}

/**
 * Fallback konfigurácia ak config súbory nie sú dostupné
 */
function setupFallbackConfiguration() {
    console.warn('Používam fallback konfiguráciu');
    
    allWorlds = [
        { id: 'world_r', name: 'R', title: 'Svet písmena R', isUnlocked: true },
        { id: 'world_l', name: 'L', title: 'Svet písmena L', isUnlocked: true },
        { id: 'world_s', name: 'S', title: 'Svet písmena S', isUnlocked: true }
    ];
    
    playerProgress = createDefaultProgress();
    setInitialWorld();
    setupEventListeners();
    updateDisplay();
}

// ===== POMOCNÉ FUNKCIE =====

/**
 * Funkcia pre debugging
 */
function debugWorldsMenu() {
    console.log('=== WORLDS MENU DEBUG ===');
    console.log('Všetky svety:', allWorlds);
    console.log('Aktuálny svet:', currentSelectedWorld);
    console.log('Visible worlds start:', visibleWorldsStartIndex);
    console.log('Pokrok hráča:', playerProgress);
    console.log('========================');
}

// Export pre testovanie (ak je potrebné)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        selectWorld,
        navigateWorlds,
        debugWorldsMenu
    };
}


/**
 * Otvorenie training modalu
 */
function openTrainingModal() {
    console.log('Otváram trénovací modal pre svet:', currentSelectedWorld.name);
    
    // Vytvor modal ak neexistuje
    createTrainingModalIfNotExists();
    
    // Naplň modal dátami
    populateTrainingModal();

    // Nastav event listenery PO vytvorení modalu
    setupTrainingModalEvents();
    
    // Zobraz modal
    const modal = document.getElementById('training-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Vytvorenie training modalu ak neexistuje
 */
function createTrainingModalIfNotExists() {
    if (document.getElementById('training-modal')) return;
    
    // Modal HTML je už v HTML súbore, takže len pridáme event listenery
    document.addEventListener('DOMContentLoaded', function() {
        const closeBtn = document.getElementById('training-modal-close');
        const startBtn = document.getElementById('start-training-btn');
        const includeAllCheckbox = document.getElementById('include-all-words');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeTrainingModal);
        }
        
        if (startBtn) {
            startBtn.addEventListener('click', startTrainingLevel);
        }
        
        if (includeAllCheckbox) {
            includeAllCheckbox.addEventListener('change', toggleAllWords);
        }
    });
}

/**
 * Naplnenie training modalu dátami
 */
function populateTrainingModal() {
    // Aktualizuj názov sveta
    const wordsTitle = document.getElementById('words-section-title');
    if (wordsTitle) {
        wordsTitle.textContent = `Naučené slová zo sveta ${currentSelectedWorld.name}:`;
    }
    
    // Načítaj len slová z odomknutých levelov
    const unlockedWords = getUnlockedWorldWords();
    populateWordsList(unlockedWords);
    
    // Reset checkboxov
    document.getElementById('show-locked-words').checked = false;
    document.getElementById('show-all-worlds-words').checked = false;
    
    // Nastav predvolené hodnoty pre itemy
    document.getElementById('diamonds-count').value = 2;
    document.getElementById('golds-count').value = 2;
    document.getElementById('crystals-count').value = 1;

    // PRIDANÉ: Nastav predvolené hodnoty pre rozšírené nastavenia
    const speechExercisesInput = document.getElementById('speech-exercises-count');
    const listeningExercisesInput = document.getElementById('listening-exercises-count');
    
    if (speechExercisesInput) {
        speechExercisesInput.value = 2; // Predvolený počet slov v rečovom cvičení
    }
    
    if (listeningExercisesInput) {
        listeningExercisesInput.value = 1; // Predvolený počet slov v posluchovom cvičení
    }
    
    // Skry rozšírené nastavenia pri otvorení modalu
    const advancedPanel = document.getElementById('advanced-settings');
    const toggleBtn = document.getElementById('toggle-advanced-settings');
    if (advancedPanel) {
        advancedPanel.style.display = 'none';
    }
    if (toggleBtn) {
        toggleBtn.classList.remove('active');
    }
    
    // Inicializuj rozšírené nastavenia
    initializeAdvancedSettings();
}

/**
 * Získanie slov len z odomknutých levelov aktuálneho sveta
 */
function getUnlockedWorldWords() {
    const unlockedWords = [];
    
    if (typeof getWorldLevels === 'function' && currentSelectedWorld) {
        const worldLevels = getWorldLevels(currentSelectedWorld.id);
        worldLevels.forEach(level => {
            const levelProgress = playerProgress?.worlds?.[level.worldId]?.levels?.[level.id];
            const isUnlocked = levelProgress?.isUnlocked || false;
            
            if (isUnlocked && level.words) {
                level.words.forEach(word => {
                    if (!unlockedWords.includes(word)) {
                        unlockedWords.push(word);
                    }
                });
            }
        });
    }
    
    return unlockedWords.sort();
}

/**
 * Získanie všetkých slov z aktuálneho sveta (vrátane zamknutých)
 */
function getAllCurrentWorldWords() {
    const allWords = [];
    
    if (typeof getWorldLevels === 'function' && currentSelectedWorld) {
        const worldLevels = getWorldLevels(currentSelectedWorld.id);
        worldLevels.forEach(level => {
            if (level.words) {
                level.words.forEach(word => {
                    if (!allWords.find(w => w.text === word)) {
                        const levelProgress = playerProgress?.worlds?.[level.worldId]?.levels?.[level.id];
                        const isUnlocked = levelProgress?.isUnlocked || false;
                        
                        allWords.push({
                            text: word,
                            isUnlocked: isUnlocked
                        });
                    }
                });
            }
        });
    }
    
    return allWords.sort((a, b) => a.text.localeCompare(b.text));
}

/**
 * Získanie všetkých slov zo všetkých svetov
 */
function getAllWorldsWords() {
    const allWords = [];
    
    if (typeof getWorldLevels === 'function') {
        allWorlds.forEach(world => {
            const worldLevels = getWorldLevels(world.id);
            worldLevels.forEach(level => {
                if (level.words) {
                    level.words.forEach(word => {
                        if (!allWords.find(w => w.text === word)) {
                            const levelProgress = playerProgress?.worlds?.[level.worldId]?.levels?.[level.id];
                            const isUnlocked = levelProgress?.isUnlocked || false;
                            
                            allWords.push({
                                text: word,
                                isUnlocked: isUnlocked,
                                world: world.name
                            });
                        }
                    });
                }
            });
        });
    }
    
    return allWords.sort((a, b) => a.text.localeCompare(b.text));
}

/**
 * Naplnenie zoznamu slov
 */
function populateWordsList(words) {
    const wordsContainer = document.getElementById('words-list');
    if (!wordsContainer) return;
    
    wordsContainer.innerHTML = '';
    
    if (typeof words[0] === 'string') {
        // Jednoduché slová (len text)
        words.forEach(word => {
            const wordElement = createWordElement(word, true);
            wordsContainer.appendChild(wordElement);
        });
    } else {
        // Objekty s dodatočnými informáciami
        words.forEach(wordObj => {
            const wordElement = createWordElement(wordObj.text, wordObj.isUnlocked, wordObj.world);
            wordsContainer.appendChild(wordElement);
        });
    }
}

/**
 * Vytvorenie elementu pre slovo
 */
function createWordElement(word, isUnlocked = true, worldName = null) {
    const wordElement = document.createElement('div');
    wordElement.className = 'word-item';
    wordElement.textContent = word;
    wordElement.dataset.word = word;
    
    // ODSTRÁNENÉ: locked styling - všetky slová sú klikateľné
    if (!isUnlocked) {
        wordElement.classList.add('locked');
        wordElement.title = 'Toto slovo je zo zamknutého levelu';
        // Ale stále povoľ kliknutie
    }
    
    if (worldName && worldName !== currentSelectedWorld.name) {
        wordElement.title = `Slovo zo sveta ${worldName}`;
    }
    
    // Event listener pre výber slova - funguje pre všetky slová
    wordElement.addEventListener('click', function() {
        console.log('Kliknuté na slovo:', word);
        if (this.classList.contains('selected')) {
            this.classList.remove('selected');
            console.log('Slovo odznačené:', word);
        } else {
            this.classList.add('selected');
            console.log('Slovo označené:', word);
        }
    });
    
    return wordElement;
}

/**
 * Aktualizácia zobrazenia slov na základe checkboxov
 */
function updateWordsDisplay() {
    const showLocked = document.getElementById('show-locked-words').checked;
    const showAllWorlds = document.getElementById('show-all-worlds-words').checked;
    const wordsTitle = document.getElementById('words-section-title');
    
    let words;
    let titleText;
    
    if (showAllWorlds) {
        words = getAllWorldsWords();
        titleText = showLocked ? 'Všetky slová zo všetkých svetov:' : 'Naučené slová zo všetkých svetov:';
        if (!showLocked) {
            words = words.filter(w => w.isUnlocked);
        }
    } else {
        if (showLocked) {
            words = getAllCurrentWorldWords();
            titleText = `Všetky slová zo sveta ${currentSelectedWorld.name}:`;
        } else {
            words = getUnlockedWorldWords();
            titleText = `Naučené slová zo sveta ${currentSelectedWorld.name}:`;
        }
    }
    
    wordsTitle.textContent = titleText;
    populateWordsList(words);
}

/**
 * Spustenie tréningového levelu - aktualizovaná verzia
 */
function startTrainingLevel() {
    // Zbieranie vybraných slov
    const selectedWordElements = document.querySelectorAll('#words-list .word-item.selected');
    const selectedWords = Array.from(selectedWordElements).map(el => el.dataset.word);
    
    if (selectedWords.length === 0) {
        alert('Prosím vyberte aspoň jedno slovo pre tréning!');
        return;
    }
    
    // Získanie nastavení počtu itemov
    const diamondsCount = parseInt(document.getElementById('diamonds-count').value) || 2;
    const goldsCount = parseInt(document.getElementById('golds-count').value) || 3;
    const crystalsCount = parseInt(document.getElementById('crystals-count').value) || 1;
    
    // Získanie rozšírených nastavení
    const speechExercisesCount = parseInt(document.getElementById('speech-exercises-count')?.value) || 3;
    const listeningExercisesCount = parseInt(document.getElementById('listening-exercises-count')?.value) || 1;
    

    console.log('Spúšťam tréning:', {
        words: selectedWords,
        diamonds: diamondsCount,
        golds: goldsCount,
        crystals: crystalsCount,
        speechExercises: speechExercisesCount,
        listeningExercises: listeningExercisesCount
    });
    
    // Zatvor modal
    closeTrainingModal();
    
    // Vytvor custom levelConfig pre tréning
    const trainingLevelConfig = {
        words: selectedWords,
        timeLimit: null,
        isTraining: true,
        gameConfig: {
            diamonds: diamondsCount,
            golds: goldsCount,
            crystals: crystalsCount,
            speechExercises: speechExercisesCount,
            listeningExercises: listeningExercisesCount
        }
    };
    
    // Spusti hru s tréningovým levelom
    const gameUrl = `game.html?training=true&config=${encodeURIComponent(JSON.stringify(trainingLevelConfig))}`;
    window.location.href = gameUrl;
}

/**
 * Zatvorenie training modalu
 */
function closeTrainingModal() {
    const modal = document.getElementById('training-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}



function debugTrainingModal() {
    console.log('=== TRAINING MODAL DEBUG ===');
    console.log('Modal element:', document.getElementById('training-modal'));
    console.log('Close button:', document.getElementById('training-modal-close'));
    console.log('Start button:', document.getElementById('start-training-btn'));
    console.log('Show locked checkbox:', document.getElementById('show-locked-words'));
    console.log('Show all worlds checkbox:', document.getElementById('show-all-worlds-words'));
    console.log('Current selected world:', currentSelectedWorld);
    console.log('============================');
}



// ==========================================
// PRIDANIE PEXESO CUSTOM LEVEL PODPORY DO WORLDSMENU.JS
// ==========================================


// ==========================================
// PEXESO TRAINING MODAL FUNKCIE
// ==========================================

/**
 * Otvorenie pexeso training modalu
 */
function openPexesoTrainingModal() {
    console.log('🎮 Otváram pexeso trénovací modal pre svet:', currentSelectedWorld.name);
    
    // Vytvor modal ak neexistuje
    createPexesoTrainingModalIfNotExists();
    
    // Naplň modal dátami
    populatePexesoTrainingModal();

    // Nastav event listenery PO vytvorení modalu
    setupPexesoTrainingModalEvents();
    
    // Zobraz modal
    const modal = document.getElementById('pexeso-training-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Vytvorenie pexeso training modalu ak neexistuje
 */
function createPexesoTrainingModalIfNotExists() {
    if (document.getElementById('pexeso-training-modal')) return;
    
    const modalHTML = `
    <div id="pexeso-training-modal" class="level-modal-overlay" style="display: none;">
        <div class="close" id="pexeso-training-modal-close">X</div>
        <div class="level-modal-content">
            <div class="level-modal-header">
                <h2>TRÉNING PEXESO</h2>
            </div>
            <div class="level-modal-body">
                <!-- Výber slov - ROVNAKO AKO V BANÍK MODALI -->
                <div class="words-display-section">
                    <h2 class="subtitle-modal">Výber slov pre minihru</h2>
                    <div id="pexeso-words-scrollable-container" class="words-scrollable-container">
                        <h3 id="pexeso-words-section-title">Naučené slová zo sveta R:</h3>
                        <div id="pexeso-words-list" class="words-list">
                            <!-- Slová sa budú generovať JavaScriptom ako word-item divky -->
                        </div>
                    </div>
                </div>

                <!-- Možnosti zobrazenia slov -->
                <div class="words-options">
                    <label class="checkbox-option">
                        <input type="checkbox" id="pexeso-show-locked-words">
                        <span class="checkmark"></span>
                        Zobraziť aj nenaučené slová z tohto sveta
                    </label>
                    
                    <label class="checkbox-option">
                        <input type="checkbox" id="pexeso-show-all-worlds-words">
                        <span class="checkmark"></span>
                        Zobraziť slová zo všetkých svetov
                    </label>
                </div>

                <!-- Nastavenie počtu hráčov -->
                <div class="players-settings">
                    <h2 class="subtitle-modal">Nastavenia hráčov:</h2>
                    <div class="players-controls">
                        <div class="player-count-control">
                            <label>Počet hráčov:</label>
                            <select id="pexeso-players-count">
                                <option value="1">1 hráč</option>
                                <option value="2">2 hráči</option>
                                <option value="3">3 hráči</option>
                                <option value="4">4 hráči</option>
                            </select>
                        </div>
                        <div id="pexeso-players-names" class="players-names-container">
                            <!-- Mená hráčov sa vygenerujú dynamicky -->
                        </div>
                    </div>
                </div>

                <!-- Nastavenia hry -->
                <div class="items-settings">
                    <h2 class="subtitle-modal">Nastavenia hry:</h2>
                    <div class="items-controls">
                        <div class="item-control">
                            <label>Časový limit (0 = neomedzený):</label>
                            <input type="number" id="pexeso-time-limit" min="0" max="600" value="0" step="30">
                        </div>
                    </div>
                </div>
            </div>
            <div class="level-modal-footer">
                <button id="pexeso-start-training-btn" class="btn-primary">
                    <a>Spustiť pexeso tréning</a>
                </button>
            </div>
        </div>
    </div>
    `;
    
    (document.getElementById('bj-stage') || document.body).insertAdjacentHTML('beforeend', modalHTML);
    console.log('✅ Pexeso training modal vytvorený');
}

function updatePexesoSelectionCounter() {
    const selectedCount = document.querySelectorAll('#pexeso-words-list .word-item.selected').length;
    
    let counterElement = document.getElementById('pexeso-selection-counter');
    
    if (!counterElement) {
        counterElement = document.createElement('div');
        counterElement.id = 'pexeso-selection-counter';
        counterElement.className = 'selection-counter';
        
        const wordsContainer = document.getElementById('pexeso-words-scrollable-container');
        if (wordsContainer) {
            wordsContainer.insertBefore(counterElement, wordsContainer.firstChild);
        }
    }
    

    
    counterElement.className = 'selection-counter';
    if (selectedCount < 3) {
        counterElement.classList.add('too-few');
    } else if (selectedCount >= 20) {
        counterElement.classList.add('at-max');
    } else {
        counterElement.classList.add('ok');
    }
}

/**
 * Naplnenie pexeso training modalu dátami
 */
function populatePexesoTrainingModal() {
    // Aktualizuj názov sveta
    const wordsTitle = document.getElementById('pexeso-words-section-title');
    if (wordsTitle) {
        wordsTitle.textContent = `Naučené slová zo sveta ${currentSelectedWorld.name}:`;
    }
    
    // Načítaj len slová z odomknutých levelov
    const unlockedWords = getUnlockedWorldWords();
    populatePexesoWordsList(unlockedWords);
    
    // Reset checkboxov
    const showLockedCheckbox = document.getElementById('pexeso-show-locked-words');
    const showAllWorldsCheckbox = document.getElementById('pexeso-show-all-worlds-words');
    if (showLockedCheckbox) showLockedCheckbox.checked = false;
    if (showAllWorldsCheckbox) showAllWorldsCheckbox.checked = false;
    
    // Nastav predvolené hodnoty pre pexeso
    const timeLimitInput = document.getElementById('pexeso-time-limit');
    const playersCountSelect = document.getElementById('pexeso-players-count');
    
    if (timeLimitInput) timeLimitInput.value = 0;
    if (playersCountSelect) {
        playersCountSelect.value = "1";
        updatePexesoPlayersNames(1);
    }
    updatePexesoSelectionCounter();
}

/**
 * Naplnenie zoznamu slov pre pexeso
 * @param {Array} words - Pole slov na zobrazenie
 */
function populatePexesoWordsList(words) {
    const wordsList = document.getElementById('pexeso-words-list');
    if (!wordsList) return;
    
    wordsList.innerHTML = '';
    
    if (words.length === 0) {
        wordsList.innerHTML = '<p style="color: rgba(255,255,255,0.6); text-align: center; padding: 20px;">Žiadne slová nie sú dostupné.</p>';
        return;
    }
    
    // Generovanie word-item diviek - rovnako ako v baník modali
    if (typeof words[0] === 'string') {
        // Jednoduché slová (len text)
        words.forEach(word => {
            const wordElement = createPexesoWordElement(word, true);
            wordsList.appendChild(wordElement);
        });
    } else {
        // Objekty s dodatočnými informáciami
        words.forEach(wordObj => {
            const wordElement = createPexesoWordElement(wordObj.text, wordObj.isUnlocked, wordObj.world);
            wordsList.appendChild(wordElement);
        });
    }
}

/**
 * Vytvorenie elementu pre slovo v pexeso modali
 * Rovnaká logika ako createWordElement() z baník modalu
 * @param {string} word - Text slova
 * @param {boolean} isUnlocked - Či je slovo odomknuté
 * @param {string} worldName - Názov sveta (voliteľné)
 * @returns {HTMLElement} Element slova
 */
function createPexesoWordElement(word, isUnlocked = true, worldName = null) {
    const wordElement = document.createElement('div');
    wordElement.className = 'word-item';
    wordElement.textContent = word;
    wordElement.dataset.word = word;
    
    // Ak je slovo zo zamknutého levelu, pridaj locked triedu
    if (!isUnlocked) {
        wordElement.classList.add('locked');
        wordElement.title = 'Toto slovo je zo zamknutého levelu';
    }
    
    // Ak je slovo z iného sveta, pridaj do titulku
    if (worldName && worldName !== currentSelectedWorld.name) {
        wordElement.title = `Slovo zo sveta ${worldName}`;
    }
    
    // Event listener pre výber slova - OPRAVENÝ
    wordElement.addEventListener('click', function() {
        console.log('Kliknuté na slovo v pexeso modali:', word);
        
        // Ak je slovo už označené, odznač ho
        if (this.classList.contains('selected')) {
            this.classList.remove('selected');
            console.log('Slovo odznačené:', word);
            updatePexesoSelectionCounter(); // Aktualizuj počítadlo
            return; // DÔLEŽITÉ: Ukonči funkciu, aby sa nepokračovalo ďalej
        }
        
        // Ak slovo NIE JE označené, skontroluj či nie je dosiahnutý limit
        const selectedCount = document.querySelectorAll('#pexeso-words-list .word-item.selected').length;
        if (selectedCount >= 20) {
            alert('⚠️ Dosiahli ste maximum 20 slov!');
            return; // Neoznač slovo, lebo je dosiahnutý limit
        }
        
        // Označ slovo (pridaj selected triedu)
        this.classList.add('selected');
        console.log('Slovo označené:', word);
        updatePexesoSelectionCounter(); // Aktualizuj počítadlo
    });
    
    return wordElement;
}

/**
 * Aktualizácia zobrazenia slov v pexeso modali
 */
function updatePexesoWordsDisplay() {
    const showLocked = document.getElementById('pexeso-show-locked-words')?.checked || false;
    const showAllWorlds = document.getElementById('pexeso-show-all-worlds-words')?.checked || false;
    const wordsTitle = document.getElementById('pexeso-words-section-title');
    
    let words = [];
    let titleText = '';
    
    if (showAllWorlds) {
        words = getAllWordsFromAllWorlds();
        titleText = showLocked ? 'Všetky slová zo všetkých svetov:' : 'Naučené slová zo všetkých svetov:';
        if (!showLocked) {
            words = words.filter(w => w.isUnlocked);
        }
    } else {
        if (showLocked) {
            words = getAllCurrentWorldWords();
            titleText = `Všetky slová zo sveta ${currentSelectedWorld.name}:`;
        } else {
            words = getUnlockedWorldWords();
            titleText = `Naučené slová zo sveta ${currentSelectedWorld.name}:`;
        }
    }
    
    if (wordsTitle) wordsTitle.textContent = titleText;
    populatePexesoWordsList(words);
}

/**
 * Aktualizácia polí pre mená hráčov
 * @param {number} playersCount - Počet hráčov
 */
function updatePexesoPlayersNames(playersCount) {
    const playersNamesContainer = document.getElementById('pexeso-players-names');
    if (!playersNamesContainer) return;
    
    playersNamesContainer.innerHTML = '';
    
    for (let i = 1; i <= playersCount; i++) {
        const playerInput = document.createElement('input');
        playerInput.type = 'text';
        playerInput.id = `pexeso-player-${i}-name`;
        playerInput.placeholder = `Hráč ${i}`;
        playerInput.value = `Hráč ${i}`;
        playerInput.className = 'player-name-input';
        
        const playerLabel = document.createElement('label');
        playerLabel.htmlFor = playerInput.id;
        playerLabel.textContent = `Hráč ${i}:`;
        
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-input-group';
        playerDiv.appendChild(playerLabel);
        playerDiv.appendChild(playerInput);
        
        playersNamesContainer.appendChild(playerDiv);
    }
}

/**
 * Inicializácia rozšírených nastavení - pridať do setupTrainingModalEvents()
 * Alebo zavolať samostatne po otvorení modalu
 */
function initializeAdvancedSettings() {
    const toggleBtn = document.getElementById('toggle-advanced-settings');
    const advancedPanel = document.getElementById('advanced-settings');
    
    if (toggleBtn && advancedPanel) {
        // Event listener pre rozklikávanie/skrývanie
        toggleBtn.addEventListener('click', function() {
            const isVisible = advancedPanel.style.display !== 'none';
            
            if (isVisible) {
                // Skry panel
                advancedPanel.style.display = 'none';
                toggleBtn.classList.remove('active');
            } else {
                // Zobraz panel
                advancedPanel.style.display = 'flex';
                toggleBtn.classList.add('active');
            }
        });
        
        console.log('Rozšírené nastavenia inicializované');
    }
}

/**
 * Nastavenie event listenerov pre pexeso training modal
 */
function setupPexesoTrainingModalEvents() {
    const showLockedCheckbox = document.getElementById('pexeso-show-locked-words');
    const showAllWorldsCheckbox = document.getElementById('pexeso-show-all-worlds-words');
    const closeBtn = document.getElementById('pexeso-training-modal-close');
    const startBtn = document.getElementById('pexeso-start-training-btn');
    const playersCountSelect = document.getElementById('pexeso-players-count');
    
    console.log('🎮 Nastavujem event listenery pre pexeso training modal');
    
    if (showLockedCheckbox) {
        showLockedCheckbox.addEventListener('change', updatePexesoWordsDisplay);
        console.log('✅ Pexeso show locked words checkbox listener nastavený');
    }
    
    if (showAllWorldsCheckbox) {
        showAllWorldsCheckbox.addEventListener('change', function() {
            console.log('Pexeso show all worlds checkbox clicked');
            updatePexesoWordsDisplay();
        });
        console.log('✅ Pexeso show all worlds checkbox listener nastavený');
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closePexesoTrainingModal);
        console.log('✅ Pexeso close button listener nastavený');
    }
    
    if (startBtn) {
        startBtn.addEventListener('click', startPexesoTrainingLevel);
        console.log('✅ Pexeso start button listener nastavený');
    }
    
    if (playersCountSelect) {
        playersCountSelect.addEventListener('change', function() {
            const playersCount = parseInt(this.value);
            updatePexesoPlayersNames(playersCount);
        });
        console.log('✅ Pexeso players count select listener nastavený');
    }
}

/**
 * Spustenie pexeso tréningového levelu
 */
function startPexesoTrainingLevel() {
    console.log('🚀 Spúšťam pexeso tréning...');
    
    // Zbieranie vybraných slov - UPRAVENÉ: používa .word-item.selected
    const selectedWordElements = document.querySelectorAll('#pexeso-words-list .word-item.selected');
    const selectedWords = Array.from(selectedWordElements).map(el => el.dataset.word);
    
    console.log('Vybrané slová:', selectedWords);
    
    // Kontrola minimálneho počtu slov
    if (selectedWords.length < 3) {
        alert('Prosím vyberte aspoň 3 slová pre pexeso tréning!');
        return;
    }

    // Kontrola maximálneho počtu slov
    if (selectedWords.length > 20) {
        alert('Prosím vyberte maximálne 20 slóv pre pexeso tréning!');
        return;
    }
    
    // Získanie nastavení
    const timeLimit = parseInt(document.getElementById('pexeso-time-limit').value) || 0;
    const playersCount = parseInt(document.getElementById('pexeso-players-count').value) || 1;
    
    // Získanie mien hráčov
    const players = [];
    for (let i = 1; i <= playersCount; i++) {
        const nameInput = document.getElementById(`pexeso-player-${i}-name`);
        const name = nameInput ? nameInput.value.trim() : `Hráč ${i}`;
        players.push({
            name: name || `Hráč ${i}`,
            score: 0
        });
    }
    
    console.log('Nastavenia pexeso tréningu:', {
        words: selectedWords,
        timeLimit: timeLimit,
        players: players,
        pairs: selectedWords.length // Počet párov = počet vybraných slov
    });
    
    // Zatvor modal
    closePexesoTrainingModal();
    
    // Vytvor URL parametre pre pexeso hru
    const params = new URLSearchParams({
        custom: 'true',
        training: 'true',
        words: JSON.stringify(selectedWords),
        players: JSON.stringify(players),
        pairs: selectedWords.length,
        timeLimit: timeLimit > 0 ? timeLimit : 0,
        worldId: currentSelectedWorld.id
    });
    
    // Presmerovanie na pexeso hru
    // OPRAVENÉ: pexeso.html je v root priečinku, nie v pexeso/
    const gameUrl = `pexeso.html?${params.toString()}`;
    console.log('Presmerovávam na:', gameUrl);
    window.location.href = gameUrl;
}

/**
 * Zatvorenie pexeso training modalu
 */
function closePexesoTrainingModal() {
    const modal = document.getElementById('pexeso-training-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

/**
 * Nastavenie event listenerov pre pexeso training modal
 */
function setupPexesoTrainingModalListeners() {
    // Zatvorenie modalu kliknutím na overlay
    document.addEventListener('click', (e) => {
        if (e.target.id === 'pexeso-training-modal') {
            closePexesoTrainingModal();
        }
    });
    
    // Zatvorenie modalu ESC klávesou
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('pexeso-training-modal');
            if (modal && modal.style.display !== 'none') {
                closePexesoTrainingModal();
            }
        }
    });
}

// ==========================================
// POMOCNÉ FUNKCIE PRE ZÍSKANIE SLOV
// ==========================================

/**
 * Získanie všetkých slov zo všetkých svetov
 * @returns {Array} Pole všetkých slov
 */
function getAllWordsFromAllWorlds() {
    const allWords = [];
    
    if (typeof LEVELS_CONFIG === 'undefined') {
        console.warn('⚠️ LEVELS_CONFIG nie je dostupný');
        return [];
    }
    
    Object.keys(LEVELS_CONFIG).forEach(worldId => {
        const worldLevels = LEVELS_CONFIG[worldId] || [];
        worldLevels.forEach(level => {
            if (level.words) {
                level.words.forEach(word => {
                    if (!allWords.find(w => w.text === word)) {
                        const levelProgress = playerProgress?.worlds?.[level.worldId]?.levels?.[level.id];
                        const isUnlocked = levelProgress?.isUnlocked || level.isUnlocked || false;
                        
                        allWords.push({
                            text: word,
                            worldId: level.worldId,
                            levelId: level.id,
                            isUnlocked: isUnlocked
                        });
                    }
                });
            }
        });
    });
    
    return allWords.sort((a, b) => a.text.localeCompare(b.text));
}

// ==========================================
// DEBUG FUNKCIE
// ==========================================

/**
 * Debug funkcia pre pexeso training modal
 */
function debugPexesoTrainingModal() {
    console.log('=== PEXESO TRAINING MODAL DEBUG ===');
    console.log('Modal element:', document.getElementById('pexeso-training-modal'));
    console.log('Close button:', document.getElementById('pexeso-training-modal-close'));
    console.log('Start button:', document.getElementById('pexeso-start-training-btn'));
    console.log('Show locked checkbox:', document.getElementById('pexeso-show-locked-words'));
    console.log('Show all worlds checkbox:', document.getElementById('pexeso-show-all-worlds-words'));
    console.log('Players count select:', document.getElementById('pexeso-players-count'));
    console.log('Current selected world:', currentSelectedWorld);
    console.log('==================================');
}

// Pridanie do globálnych funkcií pre testovanie
window.debugPexesoTrainingModal = debugPexesoTrainingModal;
window.openPexesoTrainingModal = openPexesoTrainingModal;