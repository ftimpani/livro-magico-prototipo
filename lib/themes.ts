// Catálogo de temas do protótipo. Todos os personagens são originais:
// nada de personagens, clubes ou marcas de terceiros.

export type Scene = { id: string; title: string; prompt: string };

export type Theme = {
  id: string;
  title: string; // título do tema no site
  bookTitle: string; // "As Aventuras de {NOME} ..."
  group: "meninos" | "meninas" | "unissex";
  emoji: string;
  diploma: string;
  mazeGoal: string; // "Ajude {NOME} a chegar até ..."
  words: string[]; // caça-palavras (sem acento, maiúsculas)
  scenes: Scene[];
};

export const BASE_PROMPT = `Using the attached reference photo, draw this specific child as the hero of a children's coloring book page. This must be a recognizable likeness of this exact child, not a generic cartoon mascot.
Preserve from the reference photo: the exact face shape, eye shape and spacing, eyebrows, nose, mouth and smile, ears, skin tone, and the hair's real color, texture, length and style. Keep natural, realistic child body proportions (not an exaggerated chibi or big-head mascot style).
Style: clean black-and-white line art for coloring, on a pure white background. Bold, consistent black outlines, no shading, no gray tones, no color fill, no filled black areas except the pupils. Lines simple and clean enough for a child aged 3 to 9 to color inside, but the face must stay a faithful portrait of the reference photo.
The child is fully clothed in the costume described below, in the pose and scene described.
Use only original designs: no existing cartoon characters, no logos, no brand names, no sports team crests.
Portrait orientation, the whole scene fits inside the page with a small margin. No text anywhere in the image.
Scene: `;

const s = (id: string, title: string, prompt: string): Scene => ({ id, title, prompt });

export const THEMES: Theme[] = [
  {
    id: "astronauta",
    title: "Astronauta",
    bookTitle: "no Espaço",
    group: "unissex",
    emoji: "🚀",
    diploma: "Astronauta Oficial",
    mazeGoal: "o foguete",
    words: ["FOGUETE", "LUA", "ESTRELA", "PLANETA", "COMETA", "BIP"],
    scenes: [
      s("a1", "O chamado", "the child wearing a space suit with the helmet under one arm, full body, waving happily, a small rocket and stars behind"),
      s("a2", "Decolagem", "the child piloting a rocket, seen through the round cockpit window, planets and stars outside"),
      s("a3", "Na Lua", "the child in a space suit jumping on the Moon and planting a blank flag, craters and Earth in the sky"),
      s("a4", "O amigo Bip", "the child holding hands with Bip, a friendly drop-shaped alien with one big eye and two spiral antennae, on a small planet with funny plants"),
      s("a5", "A volta", "the child floating in space among stars and a comet, with planet Earth in the background"),
    ],
  },
  {
    id: "futebol",
    title: "Craque de Futebol",
    bookTitle: "no Campeonato",
    group: "meninos",
    emoji: "⚽",
    diploma: "Craque do Campeonato",
    mazeGoal: "o gol",
    words: ["BOLA", "GOL", "TRAVE", "APITO", "TORCIDA", "TICO"],
    scenes: [
      s("f1", "A convocação", "the child in a plain blank soccer uniform with no crest and no number, full body, one foot on a soccer ball, stadium behind"),
      s("f2", "O chute", "the child kicking a soccer ball toward a goal, plain blank uniform, grass field"),
      s("f3", "O amigo Tico", "the child high-fiving Tico, a small cartoon armadillo wearing goalkeeper gloves, in front of a goal"),
      s("f4", "É gol!", "the child celebrating a goal with arms raised, confetti falling, crowd in the stands as simple shapes"),
      s("f5", "A taça", "the child on a winners podium lifting a big trophy, plain blank uniform, medal around the neck"),
    ],
  },
  {
    id: "dinossauros",
    title: "Caçador de Dinossauros",
    bookTitle: "na Terra dos Dinossauros",
    group: "meninos",
    emoji: "🦖",
    diploma: "Paleontólogo Júnior",
    mazeGoal: "o ninho do Rex",
    words: ["REX", "OVO", "VULCAO", "FOSSIL", "PEGADA", "NINHO"],
    scenes: [
      s("d1", "O ovo misterioso", "the child wearing an explorer hat and vest, kneeling next to a giant spotted egg in a backyard"),
      s("d2", "O filhote Rex", "the child hugging Rex, a clumsy friendly baby tyrannosaurus just hatched from an egg"),
      s("d3", "O vale", "the child riding on the back of a gentle long-neck dinosaur, palm trees and a volcano in the distance"),
      s("d4", "A descoberta", "the child with a brush uncovering a dinosaur skeleton fossil in the ground, shovel and bucket nearby"),
      s("d5", "O ninho", "the child and baby Rex waving next to a big nest with eggs, a friendly triceratops beside them"),
    ],
  },
  {
    id: "princesa",
    title: "Reino Encantado",
    bookTitle: "no Reino Encantado",
    group: "meninas",
    emoji: "👑",
    diploma: "Realeza do Reino Encantado",
    mazeGoal: "o castelo",
    words: ["COROA", "CASTELO", "BAILE", "ROSA", "CORUJA", "PLUMA"],
    scenes: [
      s("p1", "O convite", "the child in an original royal ball outfit with a small crown, full body, holding an invitation scroll, castle on a hill behind"),
      s("p2", "A carruagem", "the child waving from the window of an original round carriage pulled by two ponies"),
      s("p3", "O jardim", "the child in a rose garden with Pluma, a wise little owl perched on the child's arm, butterflies around"),
      s("p4", "O baile", "the child dancing in a ballroom with chandeliers and big windows, royal outfit and crown"),
      s("p5", "A coroação", "the child sitting on a throne, smiling, Pluma the owl on the armrest, banners on the wall"),
    ],
  },
  {
    id: "sereia",
    title: "Fundo do Mar",
    bookTitle: "no Fundo do Mar",
    group: "unissex",
    emoji: "🐠",
    diploma: "Guardião do Oceano",
    mazeGoal: "o baú do tesouro",
    words: ["CONCHA", "PEIXE", "CORAL", "PEROLA", "ALGA", "BOLHA"],
    scenes: [
      s("m1", "O mergulho", "the child as a diver wearing a full wetsuit, mask and snorkel, swimming underwater, fish and bubbles around"),
      s("m2", "O recife", "the child in a full wetsuit swimming over a coral reef next to a wise sea turtle"),
      s("m3", "O amigo Bolha", "the child in a full wetsuit laughing with Bolha, a playful round pufferfish, seaweed around"),
      s("m4", "O submarino", "the child looking out of the round window of a small original submarine, an octopus waving outside"),
      s("m5", "O tesouro", "the child in a full wetsuit opening a treasure chest full of pearls and shells on the sea floor, a seahorse watching"),
    ],
  },
  {
    id: "fada",
    title: "Jardim das Fadas",
    bookTitle: "no Jardim das Fadas",
    group: "meninas",
    emoji: "🧚",
    diploma: "Guardiã das Flores",
    mazeGoal: "a árvore mágica",
    words: ["FADA", "FLOR", "VARINHA", "ASAS", "PINGO", "LAGO"],
    scenes: [
      s("j1", "A luz no jardim", "the child as a garden fairy with butterfly wings and an original flower-petal dress, full body, holding a star wand"),
      s("j2", "Os cogumelos", "the fairy child sitting on a big mushroom, small mushroom houses around"),
      s("j3", "A amiga Pingo", "the fairy child talking to Pingo, a friendly ladybug, on a giant leaf"),
      s("j4", "O lago", "the fairy child flying over a pond with water lilies and a frog"),
      s("j5", "A árvore mágica", "the fairy child in front of a big tree with a little door and windows, flowers and fireflies around"),
    ],
  },
];

export function buildPrompt(scene: Scene): string {
  return BASE_PROMPT + scene.prompt + ".";
}

export function findScene(themeId: string, sceneId: string) {
  const theme = THEMES.find((t) => t.id === themeId);
  const scene = theme?.scenes.find((sc) => sc.id === sceneId);
  return theme && scene ? { theme, scene } : null;
}
