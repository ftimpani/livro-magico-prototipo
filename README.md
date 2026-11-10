# Livro Mágico: protótipo

A foto da criança vira uma **ficha de personagem** (aprovada pelos pais). A foto é
descartada e todas as páginas do livro são desenhadas a partir da ficha, para o
personagem ser sempre o mesmo. O PDF traz capa com o nome, 5 páginas de história
para colorir, labirinto, caça-palavras e diploma.
Ainda **sem pagamento, sem login e sem banco de dados**.

## Rodar no computador

Precisa do Node.js 18 ou mais novo.

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Sem chave de IA, o site roda em **modo demonstração**:
os desenhos são bonecos de exemplo e nada é cobrado. Já dá para testar o fluxo e o PDF.

## Ligar a IA de verdade

1. Gere uma chave em https://aistudio.google.com (Get API key).
2. Copie `.env.example` para `.env.local` e preencha `GEMINI_KEY`.
3. Reinicie o `npm run dev`.

`GEMINI_MODEL` escolhe o modelo: `gemini-2.5-flash-image` (padrão) ou
`gemini-3-pro-image-preview` (pago, exige faturamento ativo, mais fiel ao personagem).
Cada livro faz 1 chamada para o personagem e 5 para as páginas.

## O teste que importa (Fase 2 do plano)

Use 10 fotos de crianças da família, com autorização dos pais. Para cada modelo, anote:

- o modelo aceitou a foto ou recusou? (se recusar fotos de crianças, está descartado)
- o rosto ficou parecido? (nota de 1 a 5)
- o traço está limpo para colorir, sem cinza e sem texto estranho?
- a criança ficou parecida entre as 5 cenas?
- tempo por imagem

Antes de vender, leia os termos de uso da fal.ai e do modelo escolhido sobre fotos de menores.

## Publicar na Vercel (opcional)

1. Suba esta pasta para um repositório no GitHub e importe na Vercel.
2. Em "Environment Variables", crie `FAL_KEY`, `FAL_MODEL` e **`ACCESS_CODE`**.
   Com `ACCESS_CODE`, só quem tem o código gera desenhos, e ninguém gasta seus créditos.
3. Não divulgue o link: o protótipo ainda não tem Termos de Uso nem Política de Privacidade.

## Privacidade neste protótipo

- A foto é reduzida no próprio aparelho e enviada só no momento de gerar cada desenho.
- O servidor não grava foto nem desenho em disco ou banco: repassa ao fornecedor de IA e devolve o resultado.
- O PDF é montado no navegador.
- A autorização do responsável é obrigatória, mas ainda não fica registrada. O registro entra junto com o banco de dados.

## Onde mexer

| Arquivo | O que tem |
| --- | --- |
| `lib/themes.ts` | Temas, cenas e o prompt-base. É aqui que se ajusta o estilo dos desenhos. |
| `lib/providers.ts` | Chamada ao fornecedor de IA e modo demonstração. |
| `lib/activities.ts` | Labirinto e caça-palavras gerados por código. |
| `lib/book.ts` | Montagem do PDF. |
| `app/page.tsx` | A tela do site. |
| `app/api/generate/route.ts` | Rota que gera um desenho, com as validações. |

`npm run test:pdf` confere labirintos e caça-palavras e gera um `teste-livro.pdf`.

## Ainda não tem

Pagamento, e-mail, fila de geração, registro de consentimento, exclusão automática,
jogo dos erros, sombras, história em capítulos e os outros 20 temas do catálogo.
