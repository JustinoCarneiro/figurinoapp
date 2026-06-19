# Identidade Visual — Sistema de Figurinos TJA

> Direção visual aprovada na **Fase 2a** da metodologia Onda-Dev. **Direção B — Teatral Clássico.** Este documento é a fonte da verdade visual do projeto. Toda decisão de UI consulta aqui antes do `tokens.css`.

## Conceito

A identidade conversa com a herança do **Theatro José de Alencar** — palácio histórico inaugurado em 1910 — sem cair na caricatura "ornamento de teatro". O bordô é o **vermelho do pano de boca** (palco principal), o dourado é o **ornamento sóbrio** das fachadas neoclássicas, o creme é o **papel de carta institucional**.

Tom geral: **adulto, calmo, confiável**. Nada de teatralidade gritante. O sistema é ferramenta de trabalho da figurinista — a identidade carrega o lugar onde ele opera, sem disputar atenção com o conteúdo.

## Princípios de aplicação

1. **A figurinista é a usuária crítica.** A interface dela precisa ser legível em qualquer condição. Sem texto cinza-claro sobre creme, sem hierarquias sutis demais. Quando hesitar entre contraste e elegância, escolha contraste.

2. **Bordô é pontual, não dominante.** É a cor de **ação** (CTAs, links, títulos importantes) — não cor de fundo de grandes áreas. Bordô como fundo cansa em telas densas (listas de 100 peças).

3. **Dourado é ornamento, não destaque.** Use no logo, num divisor sutil, num ícone de status especial. Nunca como cor de CTA — competiria com o bordô e a hierarquia quebra.

4. **Creme sustenta tudo.** É o tom base. Branco puro entra só em superfícies que precisam saltar (cards de conteúdo importante, modais).

## Paleta — quando usar cada cor

| Token | Hex | Onde usar |
|---|---|---|
| `--tja-bg` | `#FAF6EE` | Fundo da aplicação. **A maior parte da área visível.** |
| `--tja-bg-elevated` | `#FFFFFF` | Cards, modais, áreas que precisam destacar do fundo. |
| `--tja-bg-muted` | `#F0E7D2` | Listas zebradas, badges suaves, áreas secundárias. |
| `--tja-primary` | `#6B1F2E` | CTAs, links, títulos de seção, ícones interativos. |
| `--tja-accent` | `#C49A4B` | Logo, divisores ornamentais, ícone de status especial. |
| `--tja-text` | `#2C1A14` | Texto principal. **Não use preto puro** (`#000`) — fica frio sobre o creme. |
| `--tja-text-soft` | `#6B5A4E` | Labels, metadados (Sala · Tamanho · Data). |
| `--tja-border` | `#E8DDC4` | Divisores, contornos de card e input. |

## Tipografia

- **Cormorant Garamond** (serif) — apenas em **títulos** (h1, h2, h3) e momentos editoriais (nome do sistema na tela de login). Peso 600 para títulos; 400 italic para destaques pontuais.
- **Lato** (sans-serif) — todo o resto. Corpo, botões, inputs, labels, badges. Pesos 400 (regular) e 700 (bold).

**Nunca misture as duas em texto corrido.** Cormorant em título, Lato em tudo abaixo. Se hesitar se um elemento é "título" ou "label destacado", é label → Lato bold.

## Estados da locação — cor por estado

A máquina de estados da locação tem mapeamento de cor próprio (definido em `.badge-*` no `tokens.css`):

- **Disponível** → verde-musgo suave (peça pronta pra sair)
- **Em uso** → bordô (peça está fora; conexão visual com "ação em curso")
- **Aguardando pagamento** → âmbar (atenção, não erro)
- **Atrasada** → vermelho-tijolo (sinaliza, não pune — sem multa)
- **Em manutenção** → dourado (estado especial, não-comum)
- **Finalizada** → cinza-creme (histórico, fim de fluxo)

## Componentes-chave

**Botão primário** — Lato 700, bordô sólido, texto creme, raio 8px, altura mínima 44px (mouse-friendly + acessível). Hover escurece o bordô; ativo desce 1px.

**Card** — branco sobre creme, borda creme-escura 1px, raio 12px, padding generoso (24px). Sombra discreta cor-de-marca diluída — nunca preto puro.

**Input** — branco, borda creme-escura, raio 8px, altura 44px. Foco: borda bordô + anel bordô translúcido 3px.

**Badge de status** — pílula minúscula, texto MAIÚSCULO com tracking generoso, fundo soft da família semântica. Pequena, discreta, mas sempre legível.

## Layout

- Largura máxima de conteúdo: 1280px (telas internas vão respirar em monitor grande).
- Largura máxima de prosa (textos longos, modais): 720px.
- Espaçamento em escala 4px (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64).
- Cantos sempre arredondados (4 / 8 / 12 / 16 px). Pílula só em badges e tags.

## Acessibilidade

- Contraste AA garantido por padrão na paleta:
  - `--tja-text` sobre `--tja-bg` → contraste alto (corpo de texto).
  - `--tja-text-on-dark` sobre `--tja-primary` → contraste alto (botão bordô).
- Áreas de toque mínimas 44×44px (mesmo em desktop, ajuda figurinista).
- Foco visível em **todo** elemento interativo via `--tja-shadow-focus` (anel bordô translúcido).
- Nunca comunicar status só por cor — sempre cor + texto/ícone.

## Do / Don't

**✓ Faça**
- Use bordô como cor de ação (botão, link, ícone interativo).
- Use creme como tela base; branco só em superfícies elevadas.
- Mantenha hierarquia tipográfica clara: título serifado, corpo sans, label sans menor e em soft.
- Garanta contraste alto em telas que a figurinista usa diariamente.

**✗ Evite**
- Bordô como fundo de seções grandes.
- Dourado em CTAs (compete com o bordô e quebra hierarquia).
- Cormorant em texto de UI (label, botão, input) — pesa e dificulta leitura em tamanhos pequenos.
- Sombras pretas (sempre cor-de-marca diluída).
- Misturar mais de uma fonte serifada (nada de Playfair + Cormorant).
- Adicionar cores fora desta paleta (mesmo "só por essa vez") — quebra o sistema.

## Fontes (Google Fonts)

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Lato:wght@400;700&display=swap" rel="stylesheet">
```

## Versionamento

Este documento e o `tokens.css` evoluem juntos. Mudança em um exige atualização do outro. Quando o sistema crescer e surgirem novos componentes (relatórios, gráficos), eles voltam aqui antes de virar código — para garantir coerência.

---

*Sistema de Figurinos TJA · Direção Visual · v1.0 · Junho/2026.*
