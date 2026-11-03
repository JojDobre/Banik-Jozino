
/**
 * Funkcia na získanie všetkých levelov konkrétneho sveta
 * @param {string} worldId - ID sveta
 * @returns {Array} - pole levelov daného sveta
 */
function getWorldLevels(worldId) {
    return LEVELS_CONFIG[worldId] || [];
}

/**
 * Funkcia na získanie konkrétneho levelu
 * @param {string} levelId - ID levelu
 * @returns {Object|null} - konfigurácia levelu alebo null
 */
function getLevelConfig(levelId) {
    for (const worldId in LEVELS_CONFIG) {
        const level = LEVELS_CONFIG[worldId].find(level => level.id === levelId);
        if (level) return level;
    }
    return null;
}

/**
 * Funkcia na získanie levelu podľa sveta a čísla levelu
 * @param {string} worldId - ID sveta
 * @param {number} levelNumber - číslo levelu
 * @returns {Object|null} - konfigurácia levelu alebo null
 */
function getLevelByNumber(worldId, levelNumber) {
    const worldLevels = getWorldLevels(worldId);
    return worldLevels.find(level => level.levelNumber === levelNumber) || null;
}

/**
 * Funkcia na získanie nasledujúceho levelu
 * @param {string} currentLevelId - ID aktuálneho levelu
 * @returns {Object|null} - konfigurácia nasledujúceho levelu alebo null
 */
function getNextLevel(currentLevelId) {
    const currentLevel = getLevelConfig(currentLevelId);
    if (!currentLevel) return null;
    
    return getLevelByNumber(currentLevel.worldId, currentLevel.levelNumber + 1);
}

/**
 * Funkcia na získanie predchádzajúceho levelu
 * @param {string} currentLevelId - ID aktuálneho levelu
 * @returns {Object|null} - konfigurácia predchádzajúceho levelu alebo null
 */
function getPreviousLevel(currentLevelId) {
    const currentLevel = getLevelConfig(currentLevelId);
    if (!currentLevel || currentLevel.levelNumber === 1) return null;
    
    return getLevelByNumber(currentLevel.worldId, currentLevel.levelNumber - 1);
}

/**
 * Funkcia na kontrolu, či je level odomknutý
 * @param {string} levelId - ID levelu
 * @returns {boolean} - true ak je level odomknutý
 */
function isLevelUnlocked(levelId) {
    const level = getLevelConfig(levelId);
    return level ? level.isUnlocked : false;
}

/**
 * Funkcia na získanie počtu levelov v svete
 * @param {string} worldId - ID sveta
 * @returns {number} - počet levelov v svete
 */
function getWorldLevelCount(worldId) {
    return getWorldLevels(worldId).length;
}

/**
 * Funkcia na filtrovanie levelov podľa typu hry
 * @param {string} worldId - ID sveta
 * @param {string} gameType - typ hry ('banik', 'pexeso', 'mario')
 * @returns {Array} - pole levelov s daným typom hry
 */
function getLevelsByGameType(worldId, gameType) {
    return getWorldLevels(worldId).filter(level => level.gameType === gameType);
}

// Export pre použitie v iných súboroch
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LEVELS_CONFIG,
        getWorldLevels,
        getLevelConfig,
        getLevelByNumber,
        getNextLevel,
        getPreviousLevel,
        isLevelUnlocked,
        getWorldLevelCount,
        getLevelsByGameType
    };
}