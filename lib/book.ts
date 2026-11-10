// Monta o PDF do livro. Funciona no navegador e no Node (usa só pdf-lib).
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { makeMaze, makeWordSearch, seedFrom } from "./activities";
import type { Theme } from "./themes";

export type BookImage = { title: string; png: Uint8Array; text?: string };
export type BookInput = {
  name: string;
  age: number;
  theme: Theme;
  images: BookImage[];
  dedication?: string;
  demo?: boolean;
};

const W = 595.28;
const H = 841.89;
const M = 42; // margem ~1,5 cm
const BLACK = rgb(0, 0, 0);
const GRAY = rgb(0.45, 0.45, 0.45);

/** Mantém só o que a fonte padrão do PDF consegue escrever. */
export function cleanText(text: string, max = 60) {
  return text
    .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9 .,!?'":;()\-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function center(page: PDFPage, text: string, y: number, size: number, font: PDFFont, color = BLACK) {
  let s = size;
  while (s > 8 && font.widthOfTextAtSize(text, s) > W - 2 * M) s -= 1;
  page.drawText(text, { x: (W - font.widthOfTextAtSize(text, s)) / 2, y, size: s, font, color });
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const test = line ? line + " " + word : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function frame(page: PDFPage) {
  page.drawRectangle({ x: M / 2, y: M / 2, width: W - M, height: H - M, borderColor: BLACK, borderWidth: 2 });
}

async function drawImageFit(doc: PDFDocument, page: PDFPage, png: Uint8Array, x: number, y: number, w: number, h: number) {
  const img = await doc.embedPng(png);
  const scale = Math.min(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  page.drawImage(img, { x: x + (w - dw) / 2, y: y + (h - dh) / 2, width: dw, height: dh });
}

function footer(page: PDFPage, font: PDFFont, n: number, demo?: boolean) {
  const text = demo ? `${n}  -  MODO DEMONSTRAÇÃO` : String(n);
  page.drawText(text, { x: (W - font.widthOfTextAtSize(text, 9)) / 2, y: 26, size: 9, font, color: GRAY });
}

export async function buildBook(input: BookInput): Promise<Uint8Array> {
  const name = cleanText(input.name, 24) || "Criança";
  const NAME = name.toUpperCase();
  const young = input.age <= 5;
  const { theme } = input;
  const doc = await PDFDocument.create();
  doc.setTitle(`As Aventuras de ${name} ${theme.bookTitle}`);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  let n = 0;
  const newPage = () => {
    const p = doc.addPage([W, H]);
    n += 1;
    if (n > 1) footer(p, regular, n, input.demo);
    return p;
  };

  // 1. Capa
  let page = newPage();
  frame(page);
  center(page, "AS AVENTURAS DE", H - 95, 26, bold);
  center(page, NAME, H - 150, 52, bold);
  center(page, theme.bookTitle.toUpperCase(), H - 190, 26, bold);
  if (input.images[0]) await drawImageFit(doc, page, input.images[0].png, M, 80, W - 2 * M, H - 300);
  center(page, "Uma história para ler, colorir e brincar", 50, 13, regular, GRAY);

  // 2. Este livro pertence a
  page = newPage();
  frame(page);
  center(page, "ESTE LIVRO PERTENCE A", H - 170, 24, bold);
  center(page, NAME, H - 240, 46, bold);
  page.drawRectangle({ x: W / 2 - 110, y: H / 2 - 150, width: 220, height: 260, borderColor: BLACK, borderWidth: 2, borderDashArray: [8, 6] });
  center(page, "Desenhe você aqui!", H / 2 - 175, 13, regular, GRAY);
  const dedication = cleanText(input.dedication || "", 180);
  if (dedication) {
    let y = 170;
    for (const line of wrap(dedication, regular, 14, W - 4 * M)) {
      center(page, line, y, 14, regular);
      y -= 20;
    }
  }

  // 3. Páginas para colorir
  for (const image of input.images) {
    page = newPage();
    center(page, cleanText(image.title).toUpperCase(), H - 70, 22, bold);
    // Trecho da história embaixo do desenho, com o nome da criança.
    const story = wrap(cleanText((image.text || "").replace(/\{NOME\}/g, name), 200), regular, 16, W - 2 * M - 20).slice(0, 3);
    const textSpace = story.length ? 30 + story.length * 22 : 0;
    await drawImageFit(doc, page, image.png, M, 55 + textSpace, W - 2 * M, H - 155 - textSpace);
    story.forEach((l, i) => center(page, l, 45 + textSpace - 22 * (i + 1), 16, regular));
  }

  // 4. Labirinto
  page = newPage();
  center(page, "LABIRINTO", H - 70, 26, bold);
  center(page, `Ajude ${name} a chegar até ${theme.mazeGoal}!`, H - 100, 15, regular);
  const size = young ? 7 : 13;
  const maze = makeMaze(size, seedFrom(name + theme.id));
  const cell = Math.min((W - 2 * M - 20) / size, 500 / size);
  const mx = (W - cell * size) / 2;
  const top = H - 150;
  const line = (x1: number, y1: number, x2: number, y2: number) =>
    page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: young ? 3 : 2, color: BLACK });
  line(mx + cell, top, mx + cell * size, top); // topo, com entrada na primeira célula
  line(mx, top, mx, top - cell * size); // esquerda
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const px = mx + x * cell;
      const py = top - y * cell;
      if (maze.right[y][x]) line(px + cell, py, px + cell, py - cell);
      if (maze.down[y][x] && !(x === size - 1 && y === size - 1)) line(px, py - cell, px + cell, py - cell);
    }
  page.drawText("ENTRADA", { x: mx, y: top + 8, size: 11, font: bold });
  const exit = "CHEGADA";
  page.drawText(exit, { x: mx + cell * size - bold.widthOfTextAtSize(exit, 11), y: top - cell * size - 18, size: 11, font: bold });

  // 5. Caça-palavras
  page = newPage();
  center(page, "CAÇA-PALAVRAS", H - 70, 26, bold);
  center(page, "Encontre as palavras escondidas e pinte cada uma de uma cor.", H - 100, 14, regular);
  const gridSize = young ? 8 : 12;
  const first = NAME.split(" ")[0]; // só o primeiro nome entra no caça-palavras
  const wordList = young ? [first, ...theme.words.slice(0, 3)] : [first, ...theme.words];
  const ws = makeWordSearch(wordList, gridSize, seedFrom(theme.id + name), young);
  const c = Math.min(440 / gridSize, 46);
  const gx = (W - c * gridSize) / 2;
  const gy = H - 140;
  page.drawRectangle({ x: gx, y: gy - c * gridSize, width: c * gridSize, height: c * gridSize, borderColor: BLACK, borderWidth: 2 });
  const fs = c * 0.55;
  for (let y = 0; y < gridSize; y++)
    for (let x = 0; x < gridSize; x++) {
      const ch = ws.grid[y][x];
      page.drawText(ch, { x: gx + x * c + (c - bold.widthOfTextAtSize(ch, fs)) / 2, y: gy - (y + 1) * c + (c - fs * 0.7) / 2, size: fs, font: bold });
    }
  let wy = gy - c * gridSize - 40;
  const perRow = 3;
  ws.words.forEach((word, i) => {
    const col = i % perRow;
    if (i > 0 && col === 0) wy -= 26;
    page.drawText(word, { x: M + 30 + col * ((W - 2 * M - 60) / perRow), y: wy, size: 15, font: bold });
  });

  // 6. Diploma
  page = newPage();
  frame(page);
  page.drawRectangle({ x: M / 2 + 8, y: M / 2 + 8, width: W - M - 16, height: H - M - 16, borderColor: BLACK, borderWidth: 1 });
  center(page, "DIPLOMA", H - 150, 48, bold);
  center(page, "Certificamos que", H - 230, 18, regular);
  center(page, NAME, H - 300, 46, bold);
  center(page, "completou todas as missões e agora é", H - 360, 18, regular);
  center(page, theme.diploma.toUpperCase(), H - 420, 30, bold);
  page.drawLine({ start: { x: 90, y: 190 }, end: { x: 260, y: 190 }, thickness: 1, color: BLACK });
  page.drawLine({ start: { x: W - 260, y: 190 }, end: { x: W - 90, y: 190 }, thickness: 1, color: BLACK });
  page.drawText("Data", { x: 160, y: 172, size: 11, font: regular });
  page.drawText("Assinatura de um adulto", { x: W - 235, y: 172, size: 11, font: regular });

  return doc.save();
}
