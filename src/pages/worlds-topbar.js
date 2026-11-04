/**
 * Svety písmen (worldsmenu.html): rovnaká horná lišta ako na ostatných
 * obrazovkách – späť, album, profil, nastavenia.
 */
import '../bridge.js';
import { topbar } from '../ui/kit.js';

const profile = window.BJ.profiles.active();
const bar = topbar({ back: 'urovne.html', profile });
bar.classList.add('worlds-topbar');
(document.getElementById('bj-stage') || document.body).append(bar);
