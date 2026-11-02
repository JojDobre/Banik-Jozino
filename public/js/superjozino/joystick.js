//////////////////////////////////////////////////
// ====== VIRTUAL JOYSTICK FUNKCIONALITA ====== //
//     MECHANIKA POHYBU PRE MOBILY/TABLETY      //
//          (SUPERJOZINO - HORIZONTAL)          //
//////////////////////////////////////////////////

///////////////////////////////////////////////
//       Premenné pre virtual joystick       //
///////////////////////////////////////////////
let joystickActive = false;                    // Či je joystick aktívny
let joystickCenter = { x: 0, y: 0 };          // Stred joysticku
let joystickKnob = null;                      // Element knobu
let joystickBase = null;                      // Element základne
let joystickContainer = null;                 // Kontajner joysticku
let joystickRadius = 45;                      // Polomer pohybu knobu (v pixeloch)
let currentDirection = null;                  // Aktuálny smer ('left' alebo 'right')
let moveInterval = null;                      // Interval pre opakovaný pohyb

///////////////////////////////////////////////
// Inicializácia joysticku po načítaní DOM   //
///////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    // Počkaj chvíľu, kým sa načíta celá stránka
    setTimeout(initVirtualJoystick, 100);
});

/**
 * Inicializácia virtual joysticku
 * Nastaví event listenery pre touch a mouse eventy
 */
function initVirtualJoystick() {
    // Získaj elementy z DOM
    joystickContainer = document.getElementById('virtualJoystick');
    joystickKnob = document.getElementById('joystickKnob');
    joystickBase = document.querySelector('.joystick-base');
    
    // Kontrola, či existujú elementy
    if (!joystickContainer || !joystickKnob) {
        console.warn('Joystick elementy nenájdené - pravdepodobne desktop verzia');
        return;
    }
    
    // Vypočítaj stred joysticku
    const rect = joystickContainer.getBoundingClientRect();
    joystickCenter.x = rect.width / 2;
    joystickCenter.y = rect.height / 2;
    
    // Event listenery pre TOUCH eventy (mobily/tablety)
    joystickKnob.addEventListener('touchstart', handleTouchStart, { passive: false });
    joystickKnob.addEventListener('touchmove', handleTouchMove, { passive: false });
    joystickKnob.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Event listenery pre MOUSE eventy (testovanie na desktope)
    joystickKnob.addEventListener('mousedown', handleMouseStart);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseEnd);
    
    console.log('Virtual Joystick inicializovaný');
}

///////////////////////////////////////////////
//           Touch Start Handler             //
///////////////////////////////////////////////
/**
 * Spracovanie začiatku dotyku na joysticku
 * @param {TouchEvent} e - Touch event
 */
function handleTouchStart(e) {
    e.preventDefault(); // Zabráň scrollovaniu stránky
    joystickActive = true;
    joystickContainer.classList.add('active'); // Pridaj vizuálny efekt
}

///////////////////////////////////////////////
//            Touch Move Handler             //
///////////////////////////////////////////////
/**
 * Spracovanie pohybu prsta po joysticku
 * @param {TouchEvent} e - Touch event
 */
function handleTouchMove(e) {
    e.preventDefault(); // Zabráň scrollovaniu
    if (!joystickActive) return;
    
    // Získaj pozíciu dotyku
    const touch = e.touches[0];
    const rect = joystickContainer.getBoundingClientRect();
    
    // Vypočítaj relatívnu pozíciu od stredu joysticku
    const x = touch.clientX - rect.left - joystickCenter.x;
    const y = touch.clientY - rect.top - joystickCenter.y;
    
    // Aktualizuj pozíciu knobu a pohyb hráča
    updateJoystickPosition(x, y);
}

///////////////////////////////////////////////
//             Touch End Handler             //
///////////////////////////////////////////////
/**
 * Spracovanie ukončenia dotyku
 * @param {TouchEvent} e - Touch event
 */
function handleTouchEnd(e) {
    e.preventDefault();
    resetJoystick(); // Vráť joystick do pôvodnej polohy
}

///////////////////////////////////////////////
//      Mouse Start Handler (testovanie)     //
///////////////////////////////////////////////
/**
 * Spracovanie stlačenia myši na joysticku
 * @param {MouseEvent} e - Mouse event
 */
function handleMouseStart(e) {
    e.preventDefault();
    joystickActive = true;
    joystickContainer.classList.add('active');
}

///////////////////////////////////////////////
//       Mouse Move Handler (testovanie)     //
///////////////////////////////////////////////
/**
 * Spracovanie pohybu myši
 * @param {MouseEvent} e - Mouse event
 */
function handleMouseMove(e) {
    if (!joystickActive) return;
    
    // Získaj pozíciu myši
    const rect = joystickContainer.getBoundingClientRect();
    
    // Vypočítaj relatívnu pozíciu od stredu
    const x = e.clientX - rect.left - joystickCenter.x;
    const y = e.clientY - rect.top - joystickCenter.y;
    
    // Aktualizuj pozíciu
    updateJoystickPosition(x, y);
}

///////////////////////////////////////////////
//        Mouse End Handler (testovanie)     //
///////////////////////////////////////////////
/**
 * Spracovanie uvolnenia myši
 * @param {MouseEvent} e - Mouse event
 */
function handleMouseEnd(e) {
    resetJoystick();
}

///////////////////////////////////////////////
// Aktualizácia pozície knobu a pohyb hráča  //
///////////////////////////////////////////////
/**
 * Aktualizuje pozíciu joystick knobu a určí smer pohybu
 * Pohyb je obmedzený len na horizontálnu os (vľavo/vpravo)
 * @param {number} x - Horizontálna vzdialenosť od stredu
 * @param {number} y - Vertikálna vzdialenosť od stredu (ignorovaná)
 */
function updateJoystickPosition(x, y) {
    // HORIZONTAL ONLY - ignorujeme Y os
    // Obmedz pohyb len na horizontálnu os
    const distance = Math.abs(x); // Vzdialenosť len na X osi
    const maxDistance = joystickRadius;
    
    let limitedX = x;
    
    // Ak je vzdialenosť väčšia ako max, obmedz ju
    if (distance > maxDistance) {
        limitedX = (x / distance) * maxDistance;
    }
    
    // Y os fixneme na 0 (len horizontálny pohyb)
    const limitedY = 0;
    
    // Aktualizuj vizuálnu pozíciu knobu (len horizontálne)
    joystickKnob.style.transform = `translate(calc(-50% + ${limitedX}px), -50%)`;
    
    // Určenie smeru pohybu na základe pozície X
    handleJoystickMovement(limitedX);
}

///////////////////////////////////////////////
//      Spracovanie pohybu hráča             //
///////////////////////////////////////////////
/**
 * Určí smer pohybu hráča na základe pozície joysticku
 * @param {number} x - Horizontálna pozícia joysticku
 */
function handleJoystickMovement(x) {
    const threshold = 15; // Minimálna vzdialenosť pre aktiváciu pohybu
    const distance = Math.abs(x);
    
    let newDirection = null;
    
    // Ak je joystick dostatočne ďaleko od stredu
    if (distance >= threshold) {
        if (x < 0) {
            newDirection = 'left';   // Vľavo
        } else {
            newDirection = 'right';  // Vpravo
        }
    }
    
    // Ak sa zmenil smer, aktualizuj game state
    if (newDirection !== currentDirection) {
        currentDirection = newDirection;
        updateGameControls(newDirection);
    }
}

///////////////////////////////////////////////
//    Aktualizácia herných kontrol           //
///////////////////////////////////////////////
/**
 * Aktualizuje stav klávesov v hre podľa smeru joysticku
 * @param {string|null} direction - Smer pohybu ('left', 'right', alebo null)
 */
function updateGameControls(direction) {
    // Prístup k game objektu (SuperJozinoGame)
    if (!window.game || !window.game.keys) {
        console.warn('Game object alebo keys nenájdené');
        return;
    }
    
    // Resetuj všetky smerové klávesy
    window.game.keys['ArrowLeft'] = false;
    window.game.keys['ArrowRight'] = false;
    
    // Nastav správny smer
    if (direction === 'left') {
        window.game.keys['ArrowLeft'] = true;
    } else if (direction === 'right') {
        window.game.keys['ArrowRight'] = true;
    }
}

///////////////////////////////////////////////
//         Reset joysticku na stred          //
///////////////////////////////////////////////
/**
 * Vráti joystick do pôvodnej pozície a zastaví pohyb
 */
function resetJoystick() {
    joystickActive = false;
    joystickContainer.classList.remove('active');
    
    // Vráť knob do stredu
    joystickKnob.style.transform = 'translate(-50%, -50%)';
    
    // Zastaví pohyb
    currentDirection = null;
    updateGameControls(null);
}

///////////////////////////////////////////////
//           Akčné tlačidlo (JUMP)           //
///////////////////////////////////////////////
/**
 * Inicializácia event listenerov pre akčné tlačidlo (skok)
 */
document.addEventListener('DOMContentLoaded', function() {
    // Počkaj chvíľu, kým sa načíta celá stránka
    setTimeout(initActionButton, 100);
});

/**
 * Inicializuje akčné tlačidlo pre skok
 */
function initActionButton() {
    const actionButton = document.getElementById('jumpButton');
    
    if (!actionButton) {
        console.warn('Jump button nenájdený - pravdepodobne desktop verzia');
        return;
    }
    
    // Touch eventy
    actionButton.addEventListener('touchstart', handleJumpTouch, { passive: false });
    actionButton.addEventListener('touchend', handleJumpRelease, { passive: false });
    
    // Mouse eventy (testovanie)
    actionButton.addEventListener('mousedown', handleJumpClick);
    actionButton.addEventListener('mouseup', handleJumpRelease);
    
    console.log('Jump button inicializovaný');
}

/**
 * Spracovanie stlačenia jump tlačidla (touch)
 * @param {TouchEvent} e - Touch event
 */
function handleJumpTouch(e) {
    e.preventDefault(); // Zabráň dvojitému vyvolaniu
    handleJump();
}

/**
 * Spracovanie stlačenia jump tlačidla (click)
 * @param {MouseEvent} e - Mouse event
 */
function handleJumpClick(e) {
    e.preventDefault();
    handleJump();
}

/**
 * Vykoná skok postavy
 */
function handleJump() {
    // Prístup k game objektu
    if (!window.game || !window.game.keys) {
        console.warn('Game object nenájdený');
        return;
    }
    
    // Simuluj stlačenie medzerníka (Space)
    window.game.keys['Space'] = true;
}

/**
 * Spracovanie uvolnenia jump tlačidla
 * @param {Event} e - Event
 */
function handleJumpRelease(e) {
    e.preventDefault();
    
    // Prístup k game objektu
    if (!window.game || !window.game.keys) {
        return;
    }
    
    // Uvoľni medzerník
    window.game.keys['Space'] = false;
}

///////////////////////////////////////////////
//              DEBUG FUNKCIE                //
///////////////////////////////////////////////
/**
 * Debug funkcia pre testovanie joysticku
 * Vypíše aktuálny stav do konzoly
 */
function debugJoystick() {
    console.log('=== JOYSTICK DEBUG ===');
    console.log('Active:', joystickActive);
    console.log('Direction:', currentDirection);
    console.log('Game keys:', window.game ? window.game.keys : 'Game nenájdené');
    console.log('=====================');
}

// Pridaj debug funkciu do globálneho scope pre testovanie
window.debugJoystick = debugJoystick;