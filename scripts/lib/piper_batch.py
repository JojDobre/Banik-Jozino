"""Piper: viac textov naraz (model sa načíta len raz).

Použitie: python piper_batch.py MODEL OUT_DIR LENGTH_SCALE < zoznam.json
zoznam.json = [["id", "text"], ...]  →  OUT_DIR/<id>.wav
"""
import json
import sys
import wave

from piper import PiperVoice
from piper.config import SynthesisConfig

model, out_dir, length = sys.argv[1], sys.argv[2], float(sys.argv[3])
voice = PiperVoice.load(model)
cfg = SynthesisConfig(length_scale=length)
items = json.load(sys.stdin)
for i, (ident, text) in enumerate(items):
    with wave.open(f"{out_dir}/{ident}.wav", "wb") as wav:
        voice.synthesize_wav(text, wav, syn_config=cfg)
    if i % 25 == 0:
        print(f"{i}/{len(items)}", flush=True)
