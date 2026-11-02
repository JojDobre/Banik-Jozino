/**
 * JavaScript súbor pre menu.html - spracovanie interaktívnych prvkov
 * Autor: Adam Reňak
 */

// Čakanie na načítanie DOM obsahu
document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('load', function() {
        setTimeout(hideLoadingScreen, 1000); // Čaká 1 sekundu potom skryje
    });
    
    console.log('Menu načítané a pripravené na použitie');
    initializeMenu();
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

/**
 * Hlavná inicializačná funkcia pre menu
 */
function initializeMenu() {
    setupModalHandlers();
    setupMenuButtons();
    setupCharacterAnimation();
}

/**
 * Nastavenie obsluhy modálnych okien (pravidlá, o projekte)
 */
function setupModalHandlers() {
   // Rules modal
   const rulesModal = document.getElementById('rules-modal');
   const showInfoButton = document.querySelector('.show-rules');
   const rulesCloseButton = rulesModal?.querySelector('.close');
   
   // About modal
   const aboutModal = document.getElementById('about-modal');
   const showAboutButton = document.querySelector('.show-about');
   const aboutCloseButton = aboutModal?.querySelector('.close');

   // Rules modal handlers
   if (rulesModal && showInfoButton && rulesCloseButton) {
       showInfoButton.addEventListener('click', function(event) {
           event.preventDefault();
           openModal(rulesModal);
       });
       
       rulesCloseButton.addEventListener('click', function() {
           closeModal(rulesModal);
       });
   }
   
   // About modal handlers
   if (aboutModal && showAboutButton && aboutCloseButton) {
       showAboutButton.addEventListener('click', function(event) {
           event.preventDefault();
           openModal(aboutModal);
       });
       
       aboutCloseButton.addEventListener('click', function() {
           closeModal(aboutModal);
       });
   }
   
    /**
    // Zatvorenie modálneho okna po kliknutí mimo obsahu
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            console.log('Zatváram modal - klik mimo obsah');
            closeModal(modal);
        }
    });
     */
}

/**
 * Otvorenie modálneho okna s animáciou
 */
function openModal(modal) {
    console.log('Otváram modal');
    modal.style.display = 'block';
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.opacity = '1';
        setupModalScrolling(); // Inicializuj scrollovanie
    }, 10);
}

/**
 * Funkcia na zatvorenie modálneho okna s animáciou
 * @param {HTMLElement} modal - Modal element na zatvorenie
 */
function closeModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}



/**
 * Nastavenie scroll funkcionalite pre modal obsah
 */
function setupModalScrolling() {
    const modalContent = document.querySelector('.modal-text-content');
    const arrowUp = document.querySelector('.modal-arrow-up');
    const arrowDown = document.querySelector('.modal-arrow-down');
    
    if (!modalContent || !arrowUp || !arrowDown) return;
    
    function updateArrows() {
        const isAtTop = modalContent.scrollTop <= 5;
        const isAtBottom = modalContent.scrollTop + modalContent.clientHeight >= modalContent.scrollHeight - 5;
        
        arrowUp.style.opacity = isAtTop ? '0.3' : '1';
        arrowDown.style.opacity = isAtBottom ? '0.3' : '1';
    }
    
    // Scroll hore
    arrowUp.addEventListener('click', function() {
        modalContent.scrollBy({ top: -100, behavior: 'smooth' });
    });
    
    // Scroll dole
    arrowDown.addEventListener('click', function() {
        modalContent.scrollBy({ top: 100, behavior: 'smooth' });
    });
    
    modalContent.addEventListener('scroll', updateArrows);
    updateArrows();
}

/**
 * Nastavenie obsluhy menu tlačidiel
 */
function setupMenuButtons() {
    const menuButtons = document.querySelectorAll('.menu-button');
    
    menuButtons.forEach(button => {       
        button.addEventListener('click', function(event) {
            this.style.transform = 'translateY(0) scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

/**
 * Nastavenie animácie pre postavičku
 */
function setupCharacterAnimation() {
    const characterImage = document.querySelector('.character-image');
    
    if (!characterImage) {
        console.warn('Obrázok postavičky nebol nájdený');
        return;
    }
    
    // Náhodná animácia postavičky každých 5 sekúnd
    setInterval(() => {
        playCharacterAnimation(characterImage);
    }, 5000);
    
    // Animácia pri kliknutí na postavičku
    characterImage.addEventListener('click', function() {
        console.log('Klik na postavičku');
        playCharacterClickAnimation(this);
        playClickSound();
    });
}

/**
 * Prehranie animácie postavičky
 * @param {HTMLElement} character - Element obrázka postavičky
 */
function playCharacterAnimation(character) {
    // Jemné pokývanie postavičky
    character.style.transform = 'rotate(0.093deg) scale(1.02)';
    
    setTimeout(() => {
        character.style.transform = 'rotate(-0.093deg) scale(1.02)';
    }, 500);
    
    setTimeout(() => {
        character.style.transform = 'rotate(0.093deg) scale(1)';
    }, 1000);
}

/**
 * Animácia pri kliknutí na postavičku
 * @param {HTMLElement} character - Element obrázka postavičky
 */
function playCharacterClickAnimation(character) {
    character.style.transform = 'rotate(0.093deg) scale(1.1)';
    setTimeout(() => {
        character.style.transform = 'rotate(0.093deg) scale(1)';
    }, 300);
}

/**
 * Funkcia pre ladenie - výpis informácií o menu
 */
function debugMenuInfo() {
    console.log('=== DEBUG INFO MENU ===');
    console.log('Počet menu tlačidiel:', document.querySelectorAll('.menu-button').length);
    console.log('Modal existuje:', !!document.getElementById('rules-modal'));
    console.log('Postavička existuje:', !!document.querySelector('.character-image'));
    console.log('========================');
}

// Spustenie debug informácií v development móde
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setTimeout(debugMenuInfo, 1000);
}