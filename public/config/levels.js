/**
 * Konfigurácia levelov pre logopedickú hru
 * Každý level má svoje špecifické nastavenia, slová na precvičovanie a obtiažnosť
 * 
 * Štruktúra levelu:
 * - id: jedinečný identifikátor levelu
 * - worldId: ID sveta, do ktorého level patří
 * - levelNumber: poradové číslo levelu v rámci sveta (1-20)
 * - name: názov levelu
 * - gameType: typ hry ('banik', 'pexeso', 'mario')
 * - difficulty: obtiažnosť levelu (1-5)
 * - words: pole slov na precvičovanie v tomto leveli
 * - gameConfig: špecifické nastavenia pre daný typ hry
 * - unlockRequirement: podmienka na odomknutie levelu
 * - timeLimit: časový limit v sekundách (null = bez limitu)
 * - minStarsToPass: minimálny počet hviezd potrebný na prejdenie levelu
 * - pozicia na y min 6 maxx 15. x min 0 max 15
 */

const LEVELS_CONFIG = {
    // ===============================
    // SVET R - Písmeno R
    // ===============================
    world_r: [
        {
            id: 'r_001',
            worldId: 'world_r',
            levelNumber: 1,
            name: 'Prvé R-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['rak', 'ryba', 'ruka'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 1,
                speechExercises: 1,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 12, y: 7 }
                ],
                golds: [
                    { x: 2, y: 9 }, 
					{ x: 5, y: 10 }, 
                    { x: 10, y: 13 },
                ],
                crystals: [
                    { x: 11, y: 9 }  
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'r_002',
            worldId: 'world_r',
            levelNumber: 2,
            name: 'Prvé R-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['rak', 'ryba', 'ruka', 'rád', 'drak'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 2,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 10 },
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 10, y: 8 }
                ],
                crystals: [
                    { x: 9, y: 7 },    
                    { x: 10, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_003',
            worldId: 'world_r',
            levelNumber: 3,
            name: 'Prvé R-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['rak', 'ryba', 'ruka', 'rosa', 'rád', 'drak'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 1,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  
                    { x: 12, y: 7 },  
                    { x: 10, y: 12 }
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 14, y: 9 },   
                    { x: 9, y: 10 },
                    { x: 10, y: 12 }
                ],
                crystals: [
                    { x: 1, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_004',
            worldId: 'world_r',
            levelNumber: 4,
            name: 'Prvé R-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['rak', 'ryba', 'ruka', 'rosa', 'rád', 'drak', 'traktor'],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 7 },  
                    { x: 9, y: 14 }
                ],
                golds: [
                    { x: 3, y: 9 },  
                    { x: 7, y: 8 },   
                    { x: 14, y: 6 }   
                ],
                crystals: [
					{ x: 4, y: 12 },
                    { x: 7, y: 11 }   
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_005',
            worldId: 'world_r',
            levelNumber: 5,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['ruka', 'rosa', 'rád', 'rok', 'drak', 'ráno'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 4,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 13, y: 8 }, 
                    { x: 9, y: 10 },  
                    { x: 1, y: 14 }
                ],
                golds: [
                    { x: 0, y: 9 },
                    { x: 3, y: 10 },					
                    { x: 7, y: 8 }   
                ],
                crystals: [
                    { x: 2, y: 10 },
                    { x: 6, y: 12 },
                    { x: 14, y: 14 },					
                    { x: 8, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_006',
            worldId: 'world_r',
            levelNumber: 6,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['rok', 'rak', 'ruka', 'traktor', 'ryba', 'rádio', 'ráno'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 7 }, 
                    { x: 10, y: 7 },  
                    { x: 2, y: 14 }
                ],
                golds: [
                    { x: 1, y: 9 },
                    { x: 10, y: 10 },
                    { x: 6, y: 7 },
                    { x: 3, y: 15 },					
                    { x: 15, y: 12 }   
                ],
                crystals: [
                    { x: 7, y: 11 },   
                    { x: 10, y: 15 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_007',
            worldId: 'world_r',
            levelNumber: 7,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['rok', 'rak', 'ruka', 'roh', 'ryba', 'rádio', 'ráno'],
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 10 },  
                    { x: 14, y: 14 }
                ],
                golds: [
                    { x: 5, y: 8 },   
                    { x: 7, y: 12 }  
                ],
                crystals: [   
                    { x: 10, y: 9 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_008',
            worldId: 'world_r',
            levelNumber: 8,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['ryba', 'rádio', 'ráno', 'rakva', 'rámus'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 10, y: 6 }, 
                    { x: 6, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 8, y: 12 },
                    { x: 1, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 15 },    
                    { x: 14, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_009',
            worldId: 'world_r',
            levelNumber: 9,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['rádio', 'ráno', 'rakva', 'rámus', 'párik'],
            gameConfig: {
				diamonds: 3,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 },
                    { x: 2, y: 9 }
                ],
                golds: [
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 0, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 11 },    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_008',
                minStars: 10
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_010',
            worldId: 'world_r',
            levelNumber: 10,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['ryba', 'rádio', 'ráno', 'rakva', 'rámus', 'rýchly'],
            gameConfig: {
				diamonds: 4,
                golds: 6,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  
                    { x: 10, y: 14 },
                    { x: 6, y: 8 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 1, y: 9 },
                    { x: 3, y: 8 },
                    { x: 5, y: 11 }
                ],
                crystals: [
                    { x: 14, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_009',
                minStars: 11
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_011',
            worldId: 'world_r',
            levelNumber: 11,
            name: 'Prvé Rka',
            gameType: 'banik',
            difficulty: 3,
            words: ['rámus', 'rýchly', 'rakva', 'raketa'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 15, y: 14 },  
					{ x: 12, y: 15 },  
                    { x: 3, y: 12 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 4, y: 15 },
                    { x: 5, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 13 },    
                    { x: 6, y: 7 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_010',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_012',
            worldId: 'world_r',
            levelNumber: 12,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['ryba', 'rádio', 'ráno', 'rakva', 'rámus', 'rýchly', 'raketa'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 7 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 6, y: 9 },   
                    { x: 7, y: 11 },  
                    { x: 14, y: 12 },
                    { x: 4, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_011',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_013',
            worldId: 'world_r',
            levelNumber: 13,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['ryba', 'rádio', 'ráno', 'rakva', 'rámus', 'rýchly', 'raketa', 'rybár', 'králik'],
            gameConfig: {
                diamonds: 5,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 12 },  // diamant na pozícii 3,8
                    { x: 9, y: 11 },
                    { x: 10, y: 14 },
                    { x: 5, y: 9 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 14, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 10 },   // gold na pozícii 7,8
                    { x: 2, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_012',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_014',
            worldId: 'world_r',
            levelNumber: 14,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['rámus', 'rýchly', 'raketa', 'rybár', 'králik'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 10 },   
                    { x: 0, y: 12 },   
                    { x: 6, y: 13 },
                    { x: 14, y: 15 }
                ],
                crystals: [
                    { x: 9, y: 8 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_013',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_015',
            worldId: 'world_r',
            levelNumber: 15,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['brána', 'pravda', 'mravec', 'raketa', 'drak'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 10 }
                ],
                golds: [
                    { x: 0, y: 11 },   
                    { x: 4, y: 9 },  
                    { x: 7, y: 15 },
                    { x: 15, y: 13 }
                ],
                crystals: [
                    { x: 13, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_014',
                minStars: 16
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_016',
            worldId: 'world_r',
            levelNumber: 16,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 5,
            words: ['brána', 'pravda', 'mravec', 'rybár', 'tráva', 'králik', 'ryba', 'rádio', 'ráno', 'rakva', 'rak', 'ruka', 'rosa', 'rád', 'drak'],
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
				speechExercises: 4,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 8 },
					{ x: 12, y: 10 },
					{ x: 9, y: 12 },
					{ x: 4, y: 13 },					
                    { x: 15, y: 15 }
                ],
                golds: [
                    { x: 1, y: 8 },
					{ x: 2, y: 15 },
					{ x: 5, y: 13 },					
                    { x: 7, y: 9 },   
                    { x: 6, y: 15 },
                    { x: 13, y: 7 }
                ],
                crystals: [
                    { x: 10, y: 11 },  
                    { x: 2, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_015',
                minStars: 20
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
    ],
    world_l: [
        {
            id: 'l_001',
            worldId: 'world_l',
            levelNumber: 1,
            name: 'Prvé L-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['lano', 'lopta', 'list', 'les'],  // 4 slová pre začiatok
            gameConfig: {
                diamonds: 1,     // málo diamantov pre začiatok
                golds: 2,        // trochu viac goldov
                crystals: 1,     // jeden kryštál
                speechExercises: 1,
                listeningExercises: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 8, y: 5 }  // diamant v strede mapy
                ],
                golds: [
                    { x: 3, y: 2 },   // gold vľavo hore
                    { x: 13, y: 8 }   // gold vpravo dole
                ],
                crystals: [
                    { x: 10, y: 4 }   // kryštál vpravo
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'l_002',
            worldId: 'world_l',
            levelNumber: 2,
            name: 'Ľahké L-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['lano', 'lopta', 'list', 'les', 'líška', 'lyžica'],  // 6 slov
            gameConfig: {
                diamonds: 2,
                golds: 3,
                crystals: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 5, y: 3 },
                    { x: 11, y: 7 }
                ],
                golds: [
                    { x: 2, y: 5 },
                    { x: 8, y: 2 },
                    { x: 14, y: 9 }
                ],
                crystals: [
                    { x: 7, y: 6 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_003',
            worldId: 'world_l',
            levelNumber: 3,
            name: 'Lavička a lúka',
            gameType: 'banik',
            difficulty: 1,
            words: ['lopta', 'list', 'líška', 'lyžica', 'lavička', 'lúka', 'ľalia'],  // 7 slov
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 4 },
                    { x: 9, y: 8 },
                    { x: 13, y: 2 }
                ],
                golds: [
                    { x: 1, y: 7 },
                    { x: 6, y: 5 },
                    { x: 11, y: 3 }
                ],
                crystals: [
                    { x: 3, y: 9 },
                    { x: 14, y: 6 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_004',
            worldId: 'world_l',
            levelNumber: 4,
            name: 'Lampa a lekár',
            gameType: 'banik',
            difficulty: 1,
            words: ['lopta', 'lúka', 'lavička', 'lyžica', 'ľalia', 'lampa',  'lekár'],  // 8 slov
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 3 },
                    { x: 8, y: 7 },
                    { x: 12, y: 5 }
                ],
                golds: [
                    { x: 5, y: 2 },
                    { x: 7, y: 9 },
                    { x: 10, y: 6 },
                    { x: 14, y: 4 }
                ],
                crystals: [
                    { x: 4, y: 8 },
                    { x: 11, y: 1 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_005',
            worldId: 'world_l',
            levelNumber: 5,
            name: 'Prvé opakovanie',  // opakovací level
            gameType: 'banik',
            difficulty: 2,
            words: ['lano', 'lopta', 'list', 'les', 'líška', 'lyžica', 'lavička', 'lúka', 'ľalia', 'lampa', 'lekár'],  // 12 slov - opakovanie
            gameConfig: {
                diamonds: 4,
                golds: 5,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },
                    { x: 6, y: 6 },
                    { x: 10, y: 4 },
                    { x: 13, y: 8 }
                ],
                golds: [
                    { x: 1, y: 5 },
                    { x: 5, y: 9 },
                    { x: 8, y: 3 },
                    { x: 11, y: 7 },
                    { x: 14, y: 2 }
                ],
                crystals: [
                    { x: 7, y: 8 },
                    { x: 12, y: 1 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_006',
            worldId: 'world_l',
            levelNumber: 6,
            name: 'Lavína a lietadlo',
            gameType: 'banik',
            difficulty: 2,
            words: ['lopta', 'lúka', 'lampa', 'lekár', 'líška', 'lavína', 'lietadlo', 'list', 'lev', 'lavička'],  // 10 slov
            gameConfig: {
                diamonds: 4,
                golds: 4,
                crystals: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 6 },
                    { x: 7, y: 2 },
                    { x: 9, y: 9 },
                    { x: 14, y: 5 }
                ],
                golds: [
                    { x: 4, y: 3 },
                    { x: 6, y: 7 },
                    { x: 11, y: 4 },
                    { x: 13, y: 9 }
                ],
                crystals: [
                    { x: 1, y: 8 },
                    { x: 8, y: 5 },
                    { x: 12, y: 2 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_007',
            worldId: 'world_l',
            levelNumber: 7,
            name: 'Leňochod a lízatko',
            gameType: 'banik',
            difficulty: 2,
            words: ['lopta', 'lúka', 'lavína', 'lietadlo', 'lev', 'lavička', 'leňochod', 'lupa', 'lúč', 'lízatko'],  // 10 slov
            gameConfig: {
                diamonds: 4,
                golds: 5,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 4 },
                    { x: 8, y: 8 },
                    { x: 10, y: 2 },
                    { x: 14, y: 7 }
                ],
                golds: [
                    { x: 1, y: 3 },
                    { x: 5, y: 6 },
                    { x: 7, y: 1 },
                    { x: 11, y: 9 },
                    { x: 13, y: 4 }
                ],
                crystals: [
                    { x: 6, y: 9 },
                    { x: 12, y: 6 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_008',
            worldId: 'world_l',
            levelNumber: 8,
            name: 'Lyže a letisko',
            gameType: 'banik',
            difficulty: 2,
            words: ['lopta', 'lietadlo', 'lupa', 'lúč', 'lízatko', 'lavína', 'lyže', 'pílka', 'letisko', 'pílka'],  // 10 slov
            gameConfig: {
                diamonds: 5,
                golds: 4,
                crystals: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 2 },
                    { x: 5, y: 7 },
                    { x: 9, y: 4 },
                    { x: 12, y: 8 },
                    { x: 14, y: 1 }
                ],
                golds: [
                    { x: 3, y: 5 },
                    { x: 7, y: 3 },
                    { x: 10, y: 9 },
                    { x: 13, y: 6 }
                ],
                crystals: [
                    { x: 4, y: 9 },
                    { x: 8, y: 6 },
                    { x: 11, y: 2 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_009',
            worldId: 'world_l',
            levelNumber: 9,
            name: 'Levanduľa a ľudina',
            gameType: 'banik',
            difficulty: 2,
            words: ['lopta', 'lúka', 'lietadlo', 'pílka', 'levanduľa', 'list', 'lavína', 'lízatko'],  // 10 slov
            gameConfig: {
                diamonds: 5,
                golds: 5,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 4 },
                    { x: 6, y: 2 },
                    { x: 8, y: 9 },
                    { x: 11, y: 5 },
                    { x: 14, y: 8 }
                ],
                golds: [
                    { x: 3, y: 7 },
                    { x: 5, y: 3 },
                    { x: 9, y: 6 },
                    { x: 12, y: 1 },
                    { x: 13, y: 9 }
                ],
                crystals: [
                    { x: 7, y: 7 },
                    { x: 10, y: 3 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_008',
                minStars: 8
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_010',
            worldId: 'world_l',
            levelNumber: 10,
            name: 'Veľké opakovanie',  // opakovací level - všetky slová z 1-9
            gameType: 'banik',
            difficulty: 3,
            words: ['lano', 'lopta', 'list', 'les', 'líška', 'lyžica', 'lavička', 'lúka', 'ľalia', 'lampa', 
                    'lúč', 'lekár', 'lavína', 'lietadlo', 'lev', 'leňochod', 'lupa', 'lízatko', 'lyže',  
                    'letisko', 'pílka', 'levanduľa'],  // 24 slov
            gameConfig: {
                diamonds: 6,
                golds: 6,
                crystals: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 3 },
                    { x: 4, y: 8 },
                    { x: 7, y: 5 },
                    { x: 10, y: 2 },
                    { x: 12, y: 7 },
                    { x: 14, y: 4 }
                ],
                golds: [
                    { x: 1, y: 6 },
                    { x: 5, y: 1 },
                    { x: 6, y: 9 },
                    { x: 9, y: 4 },
                    { x: 11, y: 8 },
                    { x: 13, y: 3 }
                ],
                crystals: [
                    { x: 3, y: 5 },
                    { x: 8, y: 7 },
                    { x: 15, y: 9 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_009',
                minStars: 9
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_011',
            worldId: 'world_l',
            levelNumber: 11,
            name: 'Lyžiar a lektvar',
            gameType: 'banik',
            difficulty: 3,
            words: ['lopta', 'lúka', 'lietadlo', 'lavička', 'lupa', 'pílka', 'levanduľa', 'lyžiar', 'lektvar'],  // 10 slov
            gameConfig: {
                diamonds: 5,
                golds: 5,
                crystals: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 1 },
                    { x: 6, y: 4 },
                    { x: 9, y: 8 },
                    { x: 11, y: 3 },
                    { x: 14, y: 6 }
                ],
                golds: [
                    { x: 2, y: 7 },
                    { x: 5, y: 5 },
                    { x: 8, y: 2 },
                    { x: 10, y: 9 },
                    { x: 13, y: 2 }
                ],
                crystals: [
                    { x: 4, y: 3 },
                    { x: 7, y: 6 },
                    { x: 12, y: 9 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_010',
                minStars: 10
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_012',
            worldId: 'world_l',
            levelNumber: 12,
            name: 'Laboratórium',
            gameType: 'banik',
            difficulty: 3,
            words: ['lopta', 'lúka', 'levanduľa', 'lektvar', 'lyžiar', 'laboratórium', 'lektor', 'lavína', 'lúčny', 'líška'],  // 10 slov
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 2 },
                    { x: 5, y: 8 },
                    { x: 8, y: 4 },
                    { x: 11, y: 7 },
                    { x: 13, y: 1 }
                ],
                golds: [
                    { x: 3, y: 6 },
                    { x: 4, y: 2 },
                    { x: 7, y: 9 },
                    { x: 9, y: 3 },
                    { x: 12, y: 5 },
                    { x: 14, y: 8 }
                ],
                crystals: [
                    { x: 6, y: 6 },
                    { x: 10, y: 1 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_011',
                minStars: 11
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_013',
            worldId: 'world_l',
            levelNumber: 13,
            name: 'Leporelo a lodička',
            gameType: 'banik',
            difficulty: 3,
            words: ['lopta', 'lúka', 'lektor', 'laboratórium', 'lúčny', 'levanduľa', 'leporelo', 'lodička', 'lízatko', 'lekáreň'],  // 10 slov
            gameConfig: {
                diamonds: 6,
                golds: 5,
                crystals: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 5 },
                    { x: 5, y: 2 },
                    { x: 7, y: 8 },
                    { x: 10, y: 4 },
                    { x: 12, y: 9 },
                    { x: 15, y: 6 }
                ],
                golds: [
                    { x: 3, y: 3 },
                    { x: 6, y: 7 },
                    { x: 9, y: 1 },
                    { x: 11, y: 6 },
                    { x: 14, y: 3 }
                ],
                crystals: [
                    { x: 4, y: 9 },
                    { x: 8, y: 5 },
                    { x: 13, y: 7 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_012',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_014',
            worldId: 'world_l',
            levelNumber: 14,
            name: 'Laborant a linkový',
            gameType: 'banik',
            difficulty: 3,
            words: ['lopta', 'lúka', 'leporelo', 'lodička', 'lekáreň', 'lavína', 'lektor', 'laborant', 'listnatý'],  // 10 slov
            gameConfig: {
                diamonds: 6,
                golds: 6,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 3 },
                    { x: 4, y: 7 },
                    { x: 7, y: 2 },
                    { x: 9, y: 9 },
                    { x: 12, y: 4 },
                    { x: 14, y: 8 }
                ],
                golds: [
                    { x: 2, y: 1 },
                    { x: 5, y: 5 },
                    { x: 8, y: 8 },
                    { x: 10, y: 3 },
                    { x: 11, y: 7 },
                    { x: 13, y: 2 }
                ],
                crystals: [
                    { x: 6, y: 3 },
                    { x: 15, y: 5 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_013',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_015',
            worldId: 'world_l',
            levelNumber: 15,
            name: 'Tretie opakovanie',  // opakovací level - všetky slová z 1-14
            gameType: 'banik',
            difficulty: 4,
            words: ['lano', 'lopta', 'list', 'les', 'líška', 'lyžica', 'lavička', 'lúka', 'ľalia', 'lampa',
                    'lúč', 'lekár', 'lavína', 'lietadlo', 'lev', 'leňochod', 'lupa', 'lízatko', 'lyže', 'leopard',
                    'letisko', 'pílka', 'levanduľa', 'lyžiar', 'lektvar', 'laboratórium', 'lektor', 'lúčny',
                    'leporelo', 'lodička', 'lekáreň', 'laborant', 'listnatý'],  // 35 slov
            gameConfig: {
                diamonds: 7,
                golds: 7,
                crystals: 4,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 2 },
                    { x: 4, y: 5 },
                    { x: 6, y: 8 },
                    { x: 8, y: 3 },
                    { x: 10, y: 6 },
                    { x: 12, y: 1 },
                    { x: 14, y: 9 }
                ],
                golds: [
                    { x: 1, y: 7 },
                    { x: 3, y: 4 },
                    { x: 5, y: 1 },
                    { x: 7, y: 6 },
                    { x: 9, y: 8 },
                    { x: 11, y: 3 },
                    { x: 13, y: 5 }
                ],
                crystals: [
                    { x: 2, y: 9 },
                    { x: 6, y: 2 },
                    { x: 10, y: 7 },
                    { x: 15, y: 4 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_014',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_016',
            worldId: 'world_l',
            levelNumber: 16,
            name: 'Liter a lievik',
            gameType: 'banik',
            difficulty: 4,
            words: ['lopta', 'lúka', 'laborant', 'listnatý', 'levanduľa', 'liter', 'lievik', 'lampa', 'lopúch'],  // 10 slov
            gameConfig: {
                diamonds: 6,
                golds: 6,
                crystals: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 6 },
                    { x: 5, y: 3 },
                    { x: 8, y: 7 },
                    { x: 10, y: 2 },
                    { x: 12, y: 8 },
                    { x: 15, y: 1 }
                ],
                golds: [
                    { x: 2, y: 4 },
                    { x: 4, y: 9 },
                    { x: 7, y: 1 },
                    { x: 9, y: 5 },
                    { x: 11, y: 9 },
                    { x: 14, y: 6 }
                ],
                crystals: [
                    { x: 6, y: 5 },
                    { x: 10, y: 8 },
                    { x: 13, y: 3 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_015',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        }
        /*{
            id: 'l_017',
            worldId: 'world_l',
            levelNumber: 17,
            name: 'Logopéd a lesník',
            gameType: 'banik',
            difficulty: 4,
            words: ['lopta', 'lúka', 'liter', 'lievik', 'lopúch', 'lekáreň', 'logopéd', 'listnatý', 'lavína', 'lavička'],  // 10 slov
            gameConfig: {
                diamonds: 7,
                golds: 5,
                crystals: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 5 },
                    { x: 4, y: 2 },
                    { x: 6, y: 9 },
                    { x: 8, y: 4 },
                    { x: 11, y: 7 },
                    { x: 13, y: 1 },
                    { x: 15, y: 8 }
                ],
                golds: [
                    { x: 3, y: 8 },
                    { x: 5, y: 4 },
                    { x: 9, y: 6 },
                    { x: 12, y: 3 },
                    { x: 14, y: 5 }
                ],
                crystals: [
                    { x: 2, y: 7 },
                    { x: 7, y: 3 },
                    { x: 10, y: 9 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_016',
                minStars: 16
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_018',
            worldId: 'world_l',
            levelNumber: 18,
            name: 'Lesník a ľudovosť',
            gameType: 'banik',
            difficulty: 4,
            words: ['lopta', 'lúka', 'logopéd', 'lopúch', 'liter', 'lievik', 'lesník', 'ľudovosť', 'laborant'],  // 10 slov
            gameConfig: {
                diamonds: 7,
                golds: 6,
                crystals: 4,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 3 },
                    { x: 4, y: 6 },
                    { x: 7, y: 1 },
                    { x: 9, y: 8 },
                    { x: 11, y: 4 },
                    { x: 13, y: 9 },
                    { x: 15, y: 2 }
                ],
                golds: [
                    { x: 1, y: 8 },
                    { x: 3, y: 5 },
                    { x: 6, y: 7 },
                    { x: 8, y: 3 },
                    { x: 10, y: 6 },
                    { x: 14, y: 7 }
                ],
                crystals: [
                    { x: 5, y: 9 },
                    { x: 9, y: 2 },
                    { x: 12, y: 5 },
                    { x: 15, y: 6 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_017',
                minStars: 17
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_019',
            worldId: 'world_l',
            levelNumber: 19,
            name: 'Predposledný level',
            gameType: 'banik',
            difficulty: 4,
            words: ['lopta', 'lúka', 'logopéd', 'laborant', 'ľudovosť', 'liter', 'listnatý', 'levanduľa', 'lampa', 'lúčny'],  // 10 slov
            gameConfig: {
                diamonds: 8,
                golds: 6,
                crystals: 4,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 2 },
                    { x: 3, y: 7 },
                    { x: 5, y: 3 },
                    { x: 7, y: 9 },
                    { x: 9, y: 5 },
                    { x: 11, y: 1 },
                    { x: 13, y: 6 },
                    { x: 15, y: 4 }
                ],
                golds: [
                    { x: 2, y: 5 },
                    { x: 4, y: 8 },
                    { x: 6, y: 1 },
                    { x: 10, y: 7 },
                    { x: 12, y: 3 },
                    { x: 14, y: 9 }
                ],
                crystals: [
                    { x: 3, y: 3 },
                    { x: 8, y: 6 },
                    { x: 11, y: 8 },
                    { x: 14, y: 2 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_018',
                minStars: 18
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_020',
            worldId: 'world_l',
            levelNumber: 20,
            name: 'Veľké finále L',  
            gameType: 'banik',
            difficulty: 5,
            words: ['lano', 'lopta', 'list', 'les', 'líška', 'lyžica', 'lavička', 'lúka', 'ľalia', 'lampa',
                    'lúč', 'lekár', 'lavína', 'lietadlo', 'lev', 'leňochod', 'lupa', 'lízatko', 'lyže',
                    'letisko', 'lilka', 'levanduľa', ľudia', 'lyžiar', 'lektvar', 'laboratórium', 'lektor', 'lúčny',
                    'leporelo', 'lodička', 'lekáreň', 'laborant', 'listnatý', 'liter', 'lievik', 'lopúch',
                    'logopéd', 'lesník', 'ľudovosť'],  
            gameConfig: {
                diamonds: 10,
                golds: 8,
                crystals: 5,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 4 },
                    { x: 2, y: 8 },
                    { x: 4, y: 1 },
                    { x: 5, y: 6 },
                    { x: 7, y: 3 },
                    { x: 9, y: 7 },
                    { x: 10, y: 2 },
                    { x: 12, y: 9 },
                    { x: 13, y: 5 },
                    { x: 15, y: 7 }
                ],
                golds: [
                    { x: 2, y: 2 },
                    { x: 3, y: 6 },
                    { x: 6, y: 8 },
                    { x: 8, y: 1 },
                    { x: 9, y: 4 },
                    { x: 11, y: 6 },
                    { x: 14, y: 3 },
                    { x: 15, y: 9 }
                ],
                crystals: [
                    { x: 4, y: 4 },
                    { x: 6, y: 5 },
                    { x: 8, y: 9 },
                    { x: 11, y: 3 },
                    { x: 13, y: 8 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_019',
                minStars: 19
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        }*/
    ],
    world_s: [
        {
            id: 's_001',
            worldId: 'world_s',
            levelNumber: 1,
            name: 'Prvé S-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['slnko', 'sova', 'seno', 'soľ'],  // 4 slová pre začiatok
            gameConfig: {
                diamonds: 1,     // málo diamantov pre začiatok
                golds: 2,        // trochu viac goldov
                crystals: 1,     // jeden kryštál
                speechExercises: 1,  // 1 slovo na vyslovenie
                listeningExercises: 1, // 1 slovo na počúvanie
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 7, y: 4 }  // diamant v strede mapy
                ],
                golds: [
                    { x: 4, y: 3 },   // gold vľavo
                    { x: 12, y: 7 }   // gold vpravo
                ],
                crystals: [
                    { x: 9, y: 6 }   // kryštál vpravo
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 's_002',
            worldId: 'world_s',
            levelNumber: 2,
            name: 'Suka a srdce',
            gameType: 'banik',
            difficulty: 1,
            words: ['slnko', 'sova', 'seno', 'soľ', 'silák', 'srdce'],  // 6 slov
            gameConfig: {
                diamonds: 2,
                golds: 3,
                crystals: 1,
                speechExercises: 1,  // stále 1 slovo
                listeningExercises: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 2 },
                    { x: 10, y: 8 }
                ],
                golds: [
                    { x: 3, y: 6 },
                    { x: 7, y: 4 },
                    { x: 13, y: 5 }
                ],
                crystals: [
                    { x: 11, y: 3 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_003',
            worldId: 'world_s',
            levelNumber: 3,
            name: 'Stôl a silák',
            gameType: 'banik',
            difficulty: 1,
            words: ['slnko', 'sova', 'seno', 'srdce', 'soľ', 'stôl', 'silák'],  // 7 slov
            gameConfig: {
                diamonds: 2,
                golds: 3,
                crystals: 2,
                speechExercises: 2,  // zvyšujeme na 2 slová
                listeningExercises: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 5, y: 5 },
                    { x: 12, y: 2 }
                ],
                golds: [
                    { x: 2, y: 8 },
                    { x: 8, y: 6 },
                    { x: 14, y: 4 }
                ],
                crystals: [
                    { x: 4, y: 3 },
                    { x: 10, y: 9 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_004',
            worldId: 'world_s',
            levelNumber: 4,
            name: 'Sitko a sviečka',
            gameType: 'banik',
            difficulty: 1,
            words: ['slnko', 'stôl', 'silák', 'sova', 'seno', 'srdce', 'sitko', 'sviečka'],  // 8 slov
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
                speechExercises: 2,  // 2 slová
                listeningExercises: 2,  // zvyšujeme aj posluch
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 4 },
                    { x: 9, y: 7 },
                    { x: 13, y: 3 }
                ],
                golds: [
                    { x: 6, y: 8 },
                    { x: 11, y: 5 },
                    { x: 2, y: 2 }
                ],
                crystals: [
                    { x: 7, y: 2 },
                    { x: 14, y: 8 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_005',
            worldId: 'world_s',
            levelNumber: 5,
            name: 'Prvé opakovanie',  // opakovací level
            gameType: 'banik',
            difficulty: 2,
            words: ['slnko', 'sova', 'seno', 'soľ', 'srdce', 'stôl', 'silák', 'sitko', 'sviečka'],  // 10 slov
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
                speechExercises: 3,  // zvyšujeme na 3 slová
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 6 },
                    { x: 10, y: 3 },
                    { x: 15, y: 9 }
                ],
                golds: [
                    { x: 2, y: 4 },
                    { x: 7, y: 7 },
                    { x: 12, y: 1 },
                    { x: 5, y: 9 }
                ],
                crystals: [
                    { x: 8, y: 5 },
                    { x: 13, y: 7 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_006',
            worldId: 'world_s',
            levelNumber: 6,
            name: 'Skala a smiech',
            gameType: 'banik',
            difficulty: 2,
            words: ['slnko', 'stôl', 'sitko', 'srdce', 'sviečka', 'skala', 'smiech', 'sneh', 'sliepka', 'slama'],  // 10 slov
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 3,
                speechExercises: 3,  // 3 slová
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 7 },
                    { x: 8, y: 2 },
                    { x: 14, y: 6 }
                ],
                golds: [
                    { x: 5, y: 4 },
                    { x: 9, y: 8 },
                    { x: 11, y: 2 },
                    { x: 2, y: 9 }
                ],
                crystals: [
                    { x: 6, y: 6 },
                    { x: 12, y: 4 },
                    { x: 4, y: 1 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_007',
            worldId: 'world_s',
            levelNumber: 7,
            name: 'Sestra a sídlo',
            gameType: 'banik',
            difficulty: 2,
            words: ['slnko', 'sneh', 'smiech', 'skala', 'sliepka', 'slama', 'sestra', 'sídlo', 'sklo', 'sladkosť'],  // 10 slov
            gameConfig: {
                diamonds: 4,
                golds: 4,
                crystals: 2,
                speechExercises: 3,
                listeningExercises: 3,  // zvyšujeme posluch
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 3 },
                    { x: 7, y: 9 },
                    { x: 11, y: 5 },
                    { x: 15, y: 2 }
                ],
                golds: [
                    { x: 4, y: 7 },
                    { x: 9, y: 3 },
                    { x: 13, y: 8 },
                    { x: 6, y: 1 }
                ],
                crystals: [
                    { x: 5, y: 5 },
                    { x: 10, y: 7 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_008',
            worldId: 'world_s',
            levelNumber: 8,
            name: 'Sklo a stavba',
            gameType: 'banik',
            difficulty: 2,
            words: ['slnko', 'sklo', 'sestra', 'sladkosť', 'sídlo', 'smiech', 'srdce', 'sliepka', 'skala', 'stavba'],  // 10 slov
            gameConfig: {
                diamonds: 4,
                golds: 5,
                crystals: 3,
                speechExercises: 4,  // zvyšujeme na 4
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 5 },
                    { x: 8, y: 8 },
                    { x: 12, y: 3 },
                    { x: 14, y: 9 }
                ],
                golds: [
                    { x: 1, y: 7 },
                    { x: 5, y: 2 },
                    { x: 9, y: 6 },
                    { x: 11, y: 9 },
                    { x: 15, y: 4 }
                ],
                crystals: [
                    { x: 4, y: 4 },
                    { x: 7, y: 7 },
                    { x: 13, y: 1 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_009',
            worldId: 'world_s',
            levelNumber: 9,
            name: 'Strom a stolička',
            gameType: 'banik',
            difficulty: 2,
            words: ['slnko', 'sklo', 'sladkosť', 'stavba', 'srdce', 'sneh', 'strom', 'sitko', 'stolička', 'sused'],  // 10 slov
            gameConfig: {
                diamonds: 4,
                golds: 5,
                crystals: 2,
                speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 6 },
                    { x: 6, y: 3 },
                    { x: 10, y: 8 },
                    { x: 13, y: 2 }
                ],
                golds: [
                    { x: 4, y: 9 },
                    { x: 7, y: 5 },
                    { x: 9, y: 1 },
                    { x: 12, y: 6 },
                    { x: 15, y: 7 }
                ],
                crystals: [
                    { x: 5, y: 7 },
                    { x: 11, y: 4 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_008',
                minStars: 8
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_010',
            worldId: 'world_s',
            levelNumber: 10,
            name: 'Druhé opakovanie',  // veľké opakovanie
            gameType: 'banik',
            difficulty: 3,
            words: ['slnko', 'sova', 'seno', 'soľ', 'srdce', 'stôl', 'silák', 'sitko', 'sviečka',
                    'skala', 'smiech', 'sneh', 'sliepka', 'slama', 'sestra', 'sídlo', 'sklo', 'sladkosť', 'stavba',
                    'strom', 'stolička', 'sused'],  // 23 slov
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 3,
                speechExercises: 5,  // 5 slov na vyslovenie
                listeningExercises: 4,  // 4 slová na počúvanie
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 3 },
                    { x: 6, y: 7 },
                    { x: 9, y: 2 },
                    { x: 12, y: 5 },
                    { x: 15, y: 8 }
                ],
                golds: [
                    { x: 1, y: 5 },
                    { x: 4, y: 8 },
                    { x: 7, y: 4 },
                    { x: 10, y: 6 },
                    { x: 13, y: 9 },
                    { x: 14, y: 1 }
                ],
                crystals: [
                    { x: 5, y: 6 },
                    { x: 8, y: 9 },
                    { x: 11, y: 3 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_009',
                minStars: 9
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_011',
            worldId: 'world_s',
            levelNumber: 11,
            name: 'Sila a súťaž',
            gameType: 'banik',
            difficulty: 3,
            words: ['slnko', 'sneh', 'strom', 'sladkosť', 'sestra', 'stavba', 'sused', 'smiech', 'sila', 'súťaž'],  // 10 slov
            gameConfig: {
                diamonds: 4,
                golds: 5,
                crystals: 3,
                speechExercises: 5,  // viac rečových cvičení
                listeningExercises: 4,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 4 },
                    { x: 7, y: 8 },
                    { x: 11, y: 1 },
                    { x: 14, y: 7 }
                ],
                golds: [
                    { x: 4, y: 2 },
                    { x: 6, y: 5 },
                    { x: 9, y: 9 },
                    { x: 12, y: 3 },
                    { x: 15, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 9 },
                    { x: 8, y: 3 },
                    { x: 13, y: 5 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_010',
                minStars: 10
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_012',
            worldId: 'world_s',
            levelNumber: 12,
            name: 'Skriňa a siréna',
            gameType: 'banik',
            difficulty: 3,
            words: ['slnko', 'súťaž', 'sila', 'smiech', 'sestra', 'skriňa', 'stolička', 'sliepka', 'sviečka', 'siréna'],  // 10 slov
            gameConfig: {
                diamonds: 4,
                golds: 6,
                crystals: 2,
                speechExercises: 5,
                listeningExercises: 4,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 6 },
                    { x: 8, y: 4 },
                    { x: 10, y: 9 },
                    { x: 15, y: 2 }
                ],
                golds: [
                    { x: 1, y: 3 },
                    { x: 5, y: 7 },
                    { x: 7, y: 2 },
                    { x: 9, y: 5 },
                    { x: 12, y: 8 },
                    { x: 14, y: 4 }
                ],
                crystals: [
                    { x: 6, y: 9 },
                    { x: 11, y: 6 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_011',
                minStars: 11
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_013',
            worldId: 'world_s',
            levelNumber: 13,
            name: 'Socha a sen',
            gameType: 'banik',
            difficulty: 3,
            words: ['slnko', 'súťaž', 'siréna', 'stolička', 'skriňa', 'sladkosť', 'socha', 'sen', 'srdce', 'skokan'],  // 10 slov
            gameConfig: {
                diamonds: 5,
                golds: 5,
                crystals: 3,
                speechExercises: 6,  // zvyšujeme na 6
                listeningExercises: 5,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 2 },
                    { x: 5, y: 8 },
                    { x: 9, y: 3 },
                    { x: 12, y: 7 },
                    { x: 14, y: 5 }
                ],
                golds: [
                    { x: 3, y: 5 },
                    { x: 7, y: 6 },
                    { x: 10, y: 1 },
                    { x: 13, y: 9 },
                    { x: 15, y: 3 }
                ],
                crystals: [
                    { x: 4, y: 7 },
                    { x: 8, y: 8 },
                    { x: 11, y: 4 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_012',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_014',
            worldId: 'world_s',
            levelNumber: 14,
            name: 'Skokan a svetlo',
            gameType: 'banik',
            difficulty: 3,
            words: ['slnko', 'sen', 'skriňa', 'skokan', 'siréna', 'súťaž', 'srdce', 'socha', 'stavba', 'svetlo'],  // 10 slov
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
                speechExercises: 6,
                listeningExercises: 5,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 4 },
                    { x: 6, y: 2 },
                    { x: 8, y: 7 },
                    { x: 11, y: 9 },
                    { x: 13, y: 3 }
                ],
                golds: [
                    { x: 3, y: 8 },
                    { x: 5, y: 5 },
                    { x: 7, y: 1 },
                    { x: 10, y: 5 },
                    { x: 12, y: 6 },
                    { x: 15, y: 8 }
                ],
                crystals: [
                    { x: 4, y: 3 },
                    { x: 14, y: 1 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_013',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_015',
            worldId: 'world_s',
            levelNumber: 15,
            name: 'Tretie opakovanie',  // opakovací level
            gameType: 'banik',
            difficulty: 4,
            words: ['slnko', 'sova', 'seno', 'soľ', 'srdce', 'stôl', 'silák', 'sitko', 'sviečka',
                    'skala', 'smiech', 'sneh', 'sliepka', 'slama', 'sestra', 'sídlo', 'sklo', 'sladkosť', 'stavba',
                    'strom', 'stolička', 'sused', 'sila', 'súťaž', 'skriňa', 'siréna', 'socha', 'sen', 'skokan',
                    'svetlo'],  // 31 slov
            gameConfig: {
                diamonds: 6,
                golds: 7,
                crystals: 4,
                speechExercises: 7,  // 7 slov
                listeningExercises: 6,  // 6 slov
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 5 },
                    { x: 4, y: 8 },
                    { x: 7, y: 3 },
                    { x: 10, y: 7 },
                    { x: 12, y: 2 },
                    { x: 15, y: 9 }
                ],
                golds: [
                    { x: 1, y: 2 },
                    { x: 3, y: 7 },
                    { x: 6, y: 4 },
                    { x: 8, y: 9 },
                    { x: 9, y: 1 },
                    { x: 13, y: 6 },
                    { x: 14, y: 3 }
                ],
                crystals: [
                    { x: 5, y: 1 },
                    { x: 7, y: 8 },
                    { x: 11, y: 5 },
                    { x: 15, y: 7 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_014',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_016',
            worldId: 'world_s',
            levelNumber: 16,
            name: 'Slanina a sladký',
            gameType: 'banik',
            difficulty: 4,
            words: ['slnko', 'svetlo', 'súťaž', 'sen', 'siréna', 'sneh', 'sliepka', 'smiech', 'slanina', 'sladký'],  // 10 slov
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 3,
                speechExercises: 7,
                listeningExercises: 6,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 4 },
                    { x: 6, y: 7 },
                    { x: 9, y: 2 },
                    { x: 11, y: 8 },
                    { x: 14, y: 5 }
                ],
                golds: [
                    { x: 2, y: 6 },
                    { x: 5, y: 3 },
                    { x: 8, y: 5 },
                    { x: 10, y: 9 },
                    { x: 12, y: 1 },
                    { x: 15, y: 4 }
                ],
                crystals: [
                    { x: 4, y: 9 },
                    { x: 7, y: 1 },
                    { x: 13, y: 7 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_015',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
    ],
    world_ch: [
        {
            id: 'ch_001',
            worldId: 'world_ch',
            levelNumber: 1,
            name: 'Prvé Č-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['čaj', 'čas', 'čiapka', 'čip'],
            gameConfig: {
                diamonds: 2,
                golds: 5,
                crystals: 3,
                speechExercises: 1,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  // diamant na pozícii 3,8
                    { x: 12, y: 7 }  // diamant na pozícii 12,7
                ],
                golds: [
                    { x: 2, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 8 },   // gold na pozícii 7,8
                    { x: 14, y: 6 },   // gold na pozícii 14,6
                    { x: 9, y: 8 },
                    { x: 10, y: 13 }
                ],
                crystals: [
                    { x: 9, y: 12 },    // kryštál na pozícii 9,7
                    { x: 3, y: 12 },
                    { x: 11, y: 9 }  
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'ch_002',
            worldId: 'world_ch',
            levelNumber: 2,
            name: 'Prvé Č-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['čiapka',  'čaj', 'česť', 'čip'],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
                speechExercises: 2,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  // diamant na pozícii 3,8
                    { x: 12, y: 7 },  // diamant na pozícii 12,7
                    { x: 7, y: 13 }
                ],
                golds: [
                    { x: 2, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 8 },   // gold na pozícii 7,8
                    { x: 10, y: 8 }
                ],
                crystals: [
                    { x: 9, y: 7 },    // kryštál na pozícii 9,7
                    { x: 10, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'ch_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_003',
            worldId: 'world_ch',
            levelNumber: 3,
            name: 'Prvé Č-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['čip', 'čaj', 'čas', 'čiapka'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 1,
                speechExercises: 2,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  // diamant na pozícii 3,8
                    { x: 12, y: 7 },  // diamant na pozícii 12,7
                    { x: 10, y: 12 }
                ],
                golds: [
                    { x: 2, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 8 },   // gold na pozícii 7,8
                    { x: 14, y: 6 },   // gold na pozícii 14,6
                    { x: 9, y: 8 },
                    { x: 10, y: 8 }
                ],
                crystals: [
                    { x: 9, y: 7 }    // kryštál na pozícii 9,7
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'ch_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_004',
            worldId: 'world_ch',
            levelNumber: 4,
            name: 'Prvé Č-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['čiapka', 'čaj', 'čip', 'čas', 'česť'], 
            gameConfig: {
                diamonds: 4,
                golds: 3,
                crystals: 1,
                speechExercises: 2,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 8 },  // diamant na pozícii 3,8
                    { x: 10, y: 7 },  // diamant na pozícii 12,7
                    { x: 4, y: 12 },
                    { x: 9, y: 14 }
                ],
                golds: [
                    { x: 3, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 8 },   // gold na pozícii 7,8
                    { x: 14, y: 6 }   // gold na pozícii 14,6
                ],
                crystals: [
                    { x: 7, y: 11 }    // kryštál na pozícii 9,7
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'ch_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_005',
            worldId: 'world_ch',
            levelNumber: 5,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['čaj', 'čip', 'česť', 'čiapka', 'čas', 'čelo'], 
            gameConfig: {
                diamonds: 4,
                golds: 2,
                crystals: 2,
                speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 4 },  // diamant na pozícii 3,8
                    { x: 9, y: 7 },  // diamant na pozícii 12,7
                    { x: 2, y: 10 },
                    { x: 1, y: 14 }
                ],
                golds: [
                    { x: 3, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 8 }   // gold na pozícii 7,8
                ],
                crystals: [
                    { x: 7, y: 11 },    // kryštál na pozícii 9,7
                    { x: 3, y: 6 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'ch_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_006',
            worldId: 'world_ch',
            levelNumber: 6,
            name: 'Prvé Č-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['čelo', 'čiapka', 'čiara', 'česať', 'čip', 'čaj'], 
            gameConfig: {
                diamonds: 4,
                golds: 2,
                crystals: 2,
                speechExercises: 2,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 5 },  // diamant na pozícii 3,8
                    { x: 4, y: 7 },  // diamant na pozícii 12,7
                    { x: 6, y: 10 },
                    { x: 2, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 12 }   // gold na pozícii 7,8
                ],
                crystals: [
                    { x: 7, y: 11 },    // kryštál na pozícii 9,7
                    { x: 10, y: 6 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'ch_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_007',
            worldId: 'world_ch',
            levelNumber: 6,
            name: 'Prvé Č-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['čelo', 'čiapka', 'čajník', 'čert', 'česať'], 
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 2,
                speechExercises: 2,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 5 },  // diamant na pozícii 3,8
                    { x: 4, y: 7 },  // diamant na pozícii 12,7
                    { x: 6, y: 10 },
                    { x: 2, y: 14 }
                ],
                golds: [
                    { x: 3, y: 8 },   // gold na pozícii 2,9
                    { x: 7, y: 12 }   // gold na pozícii 7,8
                ],
                crystals: [
                    { x: 7, y: 11 },    // kryštál na pozícii 9,7
                    { x: 10, y: 9 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'ch_006',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_008',
            worldId: 'world_ch',
            levelNumber: 6,
            name: 'Prvé Č-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['čitateľ', 'čerešňa', 'čarodejník', 'čajník'],
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 2,
                speechExercises: 2,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  // diamant na pozícii 3,8
                    { x: 6, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 11 },   // gold na pozícii 7,8
                    { x: 8, y: 12 },
                    { x: 1, y: 5 }
                ],
                crystals: [
                    { x: 9, y: 11 },    // kryštál na pozícii 9,7
                    { x: 14, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'ch_007',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
		{
            id: 'ch_009',
            worldId: 'world_ch',
            levelNumber: 9,
            name: 'Z – istota',
            gameType: 'banik',
            difficulty: 3,
            words: ['čitateľ', 'čerešňa', 'čarodejník', 'čaj', 'čiapka', 'čelo', 'činka', 'čokoláda', 'čajník'],
            gameConfig: {
                diamonds: 4,
                golds: 5,
                crystals: 2,
                speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 6 },
                    { x: 6, y: 3 },
                    { x: 10, y: 8 },
                    { x: 13, y: 2 }
                ],
                golds: [
                    { x: 4, y: 9 },
                    { x: 7, y: 5 },
                    { x: 9, y: 1 },
                    { x: 12, y: 6 },
                    { x: 15, y: 7 }
                ],
                crystals: [
                    { x: 5, y: 7 },
                    { x: 11, y: 4 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: { levelId: 'ch_008', minStars: 10 },
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_010',
            worldId: 'world_ch',
            levelNumber: 10,
            name: 'Majster Z',
            gameType: 'banik',
            difficulty: 3,
            words: ['čitateľ', 'čerešňa', 'čarodejník', 'čaj', 'čiapka', 
                'vysávač', 'cvičky', 'značka'
            ],
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 3,
                speechExercises: 5,  // 5 slov na vyslovenie
                listeningExercises: 4,  // 4 slová na počúvanie
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 3 },
                    { x: 6, y: 7 },
                    { x: 9, y: 2 },
                    { x: 12, y: 5 },
                    { x: 15, y: 8 }
                ],
                golds: [
                    { x: 1, y: 5 },
                    { x: 4, y: 8 },
                    { x: 7, y: 4 },
                    { x: 10, y: 6 },
                    { x: 13, y: 9 },
                    { x: 14, y: 1 }
                ],
                crystals: [
                    { x: 5, y: 6 },
                    { x: 8, y: 9 },
                    { x: 11, y: 3 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'ch_009',
                minStars: 9
            },
            minStarsToPass: 1,
            isUnlocked: false
        },
         {
            id: 'ch_011',
            worldId: 'world_ch',
            levelNumber: 11,
            name: 'Prvé zka',
            gameType: 'banik',
            difficulty: 3,
            words: ['čitateľ', 'čerešňa', 'činka', 'čokoláda', 'čajník',
                'vysávač', 'cvičky', 'značka'
            ],         
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 15, y: 14 },  
					{ x: 12, y: 15 },  
                    { x: 3, y: 12 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 4, y: 15 },
                    { x: 5, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 13 },    
                    { x: 6, y: 7 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'ch_010',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_012',
            worldId: 'world_ch',
            levelNumber: 12,
            name: 'Prvé z-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['zima', 'zub', 'zámok', 'zlato', 'zajac', 
                'zebra', 'zvon', 'záves', 'zajtra', 'zelenina', 'zemiak', 'záhrada'],  
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 7 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 6, y: 9 },   
                    { x: 7, y: 11 },  
                    { x: 14, y: 12 },
                    { x: 4, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'ch_011',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_013',
            worldId: 'world_ch',
            levelNumber: 13,
            name: 'Prvé z-tka',
            gameType: 'banik',
            difficulty: 4,
                        words: ['čitateľ', 'čerešňa', 'čarodejník', 'čaj', 'čiapka', 'čelo', 'činka', 'čokoláda', 'čajník',
                'vysávač', 'cvičky', 'značka'
            ],     
            gameConfig: {
                diamonds: 5,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 12 },  // diamant na pozícii 3,8
                    { x: 9, y: 11 },
                    { x: 10, y: 14 },
                    { x: 5, y: 9 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 14, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 10 },   // gold na pozícii 7,8
                    { x: 2, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'ch_012',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_014',
            worldId: 'world_ch',
            levelNumber: 14,
            name: 'Prvé z-čka',
            gameType: 'banik',
            difficulty: 4,
                        words: [ 'čaj', 'čiapka', 'čelo', 'činka', 'čokoláda', 'čajník',
                'vysávač', 'cvičky', 'značka'
            ], 
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 10 },   
                    { x: 0, y: 12 },   
                    { x: 6, y: 13 },
                    { x: 14, y: 15 }
                ],
                crystals: [
                    { x: 9, y: 8 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'ch_013',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_015',
            worldId: 'world_ch',
            levelNumber: 15,
            name: 'Prvé t-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['čip', 'čas', 'čitateľ', 'čerešňa', 'čarodejník', 'čaj', 'čiapka', 'čelo', 'činka', 'čokoláda', 'čajník',
                'vysávač', 'cvičky', 'značka'
            ],  
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 10 }
                ],
                golds: [
                    { x: 0, y: 11 },   
                    { x: 4, y: 9 },  
                    { x: 7, y: 15 },
                    { x: 15, y: 13 }
                ],
                crystals: [
                    { x: 13, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'ch_014',
                minStars: 16
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_016',
            worldId: 'world_ch',
            levelNumber: 16,
            name: 'Prvé t-čka',
            gameType: 'banik',
            difficulty: 5,
            words: ['čip', 'čas', 'čitateľ', 'čerešňa', 'čarodejník', 'čaj', 'čiapka', 'čelo', 'činka', 'čokoláda', 'čajník',
                'vysávač', 'cvičky', 'značka', 'čiara', 'česať', 'čert'
            ],
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
				speechExercises: 4,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 8 },
					{ x: 12, y: 10 },
					{ x: 9, y: 12 },
					{ x: 4, y: 13 },					
                    { x: 15, y: 15 }
                ],
                golds: [
                    { x: 1, y: 8 },
					{ x: 2, y: 15 },
					{ x: 5, y: 13 },					
                    { x: 7, y: 9 },   
                    { x: 6, y: 15 },
                    { x: 13, y: 7 }
                ],
                crystals: [
                    { x: 10, y: 11 },  
                    { x: 2, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'ch_015',
                minStars: 20
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        }
		
    ],
    world_z: [
        {
            id: 'z_001',
            worldId: 'world_z',
            levelNumber: 1,
            name: 'Prvé Z-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['zima', 'zub', 'zajac'],
            gameConfig: {
                diamonds: 1,     // málo diamantov pre začiatok
                golds: 2,        // trochu viac goldov
                crystals: 1,     // jeden kryštál
                speechExercises: 1,  // 1 slovo na vyslovenie
                listeningExercises: 1, // 1 slovo na počúvanie
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 7, y: 4 }  // diamant v strede mapy
                ],
                golds: [
                    { x: 4, y: 3 },   // gold vľavo
                    { x: 12, y: 7 }   // gold vpravo
                ],
                crystals: [
                    { x: 9, y: 6 }   // kryštál vpravo
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'z_002',
            worldId: 'world_z',
            levelNumber: 2,
            name: 'Začíname so Z',
            gameType: 'banik',
            difficulty: 1,
            words: ['zajac', 'zub', 'zima', 'zvon'],
            gameConfig: {
                diamonds: 2,
                golds: 3,
                crystals: 1,
                speechExercises: 1,  // stále 1 slovo
                listeningExercises: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 2 },
                    { x: 10, y: 8 }
                ],
                golds: [
                    { x: 3, y: 6 },
                    { x: 7, y: 4 },
                    { x: 13, y: 5 }
                ],
                crystals: [
                    { x: 11, y: 3 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'z_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_003',
            worldId: 'world_z',
            levelNumber: 3,
            name: 'Z na začiatku',
            gameType: 'banik',
            difficulty: 1,
            words: ['zebra', 'zajac', 'zvon', 'zima'],
            gameConfig: {
                diamonds: 2,
                golds: 3,
                crystals: 2,
                speechExercises: 2,  // zvyšujeme na 2 slová
                listeningExercises: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 5, y: 5 },
                    { x: 12, y: 2 }
                ],
                golds: [
                    { x: 2, y: 8 },
                    { x: 8, y: 6 },
                    { x: 14, y: 4 }
                ],
                crystals: [
                    { x: 4, y: 3 },
                    { x: 10, y: 9 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'z_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_004',
            worldId: 'world_z',
            levelNumber: 4,
            name: 'Z v slovách',
            gameType: 'banik',
            difficulty: 1,
            words: ['zámok', 'zebra', 'zvon', 'zlatý'],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
                speechExercises: 2,  // 2 slová
                listeningExercises: 2,  // zvyšujeme aj posluch
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 4 },
                    { x: 9, y: 7 },
                    { x: 13, y: 3 }
                ],
                golds: [
                    { x: 6, y: 8 },
                    { x: 11, y: 5 },
                    { x: 2, y: 2 }
                ],
                crystals: [
                    { x: 7, y: 2 },
                    { x: 14, y: 8 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'z_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_005',
            worldId: 'world_z',
            levelNumber: 5,
            name: 'Z-čka v akcii',
            gameType: 'banik',
            difficulty: 2,
            words: ['zajtra', 'zámok', 'zlatý', 'zima'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
                speechExercises: 3,  // zvyšujeme na 3 slová
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 6 },
                    { x: 10, y: 3 },
                    { x: 15, y: 9 }
                ],
                golds: [
                    { x: 2, y: 4 },
                    { x: 7, y: 7 },
                    { x: 12, y: 1 },
                    { x: 5, y: 9 }
                ],
                crystals: [
                    { x: 8, y: 5 },
                    { x: 13, y: 7 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'z_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_006',
            worldId: 'world_z',
            levelNumber: 6,
            name: 'Z v strede',
            gameType: 'banik',
            difficulty: 2,
            words: ['koza', 'slza', 'vozík', 'jazyk'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 3,
                speechExercises: 3,  // 3 slová
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 7 },
                    { x: 8, y: 2 },
                    { x: 14, y: 6 }
                ],
                golds: [
                    { x: 5, y: 4 },
                    { x: 9, y: 8 },
                    { x: 11, y: 2 },
                    { x: 2, y: 9 }
                ],
                crystals: [
                    { x: 6, y: 6 },
                    { x: 12, y: 4 },
                    { x: 4, y: 1 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'z_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_007',
            worldId: 'world_z',
            levelNumber: 7,
            name: 'Z v rôznych pozíciách',
            gameType: 'banik',
            difficulty: 2,
            words: ['zebra', 'slza', 'jazdec', 'zvonček'],
            gameConfig: {
                diamonds: 4,
                golds: 4,
                crystals: 2,
                speechExercises: 3,
                listeningExercises: 3,  // zvyšujeme posluch
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 3 },
                    { x: 7, y: 9 },
                    { x: 11, y: 5 },
                    { x: 15, y: 2 }
                ],
                golds: [
                    { x: 4, y: 7 },
                    { x: 9, y: 3 },
                    { x: 13, y: 8 },
                    { x: 6, y: 1 }
                ],
                crystals: [
                    { x: 5, y: 5 },
                    { x: 10, y: 7 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'z_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_008',
            worldId: 'world_z',
            levelNumber: 8,
            name: 'Dlhšie slová so Z',
            gameType: 'banik',
            difficulty: 2,
            words: ['zmrzlina', 'zvonček', 'záhradník'],
            gameConfig: {
                diamonds: 4,
                golds: 5,
                crystals: 3,
                speechExercises: 4,  // zvyšujeme na 4
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 5 },
                    { x: 8, y: 8 },
                    { x: 12, y: 3 },
                    { x: 14, y: 9 }
                ],
                golds: [
                    { x: 1, y: 7 },
                    { x: 5, y: 2 },
                    { x: 9, y: 6 },
                    { x: 11, y: 9 },
                    { x: 15, y: 4 }
                ],
                crystals: [
                    { x: 4, y: 4 },
                    { x: 7, y: 7 },
                    { x: 13, y: 1 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'z_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_009',
            worldId: 'world_z',
            levelNumber: 9,
            name: 'Z – istota',
            gameType: 'banik',
            difficulty: 3,
            words: ['záhradník', 'zmrzlina', 'zvedavý'],
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 3,
                speechExercises: 5,  // 5 slov na vyslovenie
                listeningExercises: 4,  // 4 slová na počúvanie
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 3 },
                    { x: 6, y: 7 },
                    { x: 9, y: 2 },
                    { x: 12, y: 5 },
                    { x: 15, y: 8 }
                ],
                golds: [
                    { x: 1, y: 5 },
                    { x: 4, y: 8 },
                    { x: 7, y: 4 },
                    { x: 10, y: 6 },
                    { x: 13, y: 9 },
                    { x: 14, y: 1 }
                ],
                crystals: [
                    { x: 5, y: 6 },
                    { x: 8, y: 9 },
                    { x: 11, y: 3 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'z_008',
                minStars: 9
            },
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_010',
            worldId: 'world_z',
            levelNumber: 10,
            name: 'Majster Z',
            gameType: 'banik',
            difficulty: 3,
            words: ['zmrzlina', 'zvedavý', 'záhrada', 'zvonček'],
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 3,
                speechExercises: 5,  // 5 slov na vyslovenie
                listeningExercises: 4,  // 4 slová na počúvanie
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 3 },
                    { x: 6, y: 7 },
                    { x: 9, y: 2 },
                    { x: 12, y: 5 },
                    { x: 15, y: 8 }
                ],
                golds: [
                    { x: 1, y: 5 },
                    { x: 4, y: 8 },
                    { x: 7, y: 4 },
                    { x: 10, y: 6 },
                    { x: 13, y: 9 },
                    { x: 14, y: 1 }
                ],
                crystals: [
                    { x: 5, y: 6 },
                    { x: 8, y: 9 },
                    { x: 11, y: 3 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'z_009',
                minStars: 9
            },
            unlockRequirement: { levelId: 'z_009', minStars: 11 },
            minStarsToPass: 1,
            isUnlocked: false
        },
         {
            id: 'z_011',
            worldId: 'world_z',
            levelNumber: 11,
            name: 'Prvé zka',
            gameType: 'banik',
            difficulty: 3,
            words: ['zima', 'zub', 'zámok', 'zlato', 'zajac', 
                'zebra', 'zvon', 'záves', 'zajtra', 'zelenina'],             
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 15, y: 14 },  
					{ x: 12, y: 15 },  
                    { x: 3, y: 12 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 4, y: 15 },
                    { x: 5, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 13 },    
                    { x: 6, y: 7 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'z_010',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_012',
            worldId: 'world_z',
            levelNumber: 12,
            name: 'Prvé z-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['zima', 'zub', 'zámok', 'zlato', 'zajac', 
                'zebra', 'zvon', 'záves', 'zajtra', 'zelenina', 'zemiak', 'záhrada'],  
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 7 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 6, y: 9 },   
                    { x: 7, y: 11 },  
                    { x: 14, y: 12 },
                    { x: 4, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'z_011',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_013',
            worldId: 'world_z',
            levelNumber: 13,
            name: 'Prvé z-tka',
            gameType: 'banik',
            difficulty: 4,
            words: ['zima', 'zub', 'zámok', 'zlato', 'zajac', 
                'zebra', 'zvon', 'záves', 'zajtra', 'zelenina', 'zemiak', 'záhrada', 'záchod'],       
            gameConfig: {
                diamonds: 5,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 12 },  // diamant na pozícii 3,8
                    { x: 9, y: 11 },
                    { x: 10, y: 14 },
                    { x: 5, y: 9 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 14, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 10 },   // gold na pozícii 7,8
                    { x: 2, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'z_012',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_014',
            worldId: 'world_z',
            levelNumber: 14,
            name: 'Prvé z-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['zima', 'zub', 'zámok', 'zlato', 'zajac', 
                'zebra', 'zvon', 'záves', 'zajtra', 'zelenina', 'zemiak', 'záhrada', 'záchod', 'zvieratá', 'zelené'],  
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 10 },   
                    { x: 0, y: 12 },   
                    { x: 6, y: 13 },
                    { x: 14, y: 15 }
                ],
                crystals: [
                    { x: 9, y: 8 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'z_013',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_015',
            worldId: 'world_z',
            levelNumber: 15,
            name: 'Prvé t-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['zima', 'zub', 'zámok', 'zlato', 'zajac', 
                'zebra', 'zvon', 'záves', 'zajtra', 'zelenina', 'zemiak', 'záhrada', 'záchod', 'zvieratá'],  
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 10 }
                ],
                golds: [
                    { x: 0, y: 11 },   
                    { x: 4, y: 9 },  
                    { x: 7, y: 15 },
                    { x: 15, y: 13 }
                ],
                crystals: [
                    { x: 13, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'z_014',
                minStars: 16
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_016',
            worldId: 'world_z',
            levelNumber: 16,
            name: 'Prvé t-čka',
            gameType: 'banik',
            difficulty: 5,
            words: ['zima', 'zub', 'zámok', 'zlato', 'zajac', 
                'zebra', 'zvon', 'záves', 'zajtra', 'zelenina', 'zemiak', 'záhrada', 'záchod', 'zvieratá', 'zmrzlina', 'zvedavý'],  
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
				speechExercises: 4,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 8 },
					{ x: 12, y: 10 },
					{ x: 9, y: 12 },
					{ x: 4, y: 13 },					
                    { x: 15, y: 15 }
                ],
                golds: [
                    { x: 1, y: 8 },
					{ x: 2, y: 15 },
					{ x: 5, y: 13 },					
                    { x: 7, y: 9 },   
                    { x: 6, y: 15 },
                    { x: 13, y: 7 }
                ],
                crystals: [
                    { x: 10, y: 11 },  
                    { x: 2, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'z_015',
                minStars: 20
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        }
    ],
    world_c: [
        {
            id: 'c_001',
            worldId: 'world_c',
            levelNumber: 1,
            name: 'Prvé C-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['palec', 'valec', 'cena', 'opica'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 1,
                speechExercises: 1,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 12, y: 7 }
                ],
                golds: [
                    { x: 2, y: 9 }, 
					{ x: 5, y: 10 }, 
                    { x: 10, y: 13 },
                ],
                crystals: [
                    { x: 11, y: 9 }  
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'c_002',
            worldId: 'world_c',
            levelNumber: 2,
            name: 'Prvé C-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['palec', 'valec', 'cena', 'opica', 'cesta', 'polica', 'maco'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 2,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 10 },
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 10, y: 8 }
                ],
                crystals: [
                    { x: 9, y: 7 },    
                    { x: 10, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'c_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'c_003',
            worldId: 'world_c',
            levelNumber: 3,
            name: 'Prvé C-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['palec', 'valec', 'cena', 'opica', 'cesta', 'polica', 'maco'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 1,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  
                    { x: 12, y: 7 },  
                    { x: 10, y: 12 }
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 14, y: 9 },   
                    { x: 9, y: 10 },
                    { x: 10, y: 12 }
                ],
                crystals: [
                    { x: 1, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'c_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'c_004',
            worldId: 'world_c',
            levelNumber: 4,
            name: 'Prvé C-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['palec', 'valec', 'cena', 'opica', 'cesta', 'polica', 'maco', 'cesto'],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 7 },  
                    { x: 9, y: 14 }
                ],
                golds: [
                    { x: 3, y: 9 },  
                    { x: 7, y: 8 },   
                    { x: 14, y: 6 }   
                ],
                crystals: [
					{ x: 4, y: 12 },
                    { x: 7, y: 11 }   
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'c_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'c_005',
            worldId: 'worldc',
            levelNumber: 5,
            name: 'Prvé C-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['cesta', 'polica', 'maco', 'cesto', 'citrón'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 4,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 13, y: 8 }, 
                    { x: 9, y: 10 },  
                    { x: 1, y: 14 }
                ],
                golds: [
                    { x: 0, y: 9 },
                    { x: 3, y: 10 },					
                    { x: 7, y: 8 }   
                ],
                crystals: [
                    { x: 2, y: 10 },
                    { x: 6, y: 12 },
                    { x: 14, y: 14 },					
                    { x: 8, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'c_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'c_006',
            worldId: 'world_c',
            levelNumber: 6,
            name: 'Prvé C-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['palec', 'valec', 'cena', 'opica', 'cesta', 'polica', 'maco', 'cesto', 'citrón'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 7 }, 
                    { x: 10, y: 7 },  
                    { x: 2, y: 14 }
                ],
                golds: [
                    { x: 1, y: 9 },
                    { x: 10, y: 10 },
                    { x: 6, y: 7 },
                    { x: 3, y: 15 },					
                    { x: 15, y: 12 }   
                ],
                crystals: [
                    { x: 7, y: 11 },   
                    { x: 10, y: 15 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'c_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'c_007',
            worldId: 'world_c',
            levelNumber: 7,
            name: 'Prvé C-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['polica', 'maco', 'cesto', 'citrón', 'cirkus', 'cukor', 'pec'],
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 10 },  
                    { x: 14, y: 14 }
                ],
                golds: [
                    { x: 5, y: 8 },   
                    { x: 7, y: 12 }  
                ],
                crystals: [   
                    { x: 10, y: 9 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'c_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'c_008',
            worldId: 'world_c',
            levelNumber: 8,
            name: 'Prvé C-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['palec', 'valec', 'cena', 'opica', 'cesta', 'polica', 'maco', 'cesto', 'citrón', 'cirkus', 'cukor', 'pec'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 10, y: 6 }, 
                    { x: 6, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 8, y: 12 },
                    { x: 1, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 15 },    
                    { x: 14, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'c_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'c_009',
            worldId: 'world_c',
            levelNumber: 9,
            name: 'Prvé C-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['palec', 'valec', 'cena', 'opica', 'cesta', 'polica', 'maco', 'cesto', 'citrón', 'cirkus', 'cukor', 'pec'],
            gameConfig: {
				diamonds: 3,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 },
                    { x: 2, y: 9 }
                ],
                golds: [
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 0, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 11 },    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'c_008',
                minStars: 10
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'c_010',
            worldId: 'world_c',
            levelNumber: 10,
            name: 'Prvé C-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['palec', 'valec', 'cena', 'opica', 'cesta', 'polica', 'maco', 'cesto', 'citrón', 'cirkus', 'cukor', 'pec'],
            gameConfig: {
				diamonds: 4,
                golds: 6,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  
                    { x: 10, y: 14 },
                    { x: 6, y: 8 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 1, y: 9 },
                    { x: 3, y: 8 },
                    { x: 5, y: 11 }
                ],
                crystals: [
                    { x: 14, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'c_009',
                minStars: 11
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'c_011',
            worldId: 'world_c',
            levelNumber: 11,
            name: 'Prvé Cka',
            gameType: 'banik',
            difficulty: 3,
            words: ['palec', 'valec', 'cirkus', 'cukor', 'pec', 'facka', 'cap', 'cicavec'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 15, y: 14 },  
					{ x: 12, y: 15 },  
                    { x: 3, y: 12 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 4, y: 15 },
                    { x: 5, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 13 },    
                    { x: 6, y: 7 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'c_010',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'c_012',
            worldId: 'world_c',
            levelNumber: 12,
            name: 'Prvé C-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['palec', 'valec', 'cena', 'opica', 'cesta', 'polica', 'maco', 'cesto', 'citrón', 'cirkus', 'cukor', 'pec', 'facka', 'cap', 'cicavec'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 7 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 6, y: 9 },   
                    { x: 7, y: 11 },  
                    { x: 14, y: 12 },
                    { x: 4, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'c_011',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'c_013',
            worldId: 'world_c',
            levelNumber: 13,
            name: 'Prvé C-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['palec', 'valec', 'cena', 'opica', 'cesta', 'polica', 'maco', 'cesto', 'citrón', 'cirkus', 'cukor', 'pec', 'facka', 'cap', 'cicavec', 'cop'],
            gameConfig: {
                diamonds: 5,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 12 },  // diamant na pozícii 3,8
                    { x: 9, y: 11 },
                    { x: 10, y: 14 },
                    { x: 5, y: 9 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 14, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 10 },   // gold na pozícii 7,8
                    { x: 2, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'c_012',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'c_014',
            worldId: 'world_c',
            levelNumber: 14,
            name: 'Prvé C-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['palec', 'valec', 'cena', 'opica', 'cesta', 'polica', 'maco', 'cesto', 'citrón', 'cirkus', 'cukor', 'pec', 'facka', 'cap', 'cicavec', 'cop'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 10 },   
                    { x: 0, y: 12 },   
                    { x: 6, y: 13 },
                    { x: 14, y: 15 }
                ],
                crystals: [
                    { x: 9, y: 8 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'c_013',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'c_015',
            worldId: 'world_c',
            levelNumber: 15,
            name: 'Prvé C-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['palec', 'valec', 'cena', 'opica', 'cesta', 'polica', 'maco', 'cesto', 'citrón', 'cirkus', 'cukor', 'pec', 'facka', 'cap', 'cicavec', 'cop'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 10 }
                ],
                golds: [
                    { x: 0, y: 11 },   
                    { x: 4, y: 9 },  
                    { x: 7, y: 15 },
                    { x: 15, y: 13 }
                ],
                crystals: [
                    { x: 13, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'c_014',
                minStars: 16
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'c_016',
            worldId: 'world_c',
            levelNumber: 16,
            name: 'Prvé C-čka',
            gameType: 'banik',
            difficulty: 5,
            words: ['palec', 'valec', 'cena', 'opica', 'cesta', 'polica', 'maco', 'cesto', 'citrón', 'cirkus', 'cukor', 'pec', 'facka', 'cap', 'cicavec', 'cop'],
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
				speechExercises: 4,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 8 },
					{ x: 12, y: 10 },
					{ x: 9, y: 12 },
					{ x: 4, y: 13 },					
                    { x: 15, y: 15 }
                ],
                golds: [
                    { x: 1, y: 8 },
					{ x: 2, y: 15 },
					{ x: 5, y: 13 },					
                    { x: 7, y: 9 },   
                    { x: 6, y: 15 },
                    { x: 13, y: 7 }
                ],
                crystals: [
                    { x: 10, y: 11 },  
                    { x: 2, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'c_015',
                minStars: 20
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
    ],
    world_sh: [
        {
            id: 'sh_001',
            worldId: 'world_sh',
            levelNumber: 1,
            name: 'Prvé Š-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['šum', 'šunka', 'šupka'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 1,
                speechExercises: 1,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 12, y: 7 }
                ],
                golds: [
                    { x: 2, y: 9 }, 
					{ x: 5, y: 10 }, 
                    { x: 10, y: 13 },
                ],
                crystals: [
                    { x: 11, y: 9 }  
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'sh_002',
            worldId: 'world_sh',
            levelNumber: 2,
            name: 'Prvé Š-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['šum', 'šunka', 'šupka', 'šošovka'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 2,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 10 },
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 10, y: 8 }
                ],
                crystals: [
                    { x: 9, y: 7 },    
                    { x: 10, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'sh_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'sh_003',
            worldId: 'world_sh',
            levelNumber: 3,
            name: 'Prvé Š-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['šum', 'šunka', 'šupka', 'šošovka', 'šaty', 'myš'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 1,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  
                    { x: 12, y: 7 },  
                    { x: 10, y: 12 }
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 14, y: 9 },   
                    { x: 9, y: 10 },
                    { x: 10, y: 12 }
                ],
                crystals: [
                    { x: 1, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'sh_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'sh_004',
            worldId: 'world_sh',
            levelNumber: 4,
            name: 'Prvé Š-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['šum', 'šunka', 'šupka', 'šošovka', 'šaty', 'myš'],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 7 },  
                    { x: 9, y: 14 }
                ],
                golds: [
                    { x: 3, y: 9 },  
                    { x: 7, y: 8 },   
                    { x: 14, y: 6 }   
                ],
                crystals: [
					{ x: 4, y: 12 },
                    { x: 7, y: 11 }   
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'sh_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'sh_005',
            worldId: 'world_sh',
            levelNumber: 5,
            name: 'Prvé C-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['šum', 'šunka', 'šupka', 'šošovka', 'šaty', 'škola', 'špagety', 'myš'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 4,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 13, y: 8 }, 
                    { x: 9, y: 10 },  
                    { x: 1, y: 14 }
                ],
                golds: [
                    { x: 0, y: 9 },
                    { x: 3, y: 10 },					
                    { x: 7, y: 8 }   
                ],
                crystals: [
                    { x: 2, y: 10 },
                    { x: 6, y: 12 },
                    { x: 14, y: 14 },					
                    { x: 8, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'sh_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'sh_006',
            worldId: 'world_sh',
            levelNumber: 6,
            name: 'Prvé Š-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['šum', 'šunka', 'šupka', 'šošovka', 'šaty', 'škola', 'špagety', 'šport', 'šašo', 'myš'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 7 }, 
                    { x: 10, y: 7 },  
                    { x: 2, y: 14 }
                ],
                golds: [
                    { x: 1, y: 9 },
                    { x: 10, y: 10 },
                    { x: 6, y: 7 },
                    { x: 3, y: 15 },					
                    { x: 15, y: 12 }   
                ],
                crystals: [
                    { x: 7, y: 11 },   
                    { x: 10, y: 15 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'sh_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'sh_007',
            worldId: 'world_sh',
            levelNumber: 7,
            name: 'Prvé Š-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['šum', 'šunka', 'šupka', 'šošovka', 'šaty', 'šibačka', 'šarkan', 'škola', 'kôš', 'guláš', 'myš', 'mikuláš'],
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 10 },  
                    { x: 14, y: 14 }
                ],
                golds: [
                    { x: 5, y: 8 },   
                    { x: 7, y: 12 }  
                ],
                crystals: [   
                    { x: 10, y: 9 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'sh_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'sh_008',
            worldId: 'world_sh',
            levelNumber: 8,
            name: 'Prvé Š-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['šum', 'šunka', 'šupka', 'šošovka', 'šaty', 'šibačka', 'šarkan', 'škola', 'špagety', 'šport', 'šašo', 'šiška', 'taška', 'kôš', 'guláš', 'myš', 'mikuláš'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 10, y: 6 }, 
                    { x: 6, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 8, y: 12 },
                    { x: 1, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 15 },    
                    { x: 14, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'sh_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'sh_009',
            worldId: 'world_sh',
            levelNumber: 9,
            name: 'Prvé Š-čka',
            gameType: 'banik',
            difficulty: 3,
            words: [ 'Lukáš', 'vešiak', 'kaša', 'šiška', 'taška', 'kôš', 'guláš', 'myš', 'mikuláš'],
            gameConfig: {
				diamonds: 3,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 },
                    { x: 2, y: 9 }
                ],
                golds: [
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 0, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 11 },    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'sh_008',
                minStars: 10
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'sh_010',
            worldId: 'world_sh',
            levelNumber: 10,
            name: 'Prvé Š-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['špagety', 'šport', 'šašo', 'šach', 'šatka', 'šípka', 'šofér', 'Lukáš', 'vešiak', 'kaša', 'šiška', 'taška', 'kôš', 'guláš', 'myš', 'mikuláš'],
            gameConfig: {
				diamonds: 4,
                golds: 6,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  
                    { x: 10, y: 14 },
                    { x: 6, y: 8 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 1, y: 9 },
                    { x: 3, y: 8 },
                    { x: 5, y: 11 }
                ],
                crystals: [
                    { x: 14, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'sh_009',
                minStars: 11
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'sh_011',
            worldId: 'world_sh',
            levelNumber: 11,
            name: 'Prvé Ška',
            gameType: 'banik',
            difficulty: 3,
            words: ['škola', 'špagety', 'šport', 'šašo', 'šach', 'šatka', 'šípka', 'šofér', 'Lukáš', 'vešiak', 'kaša', 'šiška', 'taška', 'kôš', 'guláš', 'myš', 'mikuláš'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 15, y: 14 },  
					{ x: 12, y: 15 },  
                    { x: 3, y: 12 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 4, y: 15 },
                    { x: 5, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 13 },    
                    { x: 6, y: 7 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'sh_010',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'sh_012',
            worldId: 'world_sh',
            levelNumber: 12,
            name: 'Prvé Š-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['šum', 'šunka', 'šupka', 'šošovka', 'šaty', 'šibačka', 'šarkan', 'škola', 'špagety', 'šport', 'šašo', 'šach', 'šatka', 'šípka', 'šofér', 'Lukáš', 'vešiak', 'kaša', 'šiška'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 7 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 6, y: 9 },   
                    { x: 7, y: 11 },  
                    { x: 14, y: 12 },
                    { x: 4, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'sh_011',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'sh_013',
            worldId: 'world_sh',
            levelNumber: 13,
            name: 'Prvé Š-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['šum', 'šunka', 'šupka', 'šošovka', 'šaty', 'šibačka', 'šarkan', 'škola', 'špagety', 'šport', 'šašo', 'šach', 'šatka', 'šípka', 'šofér', 'Lukáš', 'vešiak', 'kaša', 'šiška', 'taška'],
            gameConfig: {
                diamonds: 5,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 12 },  // diamant na pozícii 3,8
                    { x: 9, y: 11 },
                    { x: 10, y: 14 },
                    { x: 5, y: 9 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 14, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 10 },   // gold na pozícii 7,8
                    { x: 2, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'sh_012',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'sh_014',
            worldId: 'world_sh',
            levelNumber: 14,
            name: 'Prvé Š-čka',
            gameType: 'banik',
            difficulty: 4,
            words: [ 'šarkan', 'škola', 'špagety', 'šport', 'šašo', 'šach', 'šatka', 'šípka', 'šofér', 'kaša', 'šiška', 'taška', 'kôš', 'guláš', 'myš', 'mikuláš'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 10 },   
                    { x: 0, y: 12 },   
                    { x: 6, y: 13 },
                    { x: 14, y: 15 }
                ],
                crystals: [
                    { x: 9, y: 8 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'sh_013',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'sh_015',
            worldId: 'world_sh',
            levelNumber: 15,
            name: 'Prvé Š-čka',
            gameType: 'banik',
            difficulty: 4,
            words: [ 'šaty', 'šibačka', 'šarkan', 'škola', 'špagety', 'šport', 'šašo', 'šach', 'šatka', 'šípka', 'šofér', 'Lukáš', 'vešiak', 'kaša', 'šiška', 'taška', 'kôš', 'guláš', 'myš', 'mikuláš'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 10 }
                ],
                golds: [
                    { x: 0, y: 11 },   
                    { x: 4, y: 9 },  
                    { x: 7, y: 15 },
                    { x: 15, y: 13 }
                ],
                crystals: [
                    { x: 13, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'sh_014',
                minStars: 16
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'sh_016',
            worldId: 'world_sh',
            levelNumber: 16,
            name: 'Prvé Š-čka',
            gameType: 'banik',
            difficulty: 5,
            words: ['šum', 'šunka', 'šupka', 'šošovka', 'šaty', 'šibačka', 'šarkan', 'škola', 'špagety', 'šport', 'šašo', 'šach', 'šatka', 'šípka', 'šofér', 'Lukáš', 'vešiak', 'kaša', 'šiška', 'taška', 'kôš', 'guláš', 'myš', 'mikuláš'],
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
				speechExercises: 4,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 8 },
					{ x: 12, y: 10 },
					{ x: 9, y: 12 },
					{ x: 4, y: 13 },					
                    { x: 15, y: 15 }
                ],
                golds: [
                    { x: 1, y: 8 },
					{ x: 2, y: 15 },
					{ x: 5, y: 13 },					
                    { x: 7, y: 9 },   
                    { x: 6, y: 15 },
                    { x: 13, y: 7 }
                ],
                crystals: [
                    { x: 10, y: 11 },  
                    { x: 2, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'sh_015',
                minStars: 20
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
    ],
	world_zh: [
        {
            id: 'zh_001',
            worldId: 'world_zh',
            levelNumber: 1,
            name: 'Prvé Ž-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['žula', 'nožík'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 1,
                speechExercises: 1,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 12, y: 7 }
                ],
                golds: [
                    { x: 2, y: 9 }, 
					{ x: 5, y: 10 }, 
                    { x: 10, y: 13 },
                ],
                crystals: [
                    { x: 11, y: 9 }  
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'zh_002',
            worldId: 'world_zh',
            levelNumber: 2,
            name: 'Prvé Ž-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['žula', 'nožík', 'koža', 'žaba'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 2,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 10 },
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 10, y: 8 }
                ],
                crystals: [
                    { x: 9, y: 7 },    
                    { x: 10, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'zh_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'zh_003',
            worldId: 'world_zh',
            levelNumber: 3,
            name: 'Prvé Ž-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['žula', 'nožík', 'koža', 'žaba' , 'žena'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 1,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  
                    { x: 12, y: 7 },  
                    { x: 10, y: 12 }
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 14, y: 9 },   
                    { x: 9, y: 10 },
                    { x: 10, y: 12 }
                ],
                crystals: [
                    { x: 1, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'zh_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'zh_004',
            worldId: 'world_zh',
            levelNumber: 4,
            name: 'Prvé Ž-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['žula', 'nožík', 'koža', 'žaba' , 'žena', 'železo'],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 7 },  
                    { x: 9, y: 14 }
                ],
                golds: [
                    { x: 3, y: 9 },  
                    { x: 7, y: 8 },   
                    { x: 14, y: 6 }   
                ],
                crystals: [
					{ x: 4, y: 12 },
                    { x: 7, y: 11 }   
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'zh_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'zh_005',
            worldId: 'world_zh',
            levelNumber: 5,
            name: 'Prvé Ž-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['žula', 'nožík', 'koža', 'žaba' , 'žena', 'železo', 'pyžamo'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 4,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 13, y: 8 }, 
                    { x: 9, y: 10 },  
                    { x: 1, y: 14 }
                ],
                golds: [
                    { x: 0, y: 9 },
                    { x: 3, y: 10 },					
                    { x: 7, y: 8 }   
                ],
                crystals: [
                    { x: 2, y: 10 },
                    { x: 6, y: 12 },
                    { x: 14, y: 14 },					
                    { x: 8, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'zh_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'zh_006',
            worldId: 'world_zh',
            levelNumber: 6,
            name: 'Prvé Ž-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['žula', 'nožík', 'koža', 'žaba' , 'žena', 'železo', 'pyžamo', 'bežať', 'žiletka'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 7 }, 
                    { x: 10, y: 7 },  
                    { x: 2, y: 14 }
                ],
                golds: [
                    { x: 1, y: 9 },
                    { x: 10, y: 10 },
                    { x: 6, y: 7 },
                    { x: 3, y: 15 },					
                    { x: 15, y: 12 }   
                ],
                crystals: [
                    { x: 7, y: 11 },   
                    { x: 10, y: 15 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'zh_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'zh_007',
            worldId: 'world_zh',
            levelNumber: 7,
            name: 'Prvé Ž-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['žula', 'nožík', 'koža', 'žaba' , 'žena', 'železo', 'pyžamo', 'ležať', 'bežať', 'žiletka', 'žolík'],
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 10 },  
                    { x: 14, y: 14 }
                ],
                golds: [
                    { x: 5, y: 8 },   
                    { x: 7, y: 12 }  
                ],
                crystals: [   
                    { x: 10, y: 9 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'zh_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'zh_008',
            worldId: 'world_zh',
            levelNumber: 8,
            name: 'Prvé Ž-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['žula', 'nožík', 'koža', 'žaba' , 'žena', 'železo', 'pyžamo', 'ležať', 'bežať', 'žiletka', 'žatva'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 10, y: 6 }, 
                    { x: 6, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 8, y: 12 },
                    { x: 1, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 15 },    
                    { x: 14, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'zh_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'zh_009',
            worldId: 'world_zh',
            levelNumber: 9,
            name: 'Prvé Ž-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['koža', 'žaba' , 'žena', 'železo', 'pyžamo', 'žatva', 'žaluď', 'ruža'],
            gameConfig: {
				diamonds: 3,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 },
                    { x: 2, y: 9 }
                ],
                golds: [
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 0, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 11 },    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'zh_008',
                minStars: 10
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'zh_010',
            worldId: 'world_zh',
            levelNumber: 10,
            name: 'Prvé Ž-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['žula', 'nožík', 'koža', 'žaba' , 'žena', 'železo', 'pyžamo', 'žobrák', 'žralok', 'žehlička', 'ležať'],
            gameConfig: {
				diamonds: 4,
                golds: 6,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  
                    { x: 10, y: 14 },
                    { x: 6, y: 8 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 1, y: 9 },
                    { x: 3, y: 8 },
                    { x: 5, y: 11 }
                ],
                crystals: [
                    { x: 14, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'zh_009',
                minStars: 11
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'zh_011',
            worldId: 'world_zh',
            levelNumber: 11,
            name: 'Prvé Žka',
            gameType: 'banik',
            difficulty: 3,
            words: ['žaba', 'žena', 'železo', 'pyžamo', 'žobrák', 'žralok', 'žehliť', 'ležať', 'bežať', 'žiletka', 'žuť', 'žolík', 'žatva'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 15, y: 14 },  
					{ x: 12, y: 15 },  
                    { x: 3, y: 12 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 4, y: 15 },
                    { x: 5, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 13 },    
                    { x: 6, y: 7 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'zh_010',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'zh_012',
            worldId: 'world_zh',
            levelNumber: 12,
            name: 'Prvé Ž-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['žaba', 'žena', 'železo', 'pyžamo', 'žobrák', 'žralok', 'žehliť', 'ležať', 'bežať', 'žiletka', 'žuť', 'žolík', 'žatva'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 7 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 6, y: 9 },   
                    { x: 7, y: 11 },  
                    { x: 14, y: 12 },
                    { x: 4, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'zh_011',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'zh_013',
            worldId: 'world_zh',
            levelNumber: 13,
            name: 'Prvé Ž-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['koža', 'žaba' , 'žena', 'železo', 'pyžamo', 'žobrák', 'žralok', 'žehliť', 'ležať', 'bežať', 'žiletka', 'žuť', 'žolík', 'žatva', 'žaluď'],
            gameConfig: {
                diamonds: 5,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 12 },  // diamant na pozícii 3,8
                    { x: 9, y: 11 },
                    { x: 10, y: 14 },
                    { x: 5, y: 9 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 14, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 10 },   // gold na pozícii 7,8
                    { x: 2, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'zh_012',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'zh_014',
            worldId: 'world_sh',
            levelNumber: 14,
            name: 'Prvé Š-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['koža', 'žaba' , 'žena', 'železo', 'pyžamo', 'žobrák', 'žralok', 'žehliť', 'ležať', 'bežať', 'žiletka', 'žuť', 'žolík', 'žatva', 'žaluď'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 10 },   
                    { x: 0, y: 12 },   
                    { x: 6, y: 13 },
                    { x: 14, y: 15 }
                ],
                crystals: [
                    { x: 9, y: 8 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'zh_013',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'zh_015',
            worldId: 'world_zh',
            levelNumber: 15,
            name: 'Prvé Ž-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['žena', 'železo', 'pyžamo', 'žobrák', 'žralok', 'žehliť', 'ležať', 'bežať', 'žiletka', 'žuť', 'žolík', 'žatva', 'žaluď', 'ruža', 'žuvačka'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 10 }
                ],
                golds: [
                    { x: 0, y: 11 },   
                    { x: 4, y: 9 },  
                    { x: 7, y: 15 },
                    { x: 15, y: 13 }
                ],
                crystals: [
                    { x: 13, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'zh_014',
                minStars: 16
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'zh_016',
            worldId: 'world_zh',
            levelNumber: 16,
            name: 'Prvé Ž-čka',
            gameType: 'banik',
            difficulty: 5,
            words: ['žula', 'nožík', 'koža', 'žaba' , 'žena', 'železo', 'pyžamo', 'žobrák', 'jazdec', 'žralok', 'žehliť', 'ležať', 'bežať', 'žiletka', 'žuť', 'žolík', 'žatva', 'žaluď', 'ruža', 'žuvačka', 'žriebä'],
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
				speechExercises: 4,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 8 },
					{ x: 12, y: 10 },
					{ x: 9, y: 12 },
					{ x: 4, y: 13 },					
                    { x: 15, y: 15 }
                ],
                golds: [
                    { x: 1, y: 8 },
					{ x: 2, y: 15 },
					{ x: 5, y: 13 },					
                    { x: 7, y: 9 },   
                    { x: 6, y: 15 },
                    { x: 13, y: 7 }
                ],
                crystals: [
                    { x: 10, y: 11 },  
                    { x: 2, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'zh_015',
                minStars: 20
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
    ],
    world_dh: [
        {
            id: 'dh_001',
            worldId: 'world_dh',
            levelNumber: 1,
            name: 'Prvé Ď-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['loď', 'meď', 'dážď', 'hruď'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 1,
                speechExercises: 1,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 12, y: 7 }
                ],
                golds: [
                    { x: 2, y: 9 }, 
					{ x: 5, y: 10 }, 
                    { x: 10, y: 13 },
                ],
                crystals: [
                    { x: 11, y: 9 }  
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'dh_002',
            worldId: 'world_dh',
            levelNumber: 2,
            name: 'Prvé Ď',
            gameType: 'banik',
            difficulty: 2,
            words: ['loď', 'meď', 'dážď', 'hruď', 'loďka', 'medveď'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 2,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 10 },
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 10, y: 8 }
                ],
                crystals: [
                    { x: 9, y: 7 },    
                    { x: 10, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'dh_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'dh_003',
            worldId: 'world_dh',
            levelNumber: 3,
            name: 'Prvé Ď-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['loď', 'meď', 'dážď', 'hruď', 'loďka', 'medveď', 'ďasno'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 1,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  
                    { x: 12, y: 7 },  
                    { x: 10, y: 12 }
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 14, y: 9 },   
                    { x: 9, y: 10 },
                    { x: 10, y: 12 }
                ],
                crystals: [
                    { x: 1, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'dh_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'dh_004',
            worldId: 'world_dh',
            levelNumber: 4,
            name: 'Prvé Ď-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['loď', 'meď', 'dážď', 'hruď', 'loďka', 'medveď', 'ďasno', 'ďateľ'],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 7 },  
                    { x: 9, y: 14 }
                ],
                golds: [
                    { x: 3, y: 9 },  
                    { x: 7, y: 8 },   
                    { x: 14, y: 6 }   
                ],
                crystals: [
					{ x: 4, y: 12 },
                    { x: 7, y: 11 }   
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'dh_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'dh_005',
            worldId: 'world_dh',
            levelNumber: 5,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['loď', 'meď', 'dážď', 'hruď', 'loďka', 'medveď', 'ďakujem'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 4,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 13, y: 8 }, 
                    { x: 9, y: 10 },  
                    { x: 1, y: 14 }
                ],
                golds: [
                    { x: 0, y: 9 },
                    { x: 3, y: 10 },					
                    { x: 7, y: 8 }   
                ],
                crystals: [
                    { x: 2, y: 10 },
                    { x: 6, y: 12 },
                    { x: 14, y: 14 },					
                    { x: 8, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'dh_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'dh_006',
            worldId: 'world_dh',
            levelNumber: 6,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['loď', 'meď', 'dážď', 'hruď', 'loďka', 'medveď', 'ďasno', 'ďateľ', 'ďakujem', 'ďumbier', 'žaluď'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 7 }, 
                    { x: 10, y: 7 },  
                    { x: 2, y: 14 }
                ],
                golds: [
                    { x: 1, y: 9 },
                    { x: 10, y: 10 },
                    { x: 6, y: 7 },
                    { x: 3, y: 15 },					
                    { x: 15, y: 12 }   
                ],
                crystals: [
                    { x: 7, y: 11 },   
                    { x: 10, y: 15 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'dh_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'dh_007',
            worldId: 'world_dh',
            levelNumber: 7,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['loď', 'meď', 'dážď', 'hruď', 'loďka', 'medveď', 'ďasno', 'ďateľ', 
                'ďakujem', 'ďumbier', 'žaluď', 'ďalekohľad'],            
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 10 },  
                    { x: 14, y: 14 }
                ],
                golds: [
                    { x: 5, y: 8 },   
                    { x: 7, y: 12 }  
                ],
                crystals: [   
                    { x: 10, y: 9 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'dh_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'dh_008',
            worldId: 'world_dh',
            levelNumber: 8,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['loď', 'meď', 'dážď', 'hruď', 'loďka', 'medveď', 'ďasno', 'ďateľ', 
                'ďakujem', 'ďumbier', 'žaluď', 'ďalekohľad', 'dedina', 'dedo' ],  
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 10, y: 6 }, 
                    { x: 6, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 8, y: 12 },
                    { x: 1, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 15 },    
                    { x: 14, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'dh_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'dh_009',
            worldId: 'world_dh',
            levelNumber: 9,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['loď', 'meď', 'dážď', 'hruď', 'loďka', 'medveď', 'ďasno', 'ďateľ', 
                'ďakujem', 'ďumbier', 'žaluď', 'ďalekohľad', 'dedina', 'dedo' ],  
            gameConfig: {
				diamonds: 3,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 },
                    { x: 2, y: 9 }
                ],
                golds: [
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 0, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 11 },    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'dh_008',
                minStars: 10
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'dh_010',
            worldId: 'world_dh',
            levelNumber: 10,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['loď', 'meď', 'dážď', 'hruď', 'loďka', 'medveď', 'ďasno', 'ďateľ', 
                'ďakujem', 'ďumbier', 'žaluď', 'ďalekohľad', 'dedina', 'dedo' ],             
            gameConfig: {
				diamonds: 4,
                golds: 6,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  
                    { x: 10, y: 14 },
                    { x: 6, y: 8 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 1, y: 9 },
                    { x: 3, y: 8 },
                    { x: 5, y: 11 }
                ],
                crystals: [
                    { x: 14, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'dh_009',
                minStars: 11
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'dh_011',
            worldId: 'world_dh',
            levelNumber: 11,
            name: 'Prvé Ďka',
            gameType: 'banik',
            difficulty: 3,
            words: ['loď', 'meď', 'dážď', 'hruď', 'loďka', 'medveď', 'ďasno', 'ďateľ', 
                'ďakujem', 'ďumbier', 'žaluď', 'ďalekohľad', 'dedina', 'dedo', 'divák', 'dievča'],                  
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 15, y: 14 },  
					{ x: 12, y: 15 },  
                    { x: 3, y: 12 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 4, y: 15 },
                    { x: 5, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 13 },    
                    { x: 6, y: 7 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'dh_010',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'dh_012',
            worldId: 'world_dh',
            levelNumber: 12,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['ďasno', 'ďateľ', 
                'ďakujem', 'ďumbier', 'žaluď', 'ďalekohľad', 'dedina', 'dedo', 'divák', 'dievča', 'desať'],   
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 7 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 6, y: 9 },   
                    { x: 7, y: 11 },  
                    { x: 14, y: 12 },
                    { x: 4, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'dh_011',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'dh_013',
            worldId: 'world_dh',
            levelNumber: 13,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['loď', 'meď', 'dážď', 'hruď', 'loďka', 'medveď', 'ďasno', 'ďateľ', 
                'ďakujem', 'ďumbier', 'žaluď', 'ďalekohľad', 'dedina', 'dedo', 'divák', 'dievča', 'reďkovka'],   
            gameConfig: {
                diamonds: 5,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 12 },  // diamant na pozícii 3,8
                    { x: 9, y: 11 },
                    { x: 10, y: 14 },
                    { x: 5, y: 9 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 14, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 10 },   // gold na pozícii 7,8
                    { x: 2, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'dh_012',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'dh_014',
            worldId: 'world_dh',
            levelNumber: 14,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['loď', 'meď', 'dážď', 'hruď', 
                'ďakujem', 'ďumbier', 'žaluď', 'ďalekohľad', 'dedina', 'dedo', 'divák', 'dievča', 'reďkovka'],   
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 10 },   
                    { x: 0, y: 12 },   
                    { x: 6, y: 13 },
                    { x: 14, y: 15 }
                ],
                crystals: [
                    { x: 9, y: 8 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'dh_013',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'dh_015',
            worldId: 'world_dh',
            levelNumber: 15,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['loď', 'meď', 'dážď', 'hruď', 'loďka', 'medveď', 'ďasno', 'ďateľ', 
                'ďakujem', 'ďumbier', 'žaluď', 'ďalekohľad', 'dedina', 'dedo', 'divák', 'dievča', 'ďobnutie'],   
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 10 }
                ],
                golds: [
                    { x: 0, y: 11 },   
                    { x: 4, y: 9 },  
                    { x: 7, y: 15 },
                    { x: 15, y: 13 }
                ],
                crystals: [
                    { x: 13, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'dh_014',
                minStars: 16
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'dh_016',
            worldId: 'world_dh',
            levelNumber: 16,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 5,
            words: ['loď', 'meď', 'dážď', 'hruď', 'loďka', 'medveď', 'ďasno', 'ďateľ', 
                'ďakujem', 'ďumbier', 'žaluď', 'ďalekohľad', 'dedina', 'dedo', 'divák', 'dievča', 'ďobnutie', 'vzducholoď', 'deti'],   
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
				speechExercises: 4,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 8 },
					{ x: 12, y: 10 },
					{ x: 9, y: 12 },
					{ x: 4, y: 13 },					
                    { x: 15, y: 15 }
                ],
                golds: [
                    { x: 1, y: 8 },
					{ x: 2, y: 15 },
					{ x: 5, y: 13 },					
                    { x: 7, y: 9 },   
                    { x: 6, y: 15 },
                    { x: 13, y: 7 }
                ],
                crystals: [
                    { x: 10, y: 11 },  
                    { x: 2, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'dh_015',
                minStars: 20
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
    ],
    world_d: [
        {
            id: 'd_001',
            worldId: 'world_d',
            levelNumber: 1,
            name: 'Prvé D-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['dom', 'dúha', 'donut', 'dym'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 1,
                speechExercises: 1,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 12, y: 7 }
                ],
                golds: [
                    { x: 2, y: 9 }, 
					{ x: 5, y: 10 }, 
                    { x: 10, y: 13 },
                ],
                crystals: [
                    { x: 11, y: 9 }  
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'd_002',
            worldId: 'world_d',
            levelNumber: 2,
            name: 'Prvé D',
            gameType: 'banik',
            difficulty: 2,
            words: ['dom', 'dúha', 'donut', 'dym', 'duch', 'doska'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 2,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 10 },
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 10, y: 8 }
                ],
                crystals: [
                    { x: 9, y: 7 },    
                    { x: 10, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'd_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'd_003',
            worldId: 'world_d',
            levelNumber: 3,
            name: 'Prvé Ď-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['dynamit', 'dúha', 'dáma', 'dym', 'duch', 'doska'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 1,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  
                    { x: 12, y: 7 },  
                    { x: 10, y: 12 }
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 14, y: 9 },   
                    { x: 9, y: 10 },
                    { x: 10, y: 12 }
                ],
                crystals: [
                    { x: 1, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'd_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'd_004',
            worldId: 'world_d',
            levelNumber: 4,
            name: 'Prvé Ď-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['dom', 'dúha', 'donut', 'dym', 'duch', 'doska', 'dynamit', 'dáma'],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 7 },  
                    { x: 9, y: 14 }
                ],
                golds: [
                    { x: 3, y: 9 },  
                    { x: 7, y: 8 },   
                    { x: 14, y: 6 }   
                ],
                crystals: [
					{ x: 4, y: 12 },
                    { x: 7, y: 11 }   
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'd_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'd_005',
            worldId: 'world_d',
            levelNumber: 5,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['dom', 'dúha', 'donut', 'dym', 'duch', 'doska', 'dynamit', 'dáma', 'dukát', 'disk', 'disketa'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 4,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 13, y: 8 }, 
                    { x: 9, y: 10 },  
                    { x: 1, y: 14 }
                ],
                golds: [
                    { x: 0, y: 9 },
                    { x: 3, y: 10 },					
                    { x: 7, y: 8 }   
                ],
                crystals: [
                    { x: 2, y: 10 },
                    { x: 6, y: 12 },
                    { x: 14, y: 14 },					
                    { x: 8, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'd_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'd_006',
            worldId: 'world_d',
            levelNumber: 6,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['domov', 'doklad', 'dudlík', 'diamant', 'dom', 'dúha', 'donut', 'dym', 'duch', 
                'doska', 'dynamit', 'dáma', 'dukát', 'disk', 'disketa'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 7 }, 
                    { x: 10, y: 7 },  
                    { x: 2, y: 14 }
                ],
                golds: [
                    { x: 1, y: 9 },
                    { x: 10, y: 10 },
                    { x: 6, y: 7 },
                    { x: 3, y: 15 },					
                    { x: 15, y: 12 }   
                ],
                crystals: [
                    { x: 7, y: 11 },   
                    { x: 10, y: 15 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'd_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'd_007',
            worldId: 'world_d',
            levelNumber: 7,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['domov', 'doklad', 'dudlík', 'diamant', 'dom', 'dúha', 'donut', 'dym', 'duch', 
                'doska', 'dynamit', 'dáma', 'dukát', 'disk', 'disketa'],            
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 10 },  
                    { x: 14, y: 14 }
                ],
                golds: [
                    { x: 5, y: 8 },   
                    { x: 7, y: 12 }  
                ],
                crystals: [   
                    { x: 10, y: 9 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'd_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'd_008',
            worldId: 'world_d',
            levelNumber: 8,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['domov', 'doklad', 'dudlík', 'diamant', 'delfín', 'dúha', 'donut', 'dym', 'duch'], 
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 10, y: 6 }, 
                    { x: 6, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 8, y: 12 },
                    { x: 1, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 15 },    
                    { x: 14, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'd_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'd_009',
            worldId: 'world_d',
            levelNumber: 9,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['domov', 'doklad', 'dudlík', 'diamant', 'dom', 'dúha', 'donut', 'dym', 'duch', 
                'doska', 'dynamit', 'dáma', 'dukát', 'disk', 'disketa', 'delfín', 'dáždnik', 'dvere'],    
            gameConfig: {
				diamonds: 3,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 },
                    { x: 2, y: 9 }
                ],
                golds: [
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 0, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 11 },    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'd_008',
                minStars: 10
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'd_010',
            worldId: 'world_d',
            levelNumber: 10,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['domov', 'doklad', 'dudlík',  
                'doska', 'dynamit', 'dáma', 'drak', 'disk', 'disketa', 'delfín', 'dáždnik', 'dvere' ],             
            gameConfig: {
				diamonds: 4,
                golds: 6,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  
                    { x: 10, y: 14 },
                    { x: 6, y: 8 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 1, y: 9 },
                    { x: 3, y: 8 },
                    { x: 5, y: 11 }
                ],
                crystals: [
                    { x: 14, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'd_009',
                minStars: 11
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'd_011',
            worldId: 'world_d',
            levelNumber: 11,
            name: 'Prvé Ďka',
            gameType: 'banik',
            difficulty: 3,
            words: ['domov', 'doklad', 'dudlík', 'diamant', 'dom', 'dúha', 'donut', 'dym', 'duch', 
                'doska', 'dynamit', 'dáma', 'dukát', 'disk', 'disketa', 'delfín', 'dáždnik', 'dvere', 'drak'],                  
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 15, y: 14 },  
					{ x: 12, y: 15 },  
                    { x: 3, y: 12 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 4, y: 15 },
                    { x: 5, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 13 },    
                    { x: 6, y: 7 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'd_010',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'd_012',
            worldId: 'world_d',
            levelNumber: 12,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['domov', 'doklad', 'dudlík', 'diamant', 'dom', 'dúha', 'donut', 'dym', 'duch', 
                'doska', 'dynamit', 'dáma', 'dukát', 'disk', 'disketa', 'delfín', 'dáždnik', 'dvere', 
                'drak', 'drevo', 'diera'],   
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 7 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 6, y: 9 },   
                    { x: 7, y: 11 },  
                    { x: 14, y: 12 },
                    { x: 4, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'd_011',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'd_013',
            worldId: 'world_d',
            levelNumber: 13,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['domov', 'doklad', 'dudlík', 'diamant', 'dom', 'dúha', 'donut', 'dym', 'duch', 
                'doska',  'dáždnik', 'dvere', 
                'drak', 'drevo', 'diera', 'dinosaurus', 'doktor', 'sídlo', 'záhrada'],      
            gameConfig: {
                diamonds: 5,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 12 },  // diamant na pozícii 3,8
                    { x: 9, y: 11 },
                    { x: 10, y: 14 },
                    { x: 5, y: 9 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 14, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 10 },   // gold na pozícii 7,8
                    { x: 2, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'd_012',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'd_014',
            worldId: 'world_d',
            levelNumber: 14,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['domov', 'doklad', 'dudlík', 'diamant', 'dom', 'dúha', 'donut', 'dym', 'duch', 
                'doska', 'dynamit', 'dáma', 'dáždnik', 'dvere', 
                'drak', 'drevo', 'diera', 'dinosaurus', 'doktor', 'sídlo', 'záhrada'],     
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 10 },   
                    { x: 0, y: 12 },   
                    { x: 6, y: 13 },
                    { x: 14, y: 15 }
                ],
                crystals: [
                    { x: 9, y: 8 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'd_013',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'd_015',
            worldId: 'world_d',
            levelNumber: 15,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['domov', 'doklad', 'dudlík', 'dym', 'duch', 
                'doska', 'dynamit', 'dáma', 'dukát', 'disk', 'disketa', 'delfín', 'dáždnik', 'dvere', 
                'drak', 'drevo', 'diera', 'dinosaurus', 'doktor', 'sídlo', 'záhrada'],     
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 10 }
                ],
                golds: [
                    { x: 0, y: 11 },   
                    { x: 4, y: 9 },  
                    { x: 7, y: 15 },
                    { x: 15, y: 13 }
                ],
                crystals: [
                    { x: 13, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'd_014',
                minStars: 16
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'd_016',
            worldId: 'world_d',
            levelNumber: 16,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 5,
            words: ['domov', 'doklad', 'dudlík', 'diamant', 'dom', 'dúha', 'donut', 'dym', 'duch', 
                'doska', 'dynamit', 'dáma', 'dukát', 'disk', 'disketa', 'delfín', 'dáždnik', 'dvere', 
                'drak', 'drevo', 'diera', 'dinosaurus', 'doktor', 'sídlo', 'záhrada'],     
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
				speechExercises: 4,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 8 },
					{ x: 12, y: 10 },
					{ x: 9, y: 12 },
					{ x: 4, y: 13 },					
                    { x: 15, y: 15 }
                ],
                golds: [
                    { x: 1, y: 8 },
					{ x: 2, y: 15 },
					{ x: 5, y: 13 },					
                    { x: 7, y: 9 },   
                    { x: 6, y: 15 },
                    { x: 13, y: 7 }
                ],
                crystals: [
                    { x: 10, y: 11 },  
                    { x: 2, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'd_015',
                minStars: 20
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
    ],
    world_t: [
        {
            id: 't_001',
            worldId: 'world_t',
            levelNumber: 1,
            name: 'Prvé T-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['tona', 'tato', 'top', 'tón'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 1,
                speechExercises: 1,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 12, y: 7 }
                ],
                golds: [
                    { x: 2, y: 9 }, 
					{ x: 5, y: 10 }, 
                    { x: 10, y: 13 },
                ],
                crystals: [
                    { x: 11, y: 9 }  
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 't_002',
            worldId: 'world_t',
            levelNumber: 2,
            name: 'Prvé t',
            gameType: 'banik',
            difficulty: 2,
            words: ['tona', 'tato', 'top', 'tón', 'tank', 'tuha'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 2,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 10 },
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 10, y: 8 }
                ],
                crystals: [
                    { x: 9, y: 7 },    
                    { x: 10, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 't_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 't_003',
            worldId: 'world_t',
            levelNumber: 3,
            name: 'Prvé t-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['tona', 'tablet', 'top', 'tón', 'tank', 'tuha'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 1,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  
                    { x: 12, y: 7 },  
                    { x: 10, y: 12 }
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 14, y: 9 },   
                    { x: 9, y: 10 },
                    { x: 10, y: 12 }
                ],
                crystals: [
                    { x: 1, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 't_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 't_004',
            worldId: 'world_t',
            levelNumber: 4,
            name: 'Prvé t-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['tona', 'tablet', 'top', 'tón', 'tulipán', 'tunel', 'telefón'],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 7 },  
                    { x: 9, y: 14 }
                ],
                golds: [
                    { x: 3, y: 9 },  
                    { x: 7, y: 8 },   
                    { x: 14, y: 6 }   
                ],
                crystals: [
					{ x: 4, y: 12 },
                    { x: 7, y: 11 }   
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 't_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 't_005',
            worldId: 'world_t',
            levelNumber: 5,
            name: 'Prvé t-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['tona', 'tablet', 'top', 'tón', 'tank', 'tuha', 'tulipán'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 4,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 13, y: 8 }, 
                    { x: 9, y: 10 },  
                    { x: 1, y: 14 }
                ],
                golds: [
                    { x: 0, y: 9 },
                    { x: 3, y: 10 },					
                    { x: 7, y: 8 }   
                ],
                crystals: [
                    { x: 2, y: 10 },
                    { x: 6, y: 12 },
                    { x: 14, y: 14 },					
                    { x: 8, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 't_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 't_006',
            worldId: 'world_t',
            levelNumber: 6,
            name: 'Prvé t-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['tona', 'tablet', 'top', 'tón', 'tank', 'tuha', 'tulipán', 'tunel', 'telefón', 'auto', 
                'Oto', 'tato'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 7 }, 
                    { x: 10, y: 7 },  
                    { x: 2, y: 14 }
                ],
                golds: [
                    { x: 1, y: 9 },
                    { x: 10, y: 10 },
                    { x: 6, y: 7 },
                    { x: 3, y: 15 },					
                    { x: 15, y: 12 }   
                ],
                crystals: [
                    { x: 7, y: 11 },   
                    { x: 10, y: 15 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 't_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 't_007',
            worldId: 'world_t',
            levelNumber: 7,
            name: 'Prvé t-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['tona', 'tablet', 'top', 'tón', 'tank', 'tuha', 'auto', 
                'Oto', 'tato'],         
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 10 },  
                    { x: 14, y: 14 }
                ],
                golds: [
                    { x: 5, y: 8 },   
                    { x: 7, y: 12 }  
                ],
                crystals: [   
                    { x: 10, y: 9 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 't_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 't_008',
            worldId: 'world_t',
            levelNumber: 8,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['tona', 'tablet', 'top', 'tón', 'tank', 'tuha', 'tulipán', 'tunel', 'telefón', 'auto', 
                'Oto', 'tato', 'tanier'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 10, y: 6 }, 
                    { x: 6, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 8, y: 12 },
                    { x: 1, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 15 },    
                    { x: 14, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 't_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 't_009',
            worldId: 'world_t',
            levelNumber: 9,
            name: 'Prvé t-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['tona', 'tablet', 'top', 'tón', 'tank', 'telefón', 'auto', 
                'Oto', 'tato', 'tanier'],  
            gameConfig: {
				diamonds: 3,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 },
                    { x: 2, y: 9 }
                ],
                golds: [
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 0, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 11 },    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 't_008',
                minStars: 10
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 't_010',
            worldId: 'world_t',
            levelNumber: 10,
            name: 'Prvé Ď-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['tona', 'tablet', 'top', 'tón', 'tank', 'tuha', 'tulipán', 'tunel', 'telefón', 'auto'
                ],          
            gameConfig: {
				diamonds: 4,
                golds: 6,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  
                    { x: 10, y: 14 },
                    { x: 6, y: 8 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 1, y: 9 },
                    { x: 3, y: 8 },
                    { x: 5, y: 11 }
                ],
                crystals: [
                    { x: 14, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 't_009',
                minStars: 11
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 't_011',
            worldId: 'world_t',
            levelNumber: 11,
            name: 'Prvé tka',
            gameType: 'banik',
            difficulty: 3,
            words: ['tona', 'tablet', 'top', 'tón', 'tank', 'tuha', 'tulipán', 'tunel', 'telefón', 'auto', 
                'Oto', 'tato', 'tanier'],                
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 15, y: 14 },  
					{ x: 12, y: 15 },  
                    { x: 3, y: 12 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 4, y: 15 },
                    { x: 5, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 13 },    
                    { x: 6, y: 7 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 't_010',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 't_012',
            worldId: 'world_t',
            levelNumber: 12,
            name: 'Prvé t-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['tona', 'tablet', 'top', 'tón', 'tank', 'tuha', 'tulipán', 'tunel', 'telefón', 'auto', 
                'Oto', 'tato', 'tanier', 'tepláky'], 
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 7 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 6, y: 9 },   
                    { x: 7, y: 11 },  
                    { x: 14, y: 12 },
                    { x: 4, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 't_011',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 't_013',
            worldId: 'world_t',
            levelNumber: 13,
            name: 'Prvé t-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['tona', 'tablet', 'top', 'tón', 'tank', 'tuha', 'tulipán', 'tunel', 'telefón', 'auto', 
                'Oto', 'tato', 'tanier', 'tanec'],     
            gameConfig: {
                diamonds: 5,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 12 },  // diamant na pozícii 3,8
                    { x: 9, y: 11 },
                    { x: 10, y: 14 },
                    { x: 5, y: 9 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 14, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 10 },   // gold na pozícii 7,8
                    { x: 2, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 't_012',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 't_014',
            worldId: 'world_t',
            levelNumber: 14,
            name: 'Prvé t-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['tona', 'tablet', 'top', 'tón', 'tank', 'tuha', 'tulipán', 'tunel', 'telefón', 'auto', 
                'Oto', 'tato', 'tanier', 'tanec', 'teplota'],    
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 10 },   
                    { x: 0, y: 12 },   
                    { x: 6, y: 13 },
                    { x: 14, y: 15 }
                ],
                crystals: [
                    { x: 9, y: 8 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 't_013',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 't_015',
            worldId: 'world_t',
            levelNumber: 15,
            name: 'Prvé t-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['tona', 'tablet', 'top', 'tón', 'telefón', 'auto', 'toaleta',
                'Oto', 'tato', 'tanier', 'tanec', 'teplota'],      
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 10 }
                ],
                golds: [
                    { x: 0, y: 11 },   
                    { x: 4, y: 9 },  
                    { x: 7, y: 15 },
                    { x: 15, y: 13 }
                ],
                crystals: [
                    { x: 13, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 't_014',
                minStars: 16
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 't_016',
            worldId: 'world_t',
            levelNumber: 16,
            name: 'Prvé t-čka',
            gameType: 'banik',
            difficulty: 5,
            words: ['tona', 'tablet', 'top', 'tón', 'tank', 'tuha', 'tulipán', 'tunel', 'telefón', 'auto', 
                'Oto', 'tato', 'tanier', 'tanec', 'teplota', 'toaleta'],    
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
				speechExercises: 4,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 8 },
					{ x: 12, y: 10 },
					{ x: 9, y: 12 },
					{ x: 4, y: 13 },					
                    { x: 15, y: 15 }
                ],
                golds: [
                    { x: 1, y: 8 },
					{ x: 2, y: 15 },
					{ x: 5, y: 13 },					
                    { x: 7, y: 9 },   
                    { x: 6, y: 15 },
                    { x: 13, y: 7 }
                ],
                crystals: [
                    { x: 10, y: 11 },  
                    { x: 2, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 't_015',
                minStars: 20
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
    ],
    world_th: [
        {
            id: 'th_001',
            worldId: 'world_th',
            levelNumber: 1,
            name: 'Prvé Th-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['ťava', 'niť', 'sieť', 'kosť'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 1,
                speechExercises: 1,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 12, y: 7 }
                ],
                golds: [
                    { x: 2, y: 9 }, 
					{ x: 5, y: 10 }, 
                    { x: 10, y: 13 },
                ],
                crystals: [
                    { x: 11, y: 9 }  
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'th_002',
            worldId: 'world_th',
            levelNumber: 2,
            name: 'Prvé th',
            gameType: 'banik',
            difficulty: 2,
            words: ['ťava', 'niť', 'sieť', 'ťažiť', 'ťahať'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 2,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 10 },
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 10, y: 8 }
                ],
                crystals: [
                    { x: 9, y: 7 },    
                    { x: 10, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'th_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'th_003',
            worldId: 'world_th',
            levelNumber: 3,
            name: 'Prvé th-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['ťava', 'niť', 'sieť', 'ťažiť', 'ťahať', 'ťuk'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 1,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  
                    { x: 12, y: 7 },  
                    { x: 10, y: 12 }
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 14, y: 9 },   
                    { x: 9, y: 10 },
                    { x: 10, y: 12 }
                ],
                crystals: [
                    { x: 1, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'th_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'th_004',
            worldId: 'world_th',
            levelNumber: 4,
            name: 'Prvé th-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['ťuk', 'ťah', 'ťahák', 'chuť', 
                'kosť', 'labuť', 'masť', 'pamäť', ],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 7 },  
                    { x: 9, y: 14 }
                ],
                golds: [
                    { x: 3, y: 9 },  
                    { x: 7, y: 8 },   
                    { x: 14, y: 6 }   
                ],
                crystals: [
					{ x: 4, y: 12 },
                    { x: 7, y: 11 }   
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'th_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'th_005',
            worldId: 'world_th',
            levelNumber: 5,
            name: 'Prvé th-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['ťava', 'niť', 'sieť', 'ťažiť', 'ťahať', 'ťuk', 'ťah', 'ťahák', 'chuť', 
                'kosť', 'labuť', 'masť'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 4,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 13, y: 8 }, 
                    { x: 9, y: 10 },  
                    { x: 1, y: 14 }
                ],
                golds: [
                    { x: 0, y: 9 },
                    { x: 3, y: 10 },					
                    { x: 7, y: 8 }   
                ],
                crystals: [
                    { x: 2, y: 10 },
                    { x: 6, y: 12 },
                    { x: 14, y: 14 },					
                    { x: 8, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'th_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'th_006',
            worldId: 'world_th',
            levelNumber: 6,
            name: 'Prvé th-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['ťava', 'niť', 'sieť', 'ťažiť', 'ťahať', 'ťuk', 'ťah', 'ťahák', 'chuť', 
                'kosť', 'labuť', 'masť', 'pamäť', 'pleť'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 7 }, 
                    { x: 10, y: 7 },  
                    { x: 2, y: 14 }
                ],
                golds: [
                    { x: 1, y: 9 },
                    { x: 10, y: 10 },
                    { x: 6, y: 7 },
                    { x: 3, y: 15 },					
                    { x: 15, y: 12 }   
                ],
                crystals: [
                    { x: 7, y: 11 },   
                    { x: 10, y: 15 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'th_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'th_007',
            worldId: 'world_th',
            levelNumber: 7,
            name: 'Prvé th-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['ťava', 'niť', 'sieť', 'ťažiť', 'ťahať', 'ťuk', 'ťah', 'ťahák', 'chuť', 
                'kosť', 'labuť', 'masť', 'pamäť', 'pleť', 'púšť'],       
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 10 },  
                    { x: 14, y: 14 }
                ],
                golds: [
                    { x: 5, y: 8 },   
                    { x: 7, y: 12 }  
                ],
                crystals: [   
                    { x: 10, y: 9 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'th_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'th_008',
            worldId: 'world_th',
            levelNumber: 8,
            name: 'Prvé Ť-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['ťava', 'niť', 'sieť', 'ťažiť', 'ťahať', 'ťuk', 'ťah', 'ťahák', 'chuť', 
                'kosť', 'labuť', 'masť', 'pamäť', 'pleť', 'púšť', 'povesť', 'ťahač'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 10, y: 6 }, 
                    { x: 6, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 8, y: 12 },
                    { x: 1, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 15 },    
                    { x: 14, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'th_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'th_009',
            worldId: 'world_th',
            levelNumber: 9,
            name: 'Prvé th-čka',
            gameType: 'banik',
            difficulty: 3,
            words: [ 
                'kosť', 'labuť', 'masť', 'pamäť', 'pleť', 'púšť', 'povesť', 'ťahač', 'ťukanec', 'päsť', 
                ],
            gameConfig: {
				diamonds: 3,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 },
                    { x: 2, y: 9 }
                ],
                golds: [
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 0, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 11 },    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'th_008',
                minStars: 10
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'th_010',
            worldId: 'world_th',
            levelNumber: 10,
            name: 'Prvé Ť-čka',
            gameType: 'banik',
            difficulty: 3,
            words: [ 'ťah', 'ťahák', 'chuť', 
                'kosť', 'labuť', 'masť', 'pamäť', 'pleť', 'púšť', 'povesť', 'ťahač', 'ťukanec', 'päsť', 
                ],         
            gameConfig: {
				diamonds: 4,
                golds: 6,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  
                    { x: 10, y: 14 },
                    { x: 6, y: 8 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 1, y: 9 },
                    { x: 3, y: 8 },
                    { x: 5, y: 11 }
                ],
                crystals: [
                    { x: 14, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'th_009',
                minStars: 11
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'th_011',
            worldId: 'world_th',
            levelNumber: 11,
            name: 'Prvé thka',
            gameType: 'banik',
            difficulty: 3,
            words: ['ťahať', 'ťuk', 'ťah', 'ťahák', 'chuť', 
                'kosť', 'labuť', 'masť', 'pamäť', 'pleť', 'púšť', 'povesť', 'ťahač', 'ťukanec', 'päsť', 
                'ortuť', 'vlasť', ],               
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 15, y: 14 },  
					{ x: 12, y: 15 },  
                    { x: 3, y: 12 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 4, y: 15 },
                    { x: 5, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 13 },    
                    { x: 6, y: 7 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'th_010',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'th_012',
            worldId: 'world_th',
            levelNumber: 12,
            name: 'Prvé th-čka',
            gameType: 'banik',
            difficulty: 3,
            words: [ 
                'kosť', 'labuť', 'masť', 'pamäť', 'pleť', 'púšť', 'povesť', 'ťahač', 'ťukanec', 'päsť', 
                'ortuť', 'vlasť', 'časť', 'súčasť'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 7 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 6, y: 9 },   
                    { x: 7, y: 11 },  
                    { x: 14, y: 12 },
                    { x: 4, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'th_011',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'th_013',
            worldId: 'world_th',
            levelNumber: 13,
            name: 'Prvé th-čka',
            gameType: 'banik',
            difficulty: 4,
            words: [ 
                'ortuť', 'vlasť', 'časť', 'súčasť', 'cnosť', 'šesť', 'srsť'],     
            gameConfig: {
                diamonds: 5,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 12 },  // diamant na pozícii 3,8
                    { x: 9, y: 11 },
                    { x: 10, y: 14 },
                    { x: 5, y: 9 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 14, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 10 },   // gold na pozícii 7,8
                    { x: 2, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'th_012',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'th_014',
            worldId: 'world_th',
            levelNumber: 14,
            name: 'Prvé th-čka',
            gameType: 'banik',
            difficulty: 4,
            words: [
                 'pleť', 'púšť', 'povesť', 'ťahač', 'ťukanec', 'päsť', 
                'ortuť', 'vlasť', 'časť', 'súčasť'], 
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 10 },   
                    { x: 0, y: 12 },   
                    { x: 6, y: 13 },
                    { x: 14, y: 15 }
                ],
                crystals: [
                    { x: 9, y: 8 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'th_013',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'th_015',
            worldId: 'world_th',
            levelNumber: 15,
            name: 'Prvé th-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['ťava', 'niť', 'sieť', 'ťažiť', 'ťahať', 'ťuk', 'ťah', 'ťahák', 'chuť', 
                'kosť', 'labuť', 'masť', 'ťahač', 'ťukanec', 'päsť', 
                'ortuť', 'vlasť', 'časť', 'súčasť', 'cnosť', 'šesť', 'srsť'],     
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 10 }
                ],
                golds: [
                    { x: 0, y: 11 },   
                    { x: 4, y: 9 },  
                    { x: 7, y: 15 },
                    { x: 15, y: 13 }
                ],
                crystals: [
                    { x: 13, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'th_014',
                minStars: 16
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'th_016',
            worldId: 'world_th',
            levelNumber: 16,
            name: 'Prvé th-čka',
            gameType: 'banik',
            difficulty: 5,
            words: ['ťava', 'niť', 'sieť', 'ťažiť', 'ťahať', 'ťuk', 'ťah', 'ťahák', 'chuť', 
                'kosť', 'labuť', 'masť', 'pamäť', 'pleť', 'púšť', 'povesť', 'ťahač', 'ťukanec', 'päsť', 
                'ortuť', 'vlasť', 'časť', 'súčasť', 'cnosť', 'šesť', 'srsť'],   
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
				speechExercises: 4,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 8 },
					{ x: 12, y: 10 },
					{ x: 9, y: 12 },
					{ x: 4, y: 13 },					
                    { x: 15, y: 15 }
                ],
                golds: [
                    { x: 1, y: 8 },
					{ x: 2, y: 15 },
					{ x: 5, y: 13 },					
                    { x: 7, y: 9 },   
                    { x: 6, y: 15 },
                    { x: 13, y: 7 }
                ],
                crystals: [
                    { x: 10, y: 11 },  
                    { x: 2, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'th_015',
                minStars: 20
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
    ],
    world_n: [
        {
            id: 'n_001',
            worldId: 'world_n',
            levelNumber: 1,
            name: 'Prvé n-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['víno', 'noviny', 'menu', 'nos'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 1,
                speechExercises: 1,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 12, y: 7 }
                ],
                golds: [
                    { x: 2, y: 9 }, 
					{ x: 5, y: 10 }, 
                    { x: 10, y: 13 },
                ],
                crystals: [
                    { x: 11, y: 9 }  
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'n_002',
            worldId: 'world_n',
            levelNumber: 2,
            name: 'Prvé n',
            gameType: 'banik',
            difficulty: 2,
            words: ['vino', 'noviny', 'menu', 'noha', 'nuda', 'nos'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 2,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 10 },
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 10, y: 8 }
                ],
                crystals: [
                    { x: 9, y: 7 },    
                    { x: 10, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'n_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'n_003',
            worldId: 'world_n',
            levelNumber: 3,
            name: 'Prvé n-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['vino', 'noviny', 'menu', 'noc', 'nanuk'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 1,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  
                    { x: 12, y: 7 },  
                    { x: 10, y: 12 }
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 14, y: 9 },   
                    { x: 9, y: 10 },
                    { x: 10, y: 12 }
                ],
                crystals: [
                    { x: 1, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'n_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'n_004',
            worldId: 'world_n',
            levelNumber: 4,
            name: 'Prvé n-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['nuda', 'nos', 'vina', 'nula', 'noc', 'nanuk'],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 7 },  
                    { x: 9, y: 14 }
                ],
                golds: [
                    { x: 3, y: 9 },  
                    { x: 7, y: 8 },   
                    { x: 14, y: 6 }   
                ],
                crystals: [
					{ x: 4, y: 12 },
                    { x: 7, y: 11 }   
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'n_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'n_005',
            worldId: 'world_n',
            levelNumber: 5,
            name: 'Prvé n-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['vino', 'noviny', 'menu', 'noha', 'nuda', 'noc', 'nanuk'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 4,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 13, y: 8 }, 
                    { x: 9, y: 10 },  
                    { x: 1, y: 14 }
                ],
                golds: [
                    { x: 0, y: 9 },
                    { x: 3, y: 10 },					
                    { x: 7, y: 8 }   
                ],
                crystals: [
                    { x: 2, y: 10 },
                    { x: 6, y: 12 },
                    { x: 14, y: 14 },					
                    { x: 8, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'n_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'n_006',
            worldId: 'world_n',
            levelNumber: 6,
            name: 'Prvé n-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['vino', 'noviny', 'menu', 'noha', 'nuda', 'nos', 'vina', 'nula', 'noc', 'nanuk'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 7 }, 
                    { x: 10, y: 7 },  
                    { x: 2, y: 14 }
                ],
                golds: [
                    { x: 1, y: 9 },
                    { x: 10, y: 10 },
                    { x: 6, y: 7 },
                    { x: 3, y: 15 },					
                    { x: 15, y: 12 }   
                ],
                crystals: [
                    { x: 7, y: 11 },   
                    { x: 10, y: 15 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'n_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'n_007',
            worldId: 'world_n',
            levelNumber: 7,
            name: 'Prvé n-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['vino', 'noviny', 
                'nápis', 'nádoba', 'nákup', 'nápoj', 'nafta', 'nikel', 'nábytok'
            ],       
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 10 },  
                    { x: 14, y: 14 }
                ],
                golds: [
                    { x: 5, y: 8 },   
                    { x: 7, y: 12 }  
                ],
                crystals: [   
                    { x: 10, y: 9 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'n_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'n_008',
            worldId: 'world_n',
            levelNumber: 8,
            name: 'Prvé n-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['vino', 'noviny', 'menu', 'noha', 'nuda', 'nos', 'vina', 'nula', 'noc', 'nanuk',
                 'nafta', 'nikel', 'nábytok'
            ],  
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 10, y: 6 }, 
                    { x: 6, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 8, y: 12 },
                    { x: 1, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 15 },    
                    { x: 14, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'n_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'n_009',
            worldId: 'world_n',
            levelNumber: 9,
            name: 'Prvé n-čka',
            gameType: 'banik',
            difficulty: 3,
            words: [ 'nuda', 'nos', 'vina', 'nula', 'noc', 'nanuk',
                'nápis', 'nádoba', 'nákup', 'nápoj', 'nafta', 'nikel', 'nábytok'
            ],   
            gameConfig: {
				diamonds: 3,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 },
                    { x: 2, y: 9 }
                ],
                golds: [
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 0, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 11 },    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'n_008',
                minStars: 10
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'n_010',
            worldId: 'world_n',
            levelNumber: 10,
            name: 'Prvé n-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['vino', 'noviny', 'menu', 'noha', 'nuda', 'nos', 'vina', 'nula', 'noc', 'nanuk',
                'nápis', 'nádoba', 'nákup'
            ],            
            gameConfig: {
				diamonds: 4,
                golds: 6,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  
                    { x: 10, y: 14 },
                    { x: 6, y: 8 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 1, y: 9 },
                    { x: 3, y: 8 },
                    { x: 5, y: 11 }
                ],
                crystals: [
                    { x: 14, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'n_009',
                minStars: 11
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'n_011',
            worldId: 'world_n',
            levelNumber: 11,
            name: 'Prvé nka',
            gameType: 'banik',
            difficulty: 3,
            words: [ 'nula', 'noc', 'nanuk',
                'nápis', 'nádoba', 'nákup', 'nápoj', 'nafta', 'nikel', 'nábytok'
            ],                 
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 15, y: 14 },  
					{ x: 12, y: 15 },  
                    { x: 3, y: 12 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 4, y: 15 },
                    { x: 5, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 13 },    
                    { x: 6, y: 7 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'n_010',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'n_012',
            worldId: 'world_n',
            levelNumber: 12,
            name: 'Prvé n-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['vino', 'noviny', 'menu', 'noha', 'nuda', 'nos', 'vina', 'nula', 'noc', 'nanuk',
                'nápis', 'nádoba', 'nákup', 'nápoj', 'nafta', 'nikel', 'nábytok'
            ],  
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 7 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 6, y: 9 },   
                    { x: 7, y: 11 },  
                    { x: 14, y: 12 },
                    { x: 4, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'n_011',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'n_013',
            worldId: 'world_n',
            levelNumber: 13,
            name: 'Prvé n-ka',
            gameType: 'banik',
            difficulty: 4,
            words: ['vino', 'nápoj', 'nafta', 'nikel', 'nábytok', 'nástroj', 'nálepka', 'neón',
                'netvor', 'nádrž', 'náradie'
            ],     
            gameConfig: {
                diamonds: 5,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 12 },  // diamant na pozícii 3,8
                    { x: 9, y: 11 },
                    { x: 10, y: 14 },
                    { x: 5, y: 9 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 14, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 10 },   // gold na pozícii 7,8
                    { x: 2, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'n_012',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'n_014',
            worldId: 'world_n',
            levelNumber: 14,
            name: 'Prvé n-čka',
            gameType: 'banik',
            difficulty: 4,
            words: ['vino', 'noviny', 'nanuk',
                'nápis', 'nádoba', 'nákup', 'nástroj', 'nálepka', 'neón',
                'netvor', 'nádrž', 'náradie'
            ],    
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 10 },   
                    { x: 0, y: 12 },   
                    { x: 6, y: 13 },
                    { x: 14, y: 15 }
                ],
                crystals: [
                    { x: 9, y: 8 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'n_013',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'n_015',
            worldId: 'world_n',
            levelNumber: 15,
            name: 'Prvé n-čka',
            gameType: 'banik',
            difficulty: 4,
            words: [
                'nápis', 'nádoba', 'nákup', 'nápoj', 'nafta', 'nikel', 'nábytok', 'nástroj', 'nálepka', 'neón',
                'netvor', 'nádrž', 'náradie'
            ],       
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 10 }
                ],
                golds: [
                    { x: 0, y: 11 },   
                    { x: 4, y: 9 },  
                    { x: 7, y: 15 },
                    { x: 15, y: 13 }
                ],
                crystals: [
                    { x: 13, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'n_014',
                minStars: 16
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'n_016',
            worldId: 'world_n',
            levelNumber: 16,
            name: 'Prvé n-čka',
            gameType: 'banik',
            difficulty: 5,
            words: ['vino', 'noviny', 'menu', 'noha', 'nuda', 'nos', 'vina', 'nula', 'noc', 'nanuk',
                'nápis', 'nádoba', 'nákup', 'nápoj', 'nafta', 'nikel', 'nábytok', 'nástroj', 'nálepka', 'neón',
                'netvor', 'nádrž', 'náradie'
            ],    
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
				speechExercises: 4,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 8 },
					{ x: 12, y: 10 },
					{ x: 9, y: 12 },
					{ x: 4, y: 13 },					
                    { x: 15, y: 15 }
                ],
                golds: [
                    { x: 1, y: 8 },
					{ x: 2, y: 15 },
					{ x: 5, y: 13 },					
                    { x: 7, y: 9 },   
                    { x: 6, y: 15 },
                    { x: 13, y: 7 }
                ],
                crystals: [
                    { x: 10, y: 11 },  
                    { x: 2, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'n_015',
                minStars: 20
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
    ],
    world_nh: [
        {
            id: 'nh_001',
            worldId: 'world_nh',
            levelNumber: 1,
            name: 'Prvé nh-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['vaňa', 'dlaň', 'peň', 'jeseň'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 1,
                speechExercises: 1,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 12, y: 7 }
                ],
                golds: [
                    { x: 2, y: 9 }, 
					{ x: 5, y: 10 }, 
                    { x: 10, y: 13 },
                ],
                crystals: [
                    { x: 11, y: 9 }  
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'nh_002',
            worldId: 'world_nh',
            levelNumber: 2,
            name: 'Prvé n',
            gameType: 'banik',
            difficulty: 2,
            words: [ 'vaňa', 'dlaň', 'peň', 'jeseň', 'ňaňa', 'baňa'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 2,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 10 },
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 10, y: 8 }
                ],
                crystals: [
                    { x: 9, y: 7 },    
                    { x: 10, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'nh_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'nh_003',
            worldId: 'world_nh',
            levelNumber: 3,
            name: 'Prvé nh-ka',
            gameType: 'banik',
            difficulty: 1,
            words: [ 'vaňa', 'dlaň', 'peň', 'jeseň', 'ňaňa', 'baňa'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 1,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  
                    { x: 12, y: 7 },  
                    { x: 10, y: 12 }
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 14, y: 9 },   
                    { x: 9, y: 10 },
                    { x: 10, y: 12 }
                ],
                crystals: [
                    { x: 1, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'nh_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'nh_004',
            worldId: 'world_nh',
            levelNumber: 4,
            name: 'Prvé nh-ka',
            gameType: 'banik',
            difficulty: 1,
            words: [ 'vaňa', 'deň', 'dyňa', 'tuleň', 'kuchyňa'],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 7 },  
                    { x: 9, y: 14 }
                ],
                golds: [
                    { x: 3, y: 9 },  
                    { x: 7, y: 8 },   
                    { x: 14, y: 6 }   
                ],
                crystals: [
					{ x: 4, y: 12 },
                    { x: 7, y: 11 }   
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'nh_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'nh_005',
            worldId: 'world_nh',
            levelNumber: 5,
            name: 'Prvé nh-čka',
            gameType: 'banik',
            difficulty: 2,
            words: [ 'baňa', 'deň', 'dyňa', 'tuleň', 'kuchyňa'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 4,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 13, y: 8 }, 
                    { x: 9, y: 10 },  
                    { x: 1, y: 14 }
                ],
                golds: [
                    { x: 0, y: 9 },
                    { x: 3, y: 10 },					
                    { x: 7, y: 8 }   
                ],
                crystals: [
                    { x: 2, y: 10 },
                    { x: 6, y: 12 },
                    { x: 14, y: 14 },					
                    { x: 8, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'nh_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'nh_006',
            worldId: 'world_nh',
            levelNumber: 6,
            name: 'Prvé nh-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['peň', 'jeseň', 'ňaňa', 'baňa', 'deň', 'dyňa', 'kuchyňa'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 7 }, 
                    { x: 10, y: 7 },  
                    { x: 2, y: 14 }
                ],
                golds: [
                    { x: 1, y: 9 },
                    { x: 10, y: 10 },
                    { x: 6, y: 7 },
                    { x: 3, y: 15 },					
                    { x: 15, y: 12 }   
                ],
                crystals: [
                    { x: 7, y: 11 },   
                    { x: 10, y: 15 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'nh_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'nh_007',
            worldId: 'world_nh',
            levelNumber: 7,
            name: 'Prvé nh-čka',
            gameType: 'banik',
            difficulty: 2,
            words: [ 'vaňa', 'dlaň', 'peň', 'jeseň', 'ňaňa', 'baňa', 'deň', 'dyňa', 'tuleň', 'kuchyňa'],     
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 10 },  
                    { x: 14, y: 14 }
                ],
                golds: [
                    { x: 5, y: 8 },   
                    { x: 7, y: 12 }  
                ],
                crystals: [   
                    { x: 10, y: 9 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'nh_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'nh_008',
            worldId: 'world_nh',
            levelNumber: 8,
            name: 'Prvé nh-čka',
            gameType: 'banik',
            difficulty: 2,
            words: [ 'vaňa', 'dlaň', 'peň', 'jeseň', 'ňaňa', 'baňa', 'deň', 'dyňa', 'tuleň', 'kuchyňa'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 10, y: 6 }, 
                    { x: 6, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 8, y: 12 },
                    { x: 1, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 15 },    
                    { x: 14, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'nh_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'nh_009',
            worldId: 'world_nh',
            levelNumber: 9,
            name: 'Prvé nh-čka',
            gameType: 'banik',
            difficulty: 3,
            words: [ 'kuchyňa',
                'kôň', 'hrebeň', 'báseň'
            ],  
            gameConfig: {
				diamonds: 3,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 },
                    { x: 2, y: 9 }
                ],
                golds: [
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 0, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 11 },    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'nh_008',
                minStars: 10
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'nh_010',
            worldId: 'world_nh',
            levelNumber: 10,
            name: 'Prvé nh-čka',
            gameType: 'banik',
            difficulty: 3,
            words: [ 'vaňa', 'deň', 'dyňa', 'tuleň', 'kuchyňa',
                'kôň', 'hrebeň', 'báseň'
            ],             
            gameConfig: {
				diamonds: 4,
                golds: 6,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  
                    { x: 10, y: 14 },
                    { x: 6, y: 8 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 1, y: 9 },
                    { x: 3, y: 8 },
                    { x: 5, y: 11 }
                ],
                crystals: [
                    { x: 14, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'nh_009',
                minStars: 11
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'nh_011',
            worldId: 'world_nh',
            levelNumber: 11,
            name: 'Prvé nhka',
            gameType: 'banik',
            difficulty: 3,
            words: [ 'dyňa', 'tuleň', 'kuchyňa',
                'kôň', 'hrebeň', 'báseň'
            ],                 
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 15, y: 14 },  
					{ x: 12, y: 15 },  
                    { x: 3, y: 12 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 4, y: 15 },
                    { x: 5, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 13 },    
                    { x: 6, y: 7 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'nh_010',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'nh_012',
            worldId: 'world_nh',
            levelNumber: 12,
            name: 'Prvé nh-čka',
            gameType: 'banik',
            difficulty: 3,
            words: [ 'jeseň', 'ňaňa', 'baňa', 'deň', 'dyňa', 'tuleň', 'kuchyňa',
                'kôň', 'hrebeň', 'báseň'
            ], 
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 7 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 6, y: 9 },   
                    { x: 7, y: 11 },  
                    { x: 14, y: 12 },
                    { x: 4, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'nh_011',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'nh_013',
            worldId: 'world_nh',
            levelNumber: 13,
            name: 'Prvé nh-ka',
            gameType: 'banik',
            difficulty: 4,
            words: [ 'vaňa', 'dlaň', 'peň', 'jeseň', 'ňaňa', 'baňa', 'deň', 'dyňa', 'tuleň', 'kuchyňa',
                'kôň', 'hrebeň', 'báseň'
            ],    
            gameConfig: {
                diamonds: 5,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 12 },  // diamant na pozícii 3,8
                    { x: 9, y: 11 },
                    { x: 10, y: 14 },
                    { x: 5, y: 9 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 14, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 10 },   // gold na pozícii 7,8
                    { x: 2, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'nh_012',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'nh_014',
            worldId: 'world_nh',
            levelNumber: 14,
            name: 'Prvé nh-čka',
            gameType: 'banik',
            difficulty: 4,
            words: [ 'vaňa', 'kuchyňa',
                'kôň', 'hrebeň', 'báseň', 'laň', 'dielňa', 'remeň', 'vyhňa'
            ],     
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 10 },   
                    { x: 0, y: 12 },   
                    { x: 6, y: 13 },
                    { x: 14, y: 15 }
                ],
                crystals: [
                    { x: 9, y: 8 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'nh_013',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'nh_015',
            worldId: 'world_nh',
            levelNumber: 15,
            name: 'Prvé nh-čka',
            gameType: 'banik',
            difficulty: 4,
            words: [ 'ňaňa', 'baňa', 'deň', 'dyňa', 'tuleň', 'kuchyňa',
                'kôň', 'hrebeň', 'báseň', 'laň', 'dielňa', 'remeň', 'vyhňa'
            ],       
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 10 }
                ],
                golds: [
                    { x: 0, y: 11 },   
                    { x: 4, y: 9 },  
                    { x: 7, y: 15 },
                    { x: 15, y: 13 }
                ],
                crystals: [
                    { x: 13, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'nh_014',
                minStars: 16
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'nh_016',
            worldId: 'world_nh',
            levelNumber: 16,
            name: 'Prvé nh-čka',
            gameType: 'banik',
            difficulty: 5,
            words: [ 'vaňa', 'dlaň', 'peň', 'jeseň', 'ňaňa', 'baňa', 'deň', 'dyňa', 'tuleň', 'kuchyňa',
                'kôň', 'hrebeň', 'báseň', 'laň', 'dielňa', 'remeň', 'vyhňa'
            ],   
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
				speechExercises: 4,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 8 },
					{ x: 12, y: 10 },
					{ x: 9, y: 12 },
					{ x: 4, y: 13 },					
                    { x: 15, y: 15 }
                ],
                golds: [
                    { x: 1, y: 8 },
					{ x: 2, y: 15 },
					{ x: 5, y: 13 },					
                    { x: 7, y: 9 },   
                    { x: 6, y: 15 },
                    { x: 13, y: 7 }
                ],
                crystals: [
                    { x: 10, y: 11 },  
                    { x: 2, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'nh_015',
                minStars: 20
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
    ],
    world_k: [
        {
            id: 'k_001',
            worldId: 'world_k',
            levelNumber: 1,
            name: 'Prvé k-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['káva', 'kefa', 'kosť', 'kilo'
            ],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 1,
                speechExercises: 1,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 12, y: 7 }
                ],
                golds: [
                    { x: 2, y: 9 }, 
					{ x: 5, y: 10 }, 
                    { x: 10, y: 13 },
                ],
                crystals: [
                    { x: 11, y: 9 }  
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'k_002',
            worldId: 'world_k',
            levelNumber: 2,
            name: 'Prvé k',
            gameType: 'banik',
            difficulty: 2,
            words: ['káva', 'kefa', 'kosť', 'kilo', 'kuna'
            ],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 2,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 10 },
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 10, y: 8 }
                ],
                crystals: [
                    { x: 9, y: 7 },    
                    { x: 10, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'k_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'k_003',
            worldId: 'world_k',
            levelNumber: 3,
            name: 'Prvé k-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['káva', 'kefa', 'kosť', 'kilo', 'kuna', 'kupiť'
            ],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 1,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  
                    { x: 12, y: 7 },  
                    { x: 10, y: 12 }
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 14, y: 9 },   
                    { x: 9, y: 10 },
                    { x: 10, y: 12 }
                ],
                crystals: [
                    { x: 1, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'k_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'k_004',
            worldId: 'world_k',
            levelNumber: 4,
            name: 'Prvé k-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['káva', 'kilo', 'kuna', 'kupiť', 'múka', 'oko'
                
            ],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 7 },  
                    { x: 9, y: 14 }
                ],
                golds: [
                    { x: 3, y: 9 },  
                    { x: 7, y: 8 },   
                    { x: 14, y: 6 }   
                ],
                crystals: [
					{ x: 4, y: 12 },
                    { x: 7, y: 11 }   
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'k_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'k_005',
            worldId: 'world_k',
            levelNumber: 5,
            name: 'Prvé k-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['káva', 'kefa', 'kosť', 'kilo', 'kuna', 'kupiť', 'múka', 'oko', 'hák', 'hokej'
                
            ],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 4,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 13, y: 8 }, 
                    { x: 9, y: 10 },  
                    { x: 1, y: 14 }
                ],
                golds: [
                    { x: 0, y: 9 },
                    { x: 3, y: 10 },					
                    { x: 7, y: 8 }   
                ],
                crystals: [
                    { x: 2, y: 10 },
                    { x: 6, y: 12 },
                    { x: 14, y: 14 },					
                    { x: 8, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'k_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'k_006',
            worldId: 'world_k',
            levelNumber: 6,
            name: 'Prvé k-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['kosť', 'kilo', 'kuna', 'kupiť', 'múka', 'oko', 'hák', 'hokej',
                'puk', 'Katka', 'kabát'
            ],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 7 }, 
                    { x: 10, y: 7 },  
                    { x: 2, y: 14 }
                ],
                golds: [
                    { x: 1, y: 9 },
                    { x: 10, y: 10 },
                    { x: 6, y: 7 },
                    { x: 3, y: 15 },					
                    { x: 15, y: 12 }   
                ],
                crystals: [
                    { x: 7, y: 11 },   
                    { x: 10, y: 15 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'k_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'k_007',
            worldId: 'world_k',
            levelNumber: 7,
            name: 'Prvé k-čka',
            gameType: 'banik',
            difficulty: 2,
            words: [ 'múka', 'oko', 'hák', 'hokej',
                'puk', 'Katka', 'kabát', 'kukučka', 'kakao'
            ],     
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 10 },  
                    { x: 14, y: 14 }
                ],
                golds: [
                    { x: 5, y: 8 },   
                    { x: 7, y: 12 }  
                ],
                crystals: [   
                    { x: 10, y: 9 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'k_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'k_008',
            worldId: 'world_k',
            levelNumber: 8,
            name: 'Prvé k-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['káva', 'kefa', 'kosť', 'kilo', 'kuna', 'kupiť', 'múka', 'oko', 'hák', 'hokej',
                'puk', 'Katka', 'kabát'
                
            ],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 10, y: 6 }, 
                    { x: 6, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 8, y: 12 },
                    { x: 1, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 15 },    
                    { x: 14, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'k_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'k_009',
            worldId: 'world_k',
            levelNumber: 9,
            name: 'Prvé k-čka',
            gameType: 'banik',
            difficulty: 3,
            words: [
                'puk', 'Katka', 'kabát', 'kukučka', 'kakao', 'kniha', 'koleno', 'kohút', 'koník'
                
            ],   
            gameConfig: {
				diamonds: 3,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 },
                    { x: 2, y: 9 }
                ],
                golds: [
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 0, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 11 },    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'k_008',
                minStars: 10
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'k_010',
            worldId: 'world_k',
            levelNumber: 10,
            name: 'Prvé k-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['káva', 'kefa', 'kosť', 'kilo', 'kuna', 'kupiť', 'múka', 'oko', 'hák', 'hokej',
                'puk', 'Katka', 'kabát', 'kukučka', 'kakao', 'kniha', 'koleno', 'kohút', 'koník'
                
            ],            
            gameConfig: {
				diamonds: 4,
                golds: 6,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  
                    { x: 10, y: 14 },
                    { x: 6, y: 8 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 1, y: 9 },
                    { x: 3, y: 8 },
                    { x: 5, y: 11 }
                ],
                crystals: [
                    { x: 14, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'k_009',
                minStars: 11
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'k_011',
            worldId: 'world_k',
            levelNumber: 11,
            name: 'Prvé kka',
            gameType: 'banik',
            difficulty: 3,
            words: [ 'kuna', 'kupiť', 'múka', 'oko', 'hák', 'hokej',
                 'kakao', 'kniha', 'koleno', 'kohút', 'koník',
                'kvet', 'kotol'
            ],                 
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 15, y: 14 },  
					{ x: 12, y: 15 },  
                    { x: 3, y: 12 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 4, y: 15 },
                    { x: 5, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 13 },    
                    { x: 6, y: 7 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'k_010',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'k_012',
            worldId: 'world_k',
            levelNumber: 12,
            name: 'Prvé k-čka',
            gameType: 'banik',
            difficulty: 3,
            words: [
                'puk', 'Katka', 'kabát', 'kukučka', 'kakao', 'kniha', 'koleno', 'kohút', 'koník',
                'kvet', 'kotol', 'keks', 'kopa'
            ],  
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 7 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 6, y: 9 },   
                    { x: 7, y: 11 },  
                    { x: 14, y: 12 },
                    { x: 4, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'k_011',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'k_013',
            worldId: 'world_k',
            levelNumber: 13,
            name: 'Prvé k-ka',
            gameType: 'banik',
            difficulty: 4,
            words: ['káva', 'kefa', 'kosť', 'kilo', 'kuna', 'kupiť', 'múka', 'oko', 'hák', 'hokej',
                'puk', 'Katka', 'kabát', 'kukučka', 'kakao', 'kniha', 'koleno'
                
            ],  
            gameConfig: {
                diamonds: 5,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 12 },  // diamant na pozícii 3,8
                    { x: 9, y: 11 },
                    { x: 10, y: 14 },
                    { x: 5, y: 9 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 14, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 10 },   // gold na pozícii 7,8
                    { x: 2, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'k_012',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'k_014',
            worldId: 'world_k',
            levelNumber: 14,
            name: 'Prvé k-čka',
            gameType: 'banik',
            difficulty: 4,
            words: [
                'puk', 'Katka', 'kabát', 'kukučka', 'kakao', 'kniha', 'koleno', 'kohút', 'koník',
                'kvet', 'kotol', 'keks', 'kopa', 'krhla', 'kolík', 'košík'
            ], 
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 10 },   
                    { x: 0, y: 12 },   
                    { x: 6, y: 13 },
                    { x: 14, y: 15 }
                ],
                crystals: [
                    { x: 9, y: 8 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'k_013',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'k_015',
            worldId: 'world_k',
            levelNumber: 15,
            name: 'Prvé k-čka',
            gameType: 'banik',
            difficulty: 4,
            words: [
                'puk', 'Katka', 'kabát', 'kukučka', 'kakao', 'kniha', 'koleno', 'kohút', 'koník',
                'kvet', 'kotol', 'keks', 'kopa', 'krhla', 'kolík', 'košík', 'kočík', 'kapusta'
            ],    
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 10 }
                ],
                golds: [
                    { x: 0, y: 11 },   
                    { x: 4, y: 9 },  
                    { x: 7, y: 15 },
                    { x: 15, y: 13 }
                ],
                crystals: [
                    { x: 13, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'k_014',
                minStars: 16
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'k_016',
            worldId: 'world_k',
            levelNumber: 16,
            name: 'Prvé k-čka',
            gameType: 'banik',
            difficulty: 5,
            words: ['káva', 'kefa', 'kosť', 'kilo', 'kuna', 'kúpiť', 'múka', 'oko', 'hák', 'hokej',
                'puk', 'Katka', 'kabát', 'kukučka', 'kakao', 'kniha', 'koleno', 'kohút', 'koník',
                'kvet', 'kotol', 'keks', 'kopa', 'krhla', 'kolík', 'košík', 'kočík', 'kapusta'
            ],   
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
				speechExercises: 4,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 8 },
					{ x: 12, y: 10 },
					{ x: 9, y: 12 },
					{ x: 4, y: 13 },					
                    { x: 15, y: 15 }
                ],
                golds: [
                    { x: 1, y: 8 },
					{ x: 2, y: 15 },
					{ x: 5, y: 13 },					
                    { x: 7, y: 9 },   
                    { x: 6, y: 15 },
                    { x: 13, y: 7 }
                ],
                crystals: [
                    { x: 10, y: 11 },  
                    { x: 2, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'k_015',
                minStars: 20
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
    ],
    world_g: [
        {
            id: 'g_001',
            worldId: 'world_g',
            levelNumber: 1,
            name: 'Prvé g-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['gajdy', 'gitara', 'guma', 'liga'               
            ],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 1,
                speechExercises: 1,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 12, y: 7 }
                ],
                golds: [
                    { x: 2, y: 9 }, 
					{ x: 5, y: 10 }, 
                    { x: 10, y: 13 },
                ],
                crystals: [
                    { x: 11, y: 9 }  
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'g_002',
            worldId: 'world_g',
            levelNumber: 2,
            name: 'Prvé g',
            gameType: 'banik',
            difficulty: 2,
            words: ['gajdy', 'gitara', 'guma', 'liga', 'figa'              
            ],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 2,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 10 },
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 10, y: 8 }
                ],
                crystals: [
                    { x: 9, y: 7 },    
                    { x: 10, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'g_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'g_003',
            worldId: 'world_g',
            levelNumber: 3,
            name: 'Prvé g-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['gajdy', 'gitara', 'guma', 'liga', 'figa', 'vagón', 'magnet'               
            ],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 1,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  
                    { x: 12, y: 7 },  
                    { x: 10, y: 12 }
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 14, y: 9 },   
                    { x: 9, y: 10 },
                    { x: 10, y: 12 }
                ],
                crystals: [
                    { x: 1, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'g_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'g_004',
            worldId: 'world_g',
            levelNumber: 4,
            name: 'Prvé g-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['gajdy', 'gitara', 'figa', 'vagón', 'magnet', 'Gabo', 'gól', 'gombík'               
            ],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 7 },  
                    { x: 9, y: 14 }
                ],
                golds: [
                    { x: 3, y: 9 },  
                    { x: 7, y: 8 },   
                    { x: 14, y: 6 }   
                ],
                crystals: [
					{ x: 4, y: 12 },
                    { x: 7, y: 11 }   
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'g_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'g_005',
            worldId: 'world_g',
            levelNumber: 5,
            name: 'Prvé g-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['gajdy', 'gitara', 'guma', 'liga', 'figa', 'Gabo', 'gól', 'gombík'               
            ],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 4,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 13, y: 8 }, 
                    { x: 9, y: 10 },  
                    { x: 1, y: 14 }
                ],
                golds: [
                    { x: 0, y: 9 },
                    { x: 3, y: 10 },					
                    { x: 7, y: 8 }   
                ],
                crystals: [
                    { x: 2, y: 10 },
                    { x: 6, y: 12 },
                    { x: 14, y: 14 },					
                    { x: 8, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'g_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'g_006',
            worldId: 'world_g',
            levelNumber: 6,
            name: 'Prvé g-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['gajdy', 'gitara', 'guma', 'liga', 'figa', 'vagón', 'magnet', 'Gabo', 'gól', 'gombík'               
            ],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 7 }, 
                    { x: 10, y: 7 },  
                    { x: 2, y: 14 }
                ],
                golds: [
                    { x: 1, y: 9 },
                    { x: 10, y: 10 },
                    { x: 6, y: 7 },
                    { x: 3, y: 15 },					
                    { x: 15, y: 12 }   
                ],
                crystals: [
                    { x: 7, y: 11 },   
                    { x: 10, y: 15 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'g_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'g_007',
            worldId: 'world_g',
            levelNumber: 7,
            name: 'Prvé g-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['gajdy', 'Gabo', 'gól', 'gombík',
                'bageta', 'lego', 'gazda', 'gumáky', 'guľa'                
            ],    
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 10 },  
                    { x: 14, y: 14 }
                ],
                golds: [
                    { x: 5, y: 8 },   
                    { x: 7, y: 12 }  
                ],
                crystals: [   
                    { x: 10, y: 9 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'g_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'g_008',
            worldId: 'world_g',
            levelNumber: 8,
            name: 'Prvé g-čka',
            gameType: 'banik',
            difficulty: 2,
            words: ['gajdy', 'gitara', 'guma', 'liga', 'figa', 'vagón', 'magnet', 'Gabo', 'gazda', 'gumáky', 'guľa'                
            ],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 10, y: 6 }, 
                    { x: 6, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 8, y: 12 },
                    { x: 1, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 15 },    
                    { x: 14, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'g_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'g_009',
            worldId: 'world_g',
            levelNumber: 9,
            name: 'Prvé g-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['gajdy', 'gitara', 'guma', 'liga', 'figa', 'vagón', 'magnet', 'Gabo', 'gól', 'gombík',
                'bageta', 'lego', 'gazda', 'gumáky', 'guľa'                
            ],
            gameConfig: {
				diamonds: 3,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 },
                    { x: 2, y: 9 }
                ],
                golds: [
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 0, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 11 },    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'g_008',
                minStars: 10
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'g_010',
            worldId: 'world_g',
            levelNumber: 10,
            name: 'Prvé g-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['gajdy', 'gitara', 'magnet', 'Gabo', 'gól', 'gombík',
                 'guláš', 'gondola', 'gong', 'gunár', 'glóbus', 'gaštan'
                
            ],         
            gameConfig: {
				diamonds: 4,
                golds: 6,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  
                    { x: 10, y: 14 },
                    { x: 6, y: 8 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 1, y: 9 },
                    { x: 3, y: 8 },
                    { x: 5, y: 11 }
                ],
                crystals: [
                    { x: 14, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'g_009',
                minStars: 11
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'g_011',
            worldId: 'world_g',
            levelNumber: 11,
            name: 'Prvé gka',
            gameType: 'banik',
            difficulty: 3,
            words: ['gajdy', 'gitara', 'guma', 'liga', 'figa', 'vagón', 'magnet', 'Gabo', 'gól', 'gombík',
                'bageta', 'lego', 'gazda', 'gumáky', 'guľa', 'guláš'
            ],                 
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 15, y: 14 },  
					{ x: 12, y: 15 },  
                    { x: 3, y: 12 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 4, y: 15 },
                    { x: 5, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 13 },    
                    { x: 6, y: 7 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'g_010',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'g_012',
            worldId: 'world_g',
            levelNumber: 12,
            name: 'Prvé g-čka',
            gameType: 'banik',
            difficulty: 3,
            words: ['Gabo', 'gól', 'gombík',
                'bageta', 'lego', 'gazda', 'gumáky', 'guľa', 'guláš', 'gondola', 'gong', 'gunár', 
                'glóbus', 'gaštan'
            ],   
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 7 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 6, y: 9 },   
                    { x: 7, y: 11 },  
                    { x: 14, y: 12 },
                    { x: 4, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 15 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'g_011',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'g_013',
            worldId: 'world_g',
            levelNumber: 13,
            name: 'Prvé g-ka',
            gameType: 'banik',
            difficulty: 4,
            words: ['gajdy', 'gitara', 'guma', 'liga', 'figa', 'vagón', 'magnet', 'Gabo', 'gól', 'gombík',
                'bageta', 'lego', 'gazda', 'gumáky', 'guľa', 'guláš', 'gondola', 'gong', 'gunár', 'glóbus', 'gaštan'
                
            ], 
            gameConfig: {
                diamonds: 5,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 12 },  // diamant na pozícii 3,8
                    { x: 9, y: 11 },
                    { x: 10, y: 14 },
                    { x: 5, y: 9 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 14, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 10 },   // gold na pozícii 7,8
                    { x: 2, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'g_012',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'g_014',
            worldId: 'world_g',
            levelNumber: 14,
            name: 'Prvé g-čka',
            gameType: 'banik',
            difficulty: 4,
            words: [ 'gong', 'gunár', 'glóbus', 'gaštan',
                'tágo', 'golf', 'bager', 'bungalov', 'kengura', 'doga', 'orgován', 'gorila'
            ], 
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 10 },   
                    { x: 0, y: 12 },   
                    { x: 6, y: 13 },
                    { x: 14, y: 15 }
                ],
                crystals: [
                    { x: 9, y: 8 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'g_013',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'g_015',
            worldId: 'world_g',
            levelNumber: 15,
            name: 'Prvé g-čka',
            gameType: 'banik',
            difficulty: 4,
            words: [
                'bageta', 'lego', 'gazda', 'gumáky', 'guľa', 'guláš', 'gondola', 'gong', 'gunár', 'glóbus', 'gaštan',
                'tágo', 'golf', 'bager', 'bungalov', 'kengura', 'doga', 'orgován', 'gorila'
            ],   
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 10 }
                ],
                golds: [
                    { x: 0, y: 11 },   
                    { x: 4, y: 9 },  
                    { x: 7, y: 15 },
                    { x: 15, y: 13 }
                ],
                crystals: [
                    { x: 13, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'g_014',
                minStars: 16
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'g_016',
            worldId: 'world_g',
            levelNumber: 16,
            name: 'Prvé g-čka',
            gameType: 'banik',
            difficulty: 5,
            words: ['gajdy', 'gitara', 'guma', 'liga', 'figa', 'vagón', 'magnet', 'Gabo', 'gól', 'gombík',
                'bageta', 'lego', 'gazda', 'gumáky', 'guľa', 'guláš', 'gondola', 'gong', 'gunár', 'glóbus', 'gaštan',
                'tágo', 'golf', 'bager', 'bungalov', 'kengura', 'doga', 'orgován', 'gorila'
            ],   
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
				speechExercises: 4,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 8 },
					{ x: 12, y: 10 },
					{ x: 9, y: 12 },
					{ x: 4, y: 13 },					
                    { x: 15, y: 15 }
                ],
                golds: [
                    { x: 1, y: 8 },
					{ x: 2, y: 15 },
					{ x: 5, y: 13 },					
                    { x: 7, y: 9 },   
                    { x: 6, y: 15 },
                    { x: 13, y: 7 }
                ],
                crystals: [
                    { x: 10, y: 11 },  
                    { x: 2, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'g_015',
                minStars: 20
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
    ],
};

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