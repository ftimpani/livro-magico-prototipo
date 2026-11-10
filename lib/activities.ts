// Atividades geradas por código (sem IA): labirinto e caça-palavras.

export function rng(seed: number) {
  let a = seed >>> 0 || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFrom(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Remove acentos e deixa só letras maiúsculas. */
export function plain(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

export type Maze = { size: number; right: boolean[][]; down: boolean[][] };

/** Labirinto perfeito (um único caminho) por busca em profundidade.
 *  right[y][x] = existe parede à direita da célula; down[y][x] = parede abaixo. */
export function makeMaze(size: number, seed: number): Maze {
  const rand = rng(seed);
  const right = Array.from({ length: size }, () => Array(size).fill(true));
  const down = Array.from({ length: size }, () => Array(size).fill(true));
  const seen = Array.from({ length: size }, () => Array(size).fill(false));
  const stack: [number, number][] = [[0, 0]];
  seen[0][0] = true;
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const options: [number, number][] = [];
    if (x > 0 && !seen[y][x - 1]) options.push([x - 1, y]);
    if (x < size - 1 && !seen[y][x + 1]) options.push([x + 1, y]);
    if (y > 0 && !seen[y - 1][x]) options.push([x, y - 1]);
    if (y < size - 1 && !seen[y + 1][x]) options.push([x, y + 1]);
    if (!options.length) {
      stack.pop();
      continue;
    }
    const [nx, ny] = options[Math.floor(rand() * options.length)];
    if (nx > x) right[y][x] = false;
    else if (nx < x) right[y][nx] = false;
    else if (ny > y) down[y][x] = false;
    else down[ny][x] = false;
    seen[ny][nx] = true;
    stack.push([nx, ny]);
  }
  return { size, right, down };
}

/** Confere que existe caminho do início (0,0) ao fim (size-1,size-1). */
export function mazeSolvable(m: Maze) {
  const seen = new Set<string>(["0,0"]);
  const queue: [number, number][] = [[0, 0]];
  while (queue.length) {
    const [x, y] = queue.shift()!;
    if (x === m.size - 1 && y === m.size - 1) return true;
    const next: [number, number][] = [];
    if (x < m.size - 1 && !m.right[y][x]) next.push([x + 1, y]);
    if (x > 0 && !m.right[y][x - 1]) next.push([x - 1, y]);
    if (y < m.size - 1 && !m.down[y][x]) next.push([x, y + 1]);
    if (y > 0 && !m.down[y - 1][x]) next.push([x, y - 1]);
    for (const [nx, ny] of next) {
      const k = `${nx},${ny}`;
      if (!seen.has(k)) {
        seen.add(k);
        queue.push([nx, ny]);
      }
    }
  }
  return false;
}

export type WordSearch = { size: number; grid: string[][]; words: string[] };

/** Caça-palavras. easy = só horizontal; senão horizontal e vertical. */
export function makeWordSearch(rawWords: string[], size: number, seed: number, easy: boolean): WordSearch {
  const rand = rng(seed);
  const words = Array.from(new Set(rawWords.map(plain))).filter((w) => w.length >= 2 && w.length <= size);
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""));
  const placed: string[] = [];
  for (const word of words.sort((a, b) => b.length - a.length)) {
    for (let attempt = 0; attempt < 300; attempt++) {
      const vertical = !easy && rand() < 0.5;
      const maxX = vertical ? size : size - word.length + 1;
      const maxY = vertical ? size - word.length + 1 : size;
      const x = Math.floor(rand() * maxX);
      const y = Math.floor(rand() * maxY);
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const c = grid[y + (vertical ? i : 0)][x + (vertical ? 0 : i)];
        if (c && c !== word[i]) {
          fits = false;
          break;
        }
      }
      if (!fits) continue;
      for (let i = 0; i < word.length; i++) grid[y + (vertical ? i : 0)][x + (vertical ? 0 : i)] = word[i];
      placed.push(word);
      break;
    }
  }
  const letters = "ABCDEFGHIJLMNOPRSTUV";
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) if (!grid[y][x]) grid[y][x] = letters[Math.floor(rand() * letters.length)];
  return { size, grid, words: placed };
}
