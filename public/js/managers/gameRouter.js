/**
 * GAME ROUTER
 * Správa navigácie medzi hrami a presmerovávania s parametrami
 */

class GameRouter {
    constructor() {
        this.init();
    }

    /**
     * Inicializácia routera
     */
    init() {
        console.log('Inicializujem GameRouter...');
        
        // Zaregistruj ako globálnu premennú
        window.gameRouter = this;
        
        console.log('GameRouter inicializovaný');
    }

    /**
     * Spustenie konkrétneho levelu
     * @param {string} worldId - ID sveta
     * @param {string} levelId - ID levelu
     */
    startLevel(worldId, levelId) {
        console.log(`Spúšťam level ${levelId} zo sveta ${worldId}`);
        
        try {
            // Získaj konfiguráciu levelu
            const levelConfig = this.getLevelConfig(levelId);
            if (!levelConfig) {
                throw new Error(`Level ${levelId} neexistuje`);
            }

            // Ulož aktuálny level do sessionStorage pre rýchly prístup
            this.setCurrentLevel(worldId, levelId);
            
            // Presmeruj na správnu hru podľa typu
            this.redirectToGame(levelConfig.gameType, worldId, levelId);
            
        } catch (error) {
            console.error('Chyba pri spúšťaní levelu:', error);
            alert(`Chyba pri spúšťaní levelu: ${error.message}`);
        }
    }

    /**
     * Získanie konfigurácie levelu
     * @param {string} levelId - ID levelu
     * @returns {Object|null} - konfigurácia levelu
     */
    getLevelConfig(levelId) {
        if (typeof getLevelConfig === 'function') {
            return getLevelConfig(levelId);
        }
        
        console.error('Funkcia getLevelConfig nie je dostupná');
        return null;
    }

    /**
     * Uloženie aktuálneho levelu
     * @param {string} worldId - ID sveta
     * @param {string} levelId - ID levelu
     */
    setCurrentLevel(worldId, levelId) {
        const currentLevel = {
            worldId: worldId,
            levelId: levelId,
            startTime: new Date().toISOString(),
            attempts: 0
        };

        // Ulož do sessionStorage (pre aktuálnu session)
        sessionStorage.setItem('currentLevel', JSON.stringify(currentLevel));
        
        // Ulož aj do localStorage (pre trvalé uloženie)
        localStorage.setItem('lastPlayedLevel', JSON.stringify(currentLevel));
        
        console.log('Aktuálny level uložený:', currentLevel);
    }

    /**
     * Získanie aktuálneho levelu
     * @returns {Object|null} - aktuálny level alebo null
     */
    getCurrentLevel() {
        try {
            const currentLevelData = sessionStorage.getItem('currentLevel');
            return currentLevelData ? JSON.parse(currentLevelData) : null;
        } catch (error) {
            console.error('Chyba pri načítaní aktuálneho levelu:', error);
            return null;
        }
    }

    /**
     * Presmerovanie na správnu hru
     * @param {string} gameType - typ hry ('banik', 'pexeso', 'mario')
     * @param {string} worldId - ID sveta
     * @param {string} levelId - ID levelu
     */
    redirectToGame(gameType, worldId, levelId) {
        console.log(`Presmerovávam na hru typu: ${gameType}`);
        
        const gameUrls = {
            'banik': this.buildGameUrl(window.BJRoute ? BJRoute.banikPage() : 'game.html', worldId, levelId),
            'pexeso': this.buildGameUrl('pexeso.html', worldId, levelId),
            'mario': this.buildGameUrl('superjozino.html', worldId, levelId)
        };
        
        const url = gameUrls[gameType];
        if (url) {
            console.log(`Presmerovávam na: ${url}`);
            window.location.href = url;
        } else {
            throw new Error(`Neznámy typ hry: ${gameType}`);
        }
    }

    /**
     * Vytvorenie URL pre hru s parametrami
     * @param {string} baseUrl - základná URL hry
     * @param {string} worldId - ID sveta
     * @param {string} levelId - ID levelu
     * @returns {string} - kompletná URL s parametrami
     */
    buildGameUrl(baseUrl, worldId, levelId) {
        const params = new URLSearchParams({
            world: worldId,
            level: levelId,
            timestamp: Date.now() // Zabráni cachingu
        });
        
        return `${baseUrl}?${params.toString()}`;
    }

    /**
     * Dokončenie levelu a presmerovanie späť
     * @param {string} worldId - ID sveta
     * @param {string} levelId - ID levelu
     * @param {Object} results - výsledky levelu (stars, time, atď.)
     */
    completeLevel(worldId, levelId, results) {
        console.log(`Dokončujem level ${levelId}:`, results);
        
        try {
            // Aktualizuj pokrok v progressManageri
            if (window.progressManager) {
                window.progressManager.updateLevelProgress(worldId, levelId, {
                    stars: results.stars || 0,
                    time: results.time || null,
                    completed: true
                });
                
                console.log('Pokrok levelu aktualizovaný');
            }
            
            // Vymaž aktuálny level
            this.clearCurrentLevel();
            
            // Zobraz výsledky (ak je potrebné)
            if (results.showResults !== false) {
                this.showLevelResults(worldId, levelId, results);
            }
            
        } catch (error) {
            console.error('Chyba pri dokončovaní levelu:', error);
        }
    }

    /**
     * Zobrazenie výsledkov levelu
     * @param {string} worldId - ID sveta
     * @param {string} levelId - ID levelu
     * @param {Object} results - výsledky
     */
    showLevelResults(worldId, levelId, results) {
        const levelConfig = this.getLevelConfig(levelId);
        const worldConfig = typeof getWorldConfig === 'function' ? getWorldConfig(worldId) : null;
        
        // Jednoduchý alert s výsledkami (môže sa nahradiť lepším UI)
        const message = `
Level dokončený!

${levelConfig ? levelConfig.name : 'Level'} 
Svet: ${worldConfig ? worldConfig.title : worldId}

Hviezdy: ${results.stars || 0}/3
${results.time ? `Čas: ${this.formatTime(results.time)}` : ''}

Chceš pokračovať ďalším levelom alebo sa vrátiť na výber levelov?
        `.trim();
        
        const continueNext = confirm(message + '\n\nOK = Ďalší level, Zrušiť = Výber levelov');
        
        if (continueNext) {
            this.goToNextLevel(worldId, levelId);
        } else {
            this.returnToLevelSelector(worldId);
        }
    }

    /**
     * Prechod na ďalší level
     * @param {string} worldId - ID sveta
     * @param {string} currentLevelId - ID aktuálneho levelu
     */
    goToNextLevel(worldId, currentLevelId) {
        console.log(`Hľadám ďalší level po ${currentLevelId}`);
        
        try {
            // Získaj ďalší level
            const nextLevel = typeof getNextLevel === 'function' ? getNextLevel(currentLevelId) : null;
            
            if (nextLevel && nextLevel.worldId === worldId) {
                // Skontroluj, či je ďalší level odomknutý
                if (window.progressManager) {
                    const levelProgress = window.progressManager.getLevelProgress(worldId, nextLevel.id);
                    if (levelProgress && levelProgress.isUnlocked) {
                        this.startLevel(worldId, nextLevel.id);
                        return;
                    }
                }
            }
            
            // Ak nie je ďalší level, vráť sa na level selector
            console.log('Nie je dostupný ďalší level, vraciam sa na level selector');
            this.returnToLevelSelector(worldId);
            
        } catch (error) {
            console.error('Chyba pri hľadaní ďalšieho levelu:', error);
            this.returnToLevelSelector(worldId);
        }
    }

    /**
     * Návrat na level selector
     * @param {string} worldId - ID sveta
     */
    returnToLevelSelector(worldId) {
        console.log(`Vraciam sa na level selector pre svet: ${worldId}`);
        window.location.href = 'worldsmenu.html';
    }

    /**
     * Návrat na menu svetov
     */
    returnToWorldsMenu() {
        console.log('Vraciam sa na menu svetov');
        window.location.href = 'worldsmenu.html';
    }

    /**
     * Návrat na hlavné menu
     */
    returnToMainMenu() {
        console.log('Vraciam sa na hlavné menu');
        window.location.href = 'index.html';
    }

    /**
     * Reštart aktuálneho levelu
     * @param {string} worldId - ID sveta
     * @param {string} levelId - ID levelu
     */
    restartLevel(worldId, levelId) {
        console.log(`Reštartujem level ${levelId}`);
        
        // Aktualizuj počet pokusov
        const currentLevel = this.getCurrentLevel();
        if (currentLevel) {
            currentLevel.attempts = (currentLevel.attempts || 0) + 1;
            sessionStorage.setItem('currentLevel', JSON.stringify(currentLevel));
        }
        
        // Spusti level znova
        this.startLevel(worldId, levelId);
    }

    /**
     * Vymazanie aktuálneho levelu
     */
    clearCurrentLevel() {
        sessionStorage.removeItem('currentLevel');
        console.log('Aktuálny level vymazaný');
    }

    /**
     * Formátovanie času
     * @param {number} seconds - čas v sekundách
     * @returns {string} - formátovaný čas
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Získanie URL parametrov
     * @returns {URLSearchParams} - URL parametre
     */
    getUrlParams() {
        return new URLSearchParams(window.location.search);
    }

    /**
     * Načítanie levelu z URL parametrov
     * @returns {Object|null} - level data z URL alebo null
     */
    loadLevelFromUrl() {
        const params = this.getUrlParams();
        const worldId = params.get('world');
        const levelId = params.get('level');
        
        if (worldId && levelId) {
            console.log(`Načítavam level z URL: ${levelId} (svet: ${worldId})`);
            
            // Ulož ako aktuálny level
            this.setCurrentLevel(worldId, levelId);
            
            return {
                worldId: worldId,
                levelId: levelId,
                levelConfig: this.getLevelConfig(levelId)
            };
        }
        
        return null;
    }

    /**
     * Kontrola, či je level platný a odomknutý
     * @param {string} worldId - ID sveta
     * @param {string} levelId - ID levelu
     * @returns {boolean} - true ak je level platný a odomknutý
     */
    isLevelAccessible(worldId, levelId) {
        try {
            const levelConfig = this.getLevelConfig(levelId);
            if (!levelConfig || levelConfig.worldId !== worldId) {
                return false;
            }
            
            if (window.progressManager) {
                const levelProgress = window.progressManager.getLevelProgress(worldId, levelId);
                return levelProgress && levelProgress.isUnlocked;
            }
            
            return false;
        } catch (error) {
            console.error('Chyba pri kontrole dostupnosti levelu:', error);
            return false;
        }
    }

    /**
     * Ošetrenie neplatného prístupu k levelu
     * @param {string} worldId - ID sveta
     * @param {string} levelId - ID levelu
     */
    handleInvalidLevelAccess(worldId, levelId) {
        console.warn(`Neplatný prístup k levelu: ${levelId} (svet: ${worldId})`);
        
        alert('Tento level nie je dostupný alebo nie je odomknutý!');
        
        // Presmeruj na level selector
        this.returnToLevelSelector(worldId);
    }

    /**
     * Inicializácia hry s level configom
     * Táto funkcia sa volá z hier pre načítanie konfigurácie
     * @returns {Object|null} - level config alebo null
     */
    initializeGameWithLevel() {
        console.log('Inicializujem hru s level configom...');
        
        const levelData = this.loadLevelFromUrl();
        if (!levelData) {
            console.warn('Žiadne level data v URL');
            return null;
        }
        
        const { worldId, levelId, levelConfig } = levelData;
        
        // Skontroluj dostupnosť levelu
        if (!this.isLevelAccessible(worldId, levelId)) {
            this.handleInvalidLevelAccess(worldId, levelId);
            return null;
        }
        
        console.log('Level úspešne načítaný:', levelConfig);
        return levelConfig;
    }

    /**
     * Získanie pokroku pre aktuálny level
     * @returns {Object|null} - pokrok levelu alebo null
     */
    getCurrentLevelProgress() {
        const currentLevel = this.getCurrentLevel();
        if (!currentLevel || !window.progressManager) {
            return null;
        }
        
        return window.progressManager.getLevelProgress(currentLevel.worldId, currentLevel.levelId);
    }

    /**
     * Debug funkcie
     */
    debug = {
        showCurrentLevel: () => {
            console.log('Aktuálny level:', this.getCurrentLevel());
        },
        
        simulateCompletion: (stars = 3, time = 120) => {
            const currentLevel = this.getCurrentLevel();
            if (currentLevel) {
                this.completeLevel(currentLevel.worldId, currentLevel.levelId, {
                    stars: stars,
                    time: time
                });
            } else {
                console.log('Žiadny aktuálny level');
            }
        },
        
        forceReturnToSelector: () => {
            const currentLevel = this.getCurrentLevel();
            if (currentLevel) {
                this.returnToLevelSelector(currentLevel.worldId);
            } else {
                this.returnToWorldsMenu();
            }
        }
    };
}

// Vytvor globálnu inštanciu po načítaní
document.addEventListener('DOMContentLoaded', () => {
    if (!window.gameRouter) {
        new GameRouter();
    }
});

// Export pre Node.js (ak je potrebný)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameRouter;
}