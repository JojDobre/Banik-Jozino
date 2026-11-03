/** Názov súboru nahrávky z textu (rovnaký v build:voice aj build:word-audio). */
import { createHash } from 'node:crypto';

export function lineId(text) {
    const slug = text
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40);
    const hash = createHash('sha1').update(text).digest('hex').slice(0, 6);
    return `${slug}-${hash}`;
}
