// One Word From Your Ex — writes the single word "regifted" to entry.txt
import { mkdirSync, writeFileSync, readFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const WORD = "regifted"; // the gift nobody wanted, passed on to the next person — 4 weeks before Christmas
const ENTRY_FILE = "entry.txt"; // exactly one word, no trailing newline

function resolveOutputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR || "output";
}

function writeEntry(outDir: string): void {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, ENTRY_FILE), WORD);
}

function selfTest(): void {
  // Entry invariants: exactly "regifted", 8 chars, no trailing newline.
  if (WORD !== "regifted") throw new Error(`self-test: WORD is ${JSON.stringify(WORD)}, expected "regifted"`);
  if (WORD.length !== 8) throw new Error(`self-test: WORD length ${WORD.length}, expected 8`);
  if (WORD.endsWith("\n")) throw new Error("self-test: WORD has a trailing newline");
  // Round-trip: write to a scratch MAKEFUN_OUTPUT_DIR and verify byte-identical.
  const scratch = mkdtempSync(join(tmpdir(), "brave-eagle-selftest-"));
  try {
    const prev = process.env.MAKEFUN_OUTPUT_DIR;
    process.env.MAKEFUN_OUTPUT_DIR = scratch;
    try {
      writeEntry(resolveOutputDir());
    } finally {
      if (prev === undefined) delete process.env.MAKEFUN_OUTPUT_DIR;
      else process.env.MAKEFUN_OUTPUT_DIR = prev;
    }
    const bytes = readFileSync(join(scratch, ENTRY_FILE));
    if (bytes.toString("utf8") !== WORD) throw new Error("self-test: round-trip entry differs from WORD");
    if (bytes.length !== 8) throw new Error(`self-test: round-trip entry is ${bytes.length} bytes, expected 8`);
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
  console.log('self-test: OK — entry is exactly "regifted" (8 bytes, no trailing newline), output-dir round-trip byte-identical');
}

function main(): void {
  if (process.argv.includes("--self-test")) {
    selfTest();
    return;
  }
  writeEntry(resolveOutputDir());
}

main();
