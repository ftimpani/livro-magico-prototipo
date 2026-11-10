"use client";

import { useEffect, useRef, useState } from "react";
import { THEMES } from "@/lib/themes";
import { buildBook } from "@/lib/book";

type Drawing = { sceneId: string; title: string; image?: string; error?: string; loading: boolean };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Não foi possível abrir a imagem."));
    img.src = src;
  });
}

/** Reduz a foto no próprio aparelho antes de enviar (máx. 1024 px, JPEG). */
async function shrinkPhoto(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, 1024 / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.88);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Converte qualquer imagem recebida em PNG com fundo branco, pronta para o PDF. */
async function toPng(dataUrl: string): Promise<Uint8Array> {
  const img = await loadImage(dataUrl);
  const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale) || 900;
  canvas.height = Math.round(img.height * scale) || 1200;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob: Blob = await new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("Falha ao converter."))), "image/png"));
  return new Uint8Array(await blob.arrayBuffer());
}

export default function Home() {
  const [status, setStatus] = useState<{ demo: boolean; needsCode: boolean } | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("5");
  const [dedication, setDedication] = useState("");
  const [code, setCode] = useState("");
  const [themeId, setThemeId] = useState(THEMES[0].id);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "ok"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/generate")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ demo: true, needsCode: false }));
  }, []);

  const theme = THEMES.find((t) => t.id === themeId)!;
  const ready = !!photo && consent && name.trim().length > 0 && !busy;
  const done = drawings.length > 0 && drawings.every((d) => d.image && !d.loading);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage(null);
    try {
      setPhoto(await shrinkPhoto(file));
    } catch {
      setMessage({ kind: "error", text: "Não consegui abrir essa foto. Tente outra em JPG ou PNG." });
    }
  }

  async function generateOne(sceneId: string) {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photo, themeId, sceneId, consent, code }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Erro ao gerar o desenho.");
    return json.image as string;
  }

  async function run(sceneIds: string[]) {
    setBusy(true);
    setMessage(null);
    for (const sceneId of sceneIds) {
      setDrawings((list) => list.map((d) => (d.sceneId === sceneId ? { ...d, loading: true, error: undefined } : d)));
      try {
        const image = await generateOne(sceneId);
        setDrawings((list) => list.map((d) => (d.sceneId === sceneId ? { ...d, image, loading: false } : d)));
      } catch (e) {
        const error = e instanceof Error ? e.message : "Erro ao gerar.";
        setDrawings((list) => list.map((d) => (d.sceneId === sceneId ? { ...d, error, loading: false } : d)));
        if (/acesso|consentimento|Limite/.test(error)) {
          setMessage({ kind: "error", text: error });
          break;
        }
      }
    }
    setBusy(false);
  }

  function start() {
    setDrawings(theme.scenes.map((s) => ({ sceneId: s.id, title: s.title, loading: false })));
    run(theme.scenes.map((s) => s.id));
  }

  async function downloadPdf() {
    setBusy(true);
    setMessage(null);
    try {
      const images = [];
      for (const d of drawings) if (d.image) images.push({ title: d.title, png: await toPng(d.image) });
      const pdf = await buildBook({ name, age: Number(age) || 5, theme, images, dedication, demo: status?.demo });
      const url = URL.createObjectURL(new Blob([pdf as BlobPart], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `livro-${name.trim().toLowerCase().replace(/\s+/g, "-") || "crianca"}-${theme.id}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setMessage({ kind: "ok", text: "PDF pronto! Confira a pasta de downloads." });
    } catch {
      setMessage({ kind: "error", text: "Não foi possível montar o PDF. Tente gerar os desenhos de novo." });
    }
    setBusy(false);
  }

  function forget() {
    setPhoto(null);
    setDrawings([]);
    setConsent(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <main>
      <span className="badge">Protótipo de teste</span>
      <h1>A criança vira a heroína do próprio livro</h1>
      <p className="lead">Envie uma foto, escolha a aventura e baixe um livro para colorir com atividades e o nome dela.</p>

      {status?.demo && (
        <div className="demo" role="status">
          <strong>Modo demonstração:</strong> nenhuma chave de IA configurada. Os desenhos são bonecos de exemplo, a foto não sai do seu
          aparelho para nenhum fornecedor, e nada é cobrado. Serve para testar o fluxo e o PDF.
        </div>
      )}

      <section className="card">
        <h2><span className="step">1</span>Foto e autorização</h2>
        <div className="photo">
          {photo && <img src={photo} alt="Foto enviada" />}
          <div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} aria-label="Escolher foto da criança" />
            <p className="hint">Rosto de frente, boa luz, sem óculos escuros, só uma criança na foto.</p>
            {photo && <button className="ghost" onClick={forget}>Apagar foto e desenhos</button>}
          </div>
        </div>
        <label className="consent">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>
            Sou pai, mãe ou responsável legal por esta criança e autorizo o uso desta foto apenas para criar os desenhos deste livro. A
            foto é enviada ao fornecedor de IA para gerar os desenhos e não fica guardada neste site.
          </span>
        </label>
      </section>

      <section className="card">
        <h2><span className="step">2</span>Sobre a criança</h2>
        <div className="row">
          <div>
            <label htmlFor="name">Nome (aparece na capa)</label>
            <input id="name" type="text" maxLength={24} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Pedro" />
          </div>
          <div>
            <label htmlFor="age">Idade</label>
            <input id="age" type="number" min={3} max={9} value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
        </div>
        <p className="hint">Até 5 anos, o labirinto e o caça-palavras ficam mais fáceis.</p>
        <label htmlFor="ded">Dedicatória (opcional)</label>
        <textarea id="ded" rows={2} maxLength={180} value={dedication} onChange={(e) => setDedication(e.target.value)} placeholder="Ex.: Com amor, vovó Ana" />
      </section>

      <section className="card">
        <h2><span className="step">3</span>Escolha a aventura</h2>
        <div className="themes">
          {THEMES.map((t) => (
            <button key={t.id} className="theme" aria-pressed={t.id === themeId} onClick={() => setThemeId(t.id)} disabled={busy}>
              <span aria-hidden="true">{t.emoji}</span>
              <strong>{t.title}</strong>
              <br />
              <small>{t.scenes.length} desenhos</small>
            </button>
          ))}
        </div>
        {status?.needsCode && (
          <>
            <label htmlFor="code">Código de acesso</label>
            <input id="code" type="password" value={code} onChange={(e) => setCode(e.target.value)} />
          </>
        )}
        <div className="actions">
          <button className="primary" disabled={!ready} onClick={start}>
            {busy ? "Gerando..." : `Criar ${theme.scenes.length} desenhos`}
          </button>
          {!ready && !busy && <span className="hint">Falta: {[!photo && "foto", !consent && "autorização", !name.trim() && "nome"].filter(Boolean).join(", ")}</span>}
        </div>
      </section>

      {drawings.length > 0 && (
        <section className="card" aria-live="polite">
          <h2><span className="step">4</span>Desenhos e livro</h2>
          <div className="results">
            {drawings.map((d) => (
              <div className="result" key={d.sceneId}>
                {d.image ? <img src={d.image} alt={`Desenho: ${d.title}`} /> : <div className="wait">{d.loading ? "Desenhando..." : d.error ? "Falhou" : "Na fila"}</div>}
                <strong>{d.title}</strong>
                {d.error && <p className="error">{d.error}</p>}
                {!d.loading && (d.image || d.error) && (
                  <p><button className="ghost" disabled={busy} onClick={() => run([d.sceneId])}>Refazer</button></p>
                )}
              </div>
            ))}
          </div>
          <div className="actions">
            <button className="primary" disabled={!done || busy} onClick={downloadPdf}>Baixar o livro em PDF</button>
            <span className="hint">O PDF inclui capa, desenhos, labirinto, caça-palavras e diploma.</span>
          </div>
        </section>
      )}

      {message && <p className={message.kind} role="alert">{message.text}</p>}

      <footer>
        Protótipo para validação interna. Sem pagamento. As fotos não são gravadas no servidor; ao fechar a página, tudo é descartado.
      </footer>
    </main>
  );
}
