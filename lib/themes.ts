// Catálogo de temas do protótipo. Todos os personagens são originais:
// nada de personagens, clubes ou marcas de terceiros.

export type Scene = { id: string; title: string; prompt: string; story: string };

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

// Passo 1: a foto vira a FICHA DO PERSONAGEM. É a única vez em que a foto é usada.
export const CHARACTER_PROMPT = `Using the attached reference photo, create a CHARACTER MODEL SHEET of this specific child as the hero of a children's storybook.
It must be a recognizable likeness of this exact child, not a generic cartoon mascot. Preserve from the photo: face shape, eye shape and spacing, eyebrows, nose, mouth and smile, ears, and the hair's real texture, length and style. Natural child body proportions (no chibi, no oversized head).
Layout of the sheet, all on one page, same character in every drawing:
- on the left, the full body standing, front view, arms relaxed, smiling;
- in the middle, the full body in three-quarter view, waving;
- on the right, two head-and-shoulders close-ups: one laughing, one curious.
Clothes: a plain t-shirt, plain shorts and sneakers, with no prints.
Style: clean black-and-white line art, pure white background, bold consistent black outlines, no shading, no gray tones, no color, no filled black areas except the pupils. The same line weight and the same level of detail in all four drawings.
No text, no labels, no arrows, no frames, no logos.`;

// Passo 2 em diante: cada página usa só a ficha, nunca a foto.
export const SCENE_PROMPT = `The attached image is the character model sheet of the hero of this children's storybook. Draw ONE new full-page illustration of this exact same character.
Keep identical to the sheet: the face (shape, eyes, eyebrows, nose, mouth), the hair (texture, length, style), the body proportions and the drawing style (line weight, level of detail). The character must be instantly recognizable as the same child from the sheet. Change only the costume, the pose and the scenery described below. Draw the character once; do not copy the sheet layout.
Style: clean black-and-white line art coloring page, pure white background, bold consistent black outlines, closed shapes that are easy to fill with color, no shading, no gray tones, no color, no filled black areas except the pupils. Rich but uncluttered scenery, suitable for ages 3 to 9.
The character is fully clothed in the costume described. Use only original designs: no existing cartoon characters, no logos, no brand names, no sports team crests.
Portrait orientation, the whole scene fits inside the page with a small margin. No text anywhere in the image.
Scene: `;

const s = (id: string, title: string, prompt: string, story: string): Scene => ({ id, title, prompt, story });

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
      s("a1", "O chamado", "the child wearing a space suit with the helmet under one arm, full body, waving happily, a small rocket and stars behind", "Numa noite estrelada, {NOME} recebeu um chamado: o espaço precisava de ajuda!"),
      s("a2", "Decolagem", "the child piloting a rocket, seen through the round cockpit window, planets and stars outside", "Três, dois, um... O foguete de {NOME} subiu rumo às estrelas."),
      s("a3", "Na Lua", "the child in a space suit jumping on the Moon and planting a blank flag, craters and Earth in the sky", "Na Lua, {NOME} deu pulos gigantes e fincou uma bandeira."),
      s("a4", "O amigo Bip", "the child holding hands with Bip, a friendly drop-shaped alien with one big eye and two spiral antennae, on a small planet with funny plants", "Num planeta pequenino, {NOME} conheceu Bip, um alienígena muito simpático."),
      s("a5", "A volta", "the child floating in space among stars and a comet, with planet Earth in the background", "Missão cumprida! {NOME} voltou para casa com um novo amigo no coração."),
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
      s("f1", "A convocação", "the child in a plain blank soccer uniform with no crest and no number, full body, one foot on a soccer ball, stadium behind", "Chegou o grande dia: {NOME} vai jogar a final do campeonato!"),
      s("f2", "O chute", "the child kicking a soccer ball toward a goal, plain blank uniform, grass field", "A bola rolou e {NOME} chutou com toda a força."),
      s("f3", "O amigo Tico", "the child high-fiving Tico, a small cartoon armadillo wearing goalkeeper gloves, in front of a goal", "No gol estava Tico, o tatu goleiro, que logo virou amigo de {NOME}."),
      s("f4", "É gol!", "the child celebrating a goal with arms raised, confetti falling, crowd in the stands as simple shapes", "É gol! A torcida inteira gritou o nome de {NOME}."),
      s("f5", "A taça", "the child on a winners podium lifting a big trophy, plain blank uniform, medal around the neck", "No fim do jogo, {NOME} levantou a taça bem alto."),
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
      s("d1", "O ovo misterioso", "the child wearing an explorer hat and vest, kneeling next to a giant spotted egg in a backyard", "No quintal de casa, {NOME} encontrou um ovo enorme e misterioso."),
      s("d2", "O filhote Rex", "the child hugging Rex, a clumsy friendly baby tyrannosaurus just hatched from an egg", "Crac! Do ovo saiu Rex, um filhote de dinossauro que adorou {NOME}."),
      s("d3", "O vale", "the child riding on the back of a gentle long-neck dinosaur, palm trees and a volcano in the distance", "Juntos, {NOME} e Rex passearam pelo vale dos dinossauros."),
      s("d4", "A descoberta", "the child with a brush uncovering a dinosaur skeleton fossil in the ground, shovel and bucket nearby", "Com um pincel, {NOME} descobriu um fóssil escondido na terra."),
      s("d5", "O ninho", "the child and baby Rex waving next to a big nest with eggs, a friendly triceratops beside them", "Rex reencontrou a família, e {NOME} ganhou amigos para sempre."),
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
      s("p1", "O convite", "the child in an original royal ball outfit with a small crown, full body, holding an invitation scroll, castle on a hill behind", "Um convite chegou para {NOME}: haverá um grande baile no castelo!"),
      s("p2", "A carruagem", "the child waving from the window of an original round carriage pulled by two ponies", "A carruagem partiu, e {NOME} acenou para todo o reino."),
      s("p3", "O jardim", "the child in a rose garden with Pluma, a wise little owl perched on the child's arm, butterflies around", "No jardim das rosas, {NOME} conheceu Pluma, uma corujinha muito sábia."),
      s("p4", "O baile", "the child dancing in a ballroom with chandeliers and big windows, royal outfit and crown", "A música começou, e {NOME} dançou pelo salão inteiro."),
      s("p5", "A coroação", "the child sitting on a throne, smiling, Pluma the owl on the armrest, banners on the wall", "No fim da festa, o reino inteiro aplaudiu {NOME}."),
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
      s("m1", "O mergulho", "the child as a diver wearing a full wetsuit, mask and snorkel, swimming underwater, fish and bubbles around", "Splash! {NOME} mergulhou para conhecer o fundo do mar."),
      s("m2", "O recife", "the child in a full wetsuit swimming over a coral reef next to a wise sea turtle", "No recife colorido, uma tartaruga mostrou o caminho para {NOME}."),
      s("m3", "O amigo Bolha", "the child in a full wetsuit laughing with Bolha, a playful round pufferfish, seaweed around", "Bolha, o baiacu brincalhão, fez {NOME} dar muitas risadas."),
      s("m4", "O submarino", "the child looking out of the round window of a small original submarine, an octopus waving outside", "De dentro do submarino, {NOME} acenou para um polvo."),
      s("m5", "O tesouro", "the child in a full wetsuit opening a treasure chest full of pearls and shells on the sea floor, a seahorse watching", "No fundo do mar, {NOME} achou um baú cheio de pérolas e conchas."),
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
      s("j1", "A luz no jardim", "the child as a garden fairy with butterfly wings and an original flower-petal dress, full body, holding a star wand", "Uma luz brilhou no jardim, e {NOME} ganhou asas de fada."),
      s("j2", "Os cogumelos", "the child as a garden fairy with butterfly wings sitting on a big mushroom, small mushroom houses around", "Na vila dos cogumelos, {NOME} parou para descansar."),
      s("j3", "A amiga Pingo", "the child as a garden fairy with butterfly wings talking to Pingo, a friendly ladybug, on a giant leaf", "Pingo, a joaninha, contou um segredo para {NOME}."),
      s("j4", "O lago", "the child as a garden fairy with butterfly wings flying over a pond with water lilies and a frog", "Voando sobre o lago, {NOME} deu bom-dia para o sapo."),
      s("j5", "A árvore mágica", "the child as a garden fairy with butterfly wings in front of a big tree with a little door and windows, flowers and fireflies around", "Na árvore mágica, {NOME} encontrou um novo lar para as fadas."),
    ],
  },
];

export function buildPrompt(scene: Scene): string {
  return SCENE_PROMPT + scene.prompt + ".";
}

export function findScene(themeId: string, sceneId: string) {
  const theme = THEMES.find((t) => t.id === themeId);
  const scene = theme?.scenes.find((sc) => sc.id === sceneId);
  return theme && scene ? { theme, scene } : null;
}
