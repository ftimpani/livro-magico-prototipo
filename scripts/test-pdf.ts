// Teste rápido: monta um livro com imagens em branco e confere as atividades.
// Uso: npm run test:pdf
import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { buildBook } from "../lib/book";
import { makeMaze, makeWordSearch, mazeSolvable, plain, seedFrom } from "../lib/activities";
import { THEMES } from "../lib/themes";

function crc32(buf: Buffer) {
  let c = ~0;
  for (const b of buf) {
    c ^= b;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}
function chunk(type: string, data: Buffer) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function whitePng(w: number, h: number) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 0; // grayscale
  const raw = Buffer.alloc((w + 1) * h, 255);
  for (let y = 0; y < h; y++) raw[y * (w + 1)] = 0;
  return new Uint8Array(
    Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]),
  );
}

async function main() {
  let failures = 0;
  const check = (ok: boolean, label: string) => {
    console.log(`${ok ? "ok  " : "FALHA"} ${label}`);
    if (!ok) failures++;
  };

  for (const size of [7, 13]) for (let i = 0; i < 50; i++) if (!mazeSolvable(makeMaze(size, i + 1))) failures++;
  check(failures === 0, "100 labirintos com caminho até a chegada");

  for (const theme of THEMES)
    for (const [name, age] of [["João Pedro", 4], ["Maria Antônia", 8], ["Zé", 6]] as const) {
      const young = age <= 5;
      const words = young ? [name, ...theme.words.slice(0, 3)] : [name, ...theme.words];
      const ws = makeWordSearch(words, young ? 8 : 12, seedFrom(theme.id + name), young);
      const rows = ws.grid.map((r) => r.join(""));
      const cols = ws.grid[0].map((_, x) => ws.grid.map((r) => r[x]).join(""));
      const wanted = Array.from(new Set(words.map(plain))).filter((w) => w.length >= 2 && w.length <= ws.size);
      const all = wanted.every((w) => ws.words.includes(w) && [...rows, ...cols].some((l) => l.includes(w)));
      if (!all) check(false, `caça-palavras ${theme.id} / ${name}`);
    }
  check(true, "caça-palavras: todas as palavras colocadas e encontráveis");

  const png = whitePng(90, 120);
  let last: Uint8Array = new Uint8Array();
  for (const theme of THEMES)
    for (const age of [4, 8]) {
      last = await buildBook({
        name: "João Pedro 🚀",
        age,
        theme,
        images: theme.scenes.map((s) => ({ title: s.title, png, text: s.story })),
        dedication: "Com amor, vovó Ana",
        demo: true,
      });
      const header = Buffer.from(last.slice(0, 5)).toString();
      if (header !== "%PDF-") check(false, `PDF ${theme.id} idade ${age}`);
    }
  check(true, `PDF montado para ${THEMES.length} temas x 2 idades`);
  writeFileSync("teste-livro.pdf", last);
  console.log("Exemplo salvo em teste-livro.pdf");
  process.exit(failures ? 1 : 0);
}
main();
