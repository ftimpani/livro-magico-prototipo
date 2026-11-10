// Adaptador do fornecedor de IA. Roda só no servidor.
// A foto nunca é gravada em disco: chega na requisição, vai ao fornecedor e é descartada.

export type GenResult = { dataUrl: string; demo: boolean };

export function isDemoMode() {
  return !process.env.FAL_KEY;
}

function demoImage(title: string): GenResult {
  // Desenho de exemplo para testar o fluxo sem chave e sem custo.
  const safe = title.replace(/[<>&]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
<rect width="900" height="1200" fill="white"/>
<g fill="none" stroke="black" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
<circle cx="450" cy="400" r="150"/>
<circle cx="395" cy="375" r="14" fill="black"/><circle cx="505" cy="375" r="14" fill="black"/>
<path d="M385 450 Q450 510 515 450"/>
<path d="M330 300 Q450 170 570 300"/>
<path d="M450 550 V850 M450 640 L300 760 M450 640 L600 760 M450 850 L340 1050 M450 850 L560 1050"/>
<path d="M120 180 l22 50 54 6 -40 37 11 54 -47 -28 -47 28 11 -54 -40 -37 54 -6z"/>
<path d="M760 240 l18 40 44 5 -33 30 9 44 -38 -23 -38 23 9 -44 -33 -30 44 -5z"/>
<path d="M60 1120 H840"/>
</g>
<text x="450" y="90" font-family="Arial" font-size="40" text-anchor="middle">MODO DEMONSTRAÇÃO</text>
<text x="450" y="1175" font-family="Arial" font-size="34" text-anchor="middle">${safe}</text>
</svg>`;
  return { dataUrl: "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64"), demo: true };
}

export async function generateDrawing(photoDataUrl: string, prompt: string, sceneTitle: string): Promise<GenResult> {
  if (isDemoMode()) return demoImage(sceneTitle);

  const model = process.env.FAL_MODEL || "fal-ai/gemini-25-flash-image/edit";
  const body: Record<string, unknown> = { prompt, num_images: 1, output_format: "png" };
  if (model.includes("kontext")) body.image_url = photoDataUrl;
  else body.image_urls = [photoDataUrl];

  const res = await fetch(`https://fal.run/${model}`, {
    method: "POST",
    headers: { Authorization: `Key ${process.env.FAL_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`O fornecedor de IA recusou o pedido (${res.status}). ${text.slice(0, 300)}`);
  }
  const json = (await res.json()) as { images?: { url: string }[] };
  const url = json.images?.[0]?.url;
  if (!url) throw new Error("O fornecedor de IA não devolveu nenhuma imagem.");

  if (url.startsWith("data:")) return { dataUrl: url, demo: false };
  const img = await fetch(url);
  if (!img.ok) throw new Error("Não foi possível baixar a imagem gerada.");
  const type = img.headers.get("content-type") || "image/png";
  const b64 = Buffer.from(await img.arrayBuffer()).toString("base64");
  return { dataUrl: `data:${type};base64,${b64}`, demo: false };
}
