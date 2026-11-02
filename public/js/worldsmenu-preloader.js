/**
 * WorldsMenu Preloader s Cache API
 * Zabezpečuje rýchle načítanie obrázkov a ich uloženie do cache
 * Autor: Adam Reňak
 */

// ==========================================
// GLOBÁLNE PREMENNÉ PRE PRELOADING
// ==========================================

// Verzia cache - zvýš túto hodnotu pri zmenách obrázkov
const CACHE_VERSION = 'worldsmenu-v1.4';  
const CACHE_NAME = `banik-jozino-${CACHE_VERSION}`;

// Cache pre prednačítané obrázky (in-memory cache)
let preloadedImages = {};

// Progress tracking
let totalResources = 0;
let loadedResources = 0;
let isPreloadingComplete = false;

// ==========================================
// HLAVNÁ FUNKCIA PRELOADINGU
// ==========================================

/**
 * Spustenie preloadingu všetkých potrebných zdrojov
 */
async function startWorldsMenuPreloading() {
    try {
        console.log('🚀 Spúšťam preloading pre worlds menu...');
        
        // 1. Získaj všetky obrázky na načítanie
        const imagesToLoad = collectAllWorldsMenuImages();
        totalResources = imagesToLoad.length;
        
        console.log(`📦 Celkovo ${totalResources} obrázkov na načítanie`);
        updateLoadingMessage('Kontrolujem cache...');
        
        // 2. Skontroluj a vyčisti staré cache
        await cleanOldCaches();
        
        // 3. Načítaj všetky obrázky (paralelne)
        updateLoadingMessage('Načítavam obrázky...');
        const promises = imagesToLoad.map(imagePath => preloadImageWithCache(imagePath));
        await Promise.all(promises);
        
        console.log('✅ Všetky obrázky načítané a uložené do cache!');
        isPreloadingComplete = true;
        
        // 4. Skry loading screen
        setTimeout(() => {
            hideLoadingScreen();
        }, 500);
        
    } catch (error) {
        console.error('❌ Chyba pri preloadingu:', error);
        // Aj pri chybe pokračuj - nech sa stránka zobrazí
        setTimeout(() => {
            hideLoadingScreen();
        }, 1000);
    }
}

// ==========================================
// ZBER OBRÁZKOV NA NAČÍTANIE
// ==========================================

/**
 * Zbiera všetky obrázky potrebné pre worlds menu
 */
function collectAllWorldsMenuImages() {
    const images = [];
    
    // ==========================================
    // 1. OBRÁZKY SVETOV
    // ==========================================
    console.log('📂 Zbierame obrázky svetov...');
    
    // Získaj konfiguráciu svetov (ak existuje)
    if (typeof WORLDS_CONFIG !== 'undefined') {
        WORLDS_CONFIG.forEach(world => {
            // Použij icon z konfigurácie - má už správnu cestu a príponu
            if (world.icon) {
                images.push(world.icon);
            }
        });
        console.log(`   ✅ Pridaných ${WORLDS_CONFIG.length} world obrázkov`);
    }
    
    // ==========================================
    // 2. UI ELEMENTY
    // ==========================================
    console.log('📂 Zbierame UI elementy...');
    const uiImages = [
        // Hviezdy
        'images/star_active.png',
        'images/star_inactive.png',
        
        // Level ikony
        'images/banik-icon.png',
        'images/pexeso-icon.png',
        
        // Cursory
        'images/cursor.png',
        'images/active_cursor4.png',
        
        // Pozadia
        'images/pozadie.jpg',
        'images/worlds/background.jpg',
        
        // Menu buttony
        'images/menubutton.png'
    ];
    
    images.push(...uiImages);
    console.log(`   ✅ Pridaných ${uiImages.length} UI obrázkov`);
    
    // ==========================================
    // 3. LEVEL IKONY (ak existuje konfigurácia)
    // ==========================================
    if (typeof LEVELS_CONFIG !== 'undefined') {
        console.log('📂 Zbierame level ikony...');
        let levelIconsCount = 0;
        
        // Pre každý svet
        Object.keys(LEVELS_CONFIG).forEach(worldId => {
            const worldLevels = LEVELS_CONFIG[worldId] || [];
            
            // Pre každý level
            worldLevels.forEach(level => {
                // Pridaj ikonu levelu ak existuje
                if (level.icon) {
                    images.push(level.icon);
                    levelIconsCount++;
                }
            });
        });
        
        console.log(`   ✅ Pridaných ${levelIconsCount} level ikon`);
    }
    
    // ==========================================
    // 4. ODSTRÁNENIE DUPLIKÁTOV
    // ==========================================
    const uniqueImages = [...new Set(images)];
    console.log(`📦 Celkovo ${uniqueImages.length} unikátnych obrázkov (z ${images.length})`);
    
    return uniqueImages;
}

// ==========================================
// NAČÍTANIE OBRÁZKA S CACHE
// ==========================================

/**
 * Načíta obrázok s podporou Cache API
 * Najprv kontroluje cache, potom sieť
 */
async function preloadImageWithCache(imagePath) {
    try {
        // 1. Skús načítať z cache
        const cachedImage = await loadFromCache(imagePath);
        if (cachedImage) {
            console.log(`💾 Z cache: ${imagePath}`);
            preloadedImages[imagePath] = cachedImage;
            updateProgress();
            return cachedImage;
        }
        
        // 2. Ak nie je v cache, načítaj zo siete
        console.log(`🌐 Zo siete: ${imagePath}`);
        const image = await loadImageFromNetwork(imagePath);
        
        // 3. Ulož do cache
        if (image) {
            await saveToCache(imagePath, image);
            preloadedImages[imagePath] = image;
        }
        
        updateProgress();
        return image;
        
    } catch (error) {
        console.warn(`⚠️ Chyba pri načítaní ${imagePath}:`, error);
        updateProgress();
        return null;
    }
}

/**
 * Načítanie obrázka z cache
 */
async function loadFromCache(imagePath) {
    try {
        // Otvor cache
        const cache = await caches.open(CACHE_NAME);
        
        // Vytvor plnú URL
        const fullUrl = new URL(imagePath, window.location.href).href;
        
        // Pokús sa načítať z cache
        const response = await cache.match(fullUrl);
        
        if (response) {
            // Vytvor Image objekt z cache response
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => resolve(null);
                img.src = imageUrl;
            });
        }
        
        return null;
        
    } catch (error) {
        console.warn(`Cache read error for ${imagePath}:`, error);
        return null;
    }
}

/**
 * Načítanie obrázka zo siete
 */
function loadImageFromNetwork(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => {
            console.log(`✅ Načítaný: ${imagePath}`);
            resolve(img);
        };
        
        img.onerror = () => {
            console.warn(`⚠️ Chyba načítania: ${imagePath}`);
            resolve(null);
        };
        
        img.src = imagePath;
    });
}

/**
 * Uloženie obrázka do cache
 */
async function saveToCache(imagePath, image) {
    try {
        // Otvor cache
        const cache = await caches.open(CACHE_NAME);
        
        // Vytvor plnú URL
        const fullUrl = new URL(imagePath, window.location.href).href;
        
        // Načítaj obrázok ako blob
        const response = await fetch(imagePath);
        
        if (response.ok) {
            // Ulož do cache
            await cache.put(fullUrl, response);
            console.log(`💾 Uložené do cache: ${imagePath}`);
        }
        
    } catch (error) {
        console.warn(`Cache save error for ${imagePath}:`, error);
    }
}

// ==========================================
// SPRÁVA CACHE
// ==========================================

/**
 * Vyčistenie starých verzií cache
 */
async function cleanOldCaches() {
    try {
        console.log('🧹 Čistím staré cache...');
        
        // Získaj všetky cache names
        const cacheNames = await caches.keys();
        
        // Vymaž všetky okrem aktuálnej verzie
        const deletionPromises = cacheNames
            .filter(cacheName => cacheName.startsWith('banik-jozino-') && cacheName !== CACHE_NAME)
            .map(cacheName => {
                console.log(`🗑️ Mažem starú cache: ${cacheName}`);
                return caches.delete(cacheName);
            });
        
        await Promise.all(deletionPromises);
        
        console.log('✅ Staré cache vyčistené');
        
    } catch (error) {
        console.warn('Chyba pri čistení cache:', error);
    }
}

/**
 * Kontrola veľkosti cache
 */
async function getCacheSize() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        
        let totalSize = 0;
        
        for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }
        
        // Konvertuj na MB
        const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        console.log(`📊 Cache veľkosť: ${sizeMB} MB (${keys.length} súborov)`);
        
        return { totalSize, itemCount: keys.length, sizeMB };
        
    } catch (error) {
        console.warn('Chyba pri získavaní veľkosti cache:', error);
        return { totalSize: 0, itemCount: 0, sizeMB: 0 };
    }
}

/**
 * Vymazanie celej cache (pre debugging)
 */
async function clearAllCache() {
    try {
        const deleted = await caches.delete(CACHE_NAME);
        console.log(deleted ? '✅ Cache vymazaná' : '❌ Cache sa nepodarilo vymazať');
        return deleted;
    } catch (error) {
        console.error('Chyba pri mazaní cache:', error);
        return false;
    }
}

// ==========================================
// PROGRESS TRACKING
// ==========================================

/**
 * Aktualizácia progress baru
 */
function updateProgress() {
    loadedResources++;
    
    // Vypočítaj percento
    const percentage = Math.round((loadedResources / totalResources) * 100);
    
    // Aktualizuj progress message
    updateLoadingMessage(`Načítavam... ${percentage}%`);
    
    // Detailný log každých 10%
    if (loadedResources % Math.ceil(totalResources / 10) === 0 || loadedResources === totalResources) {
        console.log(`📊 Progress: ${percentage}% (${loadedResources}/${totalResources})`);
    }
}

/**
 * Aktualizácia loading message
 */
function updateLoadingMessage(message) {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.textContent = message;
    }
}

/**
 * Skrytie loading screenu s animáciou
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        console.log('👋 Skrývam loading screen...');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            console.log('✅ Loading screen skrytý, stránka pripravená!');
        }, 500);
    }
}

// ==========================================
// POMOCNÉ FUNKCIE
// ==========================================

/**
 * Získanie prednačítaného obrázka
 */
function getPreloadedImage(imagePath) {
    return preloadedImages[imagePath] || null;
}

/**
 * Kontrola či je preloading dokončený
 */
function isPreloadingDone() {
    return isPreloadingComplete;
}

// ==========================================
// DEBUG FUNKCIE
// ==========================================

/**
 * Debug informácie o cache
 */
async function debugCacheInfo() {
    console.log('=== CACHE DEBUG INFO ===');
    console.log('Cache verzia:', CACHE_VERSION);
    console.log('Cache name:', CACHE_NAME);
    
    const size = await getCacheSize();
    console.log('Cache veľkosť:', size.sizeMB, 'MB');
    console.log('Počet súborov:', size.itemCount);
    
    console.log('Načítané obrázky v pamäti:', Object.keys(preloadedImages).length);
    console.log('Preloading dokončený:', isPreloadingComplete);
    console.log('========================');
}

// ==========================================
// EXPORT PRE POUŽITIE V INÝCH SÚBOROCH
// ==========================================

if (typeof window !== 'undefined') {
    window.startWorldsMenuPreloading = startWorldsMenuPreloading;
    window.getPreloadedImage = getPreloadedImage;
    window.isPreloadingDone = isPreloadingDone;
    window.preloadedImages = preloadedImages;
    
    // Debug funkcie
    window.debugCacheInfo = debugCacheInfo;
    window.clearAllCache = clearAllCache;
    window.getCacheSize = getCacheSize;
}

console.log('✅ WorldsMenu Preloader načítaný a pripravený');