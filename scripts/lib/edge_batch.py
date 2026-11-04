"""Neurónový hlas Microsoft (sk-SK-ViktoriaNeural): viac textov naraz.

Použitie: python edge_batch.py OUT_DIR VOICE RATE < zoznam.json
zoznam.json = [["id", "text"], ...]  →  OUT_DIR/<id>.mp3 (surové, ďalej ffmpeg)
Potrebuje balík edge-tts. Pozn.: pred zverejnením appky generovať cez Azure Speech
(rovnaký hlas, oficiálna licencia) – viď docs/PLAN.md, fáza 7.
"""
import asyncio
import json
import sys

import edge_tts

out_dir, voice, rate = sys.argv[1], sys.argv[2], sys.argv[3]
items = json.load(sys.stdin)


async def one(sem, ident, text, done):
    async with sem:
        for attempt in range(4):
            try:
                await edge_tts.Communicate(text, voice, rate=rate).save(f"{out_dir}/{ident}.mp3")
                break
            except Exception as e:  # sieť – skúsiť znova
                if attempt == 3:
                    raise
                await asyncio.sleep(1 + attempt * 2)
        done[0] += 1
        if done[0] % 25 == 0:
            print(f"{done[0]}/{len(items)}", flush=True)


async def main():
    sem = asyncio.Semaphore(6)
    done = [0]
    await asyncio.gather(*(one(sem, i, t, done) for i, t in items))


asyncio.run(main())
