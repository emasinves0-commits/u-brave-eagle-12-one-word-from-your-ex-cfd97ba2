// One Word From Your Ex — writes the single word "regifted" to entry.txt
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const WORD = "regifted"; // the gift nobody wanted, passed on to the next person — 4 weeks before Christmas
const ENTRY_FILE = "entry.txt"; // exactly one word, no trailing newline
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, ENTRY_FILE), WORD);
