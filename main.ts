import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Two lines to my past self: line one warns about one specific moment in a
// single sentence; line two says in one sentence why it mattered and what
// changed because of it.
const LINE_1 =
  "Do not press send on the 2am email telling your boss the project is done while the tests are still red.";
const LINE_2 =
  "He forwarded it to the client before sunrise, and you spent the next three weeks rebuilding his trust one midnight fix at a time.";

const entry = `${LINE_1}\n${LINE_2}\n`;

function codePoints(s: string): number {
  return [...s].length;
}

function sentenceCount(line: string): number {
  return (line.match(/[.!?]+/g) ?? []).length;
}

function validate(text: string): void {
  const body = text.endsWith("\n") ? text.slice(0, -1) : text;
  const chars = codePoints(body);
  if (chars < 1 || chars > 280) {
    throw new Error(`entry must be 1-280 characters, got ${chars}`);
  }
  if (body.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  const lines = body.split("\n");
  if (lines.length !== 2) {
    throw new Error(`entry must be exactly 2 lines, got ${lines.length}`);
  }
  for (const [i, line] of lines.entries()) {
    if (sentenceCount(line) !== 1) {
      throw new Error(`line ${i + 1} must be exactly one sentence`);
    }
  }
}

validate(entry);
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", entry, "utf8");

// Read-back verification: the file on disk must be byte-identical to what
// was validated, so a silent write failure can never pass as a good entry.
const onDisk = readFileSync("/output/entry.txt", "utf8");
if (onDisk !== entry) {
  throw new Error(
    "read-back mismatch: /output/entry.txt differs from validated entry",
  );
}
console.log(
  `wrote /output/entry.txt (${codePoints(entry.slice(0, -1))} characters, 2 lines)`,
);
