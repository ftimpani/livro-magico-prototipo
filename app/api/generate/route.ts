import { NextResponse } from "next/server";
import { generateImage, isDemoMode } from "@/lib/providers";
import { CHARACTER_PROMPT, buildPrompt, findScene } from "@/lib/themes";

export const runtime = "nodejs";
export const maxDuration = 60;

// Limite simples por endereço, para o protótipo não gastar créditos sem controle.
const hits = new Map<string, { count: number; start: number }>();
const LIMIT = 40; // gerações por hora

function allowed(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.start > 3600_000) {
    hits.set(ip, { count: 1, start: now });
    return true;
  }
  h.count += 1;
  return h.count <= LIMIT;
}

const isImage = (v: unknown): v is string =>
  typeof v === "string" && /^data:image\/(jpeg|png|webp);base64,/.test(v) && v.length <= 3_500_000;

export async function GET() {
  return NextResponse.json({ demo: isDemoMode(), needsCode: !!process.env.ACCESS_CODE });
}

type Body = {
  kind?: "character" | "scene";
  photo?: string; // só em kind=character
  character?: string; // ficha do personagem, só em kind=scene
  themeId?: string;
  sceneId?: string;
  consent?: boolean;
  code?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  if (process.env.ACCESS_CODE && body.code !== process.env.ACCESS_CODE)
    return NextResponse.json({ error: "Código de acesso incorreto." }, { status: 401 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (!allowed(ip)) return NextResponse.json({ error: "Limite de gerações por hora atingido." }, { status: 429 });

  try {
    // 1. Foto -> ficha do personagem. Única chamada que recebe a foto.
    if (body.kind === "character") {
      if (body.consent !== true)
        return NextResponse.json({ error: "É preciso o consentimento do responsável." }, { status: 400 });
      if (!isImage(body.photo)) return NextResponse.json({ error: "Envie uma foto em JPG ou PNG." }, { status: 400 });
      const result = await generateImage(body.photo, CHARACTER_PROMPT, "Personagem", true);
      return NextResponse.json({ image: result.dataUrl, demo: result.demo });
    }

    // 2. Ficha do personagem -> página do livro. A foto não participa.
    if (!isImage(body.character)) return NextResponse.json({ error: "Crie o personagem antes de gerar as páginas." }, { status: 400 });
    const found = findScene(body.themeId || "", body.sceneId || "");
    if (!found) return NextResponse.json({ error: "Tema ou cena não encontrados." }, { status: 400 });
    const result = await generateImage(body.character, buildPrompt(found.scene), found.scene.title);
    return NextResponse.json({ image: result.dataUrl, demo: result.demo });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao gerar o desenho.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
