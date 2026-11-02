/**
 * Konfigurácia svetov pre logopedickú hru
 * Každý svet reprezentuje jedno písmeno/hlásku na precvičovanie
 * 
 * Štruktúra sveta:
 * - id: jedinečný identifikátor sveta
 * - name: názov sveta (písmeno/hláska)
 * - title: popisný názov sveta
 * - description: krátky popis sveta
 * - color: hlavná farba sveta (pre UI)
 * - icon: ikona sveta (cesta k obrázku)
 * - difficulty: obtiažnosť (1-5, kde 5 je najťažšia)
 * - unlockRequirement: podmienka na odomknutie sveta
 * - totalLevels: celkový počet levelov v svete
 * - gameTypes: typy hier dostupné v tomto svete
 */

const WORLDS_CONFIG = [
    {
        id: 'world_r',
        name: 'R',
        title: 'R',
        description: 'Precvičuj výslovnosť písmena R s rôznymi slovami',
        color: '#FF6B6B', 
        icon: 'images/worlds/world_r.png',
        difficulty: 4,
        unlockRequirement: null, 
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true 
    },
    {
        id: 'world_l',
        name: 'L',
        title: 'Svet písmena L',
        description: 'Nauč sa správne vyslovovať písmeno L',
        color: '#4ECDC4', 
        icon: 'images/worlds/world_l.png',
        difficulty: 4,
        unlockRequirement: null,
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    },
    {
        id: 'world_c',
        name: 'C',
        title: 'Svet písmena C',
        description: 'Precvičuj ostré písmeno C',
        color: '#FFEAA7',
        icon: 'images/worlds/world_c.png',
        difficulty: 3,
        unlockRequirement: null,
        /*unlockRequirement: {
            worldId: 'world_z',
            minStars: 22
        },*/
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    },
    {
        id: 'world_z',
        name: 'Z',
        title: 'Svet písmena Z',
        description: 'Zvládni buzivé písmeno Z',
        color: '#96CEB4', 
        icon: 'images/worlds/world_z.png',
        difficulty: 3,
        /*unlockRequirement: {
            worldId: 'world_s',
            minStars: 20
        },*/
        unlockRequirement: null,
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    },
    {
        id: 'world_s',
        name: 'S',
        title: 'Svet písmena S',
        description: 'Precvičuj sykavky s písmenom S',
        color: '#45B7D1', 
        icon: 'images/worlds/world_s.png',
        difficulty: 3,
        unlockRequirement: null,
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    },
    {
        id: 'world_ch',
        name: 'Č',
        title: 'Svet písmena Č',
        description: 'Čvachtaj s písmenom Č',
        color: '#74B9FF', 
        icon: 'images/worlds/world_ch.png',
        difficulty: 4,
        unlockRequirement: null,
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    },
    {
        id: 'world_zh',
        name: 'Ž',
        title: 'Svet písmena Ž',
        description: 'Žuži s písmenom Ž',
        color: '#FF9FF3', 
        icon: 'images/worlds/world_zh.png',
        difficulty: 4,
        unlockRequirement: null,
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    },
    {
        id: 'world_sh',
        name: 'Š',
        title: 'Svet písmena Š',
        description: 'Šušti s písmenom Š',
        color: '#DDA0DD', 
        icon: 'images/worlds/world_sh.png',
        difficulty: 4,
        unlockRequirement: null,
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    },
    {
        id: 'world_k',
        name: 'K',
        title: 'Svet písmena K',
        description: 'Klopkaj s písmenom K',
        color: '#00B894', 
        icon: 'images/worlds/world_k.png',
        difficulty: 2,
        unlockRequirement: null,
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    },
    {
        id: 'world_g',
        name: 'G',
        title: 'Svet písmena G',
        description: 'Grgaj s písmenom G',
        color: '#E84393', 
        icon: 'images/worlds/world_g.png',
        difficulty: 2,
        unlockRequirement: null,
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    },
    {
        id: 'world_d',
        name: 'D',
        title: 'Svet písmena D',
        description: 'Dumaj s D',
        color: '#5c1f34', 
        icon: 'images/worlds/world_d.png',
        difficulty: 2,
        unlockRequirement: null,
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    },
    {
        id: 'world_t',
        name: 'T',
        title: 'Svet písmena T',
        description: 'Tipuj s T',
        color: '#e4970a', 
        icon: 'images/worlds/world_t.png',
        difficulty: 2,
        unlockRequirement: null,
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    },
    {
        id: 'world_n',
        name: 'N',
        title: 'Svet písmena N',
        description: 'Nafkaj s N',
        color: '#3628fa', 
        icon: 'images/worlds/world_n.png',
        difficulty: 2,
        unlockRequirement: null,
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    },
    {
        id: 'world_dh',
        name: 'Ď',
        title: 'Svet písmena Ď',
        description: 'Ďabaj s mäkkým písmenom Ď',
        color: '#FD79A8', // tmavoružová
        icon: 'images/worlds/world_dh.png',
        difficulty: 3,
        unlockRequirement: null,
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    },
    {
        id: 'world_th',
        name: 'Ť',
        title: 'Svet písmena Ť',
        description: 'Ťukaj s mäkkým písmenom Ť',
        color: '#FDCB6E', // oranžová
        icon: 'images/worlds/world_th.png',
        difficulty: 3,
        unlockRequirement: null,
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    },
    {
        id: 'world_nh',
        name: 'Ň',
        title: 'Svet písmena Ň',
        description: 'Ňafaj s mäkkým písmenom Ň',
        color: '#A29BFE',
        icon: 'images/worlds/world_nh.png',
        difficulty: 3,
        unlockRequirement: null,
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    }
    
];

/**
 * Funkcia na získanie konfigurácie konkrétneho sveta
 * @param {string} worldId - ID sveta
 * @returns {Object|null} - konfigurácia sveta alebo null ak sa nenašiel
 */
function getWorldConfig(worldId) {
    return WORLDS_CONFIG.find(world => world.id === worldId) || null;
}

/**
 * Funkcia na získanie všetkých svetov
 * @returns {Array} - pole všetkých svetov
 */
function getAllWorlds() {
    return WORLDS_CONFIG;
}

/**
 * Funkcia na získanie odomknutých svetov
 * @returns {Array} - pole odomknutých svetov
 */
function getUnlockedWorlds() {
    return WORLDS_CONFIG.filter(world => world.isUnlocked);
}

/**
 * Funkcia na kontrolu, či je svet odomknutý
 * @param {string} worldId - ID sveta
 * @returns {boolean} - true ak je svet odomknutý
 */
function isWorldUnlocked(worldId) {
    const world = getWorldConfig(worldId);
    return world ? world.isUnlocked : false;
}

// Export pre použitie v iných súboroch
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WORLDS_CONFIG,
        getWorldConfig,
        getAllWorlds,
        getUnlockedWorlds,
        isWorldUnlocked
    };
}